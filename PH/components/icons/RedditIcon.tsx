import React from 'react';

export const RedditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32" // Using a 32x32 viewBox for simplicity
    {...props} // Spreads props like className (e.g., "w-5 h-5 text-orange-500")
  >
    {/* Orange Background Circle - fill is determined by text color utilities (currentColor) */}
    <circle cx="16" cy="16" r="16" fill="currentColor" />

    {/* Snoo Alien (White parts) */}
    <g fill="#FFFFFF" stroke="none">
      {/* Head - simplified oval shape */}
      <path d="M16 9 C11 9 7 12.5 7 17 C7 21.5 11 25 16 25 C21 25 25 21.5 25 17 C25 12.5 21 9 16 9 Z" />

      {/* Ears - ellipses rotated and positioned */}
      <ellipse cx="9.5" cy="13.5" rx="2.5" ry="4.5" transform="rotate(-35 9.5 13.5)" />
      <ellipse cx="22.5" cy="13.5" rx="2.5" ry="4.5" transform="rotate(35 22.5 13.5)" />

      {/* Antenna */}
      <line
        x1="19.5" // Start x slightly to the right of head center
        y1="10.5"  // Start y above the head
        x2="22"   // End x further right and up
        y2="7.5"   // End y further up
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="22.5" cy="7" r="2.2" /> {/* Antenna bulb */}
    </g>

    {/* Eyes (Orange - same color as background, creating a "cutout" effect) */}
    {/* These will appear as the background color due to 'currentColor' */}
    <circle cx="13" cy="17" r="2" fill="currentColor" />
    <circle cx="19" cy="17" r="2" fill="currentColor" />

    {/* Mouth (Orange smile, to be visible on white head) */}
    {/* Path: M (start-x) (start-y) Q (control-x for curve) (control-y for curve peak) (end-x) (end-y) */}
    <path
      d="M13 20.5 Q16 22.5 19 20.5"
      stroke="currentColor" // Changed to currentColor to make it orange
      strokeWidth="1.5"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);