import { ArrowsRightLeftIcon, ArrowsUpDownIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline';
import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraggable } from 'react-use-draggable-scroll';
import { AuthContext } from '../context/AuthContext';

const ScheduleTable = ({ cinema, selectedDate }) => {
  const ref = useRef(null);
  const { auth } = useContext(AuthContext);
  const { events } = useDraggable(ref);
  const navigate = useNavigate();

  const getRowStart = (showtime) => {
    const showtimeDate = new Date(showtime);
    const hour = showtimeDate.getHours();
    const min = showtimeDate.getMinutes();
    return Math.round((60 * hour + min) / 5);
  };

  const getRowSpan = (length) => {
    return Math.round(length / 5);
  };

  const getRowStartRange = () => {
    let firstRowStart = Infinity;
    let lastRowEnd = 0;
    let count = 0;

    cinema.theaters.forEach((theater) => {
      theater.showtimes.forEach((showtime) => {
        const showtimeDate = new Date(showtime.showtime);
        if (
          showtimeDate.getDate() === selectedDate.getDate() &&
          showtimeDate.getMonth() === selectedDate.getMonth() &&
          showtimeDate.getFullYear() === selectedDate.getFullYear()
        ) {
          const rowStart = getRowStart(showtime.showtime);
          firstRowStart = Math.min(firstRowStart, rowStart);
          lastRowEnd = Math.max(lastRowEnd, rowStart + getRowSpan(showtime.movie.length));
          count++;
        }
      });
    });

    return [firstRowStart, lastRowEnd, count];
  };

  const getTodayShowtimes = (theater) => {
    return theater.showtimes.filter((showtime) => {
      const showtimeDate = new Date(showtime.showtime);
      return (
        showtimeDate.getDate() === selectedDate.getDate() &&
        showtimeDate.getMonth() === selectedDate.getMonth() &&
        showtimeDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const isPast = (date) => {
    return new Date(date) < new Date();
  };

  const [firstRowStart, lastRowEnd, showtimeCount] = getRowStartRange();
  const gridRows = Math.max(1, lastRowEnd - firstRowStart);
  const shiftStart = 3;
  const shiftEnd = 2;

  return (
    <div
      className={`grid min-h-[50vh] max-h-screen overflow-x-auto rounded-lg bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e] shadow-xl`}
      style={{
        gridTemplateColumns: `repeat(${cinema.theaters.length}, minmax(120px, 1fr))`,
        gridTemplateRows: `repeat(${gridRows + shiftEnd}, 20px)`,
      }}
      {...events}
      ref={ref}
    >
      {cinema.theaters.map((theater, theaterIndex) => (
        <div
          key={theaterIndex}
          className="sticky top-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#222] to-[#333] py-2 text-white shadow-md"
        >
          <p className="text-2xl font-semibold bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
            {theaterIndex + 1}
          </p>
          {auth.role === 'admin' && (
            <>
              <div className="flex gap-1 text-xs text-gray-300">
                <p className="flex items-center gap-1">
                  <ArrowsUpDownIcon className="h-3 w-3" />
                  {theater.seatPlan.row === 'A'
                    ? theater.seatPlan.row
                    : `A - ${theater.seatPlan.row}`}
                </p>
                <p className="flex items-center gap-1">
                  <ArrowsRightLeftIcon className="h-3 w-3" />
                  {theater.seatPlan.column === 1
                    ? theater.seatPlan.column
                    : `1 - ${theater.seatPlan.column}`}
                </p>
              </div>
              <p className="flex items-center gap-1 text-sm text-gray-300">
                <UserIcon className="h-4 w-4" />
                {(theater.seatPlan.row.charCodeAt(0) - 64) * theater.seatPlan.column} Seats
              </p>
            </>
          )}
        </div>
      ))}

      {cinema.theaters.map((theater, theaterIndex) =>
        getTodayShowtimes(theater).map((showtime, showtimeIndex) => (
          <button
            key={showtimeIndex}
            className={`mx-1 flex flex-col items-center rounded-lg border border-gray-700 p-2 text-center shadow-md transition-all duration-300 ${
              !isPast(new Date(showtime.showtime))
                ? 'bg-[#222] hover:bg-[#333] hover:shadow-[0_0_10px_-3px_rgba(255,65,108,0.3)]'
                : `bg-[#111] ${auth.role === 'admin' ? 'hover:bg-[#222]' : 'cursor-not-allowed'}`
            } ${!showtime.isRelease && 'ring-2 ring-inset ring-[#ff416c]'}`}
            style={{
              gridRow: `${getRowStart(showtime.showtime) - firstRowStart + shiftStart} / span ${getRowSpan(
                showtime.movie.length,
              )}`,
              gridColumn: `${theaterIndex + 1}`,
            }}
            onClick={() => {
              if (!isPast(new Date(showtime.showtime)) || auth.role === 'admin') {
                navigate(`/showtime/${showtime._id}`);
              }
            }}
          >
            {!showtime.isRelease && (
              <EyeSlashIcon className="mx-auto h-5 w-5 stroke-2 text-[#ff416c]" title="Unreleased showtime" />
            )}
            <p className="text-sm font-bold text-white">{showtime.movie.name}</p>
            <p className="text-sm leading-3 text-gray-300">
              {`${new Date(showtime.showtime).getHours().toString().padStart(2, '0')}:${new Date(
                showtime.showtime,
              )
                .getMinutes()
                .toString()
                .padStart(2, '0')} - ${new Date(
                new Date(showtime.showtime).getTime() + showtime.movie.length * 60000,
              )
                .getHours()
                .toString()
                .padStart(2, '0')}:${new Date(
                new Date(showtime.showtime).getTime() + showtime.movie.length * 60000,
              )
                .getMinutes()
                .toString()
                .padStart(2, '0')}`}
            </p>
          </button>
        )),
      )}

      {showtimeCount === 0 && (
        <div className="col-span-full row-start-3 flex items-center justify-center text-xl font-semibold text-gray-400">
          There are no showtimes available.
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;