import React from "react";

export default function Movies({ moviesList, selectMovie, URL_IMAGE }) {
  return (
    <div className="container mt-3">
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
