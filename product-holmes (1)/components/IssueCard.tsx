
import React, { useState } from 'react';
import { Issue, OccurrenceDetails, SourceType } from '../types';
import SourceLink from './SourceLink';
import { CheckIcon } from './icons/CheckIcon'; // Import the new icon
import { SOURCE_TYPE_DISPLAY_NAMES } from '../constants';

interface IssueCardProps {
  issue: Issue & { occurrences?: number }; // Allow old 'occurrences' for fallback from very old data
  onResolve: (issueId: string) => void;
  style?: React.CSSProperties; // For animation delay
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onResolve, style }) => {
  const [isVanishing, setIsVanishing] = useState(false);

  const getCategoryChipStyle = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('bug')) return 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30';
    if (lowerCategory.includes('negative')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 hover:bg-yellow-500/30';
    if (lowerCategory.includes('feature')) return 'bg-green-500/20 text-green-300 border-green-500/40 hover:bg-green-500/30';
    return 'bg-gray-600/20 text-gray-300 border-gray-500/40 hover:bg-gray-600/30';
  };

  const handleResolveClick = () => {
    setIsVanishing(true);
    setTimeout(() => {
      onResolve(issue.id);
    }, 500); // Duration matches CSS animation
  };

  const renderOccurrences = () => {
    if (issue.occurrenceDetails && issue.totalOccurrences !== undefined) {
      const detailsExist = Object.values(issue.occurrenceDetails).some(count => count && count > 0);
      return (
        <>
          <p>Total Occurrences: <span className="font-semibold text-gray-300">{issue.totalOccurrences}</span></p>
          {detailsExist && (
            <div className="text-xs mt-1.5 pl-1">
              <ul className="list-none space-y-0.5 mt-1">
                {(Object.keys(issue.occurrenceDetails) as SourceType[]).map((type) => {
                  const count = issue.occurrenceDetails[type];
                  if (count && count > 0) {
                    return (
                      <li key={type} className="text-gray-400/80">
                        <span className="capitalize">{SOURCE_TYPE_DISPLAY_NAMES[type] || type}:</span>
                        <span className="font-semibold text-gray-300/90 ml-1.5">{count}</span>
                      </li>
                    );
                  }
                  return null;
                })}
              </ul>
            </div>
          )}
        </>
      );
    } else if (issue.occurrences !== undefined) { // Fallback for very old data format
      return <p>Occurrences: <span className="font-semibold text-gray-300">{issue.occurrences}</span></p>;
    }
    return <p>Occurrences: <span className="font-semibold text-gray-300">N/A</span></p>;
  };


  return (
    <div 
      style={style}
      className={`bg-gray-800/60 backdrop-blur-sm p-5 md:p-6 rounded-xl shadow-2xl border border-gray-700/70 hover:border-sky-500/60 transition-all duration-300 group relative overflow-hidden card-hover-lift ${isVanishing ? 'issue-card-vanishing' : ''} ${!isVanishing && style ? 'animate-fadeInUpStaggered' : ''}`}
    >
      <button
        onClick={handleResolveClick}
        disabled={isVanishing}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full text-gray-400 hover:text-green-400 focus:text-green-400 hover:bg-gray-700/70 focus:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all duration-200"
        aria-label="Resolve issue"
        title="Mark as Resolved"
      >
        <CheckIcon className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 pr-14">
        <h3 className="text-lg md:text-xl font-semibold text-sky-300 group-hover:text-sky-200 transition-colors duration-200 mb-2 sm:mb-0 sm:mr-10 flex-grow">
          {issue.description}
        </h3>
        <span className={`text-xs font-medium px-3 py-1 rounded-full border whitespace-nowrap ${getCategoryChipStyle(issue.category)} transition-colors duration-200`}>
          {issue.category}
        </span>
      </div>
      
      <div className="mb-4 text-sm text-gray-400 font-roboto-mono space-y-1">
        {renderOccurrences()}
        <p>Last Detected: <span className="font-semibold text-gray-300">{new Date(issue.lastDetected).toLocaleDateString('en-GB')}</span></p>
      </div>

      {issue.sources.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-sm font-medium text-sky-400/90 mb-1.5 font-roboto-mono">Evidence Trails:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {issue.sources.map(source => <SourceLink key={source.id} source={source} />)}
          </div>
        </div>
      )}
       {issue.sources.length === 0 && (
          <p className="text-xs text-gray-500 font-roboto-mono italic">No specific public sources cited for this consolidated finding.</p>
       )}
       <div className="mt-5 h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent group-hover:via-sky-600/50 transition-all duration-300"></div>
    </div>
  );
};

export default IssueCard;