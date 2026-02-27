import React, { useState, useEffect, useRef, useCallback } from 'react';

const MultiRangeSlider = ({ min, max, value, onChange, step = 1 }) => {
    const [minVal, setMinVal] = useState(value[0]);
    const [maxVal, setMaxVal] = useState(value[1]);
    const minValRef = useRef(value[0]);
    const maxValRef = useRef(value[1]);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
        (val) => Math.round(((val - min) / (max - min)) * 100),
        [min, max]
    );

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Local state sync with external value
    useEffect(() => {
        setMinVal(value[0]);
        setMaxVal(value[1]);
        minValRef.current = value[0];
        maxValRef.current = value[1];
    }, [value]);

    return (
        <div className="relative w-full flex items-center justify-center h-4 my-2">
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={minVal}
                onChange={(event) => {
                    const val = Math.min(Number(event.target.value), maxVal - step);
                    setMinVal(val);
                    minValRef.current = val;
                }}
                onMouseUp={() => onChange([minVal, maxVal])}
                onTouchEnd={() => onChange([minVal, maxVal])}
                className="absolute w-full h-0 pointer-events-none appearance-none z-20 
                           [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                           [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-700 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
                style={{ zIndex: minVal > max - 100 && '5' }}
            />
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={maxVal}
                onChange={(event) => {
                    const val = Math.max(Number(event.target.value), minVal + step);
                    setMaxVal(val);
                    maxValRef.current = val;
                }}
                onMouseUp={() => onChange([minVal, maxVal])}
                onTouchEnd={() => onChange([minVal, maxVal])}
                className="absolute w-full h-0 pointer-events-none appearance-none z-20 
                           [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-700 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md
                           [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-teal-700 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-md"
            />
            <div className="relative w-full h-1.5">
                <div className="absolute w-full h-1.5 bg-gray-200 rounded-lg z-10" />
                <div ref={range} className="absolute h-1.5 bg-teal-700 rounded-lg z-20" />
            </div>
        </div>
    );
};

export default MultiRangeSlider;
