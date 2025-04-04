import { TicketIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import Seat from "../components/Seat";
import ShowtimeDetails from "../components/ShowtimeDetails";
import { AuthContext } from "../context/AuthContext";

const Showtime = () => {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const [showtime, setShowtime] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [filterRow, setFilterRow] = useState(null);
  const [filterColumn, setFilterColumn] = useState(null);

  const sortedSelectedSeat = selectedSeats.sort((a, b) => {
    const [rowA, numberA] = a.match(/([A-Za-z]+)(\d+)/).slice(1);
    const [rowB, numberB] = b.match(/([A-Za-z]+)(\d+)/).slice(1);
    if (rowA === rowB) {
      if (parseInt(numberA) > parseInt(numberB)) {
        return 1;
      } else {
        return -1;
      }
    } else if (rowA.length > rowB.length) {
      return 1;
    } else if (rowA.length < rowB.length) {
      return -1;
    } else if (rowA > rowB) {
      return 1;
    }
    return -1;
  });

  const fetchShowtime = async () => {
    try {
      let response;
      if (auth.role === "admin") {
        response = await axios.get(`/showtime/user/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
      } else {
        response = await axios.get(`/showtime/${id}`);
      }
      setShowtime(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  useEffect(() => {
    fetchShowtime();
  }, []);

  const row = showtime?.theater?.seatPlan?.row;
  let rowLetters = [];
  if (row) {
    for (let k = 64; k <= (row.length === 2 ? row.charCodeAt(0) : 64); k++) {
      for (
        let i = 65;
        i <=
        (k === row.charCodeAt(0) || row.length === 1
          ? row.charCodeAt(row.length - 1)
          : 90);
        i++
      ) {
        const letter =
          k === 64
            ? String.fromCharCode(i)
            : String.fromCharCode(k) + String.fromCharCode(i);
        rowLetters.push(letter);
      }
    }
  }

  const column = showtime?.theater?.seatPlan.column;
  let colNumber = [];
  for (let k = 1; k <= column; k++) {
    colNumber.push(k);
  }

  const isPast = new Date(showtime.showtime) < new Date();
  const filteredSeats = showtime?.seats?.filter((seat) => {
    return (
      (!filterRow || filterRow.map((row) => row.value).includes(seat.row)) &&
      (!filterColumn ||
        filterColumn
          .map((column) => column.value)
          .includes(String(seat.number)))
    );
  });

  const calculateSeatPrice = (seat, showtime) => {
    if (!showtime?.theater?.pricing) {
      const rowLetter = seat.match(/^[A-Za-z]+/)[0].toUpperCase();
      if (rowLetter >= 'A' && rowLetter <= 'F') return 300;
      if (rowLetter >= 'G' && rowLetter <= 'Q') return 200;
      return 100;
    }
  
    const rowLetter = seat.match(/^[A-Za-z]+/)[0];
    
    if (showtime.theater.pricing.sections) {
      const section = showtime.theater.pricing.sections.find(s => 
        rowLetter >= s.rowRange.start && 
        rowLetter <= s.rowRange.end
      );
      return section ? section.price : showtime.theater.pricing.defaultPrice;
    } else {
      const totalRows = showtime.theater.seatPlan.row.charCodeAt(0) - 64;
      const sectionSize = Math.ceil(totalRows / 3);
      
      if (rowLetter.charCodeAt(0) - 64 <= sectionSize) {
        return showtime.theater.pricing.lowerSection || 300;
      } else if (rowLetter.charCodeAt(0) - 64 <= sectionSize * 2) {
        return showtime.theater.pricing.middleSection || 200;
      } else {
        return showtime.theater.pricing.upperSection || 100;
      }
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + calculateSeatPrice(seat, showtime);
    }, 0);
  };

  const formatINR = (amount) => {
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#121212] to-[#1a1a2e]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {showtime.showtime ? (
          <>
            <ShowtimeDetails
              showtime={showtime}
              showDeleteBtn={true}
              fetchShowtime={fetchShowtime}
            />
            
            {/* Seat Selection Section */}
            <div className="mt-8 bg-[#222] rounded-xl shadow-lg overflow-hidden border border-gray-800">
              <div className="p-6 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b]">
                <h2 className="text-2xl font-bold text-white">Seat Selection</h2>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Selected Seats Summary */}
                
                  
                  {/* Seat Map */}
                  <div className="flex-1">
                    <div className="w-full rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] p-3 text-center mb-6">
                      <h2 className="text-xl font-bold text-white tracking-wider">SCREEN</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <div className="flex flex-col items-center">
                        {/* Column Numbers */}
                        <div className="flex mb-2">
                          <div className="w-8"></div>
                          {colNumber.map((col, index) => (
                            <div
                              key={index}
                              className="w-8 text-center font-medium text-gray-300">
                              {col}
                            </div>
                          ))}
                          <div className="w-8"></div>
                        </div>
                        
                        {/* Seat Rows */}
                        {rowLetters.reverse().map((rowLetter, index) => (
                          <div key={index} className="flex mb-2">
                            <div className="w-8 flex items-center justify-center font-medium text-gray-300">
                              {rowLetter}
                            </div>
                            {colNumber.map((col, index) => (
                              <Seat
                                key={index}
                                seat={{ row: rowLetter, number: col }}
                                setSelectedSeats={setSelectedSeats}
                                selectable={!isPast}
                                isAvailable={
                                  !showtime.seats?.find(
                                    (seat) =>
                                      seat.row === rowLetter && seat.number === col
                                  )
                                }
                              />
                            ))}
                            <div className="w-8 flex items-center justify-center font-medium text-gray-300">
                              {rowLetter}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Seat Legend */}
                    <div className="mt-6 flex justify-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm bg-gray-700 border border-gray-600"></div>
                        <span className="text-gray-300 text-sm">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm bg-[#ff416c] border border-[#ff4b2b]"></div>
                        <span className="text-gray-300 text-sm">Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-sm bg-gray-900 border border-gray-700"></div>
                        <span className="text-gray-300 text-sm">Taken</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
                    <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] bg-clip-text text-transparent">
                          Your Selection
                        </span>
                        {selectedSeats.length > 0 && (
                          <span className="text-sm text-gray-300">
                            ({selectedSeats.length} seats selected)
                          </span>
                        )}
                      </h3>
                      
                      {selectedSeats.length > 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {selectedSeats.map((seat, index) => (
                              <div
                                key={index}
                                className="flex flex-col items-center p-3 rounded-lg bg-gray-900 border border-gray-700 hover:border-[#ff416c] transition-colors">
                                <span className="text-white font-medium text-lg">
                                  {seat}
                                </span>
                                <span className="text-[#ff416c] font-bold">
                                  {formatINR(calculateSeatPrice(seat, showtime))}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t border-gray-700 pt-3">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Subtotal:</span>
                              <span className="text-white font-medium">
                                {formatINR(calculateTotalPrice())}
                              </span>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-300">Service Fee:</span>
                              <span className="text-white font-medium">₹40.00</span>
                            </div>
                            <div className="flex justify-between mt-3 pt-3 border-t border-gray-700">
                              <span className="text-lg font-bold text-white">Total:</span>
                              <span className="text-lg font-bold text-white">
                                {formatINR(calculateTotalPrice() + 40)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-400 italic">
                            {isPast 
                              ? "This showtime has passed" 
                              : "Select seats by clicking on available seats below"}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {!isPast && selectedSeats.length > 0 && (
                      <div className="mt-4 flex justify-end">
                        <Link
                          to={auth.role ? `/purchase/${id}` : "/login"}
                          state={{
                            selectedSeats: sortedSelectedSeat,
                            showtime,
                          }}
                          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff416c] to-[#ff4b2b] px-6 py-3 font-bold text-white hover:shadow-lg hover:shadow-[#ff416c]/30 transition-all duration-300">
                          <p>Continue to Purchase</p>
                          <TicketIcon className="h-5 w-5 text-white" />
                        </Link>
                      </div>
                    )}
                  </div>
            
            {/* Admin Section */}
            {auth.role === "admin" && (
              <div className="mt-8 bg-[#222] rounded-xl shadow-lg overflow-hidden border border-gray-800">
                <div className="p-6 bg-gradient-to-r from-[#ff416c] to-[#ff4b2b]">
                  <h2 className="text-2xl font-bold text-white">Booked Seats</h2>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Filter by Row
                      </label>
                      <Select
                        value={filterRow}
                        options={Array.from(
                          new Set(showtime?.seats?.map((seat) => seat.row))
                        )
                          .sort((a, b) => a.localeCompare(b))
                          .map((value) => ({ value, label: value }))}
                        onChange={(value) => {
                          setFilterRow(value);
                        }}
                        isClearable={true}
                        isMultiple={true}
                        isSearchable={true}
                        primaryColor="red"
                        classNames={{
                          menuButton: () => "bg-gray-800 text-white border-gray-700",
                          menu: "bg-gray-800 border-gray-700",
                          listItem: ({ isSelected }) => 
                            `text-white hover:bg-gray-700 ${isSelected ? "bg-[#ff416c]" : ""}`,
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Filter by Seat Number
                      </label>
                      <Select
                        value={filterColumn}
                        options={Array.from(
                          new Set(showtime?.seats?.map((seat) => seat.number))
                        )
                          .sort((a, b) => a - b)
                          .map((value) => ({
                            value: String(value),
                            label: String(value),
                          }))}
                        onChange={(value) => {
                          setFilterColumn(value);
                        }}
                        isClearable={true}
                        isMultiple={true}
                        isSearchable={true}
                        primaryColor="red"
                        classNames={{
                          menuButton: () => "bg-gray-800 text-white border-gray-700",
                          menu: "bg-gray-800 border-gray-700",
                          listItem: ({ isSelected }) => 
                            `text-white hover:bg-gray-700 ${isSelected ? "bg-[#ff416c]" : ""}`,
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <table className="min-w-full bg-gray-900">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Seat
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Username
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                            Price
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {filteredSeats
                          ?.sort((a, b) => {
                            const rowA = a.row;
                            const numberA = a.number;
                            const rowB = b.row;
                            const numberB = b.number;
                            if (rowA === rowB) {
                              return parseInt(numberA) > parseInt(numberB)
                                ? 1
                                : -1;
                            } else {
                              return rowA.localeCompare(rowB);
                            }
                          })
                          .map((seat, index) => (
                            <tr
                              key={index}
                              className="hover:bg-gray-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                {`${seat.row}${seat.number}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {seat.user?.username || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {seat.user?.email || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  seat.user?.role === 'admin' 
                                    ? 'bg-purple-900/50 text-purple-300' 
                                    : 'bg-blue-900/50 text-blue-300'
                                }`}>
                                  {seat.user?.role || 'user'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {formatINR(calculateSeatPrice(`${seat.row}${seat.number}`, showtime))}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default Showtime;