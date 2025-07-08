import React from 'react';

export const ExcelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    {...props}
  >
    {/* Page Area: Forms the main body/canvas, extends to the right. Medium Green. */}
    <rect 
      x="3" 
      y="2" 
      width="18.5" 
      height="20" 
      rx="2" 
      fill="#1E8A4C" /* Medium Green */
    /> 

    {/* Spine Area: Darker green, forms the "spine" on the left. Drawn over the Page Area. */}
    <rect 
      x="3" 
      y="2" 
      width="7.5" 
      height="20" 
      rx="2" 
      fill="#0B5328" /* Darker Green */
    /> 
    
    {/* X-Panel: Signature Excel dark green, square, on top of Spine and Page Area. */}
    <rect 
      x="6" 
      y="6" 
      width="12" 
      height="12" 
      rx="1.5" 
      fill="#107C41" /* Signature Excel Dark Green */
    />

    {/* White X symbol, centered on the X-Panel. Path adjusted for new panel dimensions/position. */}
    <path 
      d="M7.2,8.6L8.6,7.2L12,10.6L15.4,7.2L16.8,8.6L13.4,12L16.8,15.4L15.4,16.8L12,13.4L8.6,16.8L7.2,15.4L10.6,12L7.2,8.6Z"
      fill="#FFFFFF"
    />
  </svg>
);