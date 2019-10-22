import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import withAuth from "../../services/withAuth";
import "./MoviePage.scss";
import Navbar from "../../components/navbar/NavBar";
import Loading from "../../components/loadingAnim/LoadingFullScreen";
import axios from "axios";
import ErrorToast from "../../services/toasts/ErrorToasts";
import { GlobalContext } from "../../context/GlobalContext";
import CustomLanguage from "../../services/DefineLocale";
import Player from "../../components/player/Player";
import { NavLink } from "react-router-dom";
import * as moment from "moment";

const MoviePage = props => {

  const context = useContext(GlobalContext);
  const [movieId, setMovieId] = useState("");
  const [movieDetails, setMovieDetails] = useState({ movie: [], sources: [] });
  const [commentInputValue, setCommentInputValue] = useState("");
  const [commentValue, setCommentValue] = useState("");
  const [commentsList, setCommentsList] = useState({ comments: [] });
  const [streamURL, setStreamURL] = useState("");
  const locale = context.locale;
  var lang = CustomLanguage.define(locale);

  // GET MOVIE INFOS
  // ----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      let url = document.location.href;
      let split = url.split("/");
      let imdbId = { id: split[4] };
      isMounted && setMovieId(imdbId);
      try {
        const movieRes =
          isMounted && (await axios.post("/search/singleMovie", imdbId));
        const omdbComplementaryDataRes =
          isMounted &&
          (await axios.post(
            `http://www.omdbapi.com/?i=${imdbId.id}&apikey=bb5842e5`
          ));
        if (movieRes.data.length !== 0) {
          let sourcesList = movieRes.data[0].torrents;
          if (sourcesList.length > 0) {
            let i = 0;
            let tmp = [];
            while (i < sourcesList.length) {
              tmp[i] = sourcesList[i].quality.concat(
                " ",
                sourcesList[i].source
              );
              i++;
            }
            tmp.unshift("📡");
            let uniq = [...new Set(tmp)];
            if (omdbComplementaryDataRes.data) {
              if (
                omdbComplementaryDataRes.data.Director &&
                omdbComplementaryDataRes.data.Actors
              )
                isMounted &&
                  setMovieDetails({
                    movie: movieRes.data[0],
                    sources: uniq,
                    director: omdbComplementaryDataRes.data.Director,
                    casting: omdbComplementaryDataRes.data.Actors,
                    validId: true
                  });
            } else {
              isMounted &&
                setMovieDetails({
                  movie: movieRes.data[0],
                  sources: uniq,
                  director: "Deedee Megadoodoo",
                  casting: "Hugh Mungus, Bette Davis, Sarah Connor",
                  validId: true
                });
            }
          }
        } else {
          isMounted && setMovieDetails({ validId: false });
        }
      } catch (err) {
        if (err.response && err.response.status === 401)
          console.log(err.response);
      }
    };
    if (movieDetails.validId === false) {
      props.history.push("/search");
      ErrorToast.custom.error("Movie not found", 4000);
    }
    if (movieDetails.validId !== false && movieDetails.movie.length <= 0) {
      isMounted && fetchMovies();
    }
    return () => (isMounted = false);
  }, [movieDetails, props.history]);

  // ADD COMMENT
  // ----------------------------------------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const saveComment = async () => {
      try {
        isMounted && (await axios.post("/comment/addComment", commentValue));
      } catch (err) {
        if (err.response && err.response.status === 401)
          console.log(err.response);
      }
    };
    if (commentValue) saveComment();
    return () => (isMounted = false);
  }, [commentValue]);
  
    // GET COMMENTS
    // ----------------------------------------------------------------------------------------------------------
    useEffect(() => {
        let isMounted = true;
        const getComments = async () => {
            let url = document.location.href;
            let split = url.split("/");
            let imdbId = {id: split[4]};
            try {
                const res = isMounted && await axios.post("/comment/loadComments", imdbId);
                isMounted && setCommentsList({ comments: res.data });
                // if (res.data.comments.length > 0)
                //     console.log("successfully fetched comments :)");
            } catch (err) {
                if (err.response && err.response.status === 401)
                    console.log(err.response);
            }
        };
        getComments();
        return () => isMounted = false;
    }, []);

  // STREAMING URL CONSTRUCTOR
  // ----------------------------------------------------------------------------------------------------------
  const constructURL = e => {
    if (e.target.value[0] === "7" || e.target.value[0] === "1") {
      let userId = context.uid;
      let movieId = movieDetails.movie.imdbId;
      let params = e.target.value.split(" ");
      let quality = params[0];
      let source =
        params[1] === "Popcorn" ? params[1].concat(" ", params[2]) : params[1];
      let route = "http://localhost:5000/movie";
      let url = route
        .concat("/", userId)
        .concat("/", movieId)
        .concat("/", quality)
        .concat("/", source);
      setStreamURL(url);
    }
  };

  // COMMENT HANDLERS
  // ----------------------------------------------------------------------------------------------------------
  const handleNewComment = e => {
    setCommentInputValue(e.target.value);
  };

  const saveComment = e => {
    e.preventDefault();
    let date = new Date();
    setCommentValue({
      userId: context.uid,
      username: context.username,
      firstname: context.firstname,
      movieImdbId: movieDetails.movie.imdbId,
      content: commentInputValue,
      timestamp: date
    });
    commentsList.comments.unshift({
      userId: context.uid,
      username: context.username,
      firstname: context.firstname,
      content: commentInputValue,
      timestamp: date
    });
    resetInputField();
  };

  const resetInputField = () => {
    setCommentInputValue("");
  };

  // const deleteComment = async id => {
  //   let param = {id: id}
  //     try {
  //         await axios.post("/comment/deleteComment", param);
  //     } catch (err) {
  //         if (err.response && err.response.status === 401)
  //             console.log(err.response);
  //     }
  // }

  const updateContextForMovies = () => {
    if (!context.movies_seen.includes(movieId.id)) {
      context.updateMoviesSeen([...context.movies_seen, movieId.id]);
    }
  };

  return (
    <div className="MoviePage">
      <Navbar />
      {movieDetails.validId === true ? (
        <div className="layer">
          <p className="movieTitle">
            <strong>{movieDetails.movie.title}</strong>
          </p>
          {streamURL ? (
            <div className="player">
              <Player movieId={movieId.id} streamURL={streamURL} updateContextForMovies={updateContextForMovies} />
            </div>
          ) : (
            <p>{lang.movie[0].select_source}</p>
          )}
          <div className="bottomStuff">
            <div className="infoSection">
              <div className="poster">
                <img
                  className="infoPoster"
                  alt="movie poster"
                  src={movieDetails.movie.poster}
                ></img>
              </div>
              <div className="infos">
                {movieDetails.sources.length > 0 ? (
                  <select
                    className="browser-default"
                    id="sourceSelect"
                    onChange={constructURL}
                  >
                    {movieDetails.sources.map(source => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p>{lang.movie[0].no_source}</p>
                )}

                <p className="movieSecondary">
                  {lang.movie[0].theater_release}
                </p>
                <p className="moviePrimary">{movieDetails.movie.year}</p>
                <p className="movieSecondary">{lang.movie[0].duration}</p>
                <p className="moviePrimary">{movieDetails.movie.runtime}</p>
                <p className="movieSecondary">{lang.movie[0].director}</p>
                <p className="moviePrimary">{movieDetails.director}</p>
                <p className="movieSecondary">{lang.movie[0].starring}</p>
                <p className="moviePrimary">{movieDetails.casting}</p>
                <p className="movieSecondary">{lang.movie[0].synopsis}</p>
                {movieDetails.movie.plot &&
                movieDetails.movie.plot.length > 330 ? (
                  <p id="synopsis" className="moviePrimary">
                    {movieDetails.movie.plot.substring(0, 330) + "..."}
                  </p>
                ) : (
                  <p id="synopsis" className="moviePrimary">
                    {movieDetails.movie.plot}
                  </p>
                )}
              </div>
            </div>
            <div className="commentSection">
              <div className="comments">
                {commentsList.comments.length > 0 ? (
                  <div className="ohyeah">
                    {commentsList.comments.map((comment, index) => (
                      <div className="singleComment" key={index}>
                        <div className="top">
                          <NavLink to={"/user/" + comment.username}>
                            <p className="moviePrimary" id="commenter">
                              <strong>{comment.username}</strong>
                            </p>
                          </NavLink>
                          {/* {comment.userId === context.uid && comment._id && 
                                                    <button className="waves-effect waves-white btn-flat" id="deleteButton" onClick={() => deleteComment(comment._id)}>x</button>
                                                } */}
                          <p className="movieSecondary" id="timestamp">
                            {moment(comment.timestamp).format(
                              "HH:mm - DD/MM/YYYY"
                            )}
                          </p>
                        </div>
                        <div className="bottom">
                          <p className="movieSecondary" id="content">
                            {comment.content}
                          </p>
                        </div>
                        <hr className="commentSeparator"></hr>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>{lang.comments[0].no_comment}</p>
                )}
              </div>
              <form className="inputComment">
                <input
                  value={commentInputValue}
                  onChange={handleNewComment}
                  type="text"
                  maxLength="100"
                  className="comment-input-field s1"
                  placeholder={lang.comments[0].placeholder}
                />
                <button
                  disabled={commentInputValue.length < 3}
                  onClick={saveComment}
                  type="submit"
                  id="submitCommentButton"
                  className="btn btn-secondary btn-medium waves-effect"
                  value="submit"
                >
                  {lang.comments[0].button}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Loading></Loading>
      )}
    </div>
  );
};

export default withAuth(withRouter(MoviePage));
