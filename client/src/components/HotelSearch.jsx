import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { HiSearch } from "react-icons/hi";
import { FaCalendarAlt, FaUser, FaChevronDown, FaMapMarkerAlt } from "react-icons/fa";
import CalendarComponent from "./CalendarComponent";
import CityDropdown from "./CityDropdown";

const CITIES = [
  "Mumbai", "New Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
  "Pune", "Ahmedabad", "Goa", "Jaipur", "Kochi", "Lucknow", "Udaipur",
  "Shimla", "Manali", "Darjeeling", "Ooty", "Mysore", "Agra", "Varanasi",
  "Dubai", "Bangkok", "Singapore", "London", "Dubai", "Port Blair", "Kodaikanal",
  "Mahabaleshwar", "Lonavala", "Rishikesh", "Haridwar", "Gangtok", "Leh",
];

const HotelSearch = ({ onSearch }) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [city, setCity] = useState("Mumbai");
  const [citySearch, setCitySearch] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState("checkIn");
  const [guestsDropdownOpen, setGuestsDropdownOpen] = useState(false);
  const cityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
        setGuestsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T12:00:00");
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month}'${year}`;
  };

  const getDayName = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleString("en-US", { weekday: "long" });
  };

  return (
    <section className="relative min-h-[400px] flex items-start justify-center pt-8 pb-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 100%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center gap-2 text-white text-xl font-bold drop-shadow-lg">
            <span className="text-2xl">🏨</span>
            Book Hotels
          </div>
        </div>

        <div className="relative bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-end gap-0 flex-wrap">
            <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pr-4" ref={cityRef}>
              <label className="block text-xs font-medium text-gray-500 mb-1">City</label>
              <button
                type="button"
                onClick={() => {
                  setCityDropdownOpen(!cityDropdownOpen);
                  setCalendarOpen(false);
                  setGuestsDropdownOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <div className="text-lg font-bold text-gray-900 truncate">{city || "Select City"}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase">Destination</div>
              </button>

              {/* Anchored City Dropdown */}
              <CityDropdown
                isOpen={cityDropdownOpen}
                onClose={() => setCityDropdownOpen(false)}
                onSelect={(val) => {
                  const cityName = val.split(' (')[0];
                  setCity(cityName);
                  setCityDropdownOpen(false);
                  setTimeout(() => {
                    setActiveField("departure"); // Maps to Check-in
                    setCalendarOpen(true);
                  }, 150);
                }}
                position={{ top: 0, left: 0 }}
                className="w-full"
                type="hotels"
              />
            </div>

            <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pl-4 pr-4">
              <button
                type="button"
                onClick={() => {
                  setActiveField("checkIn");
                  setCalendarOpen(true);
                  setCityDropdownOpen(false);
                  setGuestsDropdownOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "checkIn" ? "text-blue-600" : "text-gray-500"}`}>
                  Check-in
                </label>
                {checkIn ? (
                  <div>
                    <div className="text-base font-bold text-gray-900">{formatDate(checkIn)}</div>
                    <div className="text-xs text-gray-500">{getDayName(checkIn)}</div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Select date</div>
                )}
              </button>
            </div>

            <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pl-4 pr-4">
              <button
                type="button"
                onClick={() => {
                  setActiveField("checkOut");
                  setCalendarOpen(true);
                  setCityDropdownOpen(false);
                  setGuestsDropdownOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "checkOut" ? "text-red-600" : "text-gray-500"}`}>
                  Check-out
                </label>
                {checkOut ? (
                  <div>
                    <div className="text-base font-bold text-gray-900">{formatDate(checkOut)}</div>
                    <div className="text-xs text-gray-500">{getDayName(checkOut)}</div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">Select date</div>
                )}
              </button>
            </div>

            <div className="flex-1 min-w-[200px] relative border-r border-gray-200 pl-4 pr-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Guests & Rooms</label>
              <button
                type="button"
                onClick={() => {
                  setGuestsDropdownOpen(!guestsDropdownOpen);
                  setCityDropdownOpen(false);
                  setCalendarOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <div className="flex items-center gap-2">
                  <FaUser className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-900">{guests} Guest{guests !== 1 ? "s" : ""}, {rooms} Room{rooms !== 1 ? "s" : ""}</div>
                  </div>
                  <FaChevronDown className="w-3 h-3 text-gray-400" />
                </div>
              </button>
              {guestsDropdownOpen && (
                <div className="absolute z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 min-w-[300px] right-0 top-0 animate-in fade-in zoom-in duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Select Guests</h3>
                    <button onClick={() => setGuestsDropdownOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <FaChevronDown className="w-3 h-3 rotate-180" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-bold text-slate-700">Guests</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Total passengers</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-base font-black text-slate-800">{guests}</span>
                        <button
                          type="button"
                          onClick={() => setGuests(guests + 1)}
                          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all text-lg font-bold text-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-bold text-slate-700">Rooms</span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Number of rooms</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => setRooms(Math.max(1, rooms - 1))}
                          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-base font-black text-slate-800">{rooms}</span>
                        <button
                          type="button"
                          onClick={() => setRooms(rooms + 1)}
                          className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all text-lg font-bold text-blue-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGuestsDropdownOpen(false)}
                      className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-red-200 uppercase tracking-widest text-xs"
                    >
                      Apply Selection
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 pl-4">
              <button
                type="button"
                onClick={() => {
                  if (!city || !checkIn || !checkOut) {
                    toast.error("Please select city, check-in, and check-out dates.");
                    return;
                  }
                  const cIn = new Date(checkIn + "T12:00:00");
                  const cOut = new Date(checkOut + "T12:00:00");
                  if (cOut <= cIn) {
                    toast.error("Check-out must be after check-in.");
                    return;
                  }
                  onSearch?.({
                    city,
                    checkIn,
                    checkOut,
                    guests,
                    rooms,
                  });
                }}
                className="inline-flex items-center gap-2 px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-base uppercase tracking-wide"
              >
                <HiSearch className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>

          {/* Anchored Calendar Panel */}
          <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none z-[100]">
            <div className="relative w-full h-full">
              <CalendarComponent
                isOpen={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                departureDate={checkIn}
                returnDate={checkOut}
                activeField={activeField === 'checkIn' ? 'departure' : 'return'}
                onSelectDeparture={(d) => {
                  setCheckIn(d);
                  setActiveField("checkOut");
                }}
                onSelectReturn={(d) => {
                  setCheckOut(d);
                  setCalendarOpen(false);
                  setTimeout(() => setGuestsDropdownOpen(true), 150);
                }}
                isRoundTrip={true}
                className="pointer-events-auto mt-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelSearch;
