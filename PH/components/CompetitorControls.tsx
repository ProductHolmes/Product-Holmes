
import React, { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { LockIcon } from './icons/LockIcon'; // For upgrade prompt

interface CompetitorControlsProps {
  currentCompetitorName?: string | null;
  onAnalyze: (name: string) => void;
  onClear: () => void;
  isLoading: boolean;
  disabled?: boolean;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const CompetitorControls: React.FC<CompetitorControlsProps> = ({ 
  currentCompetitorName, 
  onAnalyze, 
  onClear, 
  isLoading, 
  disabled = false,
  selectedPlan,
  onGoToSubscription
}) => {
  const [showInput, setShowInput] = useState(false);
  const [competitorInput, setCompetitorInput] = useState('');
  const prevCompetitorNameRef = useRef(currentCompetitorName);
  const [formAnimationClass, setFormAnimationClass] = useState('competitor-form-hidden');

  const isMaxTier = selectedPlan === 'max';

  useEffect(() => {
    const nameJustChangedOrLoaded = prevCompetitorNameRef.current !== currentCompetitorName;

    if (currentCompetitorName && nameJustChangedOrLoaded && !isLoading && showInput) {
      setCompetitorInput('');
    }

    if (currentCompetitorName === null && prevCompetitorNameRef.current !== null && showInput && !isLoading) {
      setShowInput(false); 
      setCompetitorInput('');
    }
    
    prevCompetitorNameRef.current = currentCompetitorName;
  }, [currentCompetitorName, isLoading, showInput]);

  useEffect(() => {
    if (showInput) {
      setFormAnimationClass('competitor-form-enter-active');
    } else {
      if (formAnimationClass === 'competitor-form-enter-active') {
        setFormAnimationClass('competitor-form-leave-active');
      } 
    }
  }, [showInput, formAnimationClass]);


  const handleAnalyzeClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (competitorInput.trim() && !isLoading && !disabled && isMaxTier) {
      onAnalyze(competitorInput.trim());
    }
  };

  const handleClearClick = () => {
    if (disabled || !isMaxTier) return;
    onClear();
    setShowInput(false);
    setCompetitorInput('');
  };

  const toggleShowInput = () => {
    if ((disabled && !currentCompetitorName) || !isMaxTier) return; 
    setShowInput(prev => {
        const newShowInputState = !prev;
        if (!newShowInputState) { 
            setCompetitorInput(''); 
        }
        return newShowInputState;
    });
  };

  const isFormEffectivelyVisible = showInput || formAnimationClass === 'competitor-form-enter-active' || formAnimationClass === 'competitor-form-leave-active';

  const titleText = disabled && !isMaxTier
    ? "Analyze Primary Product & Upgrade for Competitor Intel"
    : disabled
    ? "Analyze a Primary Product First"
    : !isMaxTier
    ? "Upgrade for Competitor Intel"
    : "Competitive Analysis Matrix";

  const UpgradePrompt = () => (
    <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 rounded-lg">
      <LockIcon className="w-12 h-12 text-sky-500 mb-4" />
      <p className="text-center text-sky-300 font-semibold mb-3">Competitor Analysis is a Max Tier Feature</p>
      <button
        onClick={onGoToSubscription}
        className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-colors text-sm"
      >
        Upgrade to Max Tier
      </button>
    </div>
  );

  return (
    <section className={`my-8 py-6 border-t border-b border-gray-700/50 bg-gray-800/20 rounded-lg shadow-xl animate-fadeInUp relative ${disabled || !isMaxTier ? 'opacity-70 cursor-not-allowed' : ''}`} style={{animationDelay: '0.2s'}}>
      {!isMaxTier && !disabled && <UpgradePrompt />}
      <h3 className={`text-xl md:text-2xl font-semibold mb-6 text-center font-orbitron ${disabled || !isMaxTier ? 'text-gray-500' : 'text-sky-300'}`}>
        {titleText}
      </h3>
      
      <fieldset disabled={!isMaxTier || disabled} className={`max-w-xl mx-auto px-4 ${!isMaxTier ? 'filter blur-sm' : ''}`}>
        {!currentCompetitorName && !showInput && (
          <button 
            onClick={toggleShowInput} 
            disabled={isLoading || disabled || !isMaxTier}
            className={`w-full flex items-center justify-center px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 group text-base font-orbitron tracking-wider animate-fadeInUp
              ${disabled || !isMaxTier
                ? 'bg-gray-700 cursor-not-allowed' 
                : 'bg-sky-600 hover:bg-sky-500 focus:ring-sky-400 focus:ring-offset-gray-900'
              }
            `}
            style={{animationDelay: '0.1s'}}
            title={disabled ? "Analyze your main product before adding a competitor." : !isMaxTier ? "Upgrade to Max Tier to add competitor." : "Add Competitor Product"}
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-2 opacity-80 group-hover:opacity-100 transition-opacity" />
            Add Competitor Product
          </button>
        )}

        {(isFormEffectivelyVisible || currentCompetitorName) && (
          <div className="space-y-6">
            {currentCompetitorName && !showInput && isMaxTier && ( 
              <p className="text-center text-gray-300 font-roboto-mono animate-fadeInUp">
                Currently analyzing against: <span className="font-semibold text-sky-400">{currentCompetitorName}</span>
              </p>
            )}
            
            <div className={`${formAnimationClass} ${!showInput && formAnimationClass !== 'competitor-form-leave-active' ? 'competitor-form-hidden' : ''}`}>
              {showInput && isMaxTier && ( 
                <form onSubmit={handleAnalyzeClick} className="space-y-4">
                  <label htmlFor="competitorNameInput" className="block text-md font-medium text-sky-200 text-center font-roboto-mono">
                    {currentCompetitorName ? `Change Competitor (was: ${currentCompetitorName})` : 'Enter Competitor Product Name'}
                  </label>
                  <div className="relative flex items-center group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none opacity-50 group-focus-within:opacity-100 group-focus-within:text-sky-400 transition-opacity duration-300">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-sky-400" />
                    </div>
                    <input
                      type="text"
                      id="competitorNameInput"
                      value={competitorInput}
                      onChange={(e) => setCompetitorInput(e.target.value)}
                      placeholder="e.g., Samsung Galaxy Z, Pixel Slate"
                      disabled={isLoading || disabled || !isMaxTier}
                      className="w-full pl-10 pr-32 sm:pr-36 py-3.5 text-gray-100 bg-gray-800/80 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-lg placeholder-gray-500 disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !competitorInput.trim() || disabled || !isMaxTier}
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
                  {isLoading && <p className="text-sm text-sky-400/80 mt-2 text-center animate-pulse font-roboto-mono">Holmes is observing the competitor...</p>}
                </form>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fadeInUp" style={{animationDelay: showInput ? '0.1s' : '0s'}}>
              {currentCompetitorName && isMaxTier && (
                <button 
                  onClick={toggleShowInput} 
                  disabled={isLoading || disabled}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50"
                >
                  {showInput ? 'Cancel Change' : 'Change Competitor'}
                </button>
              )}
              {currentCompetitorName && isMaxTier && (
                <button 
                  onClick={handleClearClick} 
                  disabled={isLoading || disabled}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-700 text-white font-medium rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50"
                >
                  Clear Comparison
                </button>
              )}
              {!currentCompetitorName && showInput && isMaxTier && ( 
                 <button 
                  onClick={toggleShowInput} 
                  disabled={isLoading || disabled}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:opacity-50"
                >
                    Cancel
                </button>
              )}
            </div>
          </div>
        )}
      </fieldset>
    </section>
  );
};

export default CompetitorControls;
