import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { HiSearch } from "react-icons/hi";
import { FaExchangeAlt, FaCalendarAlt, FaUser, FaChevronDown, FaExclamationTriangle } from "react-icons/fa";
import CityDropdown from "./CityDropdown";
import CalendarComponent from "./CalendarComponent";
import TravellerDropdown from "./TravellerDropdown";

const TRIP_TYPES = [
  { id: "oneway", label: "One Way" },
  { id: "round", label: "Round Trip" },
  { id: "multi", label: "Multi City" },
];

const travelClassToApi = (label) => {
  const map = { Economy: "economy", "Premium Economy": "premium_economy", Business: "business", "First Class": "first" };
  return map[label] || "economy";
};

const Hero = ({ onSearch, isInline = false, initialParams = null }) => {
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("Mumbai");
  const [fromCode, setFromCode] = useState("BOM");
  const [fromAirport, setFromAirport] = useState("BOM, Chhatrapati Shivaji Inter...");
  const [to, setTo] = useState("New Delhi");
  const [toCode, setToCode] = useState("DEL");
  const [toAirport, setToAirport] = useState("DEL, Indira Gandhi Internatio...");
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [departureDate, setDepartureDate] = useState(today);
  const [returnDate, setReturnDate] = useState("");

  // Multi-city segments
  const [segments, setSegments] = useState([
    { id: 1, from: "Mumbai", fromCode: "BOM", to: "New Delhi", toCode: "DEL", date: today },
    { id: 2, from: "New Delhi", fromCode: "DEL", to: "Bangalore", toCode: "BLR", date: tomorrow }
  ]);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");
  const [directOnly, setDirectOnly] = useState(false);
  const [specialFare, setSpecialFare] = useState(""); // "" | "defence" | "student" | "senior"

  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState("departure");
  const [travellerDropdownOpen, setTravellerDropdownOpen] = useState(false);

  // For multi-city dropdowns
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [activeSegmentField, setActiveSegmentField] = useState(""); // "from", "to", "date"

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const searchCardRef = useRef(null);

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (initialParams) {
      if (initialParams.tripType === 'round-trip') setTripType('round');
      else if (initialParams.tripType === 'multi-city') setTripType('multi');
      else setTripType('oneway');

      if (initialParams.from) {
        setFrom(initialParams.fromCity || initialParams.from);
        setFromCode(initialParams.from);
        setFromAirport(`${initialParams.from}, ${initialParams.fromCity || ''} International`);
      }
      if (initialParams.to) {
        setTo(initialParams.toCity || initialParams.to);
        setToCode(initialParams.to);
        setToAirport(`${initialParams.to}, ${initialParams.toCity || ''} International`);
      }
      if (initialParams.departureDate) setDepartureDate(initialParams.departureDate);
      if (initialParams.returnDate) setReturnDate(initialParams.returnDate);

      if (initialParams.adults !== undefined) setAdults(initialParams.adults);
      if (initialParams.children !== undefined) setChildren(initialParams.children);
      if (initialParams.infants !== undefined) setInfants(initialParams.infants);

      const classMap = { economy: "Economy", premium_economy: "Premium Economy", business: "Business", first: "First Class" };
      if (initialParams.travelClass) setTravelClass(classMap[initialParams.travelClass] || "Economy");
      if (initialParams.specialFare) setSpecialFare(initialParams.specialFare);
      if (initialParams.segments) setSegments(initialParams.segments);
    }
  }, [initialParams]);

  useEffect(() => {
    const saved = localStorage.getItem("recentFlightSearches");
    if (saved) setRecentSearches(JSON.parse(saved).slice(0, 3));
  }, []);

  const saveSearch = (data) => {
    const searchObj = {
      from: data.fromCity || data.from,
      to: data.toCity || data.to,
      fromCode: data.fromCode || data.from,
      toCode: data.toCode || data.to,
      date: data.departureDate,
      timestamp: Date.now()
    };
    const updated = [searchObj, ...recentSearches.filter(s => s.fromCode !== searchObj.fromCode || s.toCode !== searchObj.toCode)].slice(0, 3);
    setRecentSearches(updated);
    localStorage.setItem("recentFlightSearches", JSON.stringify(updated));
  };

  const totalTravellers = adults + children + infants;
  const travellerSummary = totalTravellers === 1 ? "1 Traveller" : `${totalTravellers} Travellers`;

  const handleSwap = () => {
    const tempCity = from;
    const tempCode = fromCode;
    const tempAirport = fromAirport;
    setFrom(to);
    setFromCode(toCode);
    setFromAirport(toAirport);
    setTo(tempCity);
    setToCode(tempCode);
    setToAirport(tempAirport);
  };

  const handleFromSelect = (value) => {
    const match = value.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
    const city = match ? match[1].trim() : value;
    const code = match ? match[2] : value.toUpperCase().slice(0, 3);

    if (tripType === 'multi') {
      const newSegments = [...segments];
      newSegments[activeSegmentIndex].from = city;
      newSegments[activeSegmentIndex].fromCode = code;
      setSegments(newSegments);
    } else {
      setFrom(city);
      setFromCode(code);
      setFromAirport(`${code}, ${city} International`);

      setFromDropdownOpen(false);
      // Auto-flow: Open To dropdown ONLY after selecting a different city
      if (code.toUpperCase() !== toCode.toUpperCase()) {
        setTimeout(() => setToDropdownOpen(true), 100);
      }
    }
    setFromDropdownOpen(false);
  };

  const handleToSelect = (value) => {
    const match = value.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
    const city = match ? match[1].trim() : value;
    const code = match ? match[2] : value.toUpperCase().slice(0, 3);

    if (tripType === 'multi') {
      const newSegments = [...segments];
      newSegments[activeSegmentIndex].to = city;
      newSegments[activeSegmentIndex].toCode = code;
      setSegments(newSegments);
    } else {
      setTo(city);
      setToCode(code);
      setToAirport(`${code}, ${city} International`);

      setToDropdownOpen(false);
      // Auto-flow: Open Calendar ONLY after selecting a different city
      if (code.toUpperCase() !== fromCode.toUpperCase()) {
        setTimeout(() => {
          setActiveField("departure");
          setCalendarOpen(true);
        }, 100);
      }
    }
    setToDropdownOpen(false);
  };

  const addSegment = () => {
    if (segments.length >= 5) return;
    const last = segments[segments.length - 1];
    setSegments([...segments, {
      id: Date.now(),
      from: last.to,
      fromCode: last.toCode,
      to: "",
      toCode: "",
      date: ""
    }]);
  };

  const removeSegment = (id) => {
    if (segments.length <= 2) return;
    setSegments(segments.filter(s => s.id !== id));
  };

  const updateSegmentDate = (date) => {
    const newSegments = [...segments];
    newSegments[activeSegmentIndex].date = date;
    setSegments(newSegments);
    setCalendarOpen(false);
  };

  const setTripTypeWithClear = (id) => {
    setTripType(id);
    if (id === "oneway") setReturnDate("");
  };

  const openDepartureCalendar = () => {
    setFromDropdownOpen(false);
    setToDropdownOpen(false);
    setTravellerDropdownOpen(false);
    setActiveField("departure");
    setCalendarOpen(true);
  };

  const openReturnCalendar = () => {
    setFromDropdownOpen(false);
    setToDropdownOpen(false);
    setTravellerDropdownOpen(false);
    setTripType("round");
    setActiveField("return");
    setCalendarOpen(true);
  };

  const getDropdownPosition = (ref) => {
    if (!ref.current) return {};
    return { top: "100%", left: "0px" };
  };

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

  const handleSearchClick = () => {
    if (tripType === 'multi') {
      const invalid = segments.some(s => !s.fromCode || !s.toCode || !s.date);
      if (invalid) {
        toast.error("Please fill all cities and dates for multi-city search.");
        return;
      }
      onSearch?.({
        tripType: 'multi-city',
        segments: segments.map(s => ({
          from: s.fromCode,
          to: s.toCode,
          date: s.date
        })),
        adults,
        children,
        infants,
        travelClass: travelClassToApi(travelClass),
        directOnly
      });
    } else {
      if (!from || !to || !departureDate) {
        toast.error("Please select From, To, and Departure date.");
        return;
      }
      if (fromCode === toCode) {
        toast.error("Source and destination cities cannot be the same.");
        return;
      }
      if (tripType === "round" && !returnDate) {
        toast.error("Please select Return date for round trip.");
        return;
      }
      const searchData = {
        from: fromCode,
        to: toCode,
        fromCity: from,
        toCity: to,
        departureDate,
        returnDate: tripType === "round" ? returnDate : undefined,
        tripType: tripType === "round" ? "round-trip" : "one-way",
        adults,
        children,
        infants,
        travelClass: travelClassToApi(travelClass),
        directOnly,
        specialFare,
      };
      saveSearch(searchData);
      onSearch?.(searchData);
    }
  };

  return (
    <section
      className={`relative ${isInline ? "p-4 min-h-0 bg-white" : "min-h-[600px] flex items-start justify-center pt-8 pb-16 bg-cover bg-center bg-no-repeat"}`}
      style={isInline ? {} : {
        backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 100%), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')`,
      }}
    >
      <div className={`${isInline ? "w-full" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"}`}>
        {!isInline && (
          <div className="flex justify-end mb-6">
            <div className="inline-flex items-center gap-2 text-white text-xl font-bold drop-shadow-lg">
              <span className="text-2xl">✈</span>
              Book Flight Tickets
            </div>
          </div>
        )}

        <div className={`flex gap-2 ${isInline ? "mb-4" : "mb-6"}`}>
          {TRIP_TYPES.map(({ id, label }) => (
            <label
              key={id}
              className={`inline-flex items-center gap-2 rounded-full text-xs font-bold transition-all cursor-pointer ${isInline ? "px-4 py-2" : "px-6 py-3"} ${tripType === id
                ? "bg-red-500 text-white shadow-lg"
                : "bg-slate-100 text-gray-500 hover:bg-slate-200"
                }`}
            >
              <input
                type="radio"
                name="tripType"
                value={id}
                checked={tripType === id}
                onChange={() => setTripTypeWithClear(id)}
                className="sr-only"
              />
              <span
                className={`w-2.5 h-2.5 rounded-full border-2 ${tripType === id ? "border-white bg-white" : "border-gray-400"
                  }`}
              />
              {label}
            </label>
          ))}
        </div>

        <div ref={searchCardRef} className={`relative bg-white ${isInline ? "rounded-none shadow-none p-0" : "rounded-2xl shadow-2xl p-6"}`}>
          {tripType === "multi" ? (
            <div className="space-y-4">
              {segments.map((segment, index) => (
                <div key={segment.id} className="flex items-end gap-0 relative group">
                  <div className="flex-1 border-r border-gray-200 pr-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSegmentIndex(index);
                        setActiveSegmentField("from");
                        setFromDropdownOpen(true);
                        setToDropdownOpen(false);
                      }}
                      className="w-full text-left font-bold text-gray-900 border-b border-transparent hover:border-blue-300 pb-1"
                    >
                      {segment.from || "Select Source"}
                    </button>
                  </div>
                  <div className="flex-1 border-r border-gray-200 px-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSegmentIndex(index);
                        setActiveSegmentField("to");
                        setToDropdownOpen(true);
                        setFromDropdownOpen(false);
                      }}
                      className="w-full text-left font-bold text-gray-900 border-b border-transparent hover:border-blue-300 pb-1"
                    >
                      {segment.to || "Select Destination"}
                    </button>
                  </div>
                  <div className="flex-1 border-r border-gray-200 px-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Departure</label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSegmentIndex(index);
                        setActiveField("multi");
                        setCalendarOpen(true);
                      }}
                      className="w-full text-left font-bold text-gray-900 border-b border-transparent hover:border-blue-300 pb-1"
                    >
                      {segment.date ? formatDate(segment.date) : "Select Date"}
                    </button>
                  </div>
                  {index > 1 && (
                    <button
                      onClick={() => removeSegment(segment.id)}
                      className="p-2 text-gray-400 hover:text-red-500 absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={addSegment}
                  disabled={segments.length >= 5}
                  className="text-blue-600 text-sm font-bold hover:underline disabled:text-gray-400"
                >
                  + Add Another City
                </button>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <button onClick={() => setTravellerDropdownOpen(!travellerDropdownOpen)} className="text-sm font-bold text-gray-800 flex items-center gap-1">
                      <FaUser className="w-3 h-3" /> {travellerSummary}, {travelClass}
                    </button>
                  </div>
                  <button
                    onClick={handleSearchClick}
                    className="px-12 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
                  >
                    Search Multi-City
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-end gap-0">
              {/* From */}
              <div className={`flex-1 relative border-r border-gray-100 ${isInline ? "pr-5" : "pr-6"}`} ref={fromRef}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</label>
                <button
                  type="button"
                  onClick={() => {
                    setFromDropdownOpen(!fromDropdownOpen);
                    setToDropdownOpen(false);
                    setCalendarOpen(false);
                    setTravellerDropdownOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className={`${isInline ? "text-base" : "text-lg"} font-black text-slate-800 mb-0.5`}>{from} ({fromCode})</div>
                  <div className="text-[10px] text-gray-400 font-bold flex items-center justify-between">
                    <span className="truncate max-w-[150px]">{fromAirport}</span>
                    <FaChevronDown className="w-2.5 h-2.5 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </button>

                {/* Anchored Dropdown */}
                <CityDropdown
                  isOpen={fromDropdownOpen}
                  onClose={() => setFromDropdownOpen(false)}
                  onSelect={handleFromSelect}
                  position={{ top: 0, left: 0 }}
                  className="w-full"
                  label="From"
                />

                {/* Swap Button - Absolutely positioned on the border */}
                <div className={`absolute right-0 ${isInline ? "top-[64%]" : "top-[68%]"} -translate-y-1/2 ${isInline ? "translate-x-1/2" : "translate-x-[35%]"} z-10`}>
                  <button
                    type="button"
                    onClick={handleSwap}
                    className={`${isInline ? "w-8 h-8" : "w-10 h-10"} rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition-all shadow-md hover:shadow-lg border-2 border-white transform hover:scale-110 active:scale-95`}
                    aria-label="Swap"
                  >
                    <FaExchangeAlt className={`${isInline ? "w-3 h-3" : "w-4 h-4"}`} />
                  </button>
                </div>
              </div>

              {/* To */}
              <div className={`flex-1 relative border-r border-gray-100 ${isInline ? "pl-5 pr-2" : "pl-6 pr-4"}`} ref={toRef}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">To</label>
                <button
                  type="button"
                  onClick={() => {
                    setToDropdownOpen(!toDropdownOpen);
                    setFromDropdownOpen(false);
                    setCalendarOpen(false);
                    setTravellerDropdownOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className={`${isInline ? "text-base" : "text-lg"} font-black text-slate-800 mb-0.5`}>{to} ({toCode})</div>
                  <div className="text-[10px] text-gray-400 font-bold flex items-center justify-between">
                    <span className="truncate max-w-[150px]">{toAirport}</span>
                    <FaChevronDown className="w-2.5 h-2.5 text-gray-400 ml-2 flex-shrink-0" />
                  </div>
                </button>

                {/* Inline Error for Same Cities */}
                {fromCode === toCode && fromCode !== "" && (
                  <div className={`absolute top-[105%] ${isInline ? "left-0" : "left-6"} right-0 z-[110] bg-[#FFF5F5] border-l-4 border-red-500 shadow-xl p-3 rounded-r-lg flex items-center gap-3 animate-slideIn`}>
                    <div className="flex-shrink-0 w-7 h-7 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <FaExclamationTriangle className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-tight">From & To airports can't be same.</span>
                  </div>
                )}

                {/* Anchored Dropdown */}
                <CityDropdown
                  isOpen={toDropdownOpen}
                  onClose={() => setToDropdownOpen(false)}
                  onSelect={handleToSelect}
                  position={{ top: 0, left: 0 }}
                  className="w-full"
                  label="To"
                />
              </div>

              {/* Departure */}
              <div className={`flex-1 relative border-r border-gray-100 ${isInline ? "pl-2 pr-2" : "pl-4 pr-4"}`}>
                <button
                  type="button"
                  onClick={openDepartureCalendar}
                  className="w-full text-left focus:outline-none"
                >
                  <label className={`block text-[10px] font-bold mb-1 ${calendarOpen && activeField === "departure" ? "text-blue-600" : "text-gray-400 uppercase tracking-widest"}`}>
                    Departure
                  </label>
                  <div className="flex items-center justify-between">
                    {departureDate ? (
                      <>
                        <div>
                          <div className={`${isInline ? "text-base" : "text-lg"} font-black text-slate-800`}>{formatDate(departureDate)}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">{getDayName(departureDate)}</div>
                        </div>
                        <FaChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                      </>
                    ) : (
                      <>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Select date</div>
                        <FaChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Return */}
              <div className={`flex-1 relative border-r border-gray-100 ${isInline ? "pl-2 pr-2" : "pl-4 pr-4"}`}>
                <button
                  type="button"
                  onClick={tripType === "oneway" ? undefined : openReturnCalendar}
                  disabled={tripType === "oneway"}
                  className={`w-full text-left focus:outline-none ${tripType === "oneway" ? "cursor-default opacity-50" : ""}`}
                >
                  <label className={`block text-[10px] font-bold mb-1 ${calendarOpen && activeField === "return" ? "text-red-600" : "text-gray-400 uppercase tracking-widest"}`}>
                    Return
                  </label>
                  {tripType === "oneway" ? (
                    <div className="text-[9px] text-gray-400 font-bold uppercase leading-tight">
                      Book a round trip
                      <br />
                      to save more
                    </div>
                  ) : returnDate ? (
                    <div className="flex items-center justify-between gap-1">
                      <div>
                        <div className={`${isInline ? "text-base" : "text-lg"} font-black text-slate-800`}>{formatDate(returnDate)}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{getDayName(returnDate)}</div>
                      </div>
                      <FaChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">Select date</div>
                      <FaChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                    </div>
                  )}
                </button>
              </div>

              {/* Travellers & Class */}
              <div className={`flex-1 relative border-r border-gray-100 ${isInline ? "pl-2 pr-2" : "pl-4 pr-4"}`}>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Travellers & Class</label>
                <button
                  type="button"
                  onClick={() => {
                    setTravellerDropdownOpen(!travellerDropdownOpen);
                    setFromDropdownOpen(false);
                    setToDropdownOpen(false);
                    setCalendarOpen(false);
                  }}
                  className="w-full text-left focus:outline-none"
                >
                  <div className="flex items-center gap-2">
                    <FaUser className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <div className={`${isInline ? "text-sm" : "text-base"} font-black text-slate-800`}>{travellerSummary}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase">{travelClass}</div>
                    </div>
                    <FaChevronDown className="w-2.5 h-2.5 text-gray-400 flex-shrink-0" />
                  </div>
                </button>

                {/* Anchored Traveller Dropdown */}
                <TravellerDropdown
                  isOpen={travellerDropdownOpen}
                  onClose={() => setTravellerDropdownOpen(false)}
                  adults={adults}
                  children={children}
                  infants={infants}
                  travelClass={travelClass}
                  onApply={({ adults: a, children: c, infants: i, travelClass: tc }) => {
                    setAdults(a);
                    setChildren(c);
                    setInfants(i);
                    setTravelClass(tc);
                  }}
                  className="absolute left-0 mt-2"
                />
              </div>

              <div className={`flex-shrink-0 ${isInline ? "pl-2" : "pl-4"}`}>
                <button
                  type="button"
                  onClick={handleSearchClick}
                  className={`inline-flex items-center gap-2 ${isInline ? "px-6 py-3" : "px-10 py-4"} bg-red-500 hover:bg-slate-900 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl text-xs uppercase tracking-widest`}
                >
                  <HiSearch className="w-4 h-4" />
                  Search
                </button>
              </div>
            </div>
          )}

          {/* Modal Overlay Style Calendar */}
          <div className="absolute left-0 right-0 top-0 bottom-0 pointer-events-none z-[100]">
            <div className="relative w-full h-full">
              <CalendarComponent
                isOpen={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                departureDate={activeField === 'multi' ? segments[activeSegmentIndex].date : departureDate}
                returnDate={returnDate}
                activeField={activeField}
                onSelectDeparture={(d) => {
                  if (activeField === 'multi') updateSegmentDate(d);
                  else {
                    setDepartureDate(d);
                    // Auto-flow: open travellers after selecting departure (if one-way)
                    if (tripType === 'oneway') {
                      setCalendarOpen(false);
                      setTimeout(() => setTravellerDropdownOpen(true), 150);
                    }
                  }
                }}
                onSelectReturn={(d) => {
                  setReturnDate(d);
                  // Auto-flow: open travellers after selecting return date
                  setCalendarOpen(false);
                  setTimeout(() => setTravellerDropdownOpen(true), 150);
                }}
                isRoundTrip={tripType === "round"}
                className="pointer-events-auto mt-0"
              />
            </div>
          </div>

          {/* Checkbox row & Recently Searched */}
          {tripType !== "multi" && (
            <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${isInline ? "mt-4 pt-4" : "mt-6 pt-6"} border-t border-gray-100`}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <label className="inline-flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" checked={directOnly} onChange={(e) => setDirectOnly(e.target.checked)} className="w-3.5 h-3.5 rounded border-gray-200 text-red-500 focus:ring-red-500" />
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest group-hover:text-red-500 transition-colors">Direct Flights</span>
                </label>
                {[
                  { id: "defence", label: "Defence Fare" },
                  { id: "student", label: "Student Fare" },
                  { id: "senior", label: "Senior Citizen Fare" },
                ].map((fare) => (
                  <button
                    key={fare.id}
                    type="button"
                    onClick={() => setSpecialFare(specialFare === fare.id ? "" : fare.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${specialFare === fare.id
                      ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-100"
                      : "border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200"
                      }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full border-2 flex items-center justify-center ${specialFare === fare.id ? "border-white" : "border-gray-300"
                      }`}>
                      {specialFare === fare.id && <span className="w-1 h-1 rounded-full bg-white" />}
                    </span>
                    {fare.label}
                  </button>
                ))}
              </div>

              {recentSearches.length > 0 && (
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recently Searched:</span>
                  <div className="flex gap-4">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setFrom(s.from);
                          setFromCode(s.fromCode);
                          setTo(s.to);
                          setToCode(s.toCode);
                          setDepartureDate(s.date);
                        }}
                        className="text-[10px] font-black text-blue-600 hover:text-red-500 flex items-center gap-1 transition-colors uppercase tracking-widest"
                      >
                        <span className="flex items-center gap-1">
                          {s.fromCode}<FaExchangeAlt className="w-2 h-2" />{s.toCode}
                        </span>
                        <span className="text-slate-400 font-bold">| {s.date.split('-').reverse().slice(0, 2).join(' ')}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
