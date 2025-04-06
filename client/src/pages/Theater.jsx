import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import TheaterListsByMovie from '../components/TheaterListsByMovie';
import axios from 'axios';
import Loading from '../components/Loading';
import {
  FilmIcon,
  ClockIcon,
  StarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const Theater = () => {
  const { movieId } = useParams();
  const { auth } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultPoster = 'https://via.placeholder.com/300x450?text=No+Poster';

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`/movie/${movieId}`);
        const movieData = response.data.data;
        
        if (!movieData) {
          throw new Error('Movie data not found');
        }
        
        const completeMovie = {
          title: movieData.name || 'Untitled Movie',
          img: movieData.img || defaultPoster,
          genre: movieData.genre || 'Not specified',
          duration: movieData.length ? 
            `${Math.floor(movieData.length / 60)}h ${movieData.length % 60}m` : '--',
          rating: movieData.rating?.toFixed(1) || 'NR',
          description: movieData.description || 'No description available.',
          ...movieData
        };
        
        setMovie(completeMovie);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
        setError(error.response?.data?.message || error.message || "Failed to load movie");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovie();
  }, [movieId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] flex items-center justify-center p-4">
        <Loading message="Loading movie details..." />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] flex items-center justify-center p-4">
        <div className="bg-[#222]/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 shadow-xl text-center max-w-md w-full">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent mb-3">
            {error ? "Error Loading Movie" : "Movie Not Found"}
          </h2>
          <p className="text-gray-400 mb-6">
            {error || "The movie you're looking for doesn't exist or may have been removed."}
          </p>
          <a 
            href="/" 
            className="inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] text-white font-medium hover:shadow-lg hover:shadow-[#ff416c]/30 transition-all duration-300"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] min-h-screen">
      {/* Movie Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" aria-hidden="true"></div>
        <div 
          className="h-64 w-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${movie.img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <img 
            src={movie.img} 
            alt="" 
            className="opacity-0 w-full h-full" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.parentElement.style.backgroundImage = `url(${defaultPoster})`;
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-20 -mt-16 pb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-32 h-48 md:w-40 md:h-60 rounded-lg shadow-xl border-2 border-white/20 overflow-hidden">
              <img 
                src={movie.img} 
                alt={movie.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultPoster;
                }}
              />
            </div>
            <div className="text-white flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-[#ff416c]/10 text-[#ff416c] rounded-full text-sm font-medium border border-[#ff416c]/30">
                  {movie.genre}
                </span>
                <span className="px-3 py-1 bg-[#ff416c]/10 text-[#ff416c] rounded-full text-sm font-medium border border-[#ff416c]/30">
                {movie.showType}
                </span>
               
                <span className="px-3 py-1 bg-[#ff416c]/10 text-[#ff416c] rounded-full text-sm font-medium border border-[#ff416c]/30">
                  {movie.language}
                </span>
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium">
                  {movie.duration}
                </span>
               
                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-sm font-medium flex items-center">
                  <StarIcon className="w-4 h-4 mr-1 text-yellow-400" />
                  {movie.rating}
                </span>
              </div>
              <p className="text-gray-300 max-w-3xl">{movie.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Theater Listings */}
      <div className="container mx-auto px-4 py-8">
        <TheaterListsByMovie
          movies={[movie]}
          selectedMovieIndex={0}
          setSelectedMovieIndex={() => {}}
          auth={auth}
        />
      </div>
    </div>
  );
};

export default Theater;