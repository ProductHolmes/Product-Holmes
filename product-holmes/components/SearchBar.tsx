
import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';

interface SearchBarProps {
  onAnalyze: (productName: string) => void;
  isLoading: boolean;
  initialProductName?: string; // New prop
}

const SearchBar: React.FC<SearchBarProps> = ({ onAnalyze, isLoading, initialProductName = '' }) => {
  const [productName, setProductName] = useState<string>(initialProductName);

  useEffect(() => {
    // Update productName if initialProductName changes (e.g., when switching instances)
    setProductName(initialProductName);
  }, [initialProductName]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productName.trim() && !isLoading) {
      onAnalyze(productName.trim());
    }
  };

  return (
    <section className="my-8 md:my-10 px-4"> {/* Reduced top margin slightly */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <label htmlFor="productName" className="block text-lg font-medium text-sky-300 mb-3 text-center font-orbitron">
          Investigate Product
        </label>
        <div className="relative flex items-center group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none opacity-50 group-focus-within:opacity-100 group-focus-within:text-sky-400 transition-opacity duration-300">
             <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-sky-400" />
          </div>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Apple Vision Pro, CyberWidget X2077"
            disabled={isLoading}
            className="w-full pl-10 pr-32 sm:pr-36 py-3.5 text-gray-100 bg-gray-800/80 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-lg placeholder-gray-500 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isLoading || !productName.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <MagnifyingGlassIcon className="h-5 w-5 sm:mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
            )}
            <span className="hidden sm:inline">Analyze</span>
          </button>
        </div>
        {isLoading && <p className="text-sm text-sky-400/80 mt-4 text-center animate-pulse font-roboto-mono">Holmes is on the case...</p>}
      </form>
    </section>
  );
};

export default SearchBar;
