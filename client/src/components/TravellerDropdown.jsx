import { useState, useRef, useEffect } from "react";

const CLASS_OPTIONS = ["Economy", "Premium Economy", "Business", "First Class"];

const TravellerDropdown = ({ isOpen, onClose, adults, children, infants, travelClass, onApply }) => {
  const panelRef = useRef(null);
  const [localAdults, setLocalAdults] = useState(adults);
  const [localChildren, setLocalChildren] = useState(children);
  const [localInfants, setLocalInfants] = useState(infants);
  const [localClass, setLocalClass] = useState(travelClass);

  useEffect(() => {
    if (isOpen) {
      setLocalAdults(adults);
      setLocalChildren(children);
      setLocalInfants(infants);
      setLocalClass(travelClass);
    }
  }, [isOpen, adults, children, infants, travelClass]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleApply = () => {
    onApply({ adults: localAdults, children: localChildren, infants: localInfants, travelClass: localClass });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className="absolute left-1/2 -translate-x-1/2 top-0 z-[60] w-[calc(100%-2rem)] max-w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      <div className="p-8 space-y-6">
        {/* Adults (Above 12 Years) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Adults (Above 12 Years)</span>
            <span className="text-base font-bold text-gray-900">{localAdults}</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLocalAdults(n)}
                className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors ${
                  localAdults === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Children (2-12 Years) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Children (2-12 Years)</span>
            <span className="text-base font-bold text-gray-900">{localChildren}</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLocalChildren(n)}
                className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors ${
                  localChildren === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Infants (0-23 Months) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">Infants (0-23 Months)</span>
            <span className="text-base font-bold text-gray-900">{localInfants}</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLocalInfants(n)}
                className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-colors ${
                  localInfants === n ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Class */}
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-4">Class</span>
          <div className="space-y-3">
            {CLASS_OPTIONS.map((cls) => (
              <label key={cls} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="travelClass"
                  value={cls}
                  checked={localClass === cls}
                  onChange={() => setLocalClass(cls)}
                  className="w-4 h-4 text-red-500 focus:ring-red-500"
                />
                <span className="text-sm font-medium text-gray-800">{cls}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-md uppercase text-sm tracking-wide transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default TravellerDropdown;
