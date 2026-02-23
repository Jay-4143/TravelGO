import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { createFlightBooking } from "../api/bookings";
import SeatMap from "../components/SeatMap";
import PaymentModal from "../components/PaymentModal";
import { useGlobal } from "../context/GlobalContext";
import { generateTicket } from "../utils/TicketGenerator";
import toast from "react-hot-toast";
import { FaChevronLeft } from "react-icons/fa";

// Redesign Components
import FlightSummaryCard from "../components/booking/FlightSummaryCard";
import RefundTimeline from "../components/booking/RefundTimeline";
import { RefundableUpsell, InsuranceUpsell, BaggageProtectionUpsell } from "../components/booking/UpsellSections";
import TravellerDetailsForm from "../components/booking/TravellerDetailsForm";
import ContactInfoForm from "../components/booking/ContactInfoForm";
import FareSidebar from "../components/booking/FareSidebar";

/* Fare Discount Config */
const FARE_DISCOUNTS = {
  student: { label: "Student Fare", discount: 0.05, icon: "🎓" },
  defence: { label: "Defence Fare", discount: 0.04, icon: "🎖️" },
  senior: { label: "Senior Citizen Fare", discount: 0.06, icon: "👴" },
};

const getFareDiscount = (price, specialFare) => {
  if (!specialFare || !FARE_DISCOUNTS[specialFare]) return 0;
  return Math.round(price * FARE_DISCOUNTS[specialFare].discount);
};

const FlightBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { flight, returnFlight, searchParams, tripType } = location.state || {};

  const [step, setStep] = useState(1); // Keep step for logic (1: Review & Info, 2: Seats, 3: Success)
  const [passengers, setPassengers] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // New States for Redesign
  const [selectedPromo, setSelectedPromo] = useState(null);
  const [insuranceSelected, setInsuranceSelected] = useState(null); // null means not selected yet
  const [baggageSelected, setBaggageSelected] = useState(false);
  const [refundableSelected, setRefundableSelected] = useState(false);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [useGstin, setUseGstin] = useState(false);
  const [gstin, setGstin] = useState("");
  const [gstHolderName, setGstHolderName] = useState("");
  const [gstAddress, setGstAddress] = useState("");
  const [gstPincode, setGstPincode] = useState("");
  const [saveGst, setSaveGst] = useState(false);

  const [isAutoSelect, setIsAutoSelect] = useState(false);
  const [isReturnAutoSelect, setIsReturnAutoSelect] = useState(false);
  const [returnSelectedSeats, setReturnSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState(null);
  const { formatPrice } = useGlobal();

  const AVAILABLE_ADDONS = [
    { id: 'meal', name: 'Premium Meal', price: 599, icon: '🍱' },
    { id: 'water', name: 'Mineral Water', price: 50, icon: '💧' },
    { id: 'tea', name: 'Masala Tea', price: 99, icon: '☕' },
    { id: 'coffee', name: 'Starbucks Coffee', price: 299, icon: '☕' },
  ];

  useEffect(() => {
    if (!flight || !searchParams) {
      navigate("/flights");
      return;
    }
    const totalPax = (searchParams.adults || 0) + (searchParams.children || 0) + (searchParams.infants || 0);
    const paxList = Array(totalPax || 1)
      .fill(null)
      .map((_, i) => ({ name: "", age: i < (searchParams.adults || 0) ? 18 : i < (searchParams.adults || 0) + (searchParams.children || 0) ? 10 : 1 }));
    setPassengers(paxList);
  }, [flight, searchParams, navigate]);

  const formatTime = (date) => {
    if (!date) return "--";
    const d = new Date(date);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  };

  /* Total Calculation */
  const calculateTotal = () => {
    if (!flight) return 0;
    const passengersCount = passengers.length || 1;
    let total = flight.price * passengersCount;

    if (tripType === "round-trip" && returnFlight) {
      total += returnFlight.price * passengersCount;
    }

    // Fare Discount
    if (searchParams?.specialFare) {
      total -= getFareDiscount(flight.price, searchParams.specialFare) * passengersCount;
      if (tripType === "round-trip" && returnFlight) {
        total -= getFareDiscount(returnFlight.price, searchParams.specialFare) * passengersCount;
      }
    }

    // Seat Premium
    if (!isAutoSelect) {
      total += selectedSeats.reduce((sum, s) => sum + (s.includes('A') || s.includes('F') ? 499 : (s.includes('C') || s.includes('D') ? 299 : 99)), 0);
    }
    if (tripType === "round-trip" && returnFlight && !isReturnAutoSelect) {
      total += returnSelectedSeats.reduce((sum, s) => sum + (s.includes('A') || s.includes('F') ? 499 : (s.includes('C') || s.includes('D') ? 299 : 99)), 0);
    }

    // New Upsells
    if (insuranceSelected) total += (199 * passengersCount);
    if (baggageSelected) total += (95 * passengersCount);
    if (refundableSelected) total += Math.round(flight.price * 0.1) * passengersCount;

    // Addons
    total += selectedAddons.reduce((sum, a) => sum + (a.price * passengersCount), 0);

    // Taxes (15%) + Convenience Fee (199 per pax)
    const taxes = Math.round((flight.price * passengersCount) * 0.15);
    const fees = 199 * passengersCount;

    return Math.round(total + taxes + fees);
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: field === "age" ? Number(value) : value };
    setPassengers(updated);
  };

  useEffect(() => {
    if (searchParams && passengers.length === 0) {
      const adults = parseInt(searchParams.adults) || 1;
      const children = parseInt(searchParams.children) || 0;
      const infants = parseInt(searchParams.infants) || 0;

      const initialPassengers = [];
      for (let i = 0; i < adults; i++) initialPassengers.push({ type: 'Adult', title: '', firstName: '', lastName: '', age: 25 });
      for (let i = 0; i < children; i++) initialPassengers.push({ type: 'Child', title: '', firstName: '', lastName: '', age: 10 });
      for (let i = 0; i < infants; i++) initialPassengers.push({ type: 'Infant', title: '', firstName: '', lastName: '', age: 1 });

      setPassengers(initialPassengers);
    }
  }, [searchParams]);

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleDetailsSubmit = () => {
    // Validation
    if (passengers.some((p) => !p.firstName || !p.lastName || !p.title || (p.type !== 'Adult' && !p.dob))) {
      toast.error('Please fill all passenger details, including Date of Birth for children/infants.');
      return;
    }
    if (!mobile || !email) {
      toast.error('Please fill your contact information.');
      return;
    }
    if (insuranceSelected === null) {
      toast.error('Please select an insurance option (Yes or No).');
      return;
    }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleSeatSelectionComplete = () => {
    if (!isAutoSelect && selectedSeats.length !== passengers.length) {
      toast.error(`Please select ${passengers.length} seats or choose Auto-select for the outbound flight.`);
      return;
    }
    if (tripType === "round-trip" && returnFlight && !isReturnAutoSelect && returnSelectedSeats.length !== passengers.length) {
      toast.error(`Please select ${passengers.length} seats or choose Auto-select for the return flight.`);
      return;
    }
    handlePayment();
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createFlightBooking({
        flightId: flight._id,
        returnFlightId: returnFlight?._id,
        passengers: passengers.map((p, i) => ({
          name: `${p.title} ${p.firstName} ${p.lastName}`,
          age: p.age || 25,
          dob: p.dob || null,
          type: p.type,
          seat: isAutoSelect ? "Auto-selected" : selectedSeats[i]
        })),
        seats: isAutoSelect ? passengers.map(() => "Auto") : selectedSeats,
        tripType: tripType || "one-way",
        flightDetails: flight,
        addons: selectedAddons.map(a => ({ name: a.name, price: a.price, category: 'addon' })),
        contact: { mobile, email }
      });
      setCreatedBooking(res.data.booking);
      setIsPaymentModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Booking creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const onPaymentSuccess = (payment) => {
    setIsPaymentModalOpen(false);
    setBookingRef(createdBooking.bookingReference);
    setStep(3);
    window.scrollTo(0, 0);
  };

  if (!flight || !searchParams) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {step === 1 && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Review your flight details</h1>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => navigate("/flights", { state: searchParams })}
                    className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase hover:text-blue-600 transition-colors"
                  >
                    <FaChevronLeft className="w-2.5 h-2.5" /> Back to Search
                  </button>
                  <button
                    onClick={() => navigate("/flights", { state: { ...searchParams, isModifying: true } })}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border border-blue-100"
                  >
                    Modify Search
                  </button>
                </div>
              </div>

              <FlightSummaryCard flight={flight} searchParams={searchParams} />

              {tripType === "round-trip" && returnFlight && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-tight">Return Flight</h3>
                  <FlightSummaryCard flight={returnFlight} searchParams={searchParams} />
                </div>
              )}

              <RefundTimeline price={flight.price} />

              <RefundableUpsell
                price={flight.price}
                isSelected={refundableSelected}
                onSelect={() => setRefundableSelected(!refundableSelected)}
              />

              <InsuranceUpsell
                isSelected={insuranceSelected}
                onSelect={setInsuranceSelected}
              />

              <BaggageProtectionUpsell
                isSelected={baggageSelected}
                onSelect={setBaggageSelected}
              />

              <TravellerDetailsForm
                passengers={passengers}
                onPassengerChange={handlePassengerChange}
              />

              <ContactInfoForm
                mobile={mobile}
                email={email}
                onMobileChange={setMobile}
                onEmailChange={setEmail}
                useGstin={useGstin}
                onUseGstinToggle={setUseGstin}
                gstin={gstin}
                onGstinChange={setGstin}
                gstHolderName={gstHolderName}
                onGstHolderNameChange={setGstHolderName}
                gstAddress={gstAddress}
                onGstAddressChange={setGstAddress}
                gstPincode={gstPincode}
                onGstPincodeChange={setGstPincode}
                saveGst={saveGst}
                onSaveGstToggle={setSaveGst}
              />

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-end">
                <button
                  onClick={handleDetailsSubmit}
                  className="px-12 py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
                >
                  Continue
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <FareSidebar
              flight={flight}
              passengersCount={passengers.length}
              selectedPromo={selectedPromo}
              onPromoSelect={setSelectedPromo}
              insuranceSelected={insuranceSelected}
              baggageSelected={baggageSelected}
              refundableSelected={refundableSelected}
            />
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">{flight.from} → {flight.to} Seat Selection</h2>
            <SeatMap
              flightId={flight._id}
              passengers={passengers}
              selectedSeats={selectedSeats}
              onSeatSelect={setSelectedSeats}
              isAutoSelect={isAutoSelect}
              setIsAutoSelect={setIsAutoSelect}
            />

            {tripType === "round-trip" && returnFlight && (
              <div className="mt-12 border-t border-slate-100 pt-12">
                <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-tight">{returnFlight.from} → {returnFlight.to} Seat Selection</h2>
                <SeatMap
                  flightId={returnFlight._id}
                  passengers={passengers}
                  selectedSeats={returnSelectedSeats}
                  onSeatSelect={setReturnSelectedSeats}
                  isAutoSelect={isReturnAutoSelect}
                  setIsAutoSelect={setIsReturnAutoSelect}
                />
              </div>
            )}

            <div className="mt-12 flex justify-between pt-8 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-slate-100 text-slate-600 font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSeatSelectionComplete}
                className="px-12 py-3 bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Booking Confirmed!</h2>
            <p className="text-gray-500 font-medium mb-8">Your flight ticket has been successfully booked and sent to your email.</p>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Booking Reference</p>
              <p className="text-2xl font-black text-red-500 tracking-tighter">{bookingRef}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                onClick={() => generateTicket({
                  ...createdBooking,
                  flightDetails: flight,
                  passengers: passengers.map((p, i) => ({
                    name: `${p.title} ${p.firstName} ${p.lastName}`,
                    age: p.age || 25,
                    seatNumber: isAutoSelect ? "Auto-selected" : selectedSeats[i]
                  })),
                  addons: selectedAddons,
                  tripType: tripType
                }, 'flight')}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Ticket
              </button>
              <button
                type="button"
                onClick={() => navigate("/flights")}
                className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-600 font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all active:scale-95"
              >
                Book Another Flight
              </button>
            </div>
          </div>
        )}
      </div>

      {createdBooking && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          bookingId={createdBooking.id}
          bookingType="flight"
          amount={calculateTotal()}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </div>
  );
};

export default FlightBooking;
