import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import FlightResults from "../components/FlightResults";
import ServicesStrip from "../components/ServicesStrip";
import ExclusiveDeals from "../components/ExclusiveDeals";
import DestinationCard from "../components/DestinationCard";
import OfferCard from "../components/OfferCard";
import WhyChooseUs from "../components/WhyChooseUs";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import { searchFlights } from "../api/flights";

const destinations = [
  { title: "Dubai", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800", startingPrice: 24999 },
  { title: "Maldives", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800", startingPrice: 45999 },
  { title: "Singapore", image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800", startingPrice: 18999 },
  { title: "London", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800", startingPrice: 52999 },
  { title: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800", startingPrice: 22999 },
  { title: "Thailand", image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800", startingPrice: 16999 },
];

const offers = [
  { title: "Summer Sale", subtitle: "Up to 30% off on international flights", discount: "30% OFF", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800", ctaText: "Explore Deals" },
  { title: "Weekend Getaways", subtitle: "Hotels starting at ₹1,999 per night", discount: "FLAT 20%", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", ctaText: "Book Now" },
  { title: "Holiday Packages", subtitle: "All-inclusive packages to top destinations", discount: "BEST PRICE", image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800", ctaText: "View Packages" },
];

const Flights = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState(null);
  const [filterParams, setFilterParams] = useState({});
  const [sort, setSort] = useState("price");
  const [order, setOrder] = useState("asc");
  const [flights, setFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runSearch = useCallback(
    (params, filters = filterParams, sortVal = sort, orderVal = order) => {
      if (!params?.from || !params?.to || !params?.departureDate) return;
      setLoading(true);
      setError(null);
      const passengers = (params.adults || 0) + (params.children || 0) + (params.infants || 0);
      const req = {
        from: params.from,
        to: params.to,
        departureDate: params.departureDate,
        returnDate: params.returnDate,
        passengers: passengers < 1 ? 1 : passengers,
        class: params.travelClass || "economy",
        sort: sortVal,
        order: orderVal,
        page: 1,
        limit: 50,
        ...filters,
      };
      searchFlights(req)
        .then((res) => {
          setFlights(res.data.flights || []);
          setReturnFlights(res.data.returnFlights || []);
          setSearchParams(params);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Search failed.");
          setFlights([]);
          setReturnFlights([]);
        })
        .finally(() => setLoading(false));
    },
    [filterParams, sort, order]
  );

  const handleSearch = useCallback(
    (params) => {
      setSearchParams(params);
      runSearch(params, filterParams, sort, order);
    },
    [runSearch, filterParams, sort, order]
  );

  const handleFilterChange = useCallback(
    (next) => {
      const newFilters = { ...filterParams, ...next };
      setFilterParams(newFilters);
      if (searchParams) runSearch(searchParams, newFilters, sort, order);
    },
    [searchParams, filterParams, runSearch, sort, order]
  );

  const handleSortChange = useCallback(
    (newSort, newOrder) => {
      setSort(newSort);
      setOrder(newOrder);
      if (searchParams) runSearch(searchParams, filterParams, newSort, newOrder);
    },
    [searchParams, filterParams, runSearch]
  );

  const handleBook = useCallback(
    (flight, returnFlight) => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { state: { from: "flight-booking" } });
        return;
      }
      navigate("/flights/booking", {
        state: {
          flight,
          returnFlight,
          searchParams,
          tripType: searchParams?.tripType || "one-way",
        },
      });
    },
    [navigate, searchParams]
  );

  return (
    <>
      <Hero onSearch={handleSearch} />
      {searchParams && (
        <>
          {error && (
            <div className="max-w-7xl mx-auto px-4 py-2">
              <p className="text-red-600 bg-red-50 rounded-lg p-3 text-sm">{error}</p>
            </div>
          )}
          <FlightResults
            flights={flights}
            returnFlights={returnFlights}
            searchParams={searchParams}
            filterParams={filterParams}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            sort={sort}
            order={order}
            loading={loading}
            onBook={handleBook}
          />
        </>
      )}
      <ServicesStrip />
      <ExclusiveDeals />
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Popular Destinations</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Discover trending places and book your next trip at the best prices.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <DestinationCard key={dest.title} title={dest.title} image={dest.image} startingPrice={dest.startingPrice} />
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Special Offers</h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Limited-time deals on flights, hotels, and holiday packages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <OfferCard key={offer.title} title={offer.title} subtitle={offer.subtitle} discount={offer.discount} image={offer.image} ctaText={offer.ctaText} />
            ))}
          </div>
        </div>
      </section>
      <WhyChooseUs />
      <Reviews />
      <Footer />
    </>
  );
};

export default Flights;
