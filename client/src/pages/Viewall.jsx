import axios from "axios";
import { useContext, useEffect, useState, useCallback } from "react";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FilmIcon,
  TicketIcon,
  StarIcon,
  ChevronRightIcon,
  SparklesIcon,
  UserGroupIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/solid";
import AOS from "aos";
import "aos/dist/aos.css";

function Viewall() {
    const { auth } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const config = auth?.role === "admin" 
        ? { headers: { Authorization: `Bearer ${auth?.token}` } } 
        : {};

      const endpoint = auth?.role === "admin" 
        ? "/movie/unreleased/showing" 
        : "/movie/showing";

      const response = await axios.get(endpoint, config);
      setMovies(response.data.data);

      if (response.data.data.length > 0) {
        const randomMovie = response.data.data[Math.floor(Math.random() * response.data.data.length)];
        setFeaturedMovie(randomMovie);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-quad",
      offset: 120
    });
    
    fetchMovies();
    
    return () => {
      AOS.refreshHard();
    };
  }, [fetchMovies]);

  const handleViewTheater = useCallback((movieId) => {
    navigate(`/theater/${movieId}`);
  }, [navigate]);
  return (
   <>
   <div  className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
   <Navbar />
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 py-8">
  {movies.map((movie, index) => (
    <div
      key={movie._id}
      data-aos="fade-up"
      data-aos-delay={(index % 4) * 50}
      className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-purple-500/30 bg-gray-800 transition-transform duration-300 transform hover:-translate-y-2"
    >
      <img
        src={movie.img}
        alt={movie.name}
        className="w-full h-full object-cover transition-transform duration-500 transform group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 flex flex-col justify-end">
        <div className="absolute top-4 left-4 bg-gray-900/80 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center">
          <FilmIcon className="w-4 h-4 mr-1" />
          {movie.showType}
        </div>
        <div className="absolute top-4 right-4 bg-gray-900/80 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center">
          <StarIcon className="w-4 h-4 mr-1" />
          {movie.rating?.toFixed(1)}
        </div>
        <div className="absolute bottom-4 right-4 bg-gray-900/80 text-purple-300 px-3 py-1 rounded-full text-sm flex items-center">
          <GlobeAltIcon className="w-4 h-4 mr-1" />
          {movie.language}
        </div>

        <div className="space-y-2">
          <h3 className="font-bold text-lg">{movie.name}</h3>
          <p className="text-purple-300 text-sm">{movie.genre}</p>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{Math.floor(movie.length / 60)}h {movie.length % 60}m</span>
          </div>
          <button
            onClick={() => handleViewTheater(movie._id)}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            View Showtimes
          </button>
        </div>
      </div>
    </div>
  ))}
</div>


   </div>

   </>
  )
}

export default Viewall