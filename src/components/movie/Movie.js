import React from "react";
import "./Movie.scss";

const Movie = ({ movie, seen }) => {
  return (
    <div className="movie">
      {seen && (
        <i className="material-icons icons-red icon-top-right">
          remove_red_eye
        </i>
      )}
      <img alt={`${movie.title}`} src={movie.poster} />
      <div className="movieInfosDiv">
        {movie.title.length < 25 ? (
          <p className="movieTitle">
            <strong>{movie.title}</strong>
          </p>
        ) : (
          <p className="movieTitle">
            <strong>{movie.title.substring(0, 25) + "..."}</strong>
          </p>
        )}
        <p className="movieInfos">
          {movie.year} &nbsp;|&nbsp; {movie.rating} ☆
        </p>
      </div>
    </div>
  );
};

export default Movie;
