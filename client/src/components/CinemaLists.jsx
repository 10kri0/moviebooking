import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../components/Loading';

const CinemaLists = ({
  cinemas,
  selectedCinemaIndex,
  setSelectedCinemaIndex,
  fetchCinemas,
  auth,
  isFetchingCinemas = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [isAdding, setIsAdding] = useState(false);

  const onAddCinema = async (data) => {
    try {
      setIsAdding(true);
      const response = await axios.post('/cinema', data, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      reset();
      fetchCinemas(data.name);
      toast.success('Cinema added successfully!', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false,
        theme: 'dark',
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to add cinema. Please try again.', {
        position: 'top-center',
        autoClose: 2000,
        pauseOnHover: false,
        theme: 'dark',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const CinemaLists = ({ cinemas }) => {
    const cinemasList = cinemas?.filter((cinema) =>
      cinema.name.toLowerCase().includes(watch('search')?.toLowerCase() || ''),
    );

    return cinemasList.length ? (
      cinemasList.map((cinema, index) => (
        <button
          key={index}
          className={`w-fit rounded-xl px-5 py-3 font-medium text-white transition-all duration-300 ${
            cinemas[selectedCinemaIndex]?._id === cinema._id
              ? 'bg-gradient-to-br from-[#ff416c] to-[#ff4b2b] shadow-lg hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90'
              : 'bg-[#1e1e2e] shadow-md hover:bg-[#2a2a3a] hover:shadow-lg'
          }`}
          onClick={() => {
            setSelectedCinemaIndex(index);
            sessionStorage.setItem('selectedCinemaIndex', index);
          }}
        >
          <span className="drop-shadow-md">{cinema.name}</span>
        </button>
      ))
    ) : (
      <div className="rounded-lg bg-[#1e1e2e]/50 p-4 text-center text-gray-400">
        No cinemas found matching your search.
      </div>
    );
  };

  return (
    <div className="mx-4 flex h-fit flex-col gap-6 rounded-2xl bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] p-6 text-gray-100 shadow-2xl sm:mx-8 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
            Cinema Management
          </h2>
         
        </div>
        
        {auth.role === 'admin' && (
          <form 
            className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-end"
            onSubmit={handleSubmit(onAddCinema)}
          >
            <div className="flex-1">
              <label htmlFor="cinema-name" className="mb-1 block text-sm font-medium text-gray-300">
                Add New Cinema
              </label>
              <input
                id="cinema-name"
                placeholder="Enter cinema name"
                className="w-full rounded-xl border border-gray-700 bg-[#1e1e2e] px-4 py-3 text-white placeholder-gray-500 focus:border-[#ff416c] focus:ring-2 focus:ring-[#ff416c]/50 sm:min-w-[300px]"
                required
                {...register('name', { required: true })}
              />
            </div>
            <button
              disabled={isAdding}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-5 py-3 font-medium text-white transition-all duration-300 hover:from-[#ff416c]/90 hover:to-[#ff4b2b]/90 hover:shadow-lg disabled:from-gray-600 disabled:to-gray-700 disabled:hover:shadow-none"
            >
              {isAdding ? (
                'Adding...'
              ) : (
                <>
                  <PlusIcon className="h-5 w-5" />
                  Add Cinema
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="search"
          className="block w-full rounded-xl border border-gray-700 bg-[#1e1e2e] px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-[#ff416c] focus:ring-2 focus:ring-[#ff416c]/50"
          placeholder="Search cinemas..."
          {...register('search')}
        />
      </div>

      {isFetchingCinemas ? (
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          <CinemaLists cinemas={cinemas} />
        </div>
      )}
    </div>
  );
};

export default CinemaLists;