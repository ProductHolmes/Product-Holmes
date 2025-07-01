

import React, { useState, useEffect } from 'react';
import { LockIcon } from './icons/LockIcon'; // For upgrade button

interface WeeklyScanTimerProps {
  productName: string;
  nextScanTimestamp: number | null;
  isScanning: boolean;
  selectedPlan: string | null;
  onGoToSubscription: () => void;
}

const formatTimeLeft = (ms: number): string => {
  if (ms <= 0) return "Scanning soon or overdue...";

  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  seconds %= 60;
  minutes %= 60;
  hours %= 24;
  
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};

const WeeklyScanTimer: React.FC<WeeklyScanTimerProps> = ({ 
  productName, 
  nextScanTimestamp, 
  isScanning,
  selectedPlan,
  onGoToSubscription
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (selectedPlan === 'free' || !nextScanTimestamp) {
      setTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      setTimeLeft(Math.max(0, nextScanTimestamp - now));
    };

    calculateTimeLeft(); // Initial calculation
    const intervalId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [nextScanTimestamp, selectedPlan]);

  if (selectedPlan === 'free') {
    return (
      <div className="text-sm font-roboto-mono p-4 bg-gray-800/50 border border-gray-700/60 rounded-lg shadow-md text-center">
        <p className="text-gray-300 mb-2">
          Product: <span className="font-semibold text-sky-400">{productName}</span>
        </p>
        <p className="text-yellow-400 mb-3">
          Automated weekly scans are available on Pro & Max tiers. You are currently on the Free tier (manual analysis only).
        </p>
        <div className="flex justify-center">
            <button
            onClick={onGoToSubscription}
            className="flex items-center justify-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-colors text-xs"
            >
            <LockIcon className="w-4 h-4 mr-2" />
            Upgrade Plan for Automated Scans
            </button>
        </div>
      </div>
    );
  }

  if (isScanning) {
    return (
      <p className="text-sm text-sky-400 font-roboto-mono animate-pulse">
        Holmes is performing an automatic check for new insights on "{productName}"...
      </p>
    );
  }
  
  if (!nextScanTimestamp || timeLeft <= 0 && !isScanning) {
     return (
      <p className="text-sm text-yellow-400 font-roboto-mono animate-urgentPulse">
        Automatic update for "{productName}" pending or will start soon.
      </p>
    );
  }

  return (
    <div className="text-sm font-roboto-mono">
      <p className="text-gray-400">
        Next automated update for <span className="font-semibold text-sky-400">{productName}</span> in:
      </p>
      <p className="text-lg text-sky-300 tracking-wider">{formatTimeLeft(timeLeft)}</p>
    </div>
  );
};

export default WeeklyScanTimer;
