import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createHotelBooking } from "../api/bookings";

const HotelBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hotel, room, searchParams } = location.state || {};

  const [step, setStep] = useState(1); // 1: guests, 2: review, 3: mock payment, 4: confirmation
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [guestNames, setGuestNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotel || !room || !searchParams) {
      navigate("/hotels");
      return;
    }
    const guests = searchParams.guests || 2;
    const names = Array(guests).fill("").map((_, i) => ({ name: "", email: "", phone: "" }));
    setGuestNames(names);
  }, [hotel, room, searchParams, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString + "T12:00:00");
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const calculateTotal = () => {
    if (!room || !searchParams?.checkIn || !searchParams?.checkOut) return 0;
    const cIn = new Date(searchParams.checkIn + "T12:00:00");
    const cOut = new Date(searchParams.checkOut + "T12:00:00");
    const nights = Math.ceil((cOut - cIn) / (1000 * 60 * 60 * 24));
    return room.pricePerNight * nights * (searchParams.rooms || 1);
  };

  const handleGuestChange = (index, field, value) => {
    const updated = [...guestNames];
    updated[index] = { ...updated[index], [field]: value };
    setGuestNames(updated);
  };

  const handleReview = () => {
    if (guestNames.some((g) => !g.name)) {
      alert("Please fill all guest names.");
      return;
    }
    setStep(2);
  };

  const handleToPayment = () => setStep(3);
  const handleBackFromPayment = () => setStep(2);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createHotelBooking({
        hotelId: hotel._id,
        roomId: room._id,
        checkIn: searchParams.checkIn,
        checkOut: searchParams.checkOut,
        rooms: searchParams.rooms || 1,
        guests: searchParams.guests || 2,
        guestNames: guestNames.map((g) => g.name),
      });
      setBookingRef(res.data.booking.bookingReference);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!hotel || !room || !searchParams) return null;

  const total = calculateTotal();
  const nights = searchParams.checkIn && searchParams.checkOut
    ? Math.ceil(
        (new Date(searchParams.checkOut + "T12:00:00") - new Date(searchParams.checkIn + "T12:00:00")) /
          (1000 * 60 * 60 * 24)
      )
    : 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Hotel Booking</h1>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Guest Details</h2>
              <div className="space-y-4">
                {guestNames.map((g, i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium mb-3">Guest {i + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Full Name *</label>
                        <input
                          type="text"
                          value={g.name}
                          onChange={(e) => handleGuestChange(i, "name", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                          type="email"
                          value={g.email}
                          onChange={(e) => handleGuestChange(i, "email", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={g.phone}
                          onChange={(e) => handleGuestChange(i, "phone", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleReview}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Review Booking
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review Booking</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Hotel Details</h3>
                  <p className="text-sm text-gray-600 font-medium">{hotel.name}</p>
                  <p className="text-sm text-gray-600">{hotel.address || hotel.city}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Room Details</h3>
                  <p className="text-sm text-gray-600">{room.name || room.roomType}</p>
                  <p className="text-sm text-gray-600">Rooms: {searchParams.rooms || 1}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Dates</h3>
                  <p className="text-sm text-gray-600">
                    Check-in: {formatDate(searchParams.checkIn)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Check-out: {formatDate(searchParams.checkOut)}
                  </p>
                  <p className="text-sm text-gray-600">Nights: {nights}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Guests</h3>
                  {guestNames.map((g, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      {g.name} {g.email && `(${g.email})`}
                    </p>
                  ))}
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Price Breakdown</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        ₹{room.pricePerNight?.toLocaleString()} × {nights} night{nights !== 1 ? "s" : ""} × {searchParams.rooms || 1} room{searchParams.rooms !== 1 ? "s" : ""}
                      </span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleToPayment}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Payment Details (Mock)</h2>
              <p className="text-sm text-gray-500 mb-4">This is a demo. No real payment will be processed.</p>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value.slice(0, 5))}
                      placeholder="12/25"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="123"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-lg font-semibold">Total: ₹{total.toLocaleString()}</p>
                </div>
              </div>
              {error && <p className="text-red-600 mt-4">{error}</p>}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={handleBackFromPayment}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay ₹" + total.toLocaleString()}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-4">Your hotel booking has been confirmed.</p>
              <p className="text-lg font-semibold text-gray-900 mb-6">
                Booking Reference: <span className="text-red-500">{bookingRef}</span>
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/hotels")}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                >
                  Book Another Hotel
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/bookings")}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;
