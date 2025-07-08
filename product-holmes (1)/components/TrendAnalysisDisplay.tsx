
import React, { useMemo } from 'react';
import { Issue } from '../types';
import { Pie, Bar } from 'react-chartjs-2';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { LockIcon } from './icons/LockIcon';

interface TrendAnalysisDisplayProps {
  filteredIssues: Issue[];
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const TrendAnalysisDisplay: React.FC<TrendAnalysisDisplayProps> = ({
  filteredIssues,
  selectedPlan,
  onGoToSubscription,
}) => {
  const isMaxTier = selectedPlan === 'max';

  const categoryData = useMemo(() => {
    if (!filteredIssues.length) return null;
    const counts: { [key: string]: number } = {};
    filteredIssues.forEach(issue => {
      counts[issue.category] = (counts[issue.category] || 0) + 1;
    });
    const labels = Object.keys(counts);
    const data = Object.values(counts);
    return {
      labels,
      datasets: [{
        label: 'Issues by Category',
        data,
        backgroundColor: [
          'rgba(2, 132, 199, 0.7)', // sky-600
          'rgba(14, 165, 233, 0.7)', // sky-500
          'rgba(56, 189, 248, 0.7)', // sky-400
          'rgba(125, 211, 252, 0.7)', // sky-300
          'rgba(14, 116, 144, 0.7)', // cyan-600
          'rgba(20, 184, 166, 0.7)', // teal-500
          'rgba(13, 148, 136, 0.7)', // teal-600
        ],
        borderColor: [
          'rgba(2, 132, 199, 1)',
          'rgba(14, 165, 233, 1)',
          'rgba(56, 189, 248, 1)',
          'rgba(125, 211, 252, 1)',
          'rgba(14, 116, 144, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(13, 148, 136, 1)',
        ],
        borderWidth: 1,
      }],
    };
  }, [filteredIssues]);

  const issuesOverTimeData = useMemo(() => {
    if (!filteredIssues.length) return null;
    const countsByMonth: { [key: string]: number } = {};
    const monthYearFormat = new Intl.DateTimeFormat('en-US', { year: '2-digit', month: 'short' });

    filteredIssues.forEach(issue => {
      try {
        const date = new Date(issue.lastDetected);
        // Ensure month is 2 digits (e.g., 01 for Jan, 11 for Nov) for sorting
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        countsByMonth[monthKey] = (countsByMonth[monthKey] || 0) + 1;
      } catch (e) {
        console.warn(`Invalid date for issue ${issue.id}: ${issue.lastDetected}`);
      }
    });

    const sortedMonthKeys = Object.keys(countsByMonth).sort();
    
    // Limit to last 12 months for readability
    const recentSortedMonthKeys = sortedMonthKeys.slice(-12);

    const labels = recentSortedMonthKeys.map(key => {
        const [year, month] = key.split('-');
        return monthYearFormat.format(new Date(parseInt(year), parseInt(month) -1, 1));
    });
    const data = recentSortedMonthKeys.map(key => countsByMonth[key]);

    if (labels.length < 2 && data.every(d => d ===0)) return null; // Not enough data for a meaningful trend

    return {
      labels,
      datasets: [{
        label: 'Issues Detected Over Time (Last 12 Months)',
        data,
        backgroundColor: 'rgba(14, 165, 233, 0.6)', // sky-500
        borderColor: 'rgba(2, 132, 199, 1)', // sky-600
        borderWidth: 2,
        fill: true,
        tension: 0.3,
      }],
    };
  }, [filteredIssues]);

  const chartOptions = (titleText: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#cbd5e1' /* gray-300 */ }
      },
      title: {
        display: true,
        text: titleText,
        color: '#e0f2fe', /* sky-100 */
        font: { size: 16, family: "'Orbitron', sans-serif" }
      },
      tooltip: {
        bodyFont: { family: "'Roboto Mono', monospace"},
        titleFont: { family: "'Roboto Mono', monospace"},
      }
    },
    scales: { // Only for Bar/Line charts
      y: {
        beginAtZero: true,
        ticks: { color: '#9ca3af' /* gray-400 */, stepSize: 1 },
        grid: { color: 'rgba(100, 116, 139, 0.2)' /* slate-500/20 */ }
      },
      x: {
        ticks: { color: '#9ca3af' /* gray-400 */ },
        grid: { color: 'rgba(100, 116, 139, 0.2)' /* slate-500/20 */ }
      }
    }
  });


  const UpgradePrompt = () => (
    <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 rounded-lg">
      <LockIcon className="w-12 h-12 text-sky-500 mb-4" />
      <p className="text-center text-sky-300 font-semibold mb-3">Trend Analysis is a Max Tier Feature</p>
      <button
        onClick={onGoToSubscription}
        className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-colors text-sm"
      >
        Upgrade to Max Tier
      </button>
    </div>
  );
  
  if (!filteredIssues.length && isMaxTier) {
    return (
       <div className="my-6 p-4 md:p-6 bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-xl text-center animate-fadeInUp">
         <ChartBarIcon className="w-10 h-10 mx-auto text-sky-500 mb-3" />
         <p className="text-sky-300 font-semibold">No issues match current filters.</p>
         <p className="text-gray-400 text-sm">Adjust filters or analyze a product to see trends.</p>
       </div>
    );
  }


  return (
    <div className="my-6 p-4 md:p-6 bg-gray-800/70 border border-gray-700/60 rounded-xl shadow-xl relative animate-fadeInUp">
       {!isMaxTier && <UpgradePrompt />}
       <fieldset disabled={!isMaxTier} className={!isMaxTier ? 'opacity-50' : ''}>
        <legend className="text-xl font-semibold text-sky-300 mb-6 flex items-center justify-center font-orbitron">
            <ChartBarIcon className="w-6 h-6 mr-3 text-sky-400" />
            Issue Trend Analysis
        </legend>
        {isMaxTier && !filteredIssues.length && (
             <p className="text-center text-gray-400 py-8">No issues to display trends for.</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {categoryData && (
            <div className="bg-gray-700/30 p-4 rounded-lg shadow-inner min-h-[300px] md:min-h-[350px]">
              <Pie data={categoryData} options={chartOptions('Issue Distribution by Category')} />
            </div>
          )}
          {issuesOverTimeData && (
            <div className="bg-gray-700/30 p-4 rounded-lg shadow-inner min-h-[300px] md:min-h-[350px]">
              <Bar data={issuesOverTimeData} options={chartOptions('Issues Detected Over Time')} />
            </div>
          )}
        </div>
        {!categoryData && !issuesOverTimeData && isMaxTier && filteredIssues.length > 0 && (
            <p className="text-center text-gray-400 py-8">Not enough distinct data to display charts based on current filters.</p>
        )}
       </fieldset>
    </div>
  );
};

export default TrendAnalysisDisplay;
