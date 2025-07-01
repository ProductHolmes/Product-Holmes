
import React, { useMemo } from 'react';
import { FilterState, SourceType, Issue } from '../types';
import { SOURCE_TYPE_DISPLAY_NAMES } from '../constants';
import { FilterIcon } from './icons/FilterIcon';
import { TrashIcon } from './icons/TrashIcon'; // For Clear Filters
import { LockIcon } from './icons/LockIcon';

interface FilterControlsProps {
  filters: FilterState;
  onFiltersChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  allIssues: Issue[]; // Used to derive categories and source types
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  allIssues,
  selectedPlan,
  onGoToSubscription,
}) => {
  const isMaxTier = selectedPlan === 'max';

  const availableCategories = useMemo(() => {
    const categories = new Set(allIssues.map(issue => issue.category));
    return Array.from(categories).sort();
  }, [allIssues]);

  const availableSourceTypes = useMemo(() => {
    const sourceTypes = new Set<SourceType>();
    allIssues.forEach(issue => {
      issue.sources.forEach(source => sourceTypes.add(source.type));
      if (issue.occurrenceDetails) {
         Object.keys(issue.occurrenceDetails).forEach(st => sourceTypes.add(st as SourceType));
      }
    });
    return Array.from(sourceTypes).sort((a,b) => (SOURCE_TYPE_DISPLAY_NAMES[a] || a).localeCompare(SOURCE_TYPE_DISPLAY_NAMES[b] || b));
  }, [allIssues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFiltersChange({ [name]: value === '' ? null : value });
  };

  const UpgradePrompt = () => (
    <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 rounded-lg">
      <LockIcon className="w-12 h-12 text-sky-500 mb-4" />
      <p className="text-center text-sky-300 font-semibold mb-3">Advanced Filtering is a Max Tier Feature</p>
      <button
        onClick={onGoToSubscription}
        className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-colors text-sm"
      >
        Upgrade to Max Tier
      </button>
    </div>
  );

  return (
    <div className="my-6 p-4 md:p-6 bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-xl relative animate-fadeInUp">
      {!isMaxTier && <UpgradePrompt />}
      <fieldset disabled={!isMaxTier} className={!isMaxTier ? 'opacity-50' : ''}>
        <legend className="text-xl font-semibold text-sky-300 mb-6 flex items-center justify-center font-orbitron">
          <FilterIcon className="w-6 h-6 mr-3 text-sky-400" />
          Advanced Issue Filters
        </legend>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
          {/* Keyword Search */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-300 mb-1 font-roboto-mono">
              Keyword in Description
            </label>
            <input
              type="text"
              name="keyword"
              id="keyword"
              value={filters.keyword}
              onChange={handleInputChange}
              placeholder="e.g., battery, crash, slow"
              className="w-full px-3 py-2.5 text-gray-100 bg-gray-700/60 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors shadow-sm placeholder-gray-400"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1 font-roboto-mono">
              Category
            </label>
            <select
              name="category"
              id="category"
              value={filters.category || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-gray-100 bg-gray-700/60 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors shadow-sm appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}

            >
              <option value="">All Categories</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Source Type Filter */}
          <div>
            <label htmlFor="sourceType" className="block text-sm font-medium text-gray-300 mb-1 font-roboto-mono">
              Source Type
            </label>
            <select
              name="sourceType"
              id="sourceType"
              value={filters.sourceType || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-gray-100 bg-gray-700/60 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors shadow-sm appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="">All Source Types</option>
              {availableSourceTypes.map(st => (
                <option key={st} value={st}>{SOURCE_TYPE_DISPLAY_NAMES[st] || st}</option>
              ))}
            </select>
          </div>

          {/* Date Range Start */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1 font-roboto-mono">
              Detected After
            </label>
            <input
              type="date"
              name="startDate"
              id="startDate"
              value={filters.startDate || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-gray-100 bg-gray-700/60 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors shadow-sm"
              style={{ colorScheme: 'dark' }} // Improves date picker appearance in dark mode
            />
          </div>

          {/* Date Range End */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1 font-roboto-mono">
              Detected Before
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={filters.endDate || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 text-gray-100 bg-gray-700/60 border border-gray-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition-colors shadow-sm"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          
          {/* Clear Filters Button */}
          <div className="lg:col-start-3 flex items-end">
            <button
              type="button"
              onClick={onClearFilters}
              className="w-full flex items-center justify-center px-4 py-2.5 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-150 group"
              title="Clear all filters"
            >
              <TrashIcon className="w-5 h-5 mr-2 opacity-80 group-hover:opacity-100" />
              Clear Filters
            </button>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default FilterControls;
