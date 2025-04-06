import axios from "axios";
import { useContext, useEffect, useState, useCallback, useRef } from "react";
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

const Home = () => {
  const { auth } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

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


  const features = [
    {
      title: "4K Streaming",
      description: "Crystal-clear resolution with immersive audio",
      icon: <FilmIcon className="w-12 h-12 text-purple-400" />,
      bg: "bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1')]"
    },
    {
      title: "Exclusive Content",
      description: "Early access to upcoming blockbusters",
      icon: <StarIcon className="w-12 h-12 text-pink-400" />,
      bg: "bg-[url('https://images.unsplash.com/photo-1574267432553-4b4628081c31')]"
    },
    {
      title: "Smart Recommendations",
      description: "Personalized suggestions based on your taste",
      icon: <SparklesIcon className="w-12 h-12 text-rose-400" />,
      bg: "bg-[url('https://images.unsplash.com/photo-1585951237318-9ea5e175b891')]"
    }
  ];

  const premiumFeatures = [
    {
      title: "Dolby Atmos",
      description: "Immersive 360° sound experience",
      icon: <DevicePhoneMobileIcon className="w-12 h-12 text-purple-400" />,
      image: "https://wallpapers.com/images/hd/4k-dolby-vision-4000-x-3000-wallpaper-2120li84x4alr7uz.jpg"
    },
    {
      title: "4K Projection",
      description: "Crystal clear image quality",
      icon: <FilmIcon className="w-12 h-12 text-pink-400" />,
      image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b"
    },
    {
      title: "Luxury Seating",
      description: "Premium recliner seats",
      icon: <UserGroupIcon className="w-12 h-12 text-rose-400" />,
      image: "https://images.unsplash.com/photo-1579803815615-1203fb5a2e9d"
    },
    {
      title: "Global Content",
      description: "International cinema selection",
      icon: <GlobeAltIcon className="w-12 h-12 text-purple-300" />,
      image: "https://images.unsplash.com/photo-1485846234645-a62644f84728"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/50 z-10" />
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')] bg-cover bg-center opacity-20"
          style={{ willChange: 'transform' }}
        />
        
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="max-w-4xl space-y-6">
            <div 
              data-aos="zoom-in"
              className="inline-flex items-center px-6 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 border border-purple-500/30 animate-pulse"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              <span className="text-sm font-semibold">NOW STREAMING</span>
            </div>
            
            <h1 
              data-aos="fade-up"
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-pink-300 to-rose-400 bg-clip-text text-transparent"
            >
              Experience Cinematic<br />
              Magic Redefined
            </h1>
            
            <p 
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-xl text-gray-300 max-w-2xl mx-auto"
            >
              Dive into a world of blockbuster entertainment with curated selections and premium viewing experiences.
            </p>
            
            <div 
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex justify-center gap-4"
            >
              <button 
                onClick={() => featuredMovie && handleViewTheater(featuredMovie._id)}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform duration-300 shadow-lg shadow-purple-500/30 hover:shadow-pink-500/40"
              >
                <TicketIcon className="w-6 h-6" />
                <a href="/Viewall">Get Tickets Now </a>
              </button>
            </div>
          </div>
        </div>
      </div>

    
      {/* <section className="py-16 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              data-aos="fade-up"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Why Choose Us?
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="50"
              className="text-gray-400 max-w-2xl mx-auto text-lg"
            >
              Premium features that elevate your movie experience
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                className="group relative h-80 overflow-hidden rounded-xl hover:-translate-y-2 transition-all duration-300"
              >
                <div 
                  className={`absolute inset-0 ${feature.bg} bg-cover bg-center opacity-50 group-hover:opacity-70 transition-opacity duration-300`}
                  style={{ willChange: 'transform, opacity' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 flex flex-col justify-end">
                  <div className="mb-4 text-purple-500">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Now Showing Section */}
      <section className="py-16 px-4 bg-gray-900" >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 
              data-aos="fade-right"
              className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent"
            >
              Now Showing
            </h2>
            <button 
              data-aos="fade-left"
              data-aos-delay="50"
              className="flex items-center text-purple-300 hover:text-pink-300 group"
            >
             <a href="/Viewall"> View All</a> <ChevronRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i}
                  className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-hidden pb-4">
  <div 
    className="flex gap-4 animate-scroll"
    ref={scrollRef}
    style={{ 
      width: 'max-content',
      animation: `scroll ${movies.length * 8}s linear infinite` 
    }}
  >
    {[...movies, ...movies].map((movie, index) => (
      <div
        key={`${movie._id}-${index}`}
        data-aos="fade-up"
        data-aos-delay={(index % 4) * 50}
        onClick={() => handleViewTheater(movie._id)}
        className="cursor-pointer group relative aspect-[2/3] w-64 flex-shrink-0 rounded-lg overflow-hidden hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-purple-500/20"
      >
        <img
          src={movie.img}
          alt={movie.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-4 flex flex-col justify-end">
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
            <div className="w-full py-2.5 bg-purple-600 rounded-lg font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 text-center">
              View Showtimes
            </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll linear infinite;
          }
        `}</style>
      </section>

      {/* Premium Experience Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 
              data-aos="fade-up"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Premium Experience
            </h2>
            <p 
              data-aos="fade-up"
              data-aos-delay="50"
              className="text-gray-400 max-w-2xl mx-auto text-lg"
            >
              Discover our exclusive cinema features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {premiumFeatures.map((feature, index) => (
              <div 
                key={index}
                data-aos="fade-up"
                data-aos-delay={(index % 4) * 50}
                className="group relative h-60 overflow-hidden rounded-xl hover:-translate-y-2 transition-all duration-300"
              >
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <div className="mb-2">{feature.icon}</div>
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        data-aos="fade-up"
        className="py-12 px-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="text-2xl font-bold flex items-center gap-2">
                <FilmIcon className="w-8 h-8 text-purple-400" />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  CineVerse
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-purple-300">Support</h4>
              <nav className="space-y-2">
                <a href="/faq" className="block text-gray-300 hover:text-purple-300">FAQ</a>
                <a href="/AaboutUs" className="block text-gray-300 hover:text-purple-300">About us</a>
                <a href="#" className="block text-gray-300 hover:text-purple-300">CineVersesupport.gmail.com</a>
              </nav>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-purple-300">Connect</h4>
              <div className="flex gap-4">
                {['Facebook', 'Twitter', 'Instagram'].map((social, i) => (
                  <button 
                    key={i}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      {social === 'Facebook' && (
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      )}
                      {social === 'Twitter' && (
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      )}
                      {social === 'Instagram' && (
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      )}
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} CineVerse. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;