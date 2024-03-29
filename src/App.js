import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Movies from "./components/Movies";
import Searcher from "./components/Searcher";
import Videoplayer from "./components/Videoplayer";

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "e7cca91f9313d69879b7b4e1049e15b6";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  //State variables
  const [movies, setMovies] = useState([]); //Movies array
  const [movie, setMovie] = useState({ title: "Loading movies" }); //Movie selected
  const [searchKey, setSearchKey] = useState(""); //Searched movie in input text
  const [searchedKey, setSearchedKey] = useState("");
  const [trailer, setTrailer] = useState(null); //Trailer got from movie selected
  const [playing, setPlaying] = useState(false); //Aux to check if trailer is playing

  // Aux variables for the next/prev buttons
  const [index, setIndex] = useState(0);
  let auxIndex = 0;

  //API GET Request list of movies
  async function fetchMovies(searchKey, index) {
    const type = searchKey ? "search" : "discover"; //Type of "search" is being done

    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    // console.log(results);

    setMovies(results); // Save array of movies
    setMovie(results[0]); // Save only 1 movie

    // Sending the first movie result to FetchMovie
    if (results.length) {
      await fetchMovie(results[index ? index : 0].id);
    }
  }

  //useEffect for the API fetch
  useEffect(() => {
    fetchMovies();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Requesting only 1 object (movie) and showing it in videoplayer
  async function fetchMovie(id) {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    // console.log(data);

    // Checking if there's a trailer data
    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );

      // If there's an Official Trailer, save it, if there's not, save the first video found
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }

    // Setting the first movie of the array in its proper state
    setMovie(data);
  }

  // Function to fetch for the movie selected
  async function selectMovie(movie) {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);

    movieIndex(movie.id, searchKey);
    setIndex(movieIndex(movie.id, searchKey));
  }

  //Search specific movies
  function searchMovies(e) {
    e.preventDefault();

    //Resetting the aux variables of next/prev buttons to 0;
    setIndex(0);
    auxIndex = 0;

    //Setting the new searched key
    setSearchedKey(searchKey);

    //Fetching new results
    fetchMovies(searchKey, 0);
  }

  //Handler function to change the new key to be searched
  function handleChangeSearchKey(newKey) {
    setSearchKey(newKey);
  }

  //Handler function to change playing true/false
  function handleOnClickPlaying(playORpause) {
    setPlaying(playORpause);
  }

  //Get index of the actual movie
  async function movieIndex(id, searchKey) {
    const type = searchKey ? "search" : "discover"; //Type of "search" is being done

    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    const movieInd = results.findIndex((movie) => movie.id === id);
    // console.log(movieInd);

    setIndex(movieInd);
  }

  //Change to the NEXT movie
  async function handleNextMovie() {
    if (movies.length === 20 && index === 19) {
      alert("Sorry it's over");
    } else {
      auxIndex = auxIndex + 1;
      setIndex(index + 1);

      // console.log(index);

      const type = searchKey ? "search" : "discover"; //Type of "search" is being done
      const {
        data: { results },
      } = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      });

      // Sending the result to FetchMovie
      if (results.length) {
        try {
          await fetchMovie(results[index === 0 ? auxIndex : index + 1].id);
        } catch (e) {
          auxIndex = movies.length - 1;
          setIndex(movies.length - 1);

          alert("You reached the end!");
          console.log(e);
        }
      }
    }
  }

  //Change to the PREV movie
  async function handlePrevMovie() {
    if (movies.length === 0 && index === 0) {
      alert("You are at the beginning!");
    } else {
      auxIndex = auxIndex - 1;
      setIndex(index - 1);

      // console.log(index);

      const type = searchKey ? "search" : "discover"; //Type of "search" is being done
      const {
        data: { results },
      } = await axios.get(`${API_URL}/${type}/movie`, {
        params: {
          api_key: API_KEY,
          query: searchKey,
        },
      });

      // Sending the result to FetchMovie
      if (results.length) {
        try {
          await fetchMovie(results[index === 0 ? auxIndex : index - 1].id);
        } catch (e) {
          auxIndex = 0;
          setIndex(0);

          alert("You are at the beginning!");
          console.log(e);
        }
      }
    }
  }

  // Cleaning searchs
  function cleanSearch() {
    document.getElementById("searcherInput").value = "";
    setSearchKey("");
    setSearchedKey("");

    fetchMovies("", 0);
  }

  return (
    <>
      <div className="header row">
        <div className="col">
          <h2
            className="text-left text-warning mt-1 mb-2"
            onClick={cleanSearch}
          >
            Search movie trailers!
          </h2>
        </div>

        {/*Searcher component */}
        {/* El useState debe siempre estar en componente PADRE, se debe pasar el State y la funcion handler de su cambio al componente hijo y desde allí obtener el  valor que esta recibirá (changeSearchKey) */}
        <Searcher
          searchMovies={searchMovies}
          searchKey={searchKey}
          changeSearchKey={handleChangeSearchKey}
        />
      </div>

      <div className="mainContainer mt-2">
        {/*Videoplayer component */}
        <Videoplayer
          movie={movie}
          IMAGE_PATH={IMAGE_PATH}
          trailer={trailer}
          playing={playing}
          OnclickPlaying={handleOnClickPlaying}
          nextMovie={handleNextMovie}
          prevMovie={handlePrevMovie}
        />

        {/*Movies component */}
        <Movies
          moviesList={movies}
          selectMovie={selectMovie}
          URL_IMAGE={URL_IMAGE}
          searchedKey={searchedKey}
        />

        {/* Here's how the code would be without components */}
        {/* Movie searcher */}
        <div>
          {/* <form className="container mb-2 d-flex " onSubmit={searchMovies}>
          <div className="ms-auto">
            <input
              type="text"
              placeholder="Search"
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <button type="submit" className="btn btn-primary ms-2">
              Search
            </button>
          </div>
        </form> */}
        </div>
        {/* Banner and videoplayer container */}
        <div>
          {/* <main>
          {movie ? (
            <div
              className="viewTrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
                height: "100px",
              }}
            >
              {playing ? (
                <>
                  <Youtube
                    videoId={trailer.key}
                    className="reproductor container"
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
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        type="button"
                        onClick={() => setPlaying(true)}
                      >
                        Play trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <div className="movieDescription">
                      <h1 className="text-white">{movie.title}</h1>
                      <p className="text-white">{movie.overview}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main> */}
        </div>
        {/* Container showing movies posters */}
        <div>
          {/* <div className="container mt-3">
        <div className="row">
          {movies.map((m) => (
            <div
              key={m.id}
              className="col-md-4 mb-auto"
              onClick={() => selectMovie(m)}
            >
              <img
                src={`${URL_IMAGE + m.poster_path}`}
                alt=""
                className="moviePoster"
                height="100%"
                width="100%"
              />
              <h4 className="text-center">{m.title}</h4>
            </div>
          ))}
        </div>
      </div> */}
        </div>

        <footer className="text-white text-center my-5">
          <p>
            <span className="mdi mdi-copyright"></span>
            2023, no copyright intended
          </p>
          <p>All the data was collected from the TMDB API</p>
        </footer>
      </div>
    </>
  );
}

export default App;
