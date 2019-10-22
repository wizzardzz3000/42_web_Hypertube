import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import withAuth from "../../services/withAuth";
import "./Search.scss";
import Movie from "../../components/movie/Movie";
import Search from "../../components/searchBar/SearchBar";
import Navbar from "../../components/navbar/NavBar";
import Filter from "../../components/filter/Filter";
import { SearchProvider } from "../../context/SearchContext";
import { Link } from "react-router-dom";
import Loading from "../../components/loadingAnim/LoadingFullScreen";
import { GlobalContext } from "../../context/GlobalContext";

const SearchView = () => {
  const [searchTerms, setSearchTerms] = useState({
    genre: "All",
    page: 1,
    ratings: [0, 10],
    years: [1915, 2019],
    keywords: "",
    limit: 40
  });
  const context = useContext(GlobalContext);
  const [searchResult, setSearchResult] = useState();

  useEffect(() => {
    let isMounted = true;
    const fetchMovies = async () => {
      try {
        const res =
          isMounted && (await axios.post("/search/movies", searchTerms));
        if (res.data.length !== 0) {
          if (searchTerms.page === 1)
            isMounted && setSearchResult({ movies: [...res.data] });
          else
            isMounted &&
              setSearchResult(prev => ({
                movies: prev.movies.concat(res.data)
              }));
        }
      } catch (err) {
        if (err.response && err.response.status === 401)
          console.log(err.response);
      }
    };
    fetchMovies();
    return () => (isMounted = false);
  }, [searchTerms]);

  const search = searchValue => {
    setSearchResult({ movies: [] });
    setSearchTerms({
      ...searchTerms,
      page: 1,
      keywords: searchValue
    });
  };
  const ratings = ratings => {
    setSearchResult({ movies: [] });
    setSearchTerms({
      ...searchTerms,
      page: 1,
      ratings: ratings
    });
  };
  const years = years => {
    setSearchResult({ movies: [] });
    setSearchTerms({
      ...searchTerms,
      page: 1,
      years: years
    });
  };
  const genre = genre => {
    setSearchResult({ movies: [] });
    setSearchTerms({
      ...searchTerms,
      page: 1,
      genre: genre
    });
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted && searchResult) {
      window.document
        .getElementById("infiniteScroll")
        .addEventListener("scroll", handleScroll);
      return () =>
        window.document
          .getElementById("infiniteScroll")
          .removeEventListener("scroll", handleScroll);
    }
    return () => (isMounted = false);
  }, [searchResult]);

  const handleScroll = () => {
    if (
      window.document.getElementById("infiniteScroll").scrollTop +
        window.document.getElementById("infiniteScroll").clientHeight >=
      window.document.getElementById("infiniteScroll").scrollHeight - 120
    ) {
      setSearchTerms(p => {
        const terms = {
          ...p,
          page: p.page + 2
        };
        return terms;
      });
      return;
    }
  };

  return (
    <SearchProvider value={searchTerms}>
      <div className="SearchView" id="SearchView">
        <Navbar />
        {searchResult ? (
          <div className="layer">
            <Search search={search} />
            <Filter ratings={ratings} years={years} genre={genre} />
            <div className="infiniteScroll" id="infiniteScroll">
              {searchResult.movies.map((movie, index) => (
                <Link
                  to={`/movie/${movie.imdbId}`}
                  style={{ textDecoration: "none" }}
                  key={index}
                >
                  <Movie
                    key={`${index}-${movie.title}`}
                    movie={movie}
                    seen={
                      context.movies_seen.length
                        ? context.movies_seen.includes(movie.imdbId)
                        : false
                    }
                  />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Loading></Loading>
        )}
      </div>
    </SearchProvider>
  );
};

export default withAuth(SearchView);
