import { TrashIcon } from '@heroicons/react/24/solid';

const MovieLists = ({ movies, search, handleDelete }) => {
  const moviesList = movies?.filter((movie) =>
    movie.name.toLowerCase().includes(search?.toLowerCase() || ''),
  );

  return moviesList.length ? (
    <div className="grid grid-cols-1 gap-6 rounded-lg bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {moviesList.map((movie, index) => (
        <div
          key={index}
          className="group flex transform rounded-lg border border-gray-800 bg-[#222] shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_15px_-3px_rgba(255,65,108,0.3)]"
        >
          <div className="relative overflow-hidden">
            <img
              src={movie.img}
              alt={movie.name}
              className="h-36 w-full rounded-t-lg object-cover transition-all duration-500 group-hover:brightness-110 sm:h-48"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <p className="text-xl font-semibold text-white">{movie.name}</p>
              <p className="text-gray-400">Length: {movie.length || '-'} min.</p>
            </div>
            <button
              className="flex w-fit items-center gap-1 self-end rounded-lg bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] px-3 py-1 text-sm font-medium text-white transition-all duration-300 hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 hover:shadow-[0_0_10px_-2px_rgba(255,75,43,0.5)]"
              onClick={() => handleDelete(movie)}
            >
              DELETE
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center text-gray-400">No movies found.</div>
  );
};

export default MovieLists;