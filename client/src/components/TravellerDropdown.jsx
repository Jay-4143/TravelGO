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
      className={`absolute z-[100] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 left-0 mt-2 min-w-[320px] max-w-[400px]`}
    >
      <div className="p-5 space-y-5">
        {/* Adults */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adults (Above 12 Years)</span>
            <span className="text-sm font-bold text-slate-800">{localAdults}</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLocalAdults(n)}
                className={`flex-1 h-8 text-[11px] font-black rounded-lg transition-all ${localAdults === n ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Children */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Children (2-12 Years)</span>
            <span className="text-sm font-bold text-slate-800">{localChildren}</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLocalChildren(n)}
                className={`flex-1 h-8 text-[11px] font-black rounded-lg transition-all ${localChildren === n ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Infants */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Infants (0-23 Months)</span>
            <span className="text-sm font-bold text-slate-800">{localInfants}</span>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setLocalInfants(n)}
                className={`flex-1 h-8 text-[11px] font-black rounded-lg transition-all ${localInfants === n ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Travel Class</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CLASS_OPTIONS.map((cls) => (
              <button
                key={cls}
                type="button"
                onClick={() => setLocalClass(cls)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-all ${localClass === cls
                    ? "border-blue-600 bg-blue-50 text-blue-600 font-bold"
                    : "border-slate-100 text-slate-600 hover:border-blue-200"
                  }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${localClass === cls ? "border-blue-600" : "border-slate-300"
                  }`}>
                  {localClass === cls && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </div>
                <span className="text-[11px] uppercase tracking-tight">{cls}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="w-full py-3 bg-red-500 hover:bg-slate-900 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all uppercase text-[10px] tracking-widest mt-2"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default TravellerDropdown;
