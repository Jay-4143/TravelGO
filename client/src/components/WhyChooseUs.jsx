import { FaTag, FaHeadset, FaLock, FaUsers } from "react-icons/fa";

const features = [
  {
    icon: FaTag,
    title: "Best Price Guarantee",
    desc: "We match or beat any competitor's price. Find a lower price and we'll refund the difference.",
  },
  {
    icon: FaHeadset,
    title: "24/7 Support",
    desc: "Our travel experts are available round the clock to help you plan and manage your trips.",
  },
  {
    icon: FaLock,
    title: "Secure Payments",
    desc: "Your payments are protected with industry-standard encryption and trusted gateways.",
  },
  {
    icon: FaUsers,
    title: "Trusted by Thousands",
    desc: "Join millions of travellers who book with us for flights, hotels, and holidays every year.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Why Choose Us
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          We make travel simple, affordable, and secure for every traveller.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map(({ icon: Icon, title, desc }, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg hover:border-blue-100 hover:bg-white transition-all duration-300 text-center"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
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

export default WhyChooseUs;
