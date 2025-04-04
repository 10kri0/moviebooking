import 'react-toastify/dist/ReactToastify.css';
import Loading from './Loading';

const NowShowing = ({ movies, selectedMovieIndex, setSelectedMovieIndex, auth, isFetchingMoviesDone }) => {
  return (
    <div className="mx-4 flex flex-col rounded-lg bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] p-6 text-gray-100 shadow-xl sm:mx-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
        Now Showing
      </h2>
      {isFetchingMoviesDone ? (
        movies.length ? (
          <div className="mt-4 overflow-x-auto">
            <div className="flex w-fit gap-4 pb-4">
              {movies?.map((movie, index) => (
                <div
                  key={index}
                  className={`group flex w-[120px] transform flex-col rounded-lg border border-gray-800 p-2 transition-all duration-300 hover:scale-105 sm:w-[150px] ${
                    movies[selectedMovieIndex]?._id === movie._id
                      ? 'bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] shadow-lg shadow-[#ff416c]/30'
                      : 'bg-[#222] shadow-md hover:bg-gradient-to-br hover:from-[#ff416c]/20 hover:to-[#ff4b2b]/20 hover:shadow-[#ff416c]/20'
                  }`}
                  onClick={() => {
                    if (movies[selectedMovieIndex]?._id === movie._id) {
                      setSelectedMovieIndex(null);
                      sessionStorage.setItem('selectedMovieIndex', null);
                    } else {
                      setSelectedMovieIndex(index);
                      sessionStorage.setItem('selectedMovieIndex', index);
                    }
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={movie.img}
                      alt={movie.name}
                      className="h-36 w-full object-cover shadow-sm transition-all duration-500 group-hover:brightness-110 sm:h-48"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  <p className="mt-2 truncate text-center text-sm font-semibold text-white">
                    {movie.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center text-gray-400">There are no movies available.</p>
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default NowShowing;