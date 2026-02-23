import React from 'react';
import { useGlobal } from '../../context/GlobalContext';

const PROMO_CODES = [
    { code: 'ATIDFC', discount: 200, desc: 'Applicable on IDFC Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATMBK200', discount: 200, desc: 'Applicable on MobiKwik Wallet, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATRBL', discount: 200, desc: 'Applicable on RBL Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATSBIDOM', discount: 200, desc: 'Applicable on SBI Bank Credit/Debit Cards, T&C Apply. Flat Off ₹ 200' },
    { code: 'ATFLY', discount: 39, desc: 'Your Promocode has been applied you\'ve saved ₹ 39' },
    { code: 'ATWALLET', discount: 0, desc: 'Please login to check amount' },
];

const FareSidebar = ({
    flight,
    passengersCount,
    selectedPromo,
    onPromoSelect,
    insuranceSelected,
    baggageSelected,
    refundableSelected
}) => {
    const { formatPrice } = useGlobal();

    const baseFare = flight.price * passengersCount;
    const taxes = Math.round(baseFare * 0.15);
    const insurance = insuranceSelected ? 199 * passengersCount : 0;
    const baggage = baggageSelected ? 95 * passengersCount : 0;
    const refundable = refundableSelected ? Math.round(flight.price * 0.1) * passengersCount : 0;
    const promoDiscount = selectedPromo ? selectedPromo.discount : 0;

    const total = baseFare + taxes + insurance + baggage + refundable - promoDiscount;

    return (
        <aside className="w-80 flex-shrink-0 sticky top-24 self-start space-y-4">
            {/* Fare Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm uppercase tracking-tight">Fare Details</h3>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{passengersCount} Traveller{passengersCount > 1 ? 's' : ''}</span>
                </div>
                <div className="p-5 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-2 uppercase tracking-widest">
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px]">+</span> Base Fare
                        </div>
                        <span className="text-gray-900">₹{baseFare.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                        <div className="flex items-center gap-2 uppercase tracking-widest">
                            <span className="w-3.5 h-3.5 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px]">+</span> Tax & Charges
                        </div>
                        <span className="text-gray-900">₹{taxes.toLocaleString('en-IN')}</span>
                    </div>
                    {insurance > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                            <div className="flex items-center gap-2 uppercase tracking-widest">
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px]">+</span> Insurance
                            </div>
                            <span className="text-gray-900">₹{insurance.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    {baggage > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                            <div className="flex items-center gap-2 uppercase tracking-widest">
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px]">+</span> Protection
                            </div>
                            <span className="text-gray-900">₹{baggage.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    {refundable > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                            <div className="flex items-center gap-2 uppercase tracking-widest">
                                <span className="w-3.5 h-3.5 rounded-full border border-slate-200 inline-flex items-center justify-center text-[10px]">+</span> Refundable
                            </div>
                            <span className="text-gray-900">₹{refundable.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    {promoDiscount > 0 && (
                        <div className="flex justify-between items-center text-xs font-bold text-green-600">
                            <div className="flex items-center gap-2 uppercase tracking-widest">
                                <span className="w-3.5 h-3.5 rounded-full bg-green-100 inline-flex items-center justify-center text-[10px]">%</span> Promo Discount
                            </div>
                            <span className="font-black">₹{promoDiscount.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">Total Amount:</span>
                        <span className="text-xl font-black text-gray-900 tracking-tighter">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            {/* Promo Code selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-5 py-3 bg-gradient-to-r from-green-300 to-green-100">
                    <h3 className="font-black text-xs text-green-800 uppercase tracking-widest">Promo Code</h3>
                </div>
                {selectedPromo && (
                    <div className="p-4 bg-green-50 border-b border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px]">%</span>
                            <span className="text-xs font-black text-green-700 uppercase tracking-widest">{selectedPromo.code}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">{selectedPromo.desc}</p>
                    </div>
                )}
                <div className="p-4 max-h-[300px] overflow-y-auto no-scrollbar space-y-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Choose from the offers below</p>
                    {PROMO_CODES.map(promo => (
                        <label key={promo.code} className="flex gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="promo"
                                checked={selectedPromo?.code === promo.code}
                                onChange={() => onPromoSelect(promo)}
                                className="mt-1 w-4 h-4 text-red-500 focus:ring-red-500 border-gray-300"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-[11px] font-black uppercase tracking-widest ${selectedPromo?.code === promo.code ? 'text-green-600' : 'text-slate-700 group-hover:text-red-500'}`}>{promo.code}</span>
                                    {promo.discount > 0 && <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Save {promo.discount}</span>}
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 group-hover:text-slate-500 leading-tight">{promo.desc}</p>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default FareSidebar;
