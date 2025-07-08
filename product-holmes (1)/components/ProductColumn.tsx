
import React from 'react';
import { Issue } from '../types';
import IssueCard from './IssueCard';
import ExportControls from './ExportControls';
import LoadingSpinner from './LoadingSpinner';
import { CheckIcon } from './icons/CheckIcon'; // For "no issues" state

interface ProductColumnProps {
  productName: string;
  issues: Issue[];
  onResolveIssue: (issueId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  isPrimary: boolean; 
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const ProductColumn: React.FC<ProductColumnProps> = ({
  productName,
  issues,
  onResolveIssue,
  isLoading,
  error,
  isPrimary,
  selectedPlan,
  onGoToSubscription,
}) => {
  const columnTitleText = isPrimary ? `Primary Intel: ` : `Competitor Intel: `;
  const scrollbarClassName = isPrimary ? 'custom-scrollbar-primary' : 'custom-scrollbar-competitor';

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-700/50 rounded-lg bg-gray-800/40 backdrop-blur-sm shadow-xl animate-scaleInSlightly">
        <h2 className="text-2xl font-bold text-center mb-6">
          <span className="text-gray-300 font-orbitron">{columnTitleText}</span>
          <span className="text-sky-400 font-orbitron">{productName}</span>
        </h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-700/50 rounded-lg bg-red-900/30 backdrop-blur-sm shadow-xl animate-scaleInSlightly">
        <h2 className="text-2xl font-bold text-center mb-4">
          <span className="text-red-300 font-orbitron">{columnTitleText}</span>
          <span className="text-red-400 font-orbitron">{productName}</span>
        </h2>
        <div className="my-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center shadow-lg animate-slideDownAndFadeInTiny" role="alert">
            <h3 className="text-lg font-semibold text-red-300 mb-1 font-orbitron">Analysis Alert</h3>
            <p className="text-red-300 text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  if (issues.length === 0) {
    return (
      <div className="p-4 border border-gray-700/50 rounded-lg bg-gray-800/40 backdrop-blur-sm shadow-xl text-center min-h-[300px] flex flex-col justify-center animate-scaleInSlightly">
        <h2 className="text-2xl font-bold text-center mb-6 animate-fadeInUp">
          <span className="text-gray-300 font-orbitron">{columnTitleText}</span>
          <span className={`${isPrimary ? 'text-sky-400' : 'text-teal-400'} font-orbitron`}>{productName}</span>
        </h2>
        <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <CheckIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
          {isPrimary ? (
            <>
              <h3 className="text-xl font-semibold text-gray-100 mb-2 font-orbitron">All Clear, Detective!</h3>
              <p className="text-md text-sky-300/90 mt-1 mb-2 font-orbitron">
                  Uncover. Understand. Upgrade.
              </p>
              <p className="text-lg text-gray-300 max-w-md mx-auto leading-relaxed">
                Brilliant! It looks like <span className="font-semibold text-sky-300">"{productName}"</span> doesn’t have any negative feedback currently on our radar.
              </p>
              <p className="text-gray-400 text-sm mt-3 font-roboto-mono">
                This is excellent news. You can always investigate another product or Holmes will continue his watch.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-gray-100 mb-2 font-orbitron">Competitor Status: Clear</h3>
               <p className="text-md text-teal-300/90 mt-1 mb-2 font-orbitron">
                  Uncover. Understand. Upgrade.
              </p>
              <p className="text-gray-300 max-w-md mx-auto leading-relaxed">
                No significant issues found for <span className="font-semibold text-teal-300">"{productName}"</span> based on this scan.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3 md:p-4 border rounded-lg shadow-2xl backdrop-blur-sm animate-scaleInSlightly ${isPrimary ? 'border-sky-600/50 bg-gray-800/50' : 'border-teal-600/50 bg-gray-800/40'}`}>
      <h2 className="text-xl md:text-2xl font-bold text-center mb-6 animate-fadeInUp">
        <span className={`font-orbitron ${isPrimary ? 'text-gray-100' : 'text-gray-200'}`}>{columnTitleText}</span>
        <span className={`font-orbitron ${isPrimary ? 'text-sky-400' : 'text-teal-400'}`}>{productName}</span>
      </h2>
      
      <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <ExportControls 
          issues={issues} 
          productName={productName}
          selectedPlan={selectedPlan}
          onGoToSubscription={onGoToSubscription}
        />
      </div>

      <div className={`space-y-6 mt-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar-column ${scrollbarClassName}`}>
        {issues.map((issue, index) => (
          <IssueCard 
            key={issue.id} 
            issue={issue} 
            onResolve={onResolveIssue} 
            style={{ animationDelay: `${index * 0.08 + 0.2}s` }} // Staggered, slightly faster for columns
          />
        ))}
      </div>
        <style>
            {`
            .custom-scrollbar-column::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            .custom-scrollbar-column::-webkit-scrollbar-track {
                background: #1f2937; /* bg-gray-800 or similar dark */
            }
            .custom-scrollbar-primary::-webkit-scrollbar-thumb {
                background: #0ea5e9; /* sky-500 */
                border-radius: 3px;
            }
            .custom-scrollbar-primary::-webkit-scrollbar-thumb:hover {
                background: #0284c7; /* sky-600 */
            }
            .custom-scrollbar-primary {
              scrollbar-color: #0ea5e9 #1f2937; /* thumb track for Firefox */
            }

            .custom-scrollbar-competitor::-webkit-scrollbar-thumb {
                background: #14b8a6; /* teal-500 */
                border-radius: 3px;
            }
            .custom-scrollbar-competitor::-webkit-scrollbar-thumb:hover {
                background: #0d9488; /* teal-600 */
            }
            .custom-scrollbar-competitor {
              scrollbar-color: #14b8a6 #1f2937; /* thumb track for Firefox */
            }
        `}
        </style>
         <p className="text-xs text-gray-500/80 text-center mt-8 italic font-roboto-mono animate-fadeInUp" style={{ animationDelay: `${issues.length * 0.08 + 0.3}s` }}>
           Intel for "{productName}" is based on conceptual sources.
        </p>
    </div>
  );
};

export default ProductColumn;
