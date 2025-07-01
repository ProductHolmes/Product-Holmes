
import React, { useState, useEffect } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockIcon } from './icons/LockIcon';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp?: () => void; // Made optional for now, but will be used
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);

  const emailInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isAttemptingLogin) return;

    setError(null);
    setIsAttemptingLogin(true);

    // Simulate network delay
    setTimeout(() => {
      if (email === 'productholmes@test.com' && password === '1234') {
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Access denied.');
        setPassword(''); // Clear password field on error
      }
      setIsAttemptingLogin(false);
    }, 750);
  };

  const handleSignUpClick = () => {
    if (isAttemptingLogin) return;
    if (onNavigateToSignUp) {
      onNavigateToSignUp();
    } else {
      console.log('Sign Up button clicked, but no navigation handler provided.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 relative overflow-hidden screen-root-animate">
      {/* Decorative corner elements from Header */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 h-10 w-10 md:h-16 md:w-16 border-t-2 border-r-2 border-sky-600/50 rounded-tr-lg opacity-30 animate-pulse"></div>
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 h-10 w-10 md:h-16 md:w-16 border-b-2 border-l-2 border-sky-600/50 rounded-bl-lg opacity-30 animate-pulse"></div>

      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-sky-900/20 opacity-50 z-0"></div>


      <div className="relative z-10 w-full max-w-md">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-5xl md:text-6xl font-bold font-orbitron">
            <span className="text-sky-400">Product</span>
            <span className="text-gray-100">Holmes</span>
          </h1>
           <p className="text-md text-sky-300/90 mt-2 tracking-normal font-orbitron">
            Uncover. Understand. Upgrade.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/70 backdrop-blur-md p-6 sm:p-8 md:p-10 rounded-xl shadow-2xl border border-gray-700/70 space-y-6"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Agent Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400 transition-colors">
                <UserIcon className="h-5 w-5" />
              </div>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent.id@productholmes.sec"
                required
                disabled={isAttemptingLogin}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-sky-300 mb-1.5 font-roboto-mono">
              Access Code
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 group-focus-within:text-sky-400 transition-colors">
                <LockIcon className="h-5 w-5" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isAttemptingLogin}
                className="w-full pl-10 pr-3 py-3 text-gray-100 bg-gray-700/50 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all duration-300 shadow-md placeholder-gray-500 disabled:opacity-60"
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
            disabled={isAttemptingLogin || !email || !password}
            className="w-full flex items-center justify-center px-6 py-3.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 disabled:bg-gray-600/80 disabled:cursor-not-allowed group text-base font-orbitron tracking-wider"
          >
            {isAttemptingLogin ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </>
            ) : (
              'Engage Login Protocol'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6 font-roboto-mono">
          Want to be a Product Detective?{' '}
          <button
            type="button"
            onClick={handleSignUpClick}
            disabled={isAttemptingLogin}
            className="font-medium text-sky-400 hover:text-sky-300 hover:underline focus:outline-none focus:ring-1 focus:ring-sky-500 focus:ring-offset-1 focus:ring-offset-gray-900 rounded px-1 py-0.5 disabled:opacity-60 transition-opacity"
          >
            Sign Up
          </button>
        </p>

        <p className="text-center text-xs text-gray-500/80 mt-8 font-roboto-mono">
          Product Holmes &copy; {new Date().getFullYear()} - Internal Systems Division
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;