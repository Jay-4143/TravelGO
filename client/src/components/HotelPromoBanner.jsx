import { useNavigate } from "react-router-dom";

const HotelPromoBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-2xl overflow-hidden h-48 md:h-56"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 60%), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Up to 30% OFF on Hotels
            </h2>
            <p className="text-white/90 text-lg mb-4 max-w-md">
              Book your stay now and save big. Limited time offer on select hotels across India.
            </p>
            <button
              type="button"
              onClick={() => navigate("/hotels")}
              className="inline-flex px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors w-fit"
            >
              Explore Deals
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotelPromoBanner;
