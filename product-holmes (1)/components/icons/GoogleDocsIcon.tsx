import React from 'react';

export const GoogleDocsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 75 90" // Aspect ratio based on typical Google Docs icon proportions
    {...props}
  >
    {/* Main document body - blue */}
    <path
      d="M56.25 0H11.25C5.039 0 0 5.039 0 11.25V78.75C0 84.961 5.039 90 11.25 90H63.75C69.961 90 75 84.961 75 78.75V22.5L56.25 0Z"
      fill="#4285F4" // Google Blue
    />
    {/* Folded corner - lighter blue */}
    <path
      d="M56.25 0V22.5H75L56.25 0Z"
      fill="#A0C3FF" // Lighter blue for fold
    />
    {/* Text lines - white */}
    <rect x="15" y="45" width="45" height="5" rx="2.5" fill="#FFFFFF" />
    <rect x="15" y="55" width="45" height="5" rx="2.5" fill="#FFFFFF" />
    <rect x="15" y="65" width="45" height="5" rx="2.5" fill="#FFFFFF" />
    <rect x="15" y="75" width="30" height="5" rx="2.5" fill="#FFFFFF" />
  </svg>
);
