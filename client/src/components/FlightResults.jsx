import { useState, useMemo } from "react";
import { HiFilter, HiOutlineRefresh } from "react-icons/hi";

const TIME_OPTIONS = [
  { label: "Before 6 AM", from: "00:00", to: "05:59" },
  { label: "6 AM - 12 PM", from: "06:00", to: "11:59" },
  { label: "12 PM - 6 PM", from: "12:00", to: "17:59" },
  { label: "After 6 PM", from: "18:00", to: "23:59" },
];

const formatTime = (date) => {
  if (!date) return "--";
  const d = new Date(date);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
};

const FlightCard = ({ flight, tripType, returnFlight, searchParams, onBook }) => {
  const baggage = flight.baggage
    ? `${flight.baggage.cabin || "7 kg"} cabin, ${flight.baggage.checkIn || "15 kg"} check-in`
    : "7 kg cabin, 15 kg check-in";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-bold text-blue-600">
            {flight.airline?.charAt(0) || "F"}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{flight.airline}</p>
            <p className="text-sm text-gray-500">{flight.flightNumber || ""}</p>
          </div>
          <div className="flex items-center gap-6 text-center">
            <div>
              <p className="text-lg font-bold text-gray-900">{formatTime(flight.departureTime)}</p>
              <p className="text-xs text-gray-500">{flight.from}</p>
            </div>
            <div className="text-gray-400 text-sm">
              {flight.duration || "—"} {flight.stops !== undefined && flight.stops > 0 && `• ${flight.stops} stop(s)`}
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{formatTime(flight.arrivalTime)}</p>
              <p className="text-xs text-gray-500">{flight.to}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <p>{baggage}</p>
            {flight.refundable && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Refundable</span>
            )}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₹{flight.price?.toLocaleString()}</p>
            <p className="text-xs text-gray-500">per person</p>
            <button
              type="button"
              onClick={() => onBook(flight, tripType === "round-trip" ? returnFlight : null)}
              className="mt-2 w-full px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Book
            </button>
          </div>
        </div>
      </div>
      {tripType === "round-trip" && returnFlight && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
          <span className="text-sm text-gray-500">Return:</span>
          <span className="font-medium">{returnFlight.airline}</span>
          <span className="text-sm text-gray-600">
            {formatTime(returnFlight.departureTime)} → {formatTime(returnFlight.arrivalTime)} ({returnFlight.duration})
          </span>
        </div>
      )}
    </div>
  );
};

const FlightResults = ({
  flights = [],
  returnFlights = [],
  searchParams,
  filterParams,
  onFilterChange,
  onSortChange,
  sort,
  order,
  loading,
  onBook,
}) => {
  const [showFilters, setShowFilters] = useState(true);

  const airlines = useMemo(() => {
    const set = new Set(flights.map((f) => f.airline).filter(Boolean));
    return Array.from(set).sort();
  }, [flights]);

  const tripType = searchParams?.tripType || "one-way";

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside
          className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <HiFilter className="w-5 h-5" /> Filters
              </h3>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                {showFilters ? "Hide" : "Show"}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price range (₹)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filterParams.minPrice ?? ""}
                    onChange={(e) => onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filterParams.maxPrice ?? ""}
                    onChange={(e) => onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Airlines</label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {airlines.map((air) => (
                    <label key={air} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterParams.airline === air}
                        onChange={(e) => onFilterChange({ airline: e.target.checked ? air : undefined })}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700">{air}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stops</label>
                <select
                  value={filterParams.maxStops ?? ""}
                  onChange={(e) => onFilterChange({ maxStops: e.target.value === "" ? undefined : Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Any</option>
                  <option value="0">Non-stop</option>
                  <option value="1">1 stop</option>
                  <option value="2">2+ stops</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure time</label>
                <select
                  value={filterParams.departureTimeFrom ?? ""}
                  onChange={(e) => {
                    const opt = TIME_OPTIONS.find((o) => o.from === e.target.value);
                    onFilterChange({
                      departureTimeFrom: opt?.from,
                      departureTimeTo: opt?.to,
                    });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Any</option>
                  {TIME_OPTIONS.map((o) => (
                    <option key={o.from} value={o.from}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterParams.refundable === true}
                  onChange={(e) => onFilterChange({ refundable: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm text-gray-700">Refundable only</span>
              </label>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <p className="text-gray-600">
              {loading ? "Searching..." : `${flights.length} flight(s) found`}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <select
                value={`${sort}-${order}`}
                onChange={(e) => {
                  const [s, o] = e.target.value.split("-");
                  onSortChange(s, o);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration-asc">Duration</option>
                <option value="departure-asc">Departure: Early first</option>
                <option value="departure-desc">Departure: Late first</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <HiOutlineRefresh className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
          ) : flights.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
              No flights found. Try different dates or filters.
            </div>
          ) : (
            <div className="space-y-4">
              {tripType === "round-trip" && returnFlights?.length > 0
                ? flights.map((f, i) => (
                    <FlightCard
                      key={f._id + (returnFlights[i]?._id || i)}
                      flight={f}
                      returnFlight={returnFlights[i]}
                      tripType={tripType}
                      searchParams={searchParams}
                      onBook={onBook}
                    />
                  ))
                : flights.map((flight) => (
                    <FlightCard
                      key={flight._id}
                      flight={flight}
                      tripType={tripType}
                      searchParams={searchParams}
                      onBook={onBook}
                    />
                  ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlightResults;
