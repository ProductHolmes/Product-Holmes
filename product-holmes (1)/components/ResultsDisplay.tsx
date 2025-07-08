
import React, { useMemo } from 'react';
import { Issue, FilterState, SourceType } from '../types';
import IssueCard from './IssueCard';
import ExportControls from './ExportControls';
import FilterControls from './FilterControls';
import TrendAnalysisDisplay from './TrendAnalysisDisplay';
import { CheckIcon } from './icons/CheckIcon'; 
import { FilterIcon } from './icons/FilterIcon'; // Added import

interface ResultsDisplayProps {
  issues: Issue[];
  productName: string;
  onResolveIssue: (issueId: string) => void;
  selectedPlan: string | null;
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  onGoToSubscription: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  issues, 
  productName, 
  onResolveIssue,
  selectedPlan,
  filters,
  onFiltersChange,
  onClearFilters,
  onGoToSubscription
}) => {

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const keywordMatch = filters.keyword 
        ? issue.description.toLowerCase().includes(filters.keyword.toLowerCase())
        : true;
      const categoryMatch = filters.category 
        ? issue.category === filters.category
        : true;
      const sourceTypeMatch = filters.sourceType
        ? issue.sources.some(s => s.type === filters.sourceType) || 
          (issue.occurrenceDetails && issue.occurrenceDetails[filters.sourceType as SourceType] && issue.occurrenceDetails[filters.sourceType as SourceType]! > 0)
        : true;
      
      let dateMatch = true;
      if (filters.startDate || filters.endDate) {
        try {
          const issueDate = new Date(issue.lastDetected);
          // Set hours to 0 to compare dates only, not time
          issueDate.setHours(0,0,0,0); 

          if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            startDate.setHours(0,0,0,0);
            if (issueDate < startDate) dateMatch = false;
          }
          if (filters.endDate && dateMatch) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(0,0,0,0);
            if (issueDate > endDate) dateMatch = false;
          }
        } catch (e) {
          console.warn("Error parsing date for filtering:", issue.lastDetected, e);
          // If date is invalid, don't filter it out by date by default, or handle as needed
        }
      }
      return keywordMatch && categoryMatch && sourceTypeMatch && dateMatch;
    });
  }, [issues, filters]);

  const noOriginalIssues = issues.length === 0;
  const noFilteredIssues = filteredIssues.length === 0 && !noOriginalIssues;


  if (noOriginalIssues) {
    return (
      <div className="text-center py-12 px-4 animate-fadeInUp">
        <CheckIcon className="w-20 h-20 mx-auto text-green-500 mb-6" />
        <h2 className="text-2xl font-semibold text-gray-100 mb-3 font-orbitron">All Clear, Detective!</h2>
        <p className="text-md text-sky-300/90 mt-1 mb-3 font-orbitron">
            Uncover. Understand. Upgrade.
        </p>
        <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
          Brilliant! It looks like <span className="font-semibold text-sky-300">"{productName}"</span> doesn’t have any negative feedback currently on our radar.
        </p>
        <p className="text-gray-400 text-sm mt-4 font-roboto-mono">
          This is excellent news. You can always investigate another product or Holmes will continue his watch.
        </p>
      </div>
    );
  }

  return (
    <section className="px-0 md:px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-4 animate-fadeInUp">
        <span className="text-gray-100 font-orbitron">Intel Report: </span>
        <span className="text-sky-400 font-orbitron">{productName}</span>
      </h2>
      
      <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <ExportControls 
          issues={filteredIssues} 
          productName={productName} 
          selectedPlan={selectedPlan}
          onGoToSubscription={onGoToSubscription}
        />
      </div>

      <FilterControls 
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
        allIssues={issues} // Pass original issues to derive filter options
        selectedPlan={selectedPlan}
        onGoToSubscription={onGoToSubscription}
      />

      <TrendAnalysisDisplay
        filteredIssues={filteredIssues} // Pass filtered issues for trend calculation
        selectedPlan={selectedPlan}
        onGoToSubscription={onGoToSubscription}
      />
      
      {noFilteredIssues && (
        <div className="text-center py-12 px-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <FilterIcon className="w-20 h-20 mx-auto text-sky-500 mb-6" />
            <h2 className="text-2xl font-semibold text-gray-100 mb-3 font-orbitron">No Matching Clues</h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto leading-relaxed">
            Holmes couldn't find any issues matching your current filter criteria for <span className="font-semibold text-sky-300">"{productName}"</span>.
            </p>
            <p className="text-gray-400 text-sm mt-4 font-roboto-mono">
            Try adjusting your filters or clearing them to see all intel.
            </p>
        </div>
      )}

      {!noFilteredIssues && (
        <>
          <div className="max-w-4xl mx-auto space-y-8 mt-6">
            {filteredIssues.map((issue, index) => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                onResolve={onResolveIssue} 
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }} // Staggered animation
              />
            ))}
          </div>
          <p className="text-xs text-gray-500/80 text-center mt-12 italic font-roboto-mono animate-fadeInUp" style={{ animationDelay: `${filteredIssues.length * 0.1 + 0.3}s` }}>
            Disclaimer: Source data may be AI-generated or aggregated. Intelligence is gathered from conceptual sources and updated conceptually, avoiding redundant entries.
            Displaying {filteredIssues.length} of {issues.length} total issues for "{productName}".
          </p>
        </>
      )}
    </section>
  );
};

export default ResultsDisplay;