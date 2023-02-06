import React from "react";
import Youtube from "react-youtube";
import nobackdrop_available_image from "../assets/nobackdrop_available.png";

export default function Videoplayer({
  movie,
  IMAGE_PATH,
  trailer,
  playing,
  OnclickPlaying,
}) {
  const vote_average = Number(movie.vote_average).toFixed(2);

  return (
    <div>
      <main>
        {movie ? (
          <div
            className={`viewTrailer`}
            style={{
              // Checking if the object "movie" has a "backdrop_path" for the backgroundImage
              backgroundImage: `${
                movie.backdrop_path
                  ? `url("${IMAGE_PATH}${movie.backdrop_path}")`
                  : `url(${nobackdrop_available_image}`
              }`,
              height: "100px",
            }}
          >
            {playing ? (
              <>
                <div className="stopButtonDiv trailerOverlay">
                  <button
                    onClick={() => OnclickPlaying(false)}
                    className="stopButton"
                  >
                    <span className="mdi mdi-close"></span>
                  </button>
                </div>
                <Youtube
                  videoId={trailer.key}
                  className="reproductor container trailerOverlay"
                  containerClassName={"youtube-container amru"}
                  opts={{
                    width: "100%",
                    height: "100%",
                    playerVars: {
                      autoplay: 1,
                      controls: 0,
                      cc_load_policy: 0,
                      fs: 0,
                      iv_load_policy: 0,
                      modestbranding: 0,
                      rel: 0,
                      showinfo: 0,
                    },
                  }}
                />
              </>
            ) : (
              <div className="container">
                <div className="">
                  {trailer ? (
                    <button
                      className="boton"
                      type="button"
                      onClick={() => OnclickPlaying(true)}
                    >
                      <span className="mdi mdi-play"></span> Trailer
                    </button>
                  ) : (
                    <div className="noTrailerWarning text-warning bg-dark p-1 rounded">
                      Sorry, no trailer available{" "}
                      <span className="mdi mdi-emoticon-sad-outline"></span>
                    </div>
                  )}
                  <div className="movieDescription">
                    <div className="">
                      <h1 className="col col-md-auto text-white">
                        {movie.title}
                      </h1>
                      <h5 className="col text-white m-auto">
                        <span className="mdi mdi-star"></span> {vote_average}
                      </h5>
                    </div>
                    <p className="text-white">{movie.overview}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
