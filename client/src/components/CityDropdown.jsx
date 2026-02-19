import { useState, useRef, useEffect } from "react";
import { HiSearch } from "react-icons/hi";

const AIRPORTS = [
  { city: "New Delhi", code: "DEL", name: "Indira Gandhi International", country: "India", flag: "🇮🇳" },
  { city: "Mumbai", code: "BOM", name: "Chhatrapati Shivaji International", country: "India", flag: "🇮🇳" },
  { city: "Bangalore", code: "BLR", name: "Bengaluru International Airport", country: "India", flag: "🇮🇳" },
  { city: "Chennai", code: "MAA", name: "Chennai International Airport", country: "India", flag: "🇮🇳" },
  { city: "Kolkata", code: "CCU", name: "Netaji Subhash Chandra Bose International", country: "India", flag: "🇮🇳" },
  { city: "Hyderabad", code: "HYD", name: "Rajiv Gandhi International Airport", country: "India", flag: "🇮🇳" },
  { city: "Pune", code: "PNQ", name: "Pune Airport", country: "India", flag: "🇮🇳" },
  { city: "Ahmedabad", code: "AMD", name: "Sardar Vallabhbhai Patel International", country: "India", flag: "🇮🇳" },
  { city: "Goa", code: "GOI", name: "Goa International Airport", country: "India", flag: "🇮🇳" },
  { city: "Jaipur", code: "JAI", name: "Jaipur International Airport", country: "India", flag: "🇮🇳" },
  { city: "Kochi", code: "COK", name: "Cochin International Airport", country: "India", flag: "🇮🇳" },
  { city: "Lucknow", code: "LKO", name: "Chaudhary Charan Singh International", country: "India", flag: "🇮🇳" },
];

const CityDropdown = ({ isOpen, onClose, onSelect, position }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const filteredAirports = AIRPORTS.filter(
    (airport) =>
      airport.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      airport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (airport) => {
    onSelect(`${airport.city} (${airport.code})`);
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute z-50 bg-white rounded-lg shadow-2xl border border-gray-200 mt-2 min-w-[400px] max-w-[500px] overflow-hidden"
      style={{ top: position?.top || "100%", left: position?.left || 0 }}
    >
      {/* Search Input */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search airport or city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Important Airports</h3>
      </div>

      {/* Scrollable List */}
      <div className="max-h-[400px] overflow-y-auto">
        {filteredAirports.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500 text-sm">No airports found</div>
        ) : (
          filteredAirports.map((airport) => (
            <button
              key={airport.code}
              type="button"
              onClick={() => handleSelect(airport)}
              className="w-full px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-gray-100 last:border-b-0 group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-bold text-gray-900">{airport.city}</span>
                    <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                      {airport.code}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{airport.name}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-lg">{airport.flag}</span>
                  <span className="text-xs text-gray-500">{airport.country}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default CityDropdown;
