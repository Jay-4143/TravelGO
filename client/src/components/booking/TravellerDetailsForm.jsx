import React from 'react';
import { FaUser, FaChevronDown } from 'react-icons/fa';

const TravellerDetailsForm = ({ passengers, onPassengerChange }) => {
    const adults = passengers.filter(p => p.type === 'Adult');
    const children = passengers.filter(p => p.type === 'Child');
    const infants = passengers.filter(p => p.type === 'Infant');

    const renderPassengerRow = (p, originalIndex, displayLabel) => (
        <div key={originalIndex} className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <FaUser className="text-slate-400 w-3" />
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">{displayLabel}</span>
                </div>
                <FaChevronDown className="text-slate-300 w-3" />
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Title</p>
                        <select
                            value={p.title || ""}
                            onChange={(e) => onPassengerChange(originalIndex, "title", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none block appearance-none"
                        >
                            <option value="">Title</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                        </select>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">First Name</p>
                        <input
                            type="text"
                            value={p.firstName || ""}
                            placeholder="Given Name"
                            onChange={(e) => onPassengerChange(originalIndex, "firstName", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Last Name</p>
                        <input
                            type="text"
                            value={p.lastName || ""}
                            placeholder="Surname"
                            onChange={(e) => onPassengerChange(originalIndex, "lastName", e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>
                    {p.type !== 'Adult' && (
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Birth</p>
                            <input
                                type="date"
                                value={p.dob || ""}
                                onChange={(e) => onPassengerChange(originalIndex, "dob", e.target.value)}
                                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                    )}
                </div>
                <button className="mt-6 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">+ Add Frequent flyer number</button>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <h3 className="text-lg font-bold text-gray-900 border-b border-slate-50 p-6 flex items-center gap-3 uppercase tracking-tight">
                Traveller Details
            </h3>
            <div className="p-6">
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-center gap-2 mb-6">
                    <span className="w-4 h-4 rounded-full border border-blue-400 inline-flex items-center justify-center text-[10px] text-blue-500">i</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Please make sure you enter the Name as per your Government photo id.</span>
                </div>

                <div className="space-y-8">
                    {/* ADULTS */}
                    {adults.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-6 h-[1px] bg-slate-200"></span> ADULTS ({adults.length})
                            </h4>
                            {passengers.map((p, i) => p.type === 'Adult' && renderPassengerRow(p, i, `Adult ${passengers.filter((_, idx) => idx <= i && passengers[idx].type === 'Adult').length}`))}
                        </div>
                    )}

                    {/* CHILDREN */}
                    {children.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-6 h-[1px] bg-slate-200"></span> CHILDREN ({children.length})
                            </h4>
                            {passengers.map((p, i) => p.type === 'Child' && renderPassengerRow(p, i, `Child ${passengers.filter((_, idx) => idx <= i && passengers[idx].type === 'Child').length}`))}
                        </div>
                    )}

                    {/* INFANTS */}
                    {infants.length > 0 && (
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-6 h-[1px] bg-slate-200"></span> INFANTS ({infants.length})
                            </h4>
                            {passengers.map((p, i) => p.type === 'Infant' && renderPassengerRow(p, i, `Infant ${passengers.filter((_, idx) => idx <= i && passengers[idx].type === 'Infant').length}`))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TravellerDetailsForm;
