import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 my-16 py-8">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-green-400/70 border-b-transparent rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.2s]"></div>
        <div className="absolute inset-0 flex items-center justify-center text-sky-400">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
      </div>
      <p className="text-sky-300 text-lg font-medium tracking-wider animate-pulse font-roboto-mono">Compiling Intel Brief...</p>
    </div>
  );
};

export default LoadingSpinner;
