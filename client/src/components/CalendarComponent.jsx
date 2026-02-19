import { useState, useRef, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const toDateKey = (d) => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "");
const parseDate = (str) => (str ? new Date(str + "T12:00:00") : null);
const isSameDay = (a, b) => a && b && toDateKey(a) === toDateKey(b);
const isInRange = (day, start, end) => {
  if (!start || !end) return false;
  const t = day.getTime();
  return t >= start.getTime() && t <= end.getTime();
};
const isBefore = (a, b) => a && b && a.getTime() < b.getTime();

// Mock fare for a date (deterministic from date string)
const getFareForDate = (date) => {
  const key = toDateKey(date);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash << 5) - hash + key.charCodeAt(i);
  const n = Math.abs(hash) % 4000;
  return 3500 + n; // 3500 - 7500 range
};
const isLowFare = (date) => getFareForDate(date) < 4500;

const CalendarComponent = ({
  isOpen,
  onClose,
  departureDate,
  returnDate,
  activeField,
  onSelectDeparture,
  onSelectReturn,
  isRoundTrip,
}) => {
  const panelRef = useRef(null);
  const dep = parseDate(departureDate);
  const ret = parseDate(returnDate);

  const [leftDate, setLeftDate] = useState(() => {
    const d = dep || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    if (!isOpen) return;
    const d = dep || new Date();
    setLeftDate(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [isOpen, departureDate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const rightDate = new Date(leftDate.getFullYear(), leftDate.getMonth() + 1, 1);

  const getDays = (year, month) => {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startPad = first.getDay();
    const days = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
    return days;
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const dateStr = toDateKey(date);
    if (activeField === "departure") {
      onSelectDeparture(dateStr);
      if (isRoundTrip) {
        onSelectReturn(null);
      }
    } else {
      if (isRoundTrip) {
        if (!dep) {
          onSelectDeparture(dateStr);
        } else if (isBefore(date, dep)) {
          onSelectDeparture(dateStr);
          onSelectReturn(null);
        } else {
          onSelectReturn(dateStr);
          onClose();
        }
      } else {
        onSelectDeparture(dateStr);
        onClose();
      }
    }
  };

  const formatHeaderDate = (d) => {
    if (!d) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const monthTitle = (year, month) => {
    const d = new Date(year, month, 1);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
  };

  if (!isOpen) return null;

  const leftDays = getDays(leftDate.getFullYear(), leftDate.getMonth());
  const rightDays = getDays(rightDate.getFullYear(), rightDate.getMonth());

  return (
    <div
      ref={panelRef}
      className="absolute left-1/2 -translate-x-1/2 top-0 z-[60] w-[calc(100%-2rem)] max-w-[1100px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
    >
      {/* Header: DEPARTURE ... RETURN ... */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => setLeftDate(new Date(leftDate.getFullYear(), leftDate.getMonth() - 1, 1))}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-6">
          <span className={`text-sm font-semibold pb-1 ${activeField === "departure" ? "text-gray-900 border-b-2 border-red-600" : "text-gray-600"}`}>
            DEPARTURE {dep ? formatHeaderDate(dep) : "Select"}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold pb-1 ${activeField === "return" ? "text-gray-900 border-b-2 border-red-600" : "text-gray-600"}`}>
              RETURN {ret ? formatHeaderDate(ret) : isRoundTrip ? "Select" : "—"}
            </span>
            {ret && isRoundTrip && (
              <button
                type="button"
                onClick={() => onSelectReturn(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
                aria-label="Clear return"
              >
                <span className="text-base font-bold">×</span>
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setLeftDate(new Date(leftDate.getFullYear(), leftDate.getMonth() + 1, 1))}
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FaChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Two months */}
      <div className="flex p-8 gap-16">
        {/* Left month */}
        <div className="flex-1">
          <div className="flex items-center justify-center mb-5">
            <span className="text-base font-bold text-red-600">{monthTitle(leftDate.getFullYear(), leftDate.getMonth())}</span>
          </div>
          <div className="grid grid-cols-7 gap-x-3 gap-y-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-xs font-semibold text-gray-600 py-2 text-center">
                {w}
              </div>
            ))}
            {leftDays.map((day, i) => {
              if (!day) return <div key={`l-e-${i}`} className="h-16" />;
              const key = toDateKey(day);
              const isSelected = isSameDay(day, dep) || isSameDay(day, ret);
              const inRange = isRoundTrip && dep && ret && isInRange(day, dep, ret) && !isSelected;
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const fare = getFareForDate(day);
              const lowFare = isLowFare(day);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`relative h-16 flex flex-col items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : inRange
                      ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                      : isWeekend
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm font-semibold">{day.getDate()}</span>
                  <span className={`text-[10px] font-normal mt-0.5 ${isSelected ? "text-white/90" : lowFare ? "text-green-600 font-medium" : "text-gray-500"}`}>
                    {fare}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right month */}
        <div className="flex-1">
          <div className="flex items-center justify-center mb-5">
            <span className="text-base font-bold text-red-600">{monthTitle(rightDate.getFullYear(), rightDate.getMonth())}</span>
          </div>
          <div className="grid grid-cols-7 gap-x-3 gap-y-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="text-xs font-semibold text-gray-600 py-2 text-center">
                {w}
              </div>
            ))}
            {rightDays.map((day, i) => {
              if (!day) return <div key={`r-e-${i}`} className="h-16" />;
              const key = toDateKey(day);
              const isSelected = isSameDay(day, dep) || isSameDay(day, ret);
              const inRange = isRoundTrip && dep && ret && isInRange(day, dep, ret) && !isSelected;
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const fare = getFareForDate(day);
              const lowFare = isLowFare(day);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`relative h-16 flex flex-col items-center justify-center rounded-lg transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : inRange
                      ? "bg-blue-100 text-blue-900 hover:bg-blue-200"
                      : isWeekend
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm font-semibold">{day.getDate()}</span>
                  <span className={`text-[10px] font-normal mt-0.5 ${isSelected ? "text-white/90" : lowFare ? "text-green-600 font-medium" : "text-gray-500"}`}>
                    {fare}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-8 py-3 border-t border-gray-200 flex justify-end bg-gray-50">
        <span className="text-xs font-medium text-red-600">* All fares are in INR</span>
      </div>
    </div>
  );
};

export default CalendarComponent;
