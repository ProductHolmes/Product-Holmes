
import React from 'react';
import { AppView } from '../App'; // Import AppView type
import { PlusIcon } from './icons/PlusIcon'; // New Icon
import { ChevronDownIcon } from './icons/ChevronDownIcon'; // New Icon

interface HeaderProps {
  onGoHome: () => void; // This will now reset the active instance
  currentView: AppView;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
  onLogout: () => void;
  onToggleProductMenu: () => void;
  onAddNewInstance: () => void;
  activeProductName: string;
  isProductMenuOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onGoHome, 
  currentView, 
  selectedPlan, 
  onGoToSubscription, 
  onLogout,
  onToggleProductMenu,
  onAddNewInstance,
  activeProductName,
  isProductMenuOpen
}) => {
  const getPlanDisplayName = (planKey: string | null): string => {
    if (!planKey) return '';
    if (planKey.toLowerCase() === 'free') return 'Free Tier';
    if (planKey.toLowerCase() === 'pro') return 'Pro Tier';
    if (planKey.toLowerCase() === 'max') return 'Max Tier';
    return planKey; 
  };
  
  const slogan = "Uncover. Understand. Upgrade.";

  return (
    <header className="py-3 md:py-4 text-center bg-gray-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-700/60 shadow-2xl">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Left Section: Product Navigation & Title */}
        <div className="flex items-center">
          <button
            onClick={onToggleProductMenu}
            className="flex items-center p-2 -ml-2 rounded-md hover:bg-gray-700/50 focus:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors group"
            aria-label={isProductMenuOpen ? "Close product selection menu" : "Open product selection menu"}
            aria-expanded={isProductMenuOpen}
          >
            <h1 className="text-2xl md:text-3xl font-bold group-hover:scale-105 transition-transform duration-200">
              <span className="text-sky-400">Product</span>
              <span className="text-gray-100">Holmes</span>
            </h1>
            <ChevronDownIcon 
              className={`w-5 h-5 md:w-6 md:h-6 ml-1.5 md:ml-2 text-gray-400 group-hover:text-sky-300 transition-transform duration-200 ${isProductMenuOpen ? 'rotate-180' : ''}`} 
            />
          </button>
          <button
              onClick={onGoHome} // Resets current active instance
              className="ml-2 px-2 py-1.5 text-xs font-roboto-mono text-gray-400 hover:text-sky-300 hover:bg-gray-700/50 rounded-md transition-colors"
              title="Reset current product view"
              aria-label="Reset current product analysis view"
          >
            Reset View
          </button>
        </div>
        
        {/* Center Section: Active Product Name (optional, or subtitle) */}
         <p className="hidden lg:block text-sm text-sky-300/80 tracking-wider font-roboto-mono truncate max-w-xs">
            {currentView === 'app' ? `Investigating: ${activeProductName}` : slogan}
        </p>


        {/* Right Section: Controls & User Info */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {currentView === 'app' && (
             <button
                onClick={onAddNewInstance}
                className="p-2 rounded-full text-gray-300 hover:text-sky-300 hover:bg-sky-700/50 focus:bg-sky-700/70 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-200"
                title="Add New Product Analysis"
                aria-label="Add New Product Analysis"
              >
                <PlusIcon className="w-5 h-5 md:w-6 md:h-6" />
              </button>
          )}
          {currentView === 'app' && (
            <div className="flex flex-col items-end">
                <button
                    onClick={onGoToSubscription}
                    className="text-xs text-sky-400 hover:text-sky-300 hover:underline font-roboto-mono transition-colors whitespace-nowrap"
                    aria-label={`Manage your current subscription plan: ${getPlanDisplayName(selectedPlan)}`}
                >
                    {selectedPlan ? getPlanDisplayName(selectedPlan) : 'Manage Plan'}
                </button>
                <button
                    onClick={onLogout}
                    className="text-xs text-red-400 hover:text-red-300 hover:underline font-roboto-mono transition-colors mt-0.5"
                    aria-label="Logout from Product Holmes"
                >
                    Logout
                </button>
            </div>
          )}
           {currentView !== 'app' && (
             <p className="text-xs md:text-sm text-sky-300/80 tracking-wider font-roboto-mono">
                {slogan}
             </p>
           )}
        </div>
      </div>
      <div className="absolute top-1 right-1 md:top-1.5 md:right-1.5 h-4 w-4 md:h-6 md:w-6 border-t-2 border-r-2 border-sky-600/50 rounded-tr-lg opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1 left-1 md:bottom-1.5 md:left-1.5 h-4 w-4 md:h-6 md:w-6 border-b-2 border-l-2 border-sky-600/50 rounded-bl-lg opacity-40 animate-pulse"></div>
    </header>
  );
};

export default Header;