import React from 'react';

export const YouTubeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 28 20" // ViewBox for the standard YouTube logo
    {...props} // Spreads props like className (e.g., "w-5 h-5 text-red-500")
  >
    {/* Red body of the YouTube logo. 'currentColor' will be determined by text color utilities. */}
    <path
      d="M27.324 3.003c-.345-1.278-1.372-2.305-2.65-2.65C22.643 0 14 0 14 0S5.357 0 3.326 .353c-1.278.345-2.305 1.372-2.65 2.65C0 5.034 0 10 0 10s0 4.966 .676 6.997c.345 1.278 1.372 2.305 2.65 2.65C5.357 20 14 20 14 20s8.643 0 10.674-.353c1.278-.345 2.305-1.372 2.65-2.65C28 14.966 28 10 28 10s0-4.966-.676-6.997z"
      fill="currentColor"
    />
    {/* White play triangle */}
    <path
      d="M11.201 14.286l7.397-4.286-7.397-4.286v8.572z"
      fill="#FFFFFF"
    />
  </svg>
);