import React from "react";

export default function Wikipedia(
  props: React.SVGProps<SVGSVGElement>
): React.JSX.Element {
  return (
    <svg
      id="Regular"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <polyline
        points="2.62 5.17 8.15 18.86 14.78 5.17"
        style={{
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
        }}
        className="stroke-black dark:stroke-white"
      />
      <line
        x1="5.15"
        x2="0.75"
        y1="5.14"
        y2="5.14"
        style={{
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
        }}
        className="stroke-black dark:stroke-white"
      />
      <line
        x1="16.4"
        x2="13.08"
        y1="5.14"
        y2="5.14"
        style={{
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
        }}
        className="stroke-black dark:stroke-white"
      />
      <polyline
        points="9.46 5.17 15 18.86 21.63 5.17"
        style={{
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
        }}
        className="stroke-black dark:stroke-white"
      />
      <line
        x1="10.92"
        x2="7.6"
        y1="5.14"
        y2="5.14"
        style={{
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
        }}
        className="stroke-black dark:stroke-white"
      />
      <line
        x1="23.25"
        x2="19.34"
        y1="5.14"
        y2="5.14"
        style={{
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5px",
        }}
        className="stroke-black dark:stroke-white"
      />
    </svg>
  );
}
