
import React, { useState, useEffect, useRef } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { EmailIcon } from './icons/EmailIcon';

interface SignUpScreenProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ onSignUpSuccess, onNavigateToLogin }) => {
  const [companyName, setCompanyName] = useState('');
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [passwordMismatchError, setPasswordMismatchError] = useState<boolean>(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const companyNameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    companyNameInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSigningUp) return;

    setError(null);
    setPasswordMismatchError(false);

    if (password !== confirmPassword) {
      setPasswordMismatchError(true);
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsSigningUp(true);

    // Simulate network delay for sign-up
    setTimeout(() => {
      // In a real app, you'd make an API call here.
      // For this simulation, we'll always succeed.
      console.log('Simulated sign-up for:', { companyName, fullName, position, email });
      onSignUpSuccess(); 
      // No need to setIsSigningUp(false) if navigating away immediately
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden screen-root-animate">
      <div className="absolute top-2 right-2 md:top-4 md:right-4 h-10 w-10 md:h-16 md:w-16 border-t-2 border-r-2 border-sky-600/50 rounded-tr-lg opacity-30 animate-pulse"></div>
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 h-10 w-10 md:h-16 md:w-16 border-b-2 border-l-2 border-sky-600/50 rounded-bl-lg opacity-30 animate-pulse"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-sky-900/20 opacity-50 z-0"></div>

      <div className="relative z-10 w-full max-w-lg">
        <header className="text-center mb-8 md:mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron">
            <span className="text-sky-400">Agent</span>
            <span className="text-gray-100"> Registration</span>
          </h1>
          <p className="text-md text-sky-300/90 mt-2 tracking-normal font-orbitron">
            Uncover. Understand. Upgrade.
          </p>
          <p className="text-sm md:text-base text-sky-300/80 mt-3 tracking-wider font-roboto-mono">
            Join the Product Holmes Network
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/70 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700/70 space-y-5"
        >
          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Company / Organization Name
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400">
                <BuildingIcon className="h-5 w-5" />
              </span>
              <input
                ref={companyNameInputRef}
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Cyberdyne Systems, Stark Industries"
                required
                disabled={isSigningUp}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>
          
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Full Name
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400">
                <UserIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your operative name or alias"
                required
                disabled={isSigningUp}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Position in Company */}
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Position / Role
            </label>
            <div className="relative group">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400">
                <BriefcaseIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g., Lead Investigator, Product Analyst"
                required
                disabled={isSigningUp}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signUpEmail" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Company Email Address
            </label>
            <div className="relative group">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400">
                <EmailIcon className="h-5 w-5" />
              </span>
              <input
                type="email"
                id="signUpEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@company.domain"
                required
                disabled={isSigningUp}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="signUpPassword" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Secure Access Code (Password)
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400">
                <LockIcon className="h-5 w-5" />
              </span>
              <input
                type="password"
                id="signUpPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                required
                disabled={isSigningUp}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Confirm Access Code
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400">
                <LockIcon className="h-5 w-5" />
              </span>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                disabled={isSigningUp}
                className={`w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 rounded-lg focus:ring-2 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60 ${passwordMismatchError ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-sky-500'}`}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-800/40 border border-red-700/60 rounded-md text-center animate-slideDownAndFadeInTiny" role="alert">
              <p className="text-sm text-red-300 font-roboto-mono">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSigningUp || !companyName || !fullName || !position || !email || !password || !confirmPassword}
            className="w-full flex items-center justify-center px-6 py-3.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-gray-600/80 disabled:cursor-not-allowed group text-base font-orbitron tracking-wider"
          >
            {isSigningUp ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering Agent...
              </>
            ) : (
              'Create Account & Begin Mission'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6 font-roboto-mono">
          Already have an operative ID?{' '}
          <button
            type="button"
            onClick={onNavigateToLogin}
            disabled={isSigningUp}
            className="font-medium text-sky-400 hover:text-sky-300 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-gray-900 rounded px-1 py-0.5 disabled:opacity-60 transition-opacity"
          >
            Return to Login Portal
          </button>
        </p>

        <p className="text-center text-xs text-gray-500/80 mt-8 font-roboto-mono">
          Product Holmes &copy; {new Date().getFullYear()} - Agent Recruitment Division
        </p>
      </div>
    </div>
  );
};

export default SignUpScreen;