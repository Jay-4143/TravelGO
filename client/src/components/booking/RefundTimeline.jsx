import React from 'react';

const RefundTimeline = ({ price }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-8 uppercase tracking-tight">Refund on Cancellation</h3>

            <div className="relative mt-4 mb-8 px-4">
                {/* Timeline Line */}
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-slate-100 -translate-y-1/2" />

                <div className="flex justify-between relative">
                    {/* Now */}
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-900 mb-4">₹{Math.round(price * 0.8).toLocaleString('en-IN')} Refund</span>
                        <div className="w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm" />
                        <span className="text-[10px] font-bold text-gray-600 mt-3 uppercase tracking-widest">Now</span>
                    </div>

                    {/* Middle Point */}
                    <div className="flex flex-col items-center translate-x-12">
                        <span className="text-xs font-bold text-gray-900 mb-4">₹{Math.round(price * 0.5).toLocaleString('en-IN')} Refund</span>
                        <div className="w-4 h-4 rounded-full bg-orange-400 border-4 border-white shadow-sm" />
                        <span className="text-[10px] font-bold text-gray-600 mt-3 uppercase tracking-widest">Fri Feb 20 2026</span>
                    </div>

                    {/* Near Departure */}
                    <div className="flex flex-col items-center -translate-x-12">
                        <span className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest">Non refundable</span>
                        <div className="w-4 h-4 rounded-full bg-red-400 border-4 border-white shadow-sm" />
                        <span className="text-[10px] font-bold text-gray-600 mt-3 uppercase tracking-widest">Mon Feb 23 2026</span>
                    </div>

                    {/* Departure */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest opacity-0">.</span>
                        <div className="w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm" />
                        <div className="text-right mt-3">
                            <span className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest">Departure</span>
                            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Tue Feb 24 2026</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundTimeline;
