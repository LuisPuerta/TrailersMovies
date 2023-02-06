import React from "react";

export default function Searcher({ searchMovies, searchKey, changeSearchKey }) {
  // State variables
  // const [movieSearched, setMovieSearched] = useState("");

  return (
    <form className="container mb-2 col d-flex " onSubmit={(searchMovies)}>
      <div className="ms-auto">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => changeSearchKey(e.target.value)} 
          //e.target.value is the value that changeSearchKey will send to the change handler function
        />
        <button type="submit" className="btn btn-warning ms-2 ">
        <span className="mdi mdi-cloud-search"></span>
        </button>
      </div>
    </form>
  );
}
