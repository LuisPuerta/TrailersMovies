import React from "react";

export default function Movies({
  moviesList,
  selectMovie,
  URL_IMAGE,
  searchedKey,
}) {
  return (
    <div className="container mt-3">
      {!searchedKey ? (
        <h2 className="text-white">Trending movies!</h2>
      ) : (
        <h2 className="text-white">
          <span className="mdi mdi-magnify"> </span>Coincidences for:{" "}
          <span className="text-warning">{searchedKey}</span>
        </h2>
      )}
      <div className="row">
        {moviesList.map((m) => (
          <div
            key={m.id}
            className="col-md-4 mb-auto mt-4"
            onClick={() => selectMovie(m)}
          >
            <img
              src={`${URL_IMAGE + m.poster_path}`}
              alt=""
              className="moviePoster"
              height="100%"
              width="100%"
            />
            <h4 className="text-center text-white">{m.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
