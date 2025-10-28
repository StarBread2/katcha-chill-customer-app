import React from "react";

interface CrowdMeterProps {
  limit?: number;        // Max capacity (default 100)
  value?: number;        // Current count (default 50)
  segments?: number;     // Number of bar shapes (default 8)
  colors?: string[];     // Gradient colors [low, mid, high]
}

const CrowdMeter_Bar: React.FC<CrowdMeterProps> = ({
    limit = 100,
    value = 0,
    segments = 8,
    colors = ["#28D977", "#FDB927", "#FF3B3B"], // green → yellow → red
    }) => {
    const percentage = Math.min(value / limit, 1); // Ensure not over 100%
    const activeSegments = Math.round(percentage * segments);

    // Determine color intensity based on how full the meter is
    let currentColor = colors[0];
    if (percentage > 0.66) currentColor = colors[2];
    else if (percentage > 0.33) currentColor = colors[1];

    return (
        <div className="flex space-x-1">
        {Array.from({ length: segments }).map((_, i) => (
            <div
            key={i}
            className="w-4 h-[25px] rounded-full transition-all duration-300"
            style={{
                backgroundColor: i < activeSegments ? currentColor : "#D9D9D9",
            }}
            ></div>
        ))}
        </div>
    );
};

export default CrowdMeter_Bar;
