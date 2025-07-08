
import React from 'react';
import * as XLSX from 'xlsx';
import { Issue, Source, SourceType } from '../types';
import { CsvIcon } from './icons/CsvIcon';
import { ExcelIcon } from './icons/ExcelIcon';
import { SOURCE_TYPE_DISPLAY_NAMES } from '../constants';
import { LockIcon } from './icons/LockIcon'; // For upgrade prompt

interface ExportControlsProps {
  issues: Issue[];
  productName: string;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const MAX_SOURCES_COLUMNS = 3;

const escapeCsvCell = (cellData: any): string => {
  if (cellData === null || cellData === undefined) {
    return '';
  }
  const stringData = String(cellData);
  if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
    return `"${stringData.replace(/"/g, '""')}"`;
  }
  return stringData;
};

const ExportControls: React.FC<ExportControlsProps> = ({ 
  issues, 
  productName,
  selectedPlan,
  onGoToSubscription
}) => {
  const getSafeFilename = (name: string) => name.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();

  const isFreeTier = selectedPlan === 'free';

  const handleExportCSV = () => {
    if (isFreeTier) return;
    const sourceTypesOrder: SourceType[] = [
      SourceType.Tweets,
      SourceType.RedditPosts,
      SourceType.TrustpilotPosts,
      SourceType.YouTube,
      SourceType.GoogleArticles,
    ];

    const headers = [
      'ID', 'Description', 'Category', 'Last Detected', 'Total Occurrences',
      ...sourceTypesOrder.map(st => `${SOURCE_TYPE_DISPLAY_NAMES[st]} Occurrences`),
    ];
    for (let i = 1; i <= MAX_SOURCES_COLUMNS; i++) {
      headers.push(`Source ${i} Type`, `Source ${i} Title`, `Source ${i} URL`);
    }

    const rows = issues.map(issue => {
      const rowBase = [
        escapeCsvCell(issue.id),
        escapeCsvCell(issue.description),
        escapeCsvCell(issue.category),
        escapeCsvCell(new Date(issue.lastDetected).toLocaleDateString('en-CA')),
        escapeCsvCell(issue.totalOccurrences),
      ];
      
      const occurrenceDetailCells = sourceTypesOrder.map(st => 
        escapeCsvCell(issue.occurrenceDetails?.[st] || 0)
      );

      const sourceCells: string[] = [];
      for (let i = 0; i < MAX_SOURCES_COLUMNS; i++) {
        const source = issue.sources[i];
        sourceCells.push(
          escapeCsvCell(source ? SOURCE_TYPE_DISPLAY_NAMES[source.type as SourceType] || source.type : ''),
          escapeCsvCell(source ? source.title : ''),
          escapeCsvCell(source ? source.url : '')
        );
      }
      return [...rowBase, ...occurrenceDetailCells, ...sourceCells].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${getSafeFilename(productName)}_issues.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleExportXLSX = () => {
    if (isFreeTier) return;
     const sourceTypesOrder: SourceType[] = [
      SourceType.Tweets,
      SourceType.RedditPosts,
      SourceType.TrustpilotPosts,
      SourceType.YouTube,
      SourceType.GoogleArticles,
    ];

    const dataForExcel = issues.map(issue => {
      const row: {[key: string]: any} = {
        'ID': issue.id,
        'Description': issue.description,
        'Category': issue.category,
        'Last Detected': new Date(issue.lastDetected),
        'Total Occurrences': issue.totalOccurrences,
      };

      sourceTypesOrder.forEach(st => {
        row[`${SOURCE_TYPE_DISPLAY_NAMES[st]} Occurrences`] = issue.occurrenceDetails?.[st] || 0;
      });

      issue.sources.slice(0, MAX_SOURCES_COLUMNS).forEach((source, i) => {
        row[`Source ${i + 1} Type`] = SOURCE_TYPE_DISPLAY_NAMES[source.type as SourceType] || source.type;
        row[`Source ${i + 1} Title`] = source.title;
        row[`Source ${i + 1} URL`] = source.url;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    
    const headersFromJson = XLSX.utils.sheet_to_json(worksheet, {header:1})[0] as string[];
    const dateColumnIndex = headersFromJson.findIndex(header => header === 'Last Detected');

    if (dateColumnIndex !== -1) {
        const dateColumnLetter = XLSX.utils.encode_col(dateColumnIndex);
         Object.keys(worksheet).forEach(cellAddress => {
            if (cellAddress.startsWith(dateColumnLetter) && cellAddress !== `${dateColumnLetter}1`) { 
                 if (worksheet[cellAddress].v instanceof Date) {
                    worksheet[cellAddress].t = 'd'; 
                    worksheet[cellAddress].z = 'yyyy-mm-dd'; 
                } else if (typeof worksheet[cellAddress].v === 'string' && !isNaN(new Date(worksheet[cellAddress].v as string).getTime())) {
                    // Attempt to convert string to Date if it's a valid date string
                    const dateVal = new Date(worksheet[cellAddress].v as string);
                    if (!isNaN(dateVal.getTime())) { // Check if conversion was successful
                         worksheet[cellAddress].v = dateVal;
                         worksheet[cellAddress].t = 'd';
                         worksheet[cellAddress].z = 'yyyy-mm-dd';
                    }
                }
            }
        });
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Issues');
    XLSX.writeFile(workbook, `${getSafeFilename(productName)}_issues.xlsx`);
  };

  const UpgradePrompt = () => (
    <div className="absolute inset-0 bg-gray-800/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 rounded-lg">
      <LockIcon className="w-10 h-10 text-sky-500 mb-3" />
      <p className="text-center text-sky-300 font-semibold mb-2 text-sm">Data Export is a Pro/Max Tier Feature</p>
      <button
        onClick={onGoToSubscription}
        className="px-3 py-1.5 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-colors text-xs"
      >
        Upgrade Plan
      </button>
    </div>
  );

  return (
    <div className="my-6 p-4 bg-gray-800/50 border border-gray-700/60 rounded-lg shadow-md relative">
      {isFreeTier && <UpgradePrompt />}
      <fieldset disabled={isFreeTier} className={isFreeTier ? 'opacity-50 filter blur-sm' : ''}>
        <h3 className="text-lg font-semibold text-sky-300 mb-4 text-center font-orbitron">Export Intel</h3>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleExportCSV}
            aria-label="Export issues as CSV"
            disabled={isFreeTier}
            className="flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white font-medium rounded-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 group w-full sm:w-auto disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <CsvIcon className="w-5 h-5 mr-2 opacity-90 group-hover:opacity-100" />
            Export as CSV
          </button>
          <button
            onClick={handleExportXLSX}
            aria-label="Export issues as XLSX (Excel)"
            disabled={isFreeTier}
            className="flex items-center justify-center px-5 py-2.5 bg-green-600 text-white font-medium rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 group w-full sm:w-auto disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <ExcelIcon className="w-5 h-5 mr-2 opacity-90 group-hover:opacity-100" />
            Export as XLSX
          </button>
        </div>
      </fieldset>
    </div>
  );
};

export default ExportControls;
