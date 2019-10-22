import React from "react";
import { NavLink } from "react-router-dom";
import "./MoviesList.scss";

const MoviesPosters = ({ movies }) => {
  const MovieItem = ({ imdbId, title, poster }) => (
    <div className="movie-poster-only col xl2 l3 m4 s6">
      <NavLink to={`/movie/${imdbId}`}>
        <img alt={`The movie titled: ${title} - ${imdbId}`} src={poster} />
      </NavLink>
    </div>
  );

  const moviesList = movies =>
    movies.map(
      movie =>
        movie.imdbId !== undefined && (
          <MovieItem key={movie.imdbId} imdbId={movie.imdbId} title={movie.title} poster={movie.poster} />
        )
    );

  return <div className="movies-posters-list">{moviesList(movies)}</div>;
};

export default MoviesPosters;
