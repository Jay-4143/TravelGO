import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPopularDestinations } from "../api/hotels";

const DEST_IMAGES = {
  Mumbai: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600",
  "New Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
  Bangalore: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600",
  Chennai: "https://images.unsplash.com/photo-1596178060812-6b8c19e28a56?w=600",
  Goa: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=600",
  Jaipur: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600",
  Udaipur: "https://images.unsplash.com/photo-1585829364621-fae6c9ac84cc?w=600",
  Shimla: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600",
  Manali: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600",
  Ooty: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
  Agra: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
  Kochi: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600",
  "Port Blair": "https://images.unsplash.com/photo-1559827260-dc66d43bef33?w=600",
  Dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
  Bangkok: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600",
  Singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600",
};

const getImage = (city) => DEST_IMAGES[city] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600";

const HotelPopularDestinations = ({ onCityClick }) => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularDestinations()
      .then((res) => {
        if (res.data?.destinations?.length > 0) {
          setDestinations(res.data.destinations);
        } else {
          setDestinations([
            { city: "Mumbai", count: 12, minPrice: 1999 },
            { city: "Goa", count: 8, minPrice: 2499 },
            { city: "Jaipur", count: 6, minPrice: 1899 },
            { city: "Shimla", count: 5, minPrice: 2999 },
            { city: "Ooty", count: 4, minPrice: 1599 },
            { city: "New Delhi", count: 10, minPrice: 2299 },
          ]);
        }
      })
      .catch(() => {
        setDestinations([
          { city: "Mumbai", count: 12, minPrice: 1999 },
          { city: "Goa", count: 8, minPrice: 2499 },
          { city: "Jaipur", count: 6, minPrice: 1899 },
          { city: "Shimla", count: 5, minPrice: 2999 },
          { city: "Ooty", count: 4, minPrice: 1599 },
          { city: "New Delhi", count: 10, minPrice: 2299 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleClick = (dest) => {
    if (onCityClick) onCityClick(dest.city);
    else navigate("/hotels", { state: { presetCity: dest.city } });
  };

  if (loading && destinations.length === 0) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Popular Hotel Destinations</h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Find the best hotels at unbeatable prices across top destinations.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {(destinations.length ? destinations : []).slice(0, 12).map((dest) => (
            <button
              key={dest.city}
              type="button"
              onClick={() => handleClick(dest)}
              className="group block relative rounded-2xl overflow-hidden aspect-[4/5] min-h-[180px] text-left"
            >
              <img
                src={getImage(dest.city)}
                alt={dest.city}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                <h3 className="text-lg font-bold">{dest.city}</h3>
                <p className="text-sm text-white/90">
                  From ₹{dest.minPrice?.toLocaleString() || "1,999"}{" "}
                  <span className="text-white/70 text-xs">/ night</span>
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelPopularDestinations;
