import React from 'react';
import { FaPlane, FaSuitcaseRolling, FaChevronRight } from 'react-icons/fa';

const FlightSummaryCard = ({ flight, searchParams }) => {
    const formatTime = (date) => {
        if (!date) return "--:--";
        const d = new Date(date);
        return d.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: '2-digit' });
    };

    const baggage = flight.baggage
        ? { cabin: flight.baggage.cabin || "7kg", checkIn: flight.baggage.checkIn || "15kg" }
        : { cabin: "7kg", checkIn: "15kg" };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-gray-900">{flight.fromCity || flight.from}</h2>
                        <FaChevronRight className="text-gray-300 w-3" />
                        <h2 className="text-xl font-bold text-gray-900">{flight.toCity || flight.to}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-blue-600 text-xs font-bold uppercase hover:underline flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full border border-blue-600 inline-flex items-center justify-center text-[10px]">i</span> Fare Rules
                        </button>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">Partially Refundable</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-6 text-xs text-gray-500 font-medium">
                    <span>• {formatDate(flight.departureDate || searchParams?.departureDate)}</span>
                    <span>• Duration {flight.duration || "02h 20m"}</span>
                    <span>• {flight.stops === 0 ? "Non Stop" : `${flight.stops} stop(s)`}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-red-500 font-bold border border-slate-200">
                            {flight.airlineCode || "AI"}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900 leading-tight">{flight.airline}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{flight.flightNumber || "SG-106"}</p>
                        </div>
                    </div>
                    <div className="text-center md:border-l border-slate-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Aircraft</p>
                        <p className="text-xs font-bold text-gray-700">BOEING</p>
                    </div>
                    <div className="text-center md:border-l border-slate-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Travel Class</p>
                        <p className="text-xs font-bold text-gray-700 uppercase">{searchParams?.travelClass || "Economy"}</p>
                    </div>
                    <div className="flex gap-4 md:border-l border-slate-200 px-4">
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Check-In</p>
                            <p className="text-xs font-bold text-gray-700">{baggage.checkIn}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Cabin</p>
                            <p className="text-xs font-bold text-gray-700">{baggage.cabin}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between relative px-4">
                    <div className="text-left z-10">
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">{formatTime(flight.departureTime)}</p>
                        <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{formatDate(flight.departureDate || searchParams?.departureDate)}</p>
                        <p className="text-xs font-bold text-gray-700 mt-1">{flight.fromCity || flight.from} [{flight.from}]</p>
                        <p className="text-[10px] text-gray-400 font-medium">Coming Soon International Airport Terminal 1</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center px-12 relative">
                        <span className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">{flight.duration}</span>
                        <div className="w-full flex items-center gap-2">
                            <div className="h-px bg-slate-200 border-b border-dashed border-slate-300 flex-1" />
                            <FaPlane className="text-blue-400 w-4 h-4 transform rotate-45 -translate-y-[2px]" />
                            <div className="h-px bg-slate-200 border-b border-dashed border-slate-300 flex-1" />
                        </div>
                    </div>

                    <div className="text-right z-10">
                        <p className="text-2xl font-black text-gray-900 tracking-tighter">{formatTime(flight.arrivalTime)}</p>
                        <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{formatDate(flight.arrivalTime || searchParams?.departureDate)}</p>
                        <p className="text-xs font-bold text-gray-700 mt-1">{flight.toCity || flight.to} [{flight.to}]</p>
                        <p className="text-[10px] text-gray-400 font-medium">Coming Soon International Airport Terminal 1D</p>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-50 flex items-center gap-2">
                    <div className="p-1 px-3 bg-blue-50 rounded-lg flex items-center gap-2 border border-blue-100">
                        <span className="w-4 h-4 rounded-full border border-blue-400 inline-flex items-center justify-center text-[10px] text-blue-500 animate-pulse">i</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Meal, Seat are chargeable.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightSummaryCard;
