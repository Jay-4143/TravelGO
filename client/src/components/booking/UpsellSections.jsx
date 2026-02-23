import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaSuitcaseRolling } from 'react-icons/fa';

export const RefundableUpsell = ({ price, onSelect, isSelected }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 group cursor-pointer" onClick={onSelect}>
            <div className={`p-4 flex items-center gap-3 transition-colors ${isSelected ? 'bg-green-600 text-white' : 'bg-emerald-700 text-white'}`}>
                <FaCheckCircle className="w-5 h-5" />
                <h4 className="font-bold text-sm uppercase tracking-tight">Refundable Booking (Upto 100% refund)</h4>
                <div className="ml-auto text-right">
                    <p className="text-xl font-black tracking-tighter leading-none">₹{Math.round(price * 0.1).toLocaleString('en-IN')}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Per Person</p>
                </div>
            </div>
            <div className="p-6 bg-white border-x border-b border-slate-100 rounded-b-2xl">
                <div className="grid grid-cols-2 gap-8 mb-6">
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-400">🎁</div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Benefits</p>
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-xs font-bold text-gray-700">Refundable upto 100%</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-4 md:border-l border-slate-100 md:pl-8">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400">🛡️</div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Other Benefits</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Illness/Injury
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Pre-existing medical condition
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-[10px] text-gray-500 font-medium mb-6 leading-relaxed">
                    Upgrade your booking and receive a 100% refund if you cannot attend and can evidence one of the many reasons in our <span className="text-blue-600 hover:underline cursor-pointer">Terms and Conditions</span>, which you accept when you select a Refundable Booking.
                </p>

                <div className="flex gap-4">
                    <button className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${!isSelected ? 'border-blue-600 text-blue-600' : 'border-slate-100 text-slate-400'}`}>Want to take a risk</button>
                    <button className={`flex-1 py-2.5 rounded-xl border-2 font-bold text-xs uppercase tracking-widest transition-all ${isSelected ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-100' : 'border-slate-300 text-gray-700'}`}>Secure my trip</button>
                </div>
            </div>
        </div>
    );
};

export const InsuranceUpsell = ({ onSelect, isSelected }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-slate-50 p-6 flex items-center justify-between uppercase tracking-tight">
                Travel Insurance
            </h3>
            <div className="p-6">
                <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden">
                    <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaShieldAlt />
                            <span className="text-[11px] font-black uppercase tracking-widest">Benefits Of Travel Insurance</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-black tracking-tighter">₹199</span>
                            <span className="text-[9px] font-black uppercase tracking-widest ml-1 opacity-80">Per Person</span>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-50/30">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="text-xs font-black text-slate-700 leading-relaxed mb-4">Secure your Trip with Travel Insurance. Here are some reasons you should get insured:</p>
                                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                    {['Trip Cancellation', 'Trip Delay', 'Lost Baggage', 'Medical Expenses'].map(ben => (
                                        <div key={ben} className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {ben}
                                        </div>
                                    ))}
                                </div>
                                <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-4 hover:underline">And lot more</button>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-blue-100 flex flex-col items-center gap-2 shadow-sm">
                                <div className="w-12 h-6 bg-blue-900 rounded flex items-center justify-center text-[7px] text-white font-black italic">BAJAJ Allianz</div>
                                <span className="text-[8px] font-black text-blue-900 uppercase tracking-widest">GENERAL</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => onSelect(false)} className={`flex-1 py-2.5 rounded-lg border font-black text-[10px] uppercase tracking-widest transition-all ${isSelected === false ? 'bg-white border-blue-600 text-blue-600 shadow-sm ring-2 ring-blue-50' : 'bg-transparent border-slate-200 text-slate-400 hover:border-slate-300'}`}>I don't want to secure my trip</button>
                            <button onClick={() => onSelect(true)} className={`flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isSelected === true ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-blue-900 text-white shadow-md hover:bg-blue-800'}`}>
                                {isSelected === true && <FaCheckCircle />} Yes, secure my trip
                            </button>
                        </div>

                        {isSelected !== null && (
                            <div className="mt-4 pt-4 border-t border-blue-100 flex items-start gap-3 animate-fadeIn">
                                <span className="text-xs">{isSelected ? '✅' : 'ℹ️'}</span>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-green-600' : 'text-slate-500'}`}>
                                    {isSelected ? 'Great choice! Your trip is secured.' : 'You have opted out of travel insurance.'}
                                </p>
                            </div>
                        )}
                        <div className="mt-2 bg-blue-50 p-2 rounded-lg flex items-center gap-2 border border-blue-100/50">
                            <span className="w-4 h-4 rounded-full border border-blue-400 inline-flex items-center justify-center text-[10px] text-blue-500">i</span>
                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Travel insurance is only for Indian citizens below the age of 70 years.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const BaggageProtectionUpsell = ({ onSelect, isSelected }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-slate-50 p-6 flex items-center justify-between uppercase tracking-tight">
                Lost Baggage Protection
            </h3>
            <div className="p-6">
                <div className="bg-white rounded-2xl border border-cyan-100 overflow-hidden shadow-sm">
                    <div className="bg-cyan-700 text-white p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FaSuitcaseRolling />
                            <span className="text-[11px] font-black uppercase tracking-widest">Benefits of Lost Baggage Protection</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-black tracking-tighter">₹95</span>
                            <span className="text-[9px] font-black uppercase tracking-widest ml-1 opacity-80">Premium Amount</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="flex gap-4 mb-6">
                            <div className="w-16 h-8 bg-slate-800 rounded flex flex-col items-center justify-center p-1">
                                <span className="text-[7px] text-white font-bold leading-none">BLUE</span>
                                <span className="text-[7px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-black leading-none uppercase">Ribbon</span>
                                <span className="text-[7px] text-white font-bold leading-none">BAGS</span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">This service tracks and speeds up the return of the delayed baggage. Get compensation for your overseas travel expenses if your luggage is reported misplaced or is not delivered".</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            {[
                                { icon: '🎁', title: 'Guaranteed Payment', desc: 'Rest assured with up to compensation if your baggage doesn\'t arrive in 96 hours.' },
                                { icon: '📡', title: 'Live Tracking', desc: 'Stay informed in real time with updates via email & SMS.' },
                                { icon: '📋', title: 'No Proof required', desc: 'No need to provide the details of the bag content.' }
                            ].map(item => (
                                <div key={item.title}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest leading-none">{item.title}</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => onSelect(false)} className={`flex-1 py-2.5 rounded-lg border font-black text-[10px] uppercase tracking-widest transition-all ${!isSelected ? 'bg-white border-cyan-200 text-cyan-700 shadow-sm' : 'bg-transparent border-slate-200 text-slate-400'}`}>I don't want to secure my baggage</button>
                            <button onClick={() => onSelect(true)} className={`flex-1 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all ${isSelected ? 'bg-cyan-700 text-white shadow-lg shadow-cyan-100' : 'bg-blue-900 text-white shadow-md'}`}>Secure my baggage</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
