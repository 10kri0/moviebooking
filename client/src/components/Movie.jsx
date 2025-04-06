import {
  MagnifyingGlassIcon,
  FilmIcon,
  ClockIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
  StarIcon,
  DocumentTextIcon,

  GlobeAltIcon,


} from "@heroicons/react/24/outline";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

const Movie = () => {
  const { auth } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [movies, setMovies] = useState([]);
  const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false);
  const [isAddingMovie, setIsAddingMovie] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMovies = async () => {
    try {
      setIsFetchingMoviesDone(false);
      const response = await axios.get("/movie");
      reset();
      setMovies(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch movies");
    } finally {
      setIsFetchingMoviesDone(true);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const onAddMovie = async (data) => {
    try {
      const movieData = {
        name: data.name,
        img: data.img,
        description: data.description,
        genre: data.genre,
        rating: parseFloat(data.rating),

        length: (parseInt(data.lengthHr) || 0) * 60 + (parseInt(data.lengthMin) || 0),
        language: data.language,
        showType: data.showType

        

      };

      setIsAddingMovie(true);
      const response = await axios.post('/movie', movieData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      
      fetchMovies();
      toast.success('Movie added successfully!');
    } catch (error) {
      console.error("Error details:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error adding movie');
    } finally {
      setIsAddingMovie(false);
    }
  };

  const onDeleteMovie = async (id) => {
    try {
      await axios.delete(`/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      fetchMovies();
      toast.success("Movie deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting movie");
    }
  };

  const handleDelete = (movie) => {
    if (window.confirm(`Are you sure you want to delete "${movie.name}"?`)) {
      onDeleteMovie(movie._id);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const MovieLists = ({ movies, handleDelete }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie._id} className="bg-[#333]/80 rounded-xl overflow-hidden shadow-lg border border-[#444] hover:border-[#ff416c] transition-all hover:shadow-[#ff416c]/30">
            <div className="relative">
              <img 
                src={movie.img} 
                alt={movie.name} 
                className="w-full h-64 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                }}
              />
              <div className="absolute top-2 right-2 bg-black/70 rounded-full px-2 py-1 text-sm text-white flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                {movie.rating?.toFixed(1)}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold text-white truncate">{movie.name}</h3>
              <div className="flex items-center text-gray-300 text-sm mt-1">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {movie.genre}
              </div>
              <div className="flex items-center text-gray-300 text-sm mt-1">
                <GlobeAltIcon className="w-4 h-4 mr-1" />
                {movie.language}
              </div>
              <div className="flex items-center text-gray-300 text-sm mt-1">
                <FilmIcon className="w-4 h-4 mr-1" />
                {movie.showType}
              </div>
              <div className="flex items-center text-gray-300 text-sm mt-1">

                <ClockIcon className="w-4 h-4 mr-1" />
                {Math.floor(movie.length / 60)}h {movie.length % 60}m
              </div>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{movie.description}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDelete(movie)}
                  className="text-red-400 hover:text-red-500 transition-colors flex items-center text-sm"
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] mb-4 shadow-lg shadow-[#ff416c]/30">
            <FilmIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] mb-3">
            Movie Catalog
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Manage your movie collection with cinematic elegance
          </p>
        </div>

        {/* Add Movie Form */}
        <div className="bg-[#222]/90 rounded-xl shadow-xl border border-[#333] backdrop-blur-sm p-6 mb-10 transition-all hover:shadow-[#ff416c]/20">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <PlusIcon className="w-6 h-6 text-[#ff416c]" />
            <span className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
              Add New Movie
            </span>
          </h2>
          <form onSubmit={handleSubmit(onAddMovie)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FilmIcon className="w-4 h-4 text-[#ff416c]" />
                  Movie Title
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Movie name is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                  placeholder="Enter movie title"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-[#ff416c]" />
                  Poster URL
                </label>
                <input
                  type="text"
                  {...register("img", { required: "Poster URL is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                  placeholder="Enter image URL"
                />
                {errors.img && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.img.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4 text-[#ff416c]" />
                  Genre
                </label>
                <select
                  {...register("genre", { required: "Genre is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                >
                  <option value="">Select Genre</option>
                  <option value="Action">Action</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Drama">Drama</option>
                  <option value="Horror">Horror</option>
                  <option value="Sci-Fi">Sci-Fi</option>
                  <option value="Thriller">Thriller</option>
                  <option value="Romance">Romance</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Animation">Animation</option>
                  <option value="Documentary">Documentary</option>
                </select>
                {errors.genre && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.genre.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <StarIcon className="w-4 h-4 text-[#ff416c]" />
                  Rating (0-10)
                </label>
                <input
                  type="number"
                  {...register("rating", {
                    required: "Rating is required",
                    min: { value: 0, message: "Minimum rating is 0" },
                    max: { value: 10, message: "Maximum rating is 10" },
                    valueAsNumber: true
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                  placeholder="Enter rating (0-10)"
                  step="0.1"
                  min="0"
                  max="10"
                />
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.rating.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">

                  <GlobeAltIcon className="w-4 h-4 text-[#ff416c]" />
                  Language
                </label>
                <select
                  {...register("language", { required: "Language is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Other">Other</option>
                </select>
                {errors.language && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.language.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FilmIcon className="w-4 h-4 text-[#ff416c]" />
                  Show Type
                </label>
                <select
                  {...register("showType", { required: "Show type is required" })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                >
                  <option value="">Select Show Type</option>
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX">IMAX</option>
                  <option value="4DX">4DX</option>
                </select>
                {errors.showType && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.showType.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">

                  <ClockIcon className="w-4 h-4 text-[#ff416c]" />
                  Duration (Hours)
                </label>
                <input
                  type="number"
                  {...register("lengthHr")}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                  placeholder="Hours"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-[#ff416c]" />
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  {...register("lengthMin", {
                    required: "Duration is required",
                    min: { value: 0, message: "Must be positive number" },
                    max: { value: 59, message: "Must be less than 60" }
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                  placeholder="Minutes"
                  min="0"
                  max="59"
                />
                {errors.lengthMin && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.lengthMin.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <DocumentTextIcon className="w-4 h-4 text-[#ff416c]" />
                  Description
                </label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full px-4 py-3 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                  placeholder="Enter movie description"
                  rows="3"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={isAddingMovie}
              className={`w-full py-3.5 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isAddingMovie
                  ? "bg-[#444] text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 shadow-lg hover:shadow-[#ff416c]/30"
              }`}
            >
              {isAddingMovie ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding Movie...
                </>
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  Add Movie
                </>
              )}
            </button>
          </form>
        </div>

        {/* Movie List Section */}
        <div className="bg-[#222]/90 rounded-xl shadow-xl border border-[#333] backdrop-blur-sm p-6 transition-all hover:shadow-[#ff416c]/20">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FilmIcon className="w-6 h-6 text-[#ff416c]" />
              <span className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                Movie Collection
              </span>
            </h2>
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#333] border border-[#444] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff416c] focus:border-transparent transition-all"
                placeholder="Search movies..."
              />
            </div>
          </div>

          {isFetchingMoviesDone ? (
            <MovieLists movies={filteredMovies} handleDelete={handleDelete} />
          ) : (
            <div className="flex justify-center items-center py-12">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movie;