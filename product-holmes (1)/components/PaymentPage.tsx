
import React, { useState, useEffect, useRef } from 'react';
import { LockIcon } from './icons/LockIcon'; 
import { UserIcon } from './icons/UserIcon';
import { StarIcon } from './icons/StarIcon'; // For plan display

interface PaymentPageProps {
  selectedPlan: string | null;
  onPaymentSuccess: () => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ selectedPlan, onPaymentSuccess }) => {
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [country, setCountry] = useState('');
  const [specialCode, setSpecialCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const cardholderNameInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    cardholderNameInputRef.current?.focus();
  }, []);

  const getPlanDisplayName = (planKey: string | null): string => {
    if (!planKey) return 'N/A';
    if (planKey.toLowerCase() === 'free') return 'Free Tier';
    if (planKey.toLowerCase() === 'pro') return 'Pro Tier ($149/month)';
    if (planKey.toLowerCase() === 'max') return 'Max Tier ($299/month)';
    return planKey;
  };

  const handleSpecialCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpecialCode(e.target.value);
    // Removed immediate processing from here
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);

    if (specialCode.trim().toUpperCase() === 'TRPOR11') {
      // Handle special code on submission
      setTimeout(() => {
        onPaymentSuccess();
        // setIsProcessing(false); // Not strictly necessary if navigating away
      }, 300); // Short delay for visual feedback
      return;
    }

    // Simulate network delay for "normal payment processing"
    setTimeout(() => {
      onPaymentSuccess();
      setIsProcessing(false);
    }, 1500);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      parts.push(cleaned.substring(i, i + 4));
    }
    return parts.join('-').substring(0, 19); // Max length for XXXX-XXXX-XXXX-XXXX
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned.substring(0,5);
  };

  const isSpecialCodeActive = specialCode.trim().toUpperCase() === 'TRPOR11';

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden screen-root-animate">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-sky-900/15 opacity-75 z-0"></div>
      <div className="absolute top-2 right-2 md:top-4 md:right-4 h-10 w-10 md:h-16 md:w-16 border-t-2 border-r-2 border-sky-600/50 rounded-tr-lg opacity-30 animate-pulse"></div>
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 h-10 w-10 md:h-16 md:w-16 border-b-2 border-l-2 border-sky-600/50 rounded-bl-lg opacity-30 animate-pulse"></div>

      <div className="relative z-10 w-full max-w-lg">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron">
            <span className="text-sky-400">Payment</span>
            <span className="text-gray-100"> Protocol</span>
          </h1>
          <p className="text-md text-sky-300/90 mt-2 tracking-normal font-orbitron">
            Uncover. Understand. Upgrade.
          </p>
          <p className="text-md md:text-lg text-sky-300/80 mt-3 tracking-wider font-roboto-mono">
            Finalize Your Subscription: <span className="text-yellow-400">{getPlanDisplayName(selectedPlan)}</span>
          </p>
        </header>

        <form 
          onSubmit={handleSubmit} 
          className="bg-gray-800/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700/70 space-y-5"
        >
          {/* Cardholder Name */}
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Cardholder Name
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-sky-400">
                <UserIcon className="h-5 w-5" />
              </span>
              <input
                ref={cardholderNameInputRef}
                type="text"
                id="cardholderName"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="Agent Name or Company Alias"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>
          
          {/* Fake Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Galactic Credit Unit (GCU) Number
            </label>
             <div className="relative group">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 group-focus-within:text-sky-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21z" />
                </svg>
              </span>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                maxLength={19}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
                Expiry (MM/YY)
              </label>
              <input
                type="text"
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                placeholder="MM/YY"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                maxLength={5}
                className="w-full px-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
            {/* CVV */}
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
                Secure Code (CVV)
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0,4))}
                placeholder="XXX"
                required={!isSpecialCodeActive}
                disabled={isProcessing || isSpecialCodeActive}
                maxLength={4}
                className="w-full px-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>
          
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your Organization or Alias"
              required={!isSpecialCodeActive}
              disabled={isProcessing || isSpecialCodeActive}
              className="w-full px-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
            />
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Country / Sector
            </label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g., Terra Prime, Mars Colony Alpha"
              disabled={isProcessing || isSpecialCodeActive}
              required={!isSpecialCodeActive}
              className="w-full px-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
            />
          </div>

          {/* Special Code */}
          <div>
            <label htmlFor="specialCode" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Agent Authorization Code (Optional)
            </label>
            <input
              type="text"
              id="specialCode"
              value={specialCode}
              onChange={handleSpecialCodeChange}
              placeholder="Enter if provided"
              disabled={isProcessing}
              className="w-full px-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={
              isProcessing || 
              (!isSpecialCodeActive && 
                (!cardholderName || !cardNumber || !expiryDate || !cvv || !companyName || !country))
            }
            className="w-full flex items-center justify-center px-6 py-3.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-gray-600/80 disabled:cursor-not-allowed group text-base font-orbitron tracking-wider"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Transaction...
              </>
            ) : (
             <> Confirm & Activate Plan <StarIcon className="w-5 h-5 ml-2.5 opacity-80 group-hover:opacity-100 transition-opacity"/> </>
            )}
          </button>
        </form>
         <p className="text-center text-xs text-gray-500/80 mt-8 font-roboto-mono">
          Note: This is a simulated payment interface. No real transaction will occur.
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
