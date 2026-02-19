import { useNavigate } from "react-router-dom";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useState } from "react";

const hotelOffers = [
  { title: "Weekend Stay", discount: "25% OFF", code: "WEEKEND25", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", cta: "Book Now" },
  { title: "Long Stay Deal", discount: "20% OFF (5+ nights)", code: "LONGSTAY", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600", cta: "Book Now" },
  { title: "Budget Stays", discount: "From ₹999/night", code: "BUDGET", image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600", cta: "Book Now" },
  { title: "Luxury Escapes", discount: "15% OFF", code: "LUXURY15", image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600", cta: "Book Now" },
];

const HotelOffers = () => {
  const navigate = useNavigate();
  const [scrollPos, setScrollPos] = useState(0);

  const scroll = (dir) => {
    const container = document.getElementById("hotel-offers-slider");
    if (!container) return;
    const step = 320;
    const newPos = dir === "left" ? Math.max(0, scrollPos - step) : scrollPos + step;
    container.scrollTo({ left: newPos, behavior: "smooth" });
    setScrollPos(newPos);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Hotel Offers & Deals</h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <div
            id="hotel-offers-slider"
            className="flex gap-4 overflow-x-auto scroll-smooth py-2"
            onScroll={(e) => setScrollPos(e.target.scrollLeft)}
          >
            {hotelOffers.map((card) => (
              <div
                key={card.title}
                className="flex-shrink-0 w-[280px] sm:w-[300px] rounded-xl overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={card.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-sm font-medium">{card.title}</p>
                    <p className="text-lg font-bold text-red-400 mt-0.5">{card.discount}</p>
                    <div className="mt-2 inline-block px-2 py-1 bg-white/20 rounded text-xs font-medium">
                      Use Code: {card.code}
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <button
                    type="button"
                    onClick={() => navigate("/hotels")}
                    className="w-full py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {card.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-red-500 text-white shadow-md flex items-center justify-center hover:bg-red-600"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HotelOffers;
