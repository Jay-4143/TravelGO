import { FaTag, FaHeadset, FaLock, FaBed } from "react-icons/fa";

const features = [
  {
    icon: FaTag,
    title: "Best Price Guarantee",
    desc: "We match or beat any competitor's hotel price. Find a lower rate and we'll refund the difference.",
  },
  {
    icon: FaHeadset,
    title: "24/7 Customer Support",
    desc: "Our support team is available round the clock to help with bookings, changes, and queries.",
  },
  {
    icon: FaLock,
    title: "Secure Booking",
    desc: "Your personal and payment information is protected with industry-standard security.",
  },
  {
    icon: FaBed,
    title: "Verified Stays",
    desc: "All hotels are verified. Real reviews and photos from genuine guests help you choose wisely.",
  },
];

const WhyBookHotels = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Why Book Hotels With Us?
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          We make hotel booking simple, affordable, and secure for every traveller.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-blue-100 hover:bg-white transition-all duration-300 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-red-500 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBookHotels;
