
import React from "react";

export const WaveAnimation: React.FC = () => {
  return (
    <div className="wave-container">
      <svg
        className="wave-svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave"
            d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z"
          />
        </defs>
        <g>
          <use
            xlinkHref="#wave"
            x="50"
            y="0"
            fill="rgba(37, 99, 235, 0.05)"
            className="animate-wave"
          />
          <use
            xlinkHref="#wave"
            x="50"
            y="3"
            fill="rgba(37, 99, 235, 0.1)"
            className="animate-wave"
            style={{ animationDelay: "0.25s", animationDuration: "18s" }}
          />
          <use
            xlinkHref="#wave"
            x="50"
            y="6"
            fill="rgba(37, 99, 235, 0.15)"
            className="animate-wave"
            style={{ animationDelay: "0.5s", animationDuration: "15s" }}
          />
        </g>
      </svg>
    </div>
  );
};
