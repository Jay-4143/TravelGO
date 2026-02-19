import { useState, useRef } from "react";
import { HiSearch } from "react-icons/hi";
import { FaExchangeAlt, FaCalendarAlt, FaUser, FaChevronDown } from "react-icons/fa";
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

const Hero = ({ onSearch }) => {
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("Mumbai");
  const [fromAirport, setFromAirport] = useState("BOM, Chhatrapati Shivaji Inter...");
  const [to, setTo] = useState("New Delhi");
  const [toAirport, setToAirport] = useState("DEL, Indira Gandhi Internatio...");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [travelClass, setTravelClass] = useState("Economy");
  const [directOnly, setDirectOnly] = useState(false);
  const [defenceFare, setDefenceFare] = useState(false);
  const [studentFare, setStudentFare] = useState(false);
  const [seniorFare, setSeniorFare] = useState(false);
  const [fromDropdownOpen, setFromDropdownOpen] = useState(false);
  const [toDropdownOpen, setToDropdownOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [activeField, setActiveField] = useState("departure");
  const [travellerDropdownOpen, setTravellerDropdownOpen] = useState(false);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const searchCardRef = useRef(null);

  const totalTravellers = adults + children + infants;
  const travellerSummary =
    totalTravellers === 1 ? "1 Traveller" : `${totalTravellers} Travellers`;

  const handleSwap = () => {
    const tempCity = from;
    const tempAirport = fromAirport;
    setFrom(to);
    setFromAirport(toAirport);
    setTo(tempCity);
    setToAirport(tempAirport);
  };

  const handleFromSelect = (value) => {
    const match = value.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
    if (match) {
      setFrom(match[1].trim());
      setFromAirport(`${match[2]}, ...`);
    } else {
      setFrom(value);
    }
    setFromDropdownOpen(false);
  };

  const handleToSelect = (value) => {
    const match = value.match(/^(.+?)\s*\(([A-Z]{3})\)$/);
    if (match) {
      setTo(match[1].trim());
      setToAirport(`${match[2]}, ...`);
    } else {
      setTo(value);
    }
    setToDropdownOpen(false);
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

  const formatHeaderDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section
      className="relative min-h-[600px] flex items-start justify-center pt-8 pb-16 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(37, 99, 235, 0.3) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 100%), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920')`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-end mb-6">
          <div className="inline-flex items-center gap-2 text-white text-xl font-bold drop-shadow-lg">
            <span className="text-2xl">✈</span>
            Book Flight Tickets
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {TRIP_TYPES.map(({ id, label }) => (
            <label
              key={id}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all cursor-pointer ${
                tripType === id
                  ? "bg-white text-red-500 shadow-lg"
                  : "bg-white/90 text-gray-600 hover:bg-white hover:shadow-md"
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
                className={`w-3 h-3 rounded-full border-2 ${
                  tripType === id ? "border-red-500 bg-red-500" : "border-gray-400"
                }`}
              />
              {label}
            </label>
          ))}
        </div>

        <div ref={searchCardRef} className="relative bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex items-end gap-0">
            {/* From */}
            <div className="flex-1 relative border-r border-gray-200 pr-4" ref={fromRef}>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
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
                <div className="text-lg font-bold text-gray-900 mb-0.5">{from}</div>
                <div className="text-xs text-gray-500 flex items-center justify-between">
                  <span className="truncate">{fromAirport}</span>
                  <FaChevronDown className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
                </div>
              </button>
              <CityDropdown
                isOpen={fromDropdownOpen}
                onClose={() => setFromDropdownOpen(false)}
                onSelect={handleFromSelect}
                position={getDropdownPosition(fromRef)}
              />
            </div>

            <div className="flex items-center px-2 pb-2">
              <button
                type="button"
                onClick={handleSwap}
                className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors"
                aria-label="Swap"
              >
                <FaExchangeAlt className="w-4 h-4" />
              </button>
            </div>

            {/* To */}
            <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4" ref={toRef}>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
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
                <div className="text-lg font-bold text-gray-900 mb-0.5">{to}</div>
                <div className="text-xs text-gray-500 flex items-center justify-between">
                  <span className="truncate">{toAirport}</span>
                  <FaChevronDown className="w-3 h-3 text-gray-400 ml-2 flex-shrink-0" />
                </div>
              </button>
              <CityDropdown
                isOpen={toDropdownOpen}
                onClose={() => setToDropdownOpen(false)}
                onSelect={handleToSelect}
                position={getDropdownPosition(toRef)}
              />
            </div>

            {/* Departure */}
            <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4">
              <button
                type="button"
                onClick={openDepartureCalendar}
                className="w-full text-left focus:outline-none"
              >
                <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "departure" ? "text-blue-600" : "text-gray-500"}`}>
                  Departure
                </label>
                <div className="flex items-center justify-between">
                  {departureDate ? (
                    <>
                      <div>
                        <div className="text-base font-bold text-gray-900">{formatDate(departureDate)}</div>
                        <div className="text-xs text-gray-500">{getDayName(departureDate)}</div>
                      </div>
                      <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    </>
                  ) : (
                    <>
                      <div className="text-xs text-gray-400">Select date</div>
                      <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Return */}
            <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4">
              <button
                type="button"
                onClick={tripType === "oneway" ? undefined : openReturnCalendar}
                disabled={tripType === "oneway"}
                className={`w-full text-left focus:outline-none ${tripType === "oneway" ? "cursor-default" : ""}`}
              >
                <label className={`block text-xs font-medium mb-1 ${calendarOpen && activeField === "return" ? "text-red-600" : "text-gray-500"}`}>
                  Return
                </label>
                {tripType === "oneway" ? (
                  <div className="text-xs text-gray-400 leading-tight">
                    Book a round trip
                    <br />
                    to save more
                  </div>
                ) : returnDate ? (
                  <div className="flex items-center justify-between gap-1">
                    <div>
                      <div className="text-base font-bold text-gray-900">{formatDate(returnDate)}</div>
                      <div className="text-xs text-gray-500">{getDayName(returnDate)}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReturnDate("");
                        }}
                        className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        aria-label="Clear return date"
                      >
                        ×
                      </button>
                      <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">Select date</div>
                    <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  </div>
                )}
              </button>
            </div>

            {/* Travellers & Class */}
            <div className="flex-1 relative border-r border-gray-200 pl-4 pr-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Travellers & Class</label>
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
                  <FaUser className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-base font-bold text-gray-900">{travellerSummary}</div>
                    <div className="text-xs text-gray-500">{travelClass}</div>
                  </div>
                  <FaChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                </div>
              </button>
            </div>

            <div className="flex-shrink-0 pl-4">
              <button
                type="button"
                onClick={() => {
                  if (!from || !to || !departureDate) {
                    alert("Please select From, To, and Departure date.");
                    return;
                  }
                  if (tripType === "round" && !returnDate) {
                    alert("Please select Return date for round trip.");
                    return;
                  }
                  onSearch?.({
                    from,
                    to,
                    departureDate,
                    returnDate: tripType === "round" ? returnDate : undefined,
                    tripType: tripType === "round" ? "round-trip" : "one-way",
                    adults,
                    children,
                    infants,
                    travelClass: travelClassToApi(travelClass),
                    directOnly,
                  });
                }}
                className="inline-flex items-center gap-2 px-10 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl text-base uppercase tracking-wide"
              >
                <HiSearch className="w-5 h-5" />
                Search
          </button>
            </div>
          </div>

          {/* Checkbox row */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={directOnly}
                onChange={(e) => setDirectOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Direct Flights</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
                type="checkbox"
                checked={defenceFare}
                onChange={(e) => setDefenceFare(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Defence Fare</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
                type="checkbox"
                checked={studentFare}
                onChange={(e) => setStudentFare(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Student Fare</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
                type="checkbox"
                checked={seniorFare}
                onChange={(e) => setSeniorFare(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 font-medium">Senior Citizen Fare</span>
            </label>
          </div>

          {/* Calendar panel - positioned relative to card */}
          <div className="absolute left-0 right-0 top-full pt-2">
            <CalendarComponent
              isOpen={calendarOpen}
              onClose={() => setCalendarOpen(false)}
              departureDate={departureDate}
              returnDate={returnDate}
              activeField={activeField}
              onSelectDeparture={setDepartureDate}
              onSelectReturn={setReturnDate}
              isRoundTrip={tripType === "round"}
            />
          </div>

          {/* Traveller dropdown - positioned relative to card */}
          <div className="absolute left-0 right-0 top-full pt-2">
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
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
