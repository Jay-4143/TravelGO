import { useState } from "react";
import { HiFilter } from "react-icons/hi";
import { FaList, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import HotelMapView from "./HotelMapView";

const AMENITIES_OPTIONS = [
  "WiFi", "Swimming Pool", "Gym", "Spa", "Restaurant", "Bar", "Parking", "Airport Shuttle",
  "Room Service", "Laundry", "Business Center", "Pet Friendly", "Beach Access", "Mountain View"
];

const PROPERTY_TYPES = ["Hotel", "Resort", "Apartment", "Villa", "Hostel", "Guesthouse"];

const HotelCard = ({ hotel, searchParams, onViewDetails, isSelected, onSelectToggle, onHover, isCompact }) => {
  const { formatPrice } = useGlobal();
  const imageUrl = hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800";
  const amenitiesPreview = hotel.amenities?.slice(0, 4) || [];
  const pricePerNight = hotel.pricePerNight || 0;

  const calculateTotalPrice = () => {
    if (!searchParams || !searchParams.checkIn || !searchParams.checkOut) return null;
    const { checkIn, checkOut, roomsData } = searchParams;
    const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));
    const totalRooms = roomsData?.length || searchParams.rooms || 1;
    return pricePerNight * nights * totalRooms;
  };

  const totalPrice = calculateTotalPrice();
  const basePrice = (totalPrice || pricePerNight);
  const taxPrice = basePrice * 0.18;
  const oldPrice = basePrice * 1.25;
  const savedPrice = oldPrice - basePrice;

  return (
    <div
      className={`flex ${isCompact ? 'gap-2 mb-3' : 'gap-3 mb-4'} items-stretch group/card relative`}
      onMouseEnter={() => onHover && onHover(hotel._id)}
      onMouseLeave={() => onHover && onHover(null)}
    >
      {!isCompact && (
        <div className="flex flex-col pt-4">
          <label className="relative flex cursor-pointer items-center rounded-full p-2 border-transparent" htmlFor={`checkbox-${hotel._id}`}>
            <input
              type="checkbox"
              className="peer relative h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-[#D90429] checked:bg-[#D90429]"
              id={`checkbox-${hotel._id}`}
              checked={isSelected}
              onChange={() => onSelectToggle(hotel)}
            />
            <span className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
              </svg>
            </span>
          </label>
        </div>
      )}

      {isCompact ? (
        /* --- HIGH DENSITY GRID STYLING FOR MAP SPLIT VIEW --- */
        <div className={`flex-1 flex flex-col bg-white border rounded border-gray-200 overflow-hidden cursor-pointer shadow-sm hover:shadow`} onClick={() => onViewDetails(hotel)}>
          <div className="flex h-[120px]">
            <div className="w-[110px] h-[120px] shrink-0 relative">
              <img src={imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-2 flex flex-col justify-between flex-1 min-w-0">
              <div className="flex justify-between items-start gap-1">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-bold text-gray-900 leading-tight truncate mb-0.5" title={hotel.name}>{hotel.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: hotel.starCategory || 3 }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-[10px]">★</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-500 truncate flex items-center gap-1" title={hotel.address || hotel.city}>
                    <FaMapMarkerAlt className="text-blue-500 shrink-0" size={9} /> <span className="truncate">{hotel.address || hotel.city}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <div className="bg-green-700 text-white text-[12px] font-bold px-1.5 py-0.5 rounded leading-none mb-1">
                    {hotel.rating?.toFixed(1) || "4.2"}
                  </div>
                  <span className="text-[9px] text-gray-500 leading-none">{hotel.reviews || 12} reviews</span>
                </div>
              </div>

              <div className="flex justify-end items-end">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 line-through leading-none mb-0.5">
                    {formatPrice(oldPrice)}
                  </span>
                  <p className="text-[17px] font-black text-gray-900 leading-none mb-0.5">
                    {formatPrice(basePrice)}
                  </p>
                  <p className="text-[9px] text-gray-500 font-medium whitespace-nowrap mb-0.5 leading-none">
                    + {formatPrice(taxPrice)} Tax
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#E5F1FB] px-2 py-1.5 border-t border-[#BDE0FE]">
            <span className="text-[10px] text-[#006CE4] font-medium leading-none block line-clamp-1">SBI Card Offer: Save INR 7k</span>
          </div>
        </div>
      ) : (
        /* --- STANDARD EXPANDED LIST STYLING --- */
        <div className={`flex-1 bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row ${isSelected ? 'border-[#D90429] bg-red-50/10' : 'border-gray-200'}`}>
          <div className="w-full md:w-64 h-48 md:h-auto flex-shrink-0 cursor-pointer" onClick={() => onViewDetails(hotel)}>
            <img src={imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{hotel.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{hotel.address || hotel.city}</p>
                <div className="flex items-center gap-2 mb-2">
                  {Array.from({ length: hotel.starCategory || 3 }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({hotel.rating?.toFixed(1) || "0.0"})</span>
                </div>
                {amenitiesPreview.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {amenitiesPreview.map((a, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {a === "Free WiFi" ? "WiFi" : a}
                      </span>
                    ))}
                    {hotel.amenities?.length > 4 && (
                      <span className="text-xs px-2 py-1 text-gray-500">+{hotel.amenities.length - 4} more</span>
                    )}
                  </div>
                )}
                {hotel.freeCancellation && (
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                    Free Cancellation
                  </span>
                )}
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-2xl font-bold text-gray-900">{formatPrice(basePrice)}</p>
                {totalPrice ? (
                  <p className="text-xs text-gray-500 font-medium">for {Math.max(1, Math.ceil((new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24)))} night{Math.max(1, Math.ceil((new Date(searchParams.checkOut) - new Date(searchParams.checkIn)) / (1000 * 60 * 60 * 24))) > 1 ? 's' : ''}</p>
                ) : (
                  <p className="text-xs text-gray-500">per night</p>
                )}
                {totalPrice && (
                  <p className="text-[10px] text-gray-400 mt-1">{formatPrice(pricePerNight)} / night</p>
                )}
                <button
                  type="button"
                  onClick={() => onViewDetails(hotel)}
                  className="mt-4 px-6 py-2 bg-[#D90429] hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HotelResults = ({
  hotels = [],
  searchParams,
  filterParams,
  pagination,
  onFilterChange,
  onSortChange,
  onPageChange,
  sort,
  order,
  loading,
  selectedHotels = [],
  setSelectedHotels,
  viewMode,
  setViewMode,
}) => {
  const navigate = useNavigate();
  const [hoveredHotelId, setHoveredHotelId] = useState(null);

  const handleViewDetails = (hotel) => {
    const url = `/hotels/${hotel._id}?searchParams=${encodeURIComponent(JSON.stringify(searchParams))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSelectToggle = (hotel) => {
    if (!setSelectedHotels) return;
    setSelectedHotels((prev) => {
      const isSelected = prev.find((h) => h._id === hotel._id);
      if (isSelected) {
        return prev.filter((h) => h._id !== hotel._id);
      } else {
        return [...prev, hotel];
      }
    });
  };

  return (
    <div className="flex-1 min-w-0">
      {viewMode !== "map" && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <p className="text-gray-900 text-[13px] font-medium">
            {loading ? "Searching..." : (
              <>
                Showing {hotels.length} of {pagination?.total ?? hotels.length} hotels found <span className="text-[#D90429] cursor-pointer font-medium hover:underline">(show all)</span>
              </>
            )}
          </p>
        </div>
      )}

      {viewMode !== "map" && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
          <div className="flex items-center gap-1 md:gap-4 flex-wrap w-full md:w-auto overflow-x-auto custom-scrollbar">
            <span className="text-xs font-black text-gray-800 uppercase tracking-widest px-2 min-w-max">
              Sort By
            </span>
            <div className="w-px h-6 bg-gray-200 hidden md:block" />

            <button
              onClick={() => onSortChange("rating", "desc")}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors whitespace-nowrap ${sort === "rating" && order === "desc" ? "text-red-500 bg-red-50 border-b-2 border-red-500" : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              Featured ↓
            </button>

            <button
              onClick={() => {
                const newOrder = sort === "starCategory" && order === "desc" ? "asc" : "desc";
                onSortChange("starCategory", newOrder);
              }}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors whitespace-nowrap ${sort === "starCategory" ? "text-red-500 bg-red-50 border-b-2 border-red-500" : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              Rating {sort === "starCategory" ? (order === "desc" ? "↓" : "↑") : ""}
            </button>

            <button
              onClick={() => {
                const newOrder = sort === "price" && order === "asc" ? "desc" : "asc";
                onSortChange("price", newOrder);
              }}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded transition-colors whitespace-nowrap ${sort === "price" ? "text-red-500 bg-red-50 border-b-2 border-red-500" : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              Price {sort === "price" ? (order === "asc" ? "↑" : "↓") : ""}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 md:mt-0 ml-auto md:ml-0">
            {/* List / Map toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "list"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <FaList size={12} /> List
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${viewMode === "map"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                <FaMapMarkerAlt size={12} /> Map
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : hotels.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          No hotels found. Try different dates or filters.
        </div>
      ) : viewMode === "map" ? (
        /* ── Map Split View ── */
        <div className="flex flex-col xl:flex-row gap-4 h-[calc(100vh-160px)]">
          {/* Scrollable List */}
          <div className="w-full xl:w-[480px] shrink-0 flex flex-col overflow-y-auto custom-scrollbar pr-2 pb-4 h-full">
            <div className="mb-4">
              <button
                onClick={() => setViewMode("list")}
                className="text-[#006CE4] font-bold text-[13px] hover:underline mb-1 w-full text-left"
              >
                Back to List view
              </button>
              <div className="flex items-center justify-between gap-4 mt-1">
                <p className="text-gray-900 text-[13px] font-medium truncate">
                  {loading ? "Searching..." : `Showing ${hotels.length} of ${pagination?.total ?? hotels.length} hotels found`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const newOrder = sort === "rating" && order === "desc" ? "asc" : "desc";
                    onSortChange("rating", newOrder);
                  }}
                  className="text-[#D90429] text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  FEATURED {sort === "rating" && order === "asc" ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {hotels && hotels.filter(h => h && h._id).map((hotel) => (
                <HotelCard
                  key={hotel._id}
                  hotel={hotel}
                  searchParams={searchParams}
                  onViewDetails={handleViewDetails}
                  isSelected={selectedHotels.some(sh => sh._id === hotel._id)}
                  onSelectToggle={handleSelectToggle}
                  onHover={setHoveredHotelId}
                  isCompact={true}
                />
              ))}
            </div>
            {pagination && pagination.pages > 1 && onPageChange && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  type="button"
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sticky Map */}
          <div className="hidden xl:block flex-1 rounded-xl overflow-hidden shadow-sm sticky top-0 h-[calc(100vh-160px)] relative group">
            <button
              onClick={() => setViewMode("list")}
              className="absolute top-4 right-4 z-[2000] bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-md transition-all opacity-0 group-hover:opacity-100"
              title="Close Map View"
            >
              <FaTimes size={14} />
            </button>
            <HotelMapView
              hotels={hotels}
              hoveredHotelId={hoveredHotelId}
              onViewDetails={handleViewDetails}
              className="w-full h-full"
            />
          </div>
        </div>
      ) : (
        /* ── List View ── */
        <>
          <div className="space-y-4">
            {hotels && hotels.filter(h => h && h._id).map((hotel) => (
              <HotelCard
                key={hotel._id}
                hotel={hotel}
                searchParams={searchParams}
                onViewDetails={handleViewDetails}
                isSelected={selectedHotels.some(sh => sh._id === hotel._id)}
                onSelectToggle={handleSelectToggle}
                onHover={setHoveredHotelId}
              />
            ))}
          </div>
          {pagination && pagination.pages > 1 && onPageChange && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                type="button"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelResults;
