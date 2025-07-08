import React from 'react';

export const CsvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Page Body - very light gray with rounded corners */}
    <path 
      d="M19.5 21.5H4.5C3.675 21.5 3 20.825 3 20V4C3 3.175 3.675 2.5 4.5 2.5H13.5l6 6V20C19.5 20.825 18.825 21.5 19.5 21.5Z"
      fill="#EBF0F2"
    />
    {/* Page Fold - darker gray */}
    <path 
      d="M13.5 2.5V8.5H19.5L13.5 2.5Z" 
      fill="#D4DDE2"
    />
    
    {/* Banner - Dark Blue (Left Part with rounded left end, suggesting wrap-around) */}
    <path 
      d="M6 14.75H4.5C3.948 14.75 3.5 14.302 3.5 13.75V11.25C3.5 10.698 3.948 10.25 4.5 10.25H6V14.75Z" 
      fill="#25B1E4"
    />

    {/* Banner - Light Blue (Right Part extending from dark blue, with rounded right end) */}
    <path 
      d="M19.5 14.75H6V10.25H19.5C20.052 10.25 20.5 10.698 20.5 11.25V13.75C20.5 14.302 20.052 14.75 19.5 14.75Z" 
      fill="#36C8FD"
    />
    
    {/* CSV Text - white, bold, centered */}
    <text 
      x="12" 
      y="12.65" // Adjusted for better visual centering within the 4.5 height banner
      fontFamily="Arial, Verdana, sans-serif" 
      fontSize="3.3" 
      fontWeight="bold" 
      fill="#FFFFFF" 
      textAnchor="middle" 
      dominantBaseline="central"
    >
      CSV
    </text>
  </svg>
);
