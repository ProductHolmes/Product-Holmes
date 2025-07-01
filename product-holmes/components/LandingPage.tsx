
import React from 'react';
import Footer from './icons/Footer'; // Reusing the Footer
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon'; // For thematic consistency

interface LandingPageProps {
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToLogin, onNavigateToSignUp }) => {
  const slogan = "Uncover. Understand. Upgrade.";
  const introSentence = "Introducing a new era of AI detectives, ProductHolmes.";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-between p-4 relative overflow-hidden screen-root-animate">
      {/* Decorative corner elements */}
      <div className="absolute top-2 right-2 md:top-4 md:right-4 h-12 w-12 md:h-20 md:w-20 border-t-2 border-r-2 border-sky-600/40 rounded-tr-lg opacity-25 animate-pulse"></div>
      <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 h-12 w-12 md:h-20 md:w-20 border-b-2 border-l-2 border-sky-600/40 rounded-bl-lg opacity-25 animate-pulse"></div>
      
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800/50 to-sky-900/10 opacity-60 z-0"></div>

      {/* Spacer to push content from top, if needed, or rely on justify-center for main content */}
      <div></div>

      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
        {/* Optional: A subtle Holmes-like icon or graphic */}
         <MagnifyingGlassIcon className="w-24 h-24 md:w-32 md:h-32 text-sky-500/70 mb-6 md:mb-8 animate-scaleInSlightly" style={{animationDelay: '0.4s'}} />

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-orbitron mb-3 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <span className="text-sky-400">Product</span>
          <span className="text-gray-100">Holmes</span>
        </h1>
        <p className="text-lg md:text-xl text-sky-300/90 mb-4 font-orbitron tracking-wide animate-fadeInUp" style={{animationDelay: '0.8s'}}>
          {slogan}
        </p>
        <p className="text-md md:text-lg text-gray-300 max-w-xl mx-auto mb-10 md:mb-12 font-roboto-mono leading-relaxed animate-fadeInUp" style={{animationDelay: '1s'}}>
          {introSentence}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 animate-fadeInUp" style={{animationDelay: '1.2s'}}>
          <button
            onClick={onNavigateToLogin}
            className="w-full sm:w-auto px-8 py-3.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 group text-base font-orbitron tracking-wider shadow-lg hover:shadow-sky-500/40"
          >
            Access Portal
          </button>
          <button
            onClick={onNavigateToSignUp}
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-700/70 text-sky-300 font-semibold rounded-lg border-2 border-sky-600/50 hover:bg-sky-700/40 hover:text-sky-200 hover:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 group text-base font-orbitron tracking-wider shadow-md hover:shadow-sky-600/30"
          >
            Join the Network
          </button>
        </div>
      </main>
      
      {/* Footer at the bottom */}
      <div className="relative z-10 w-full animate-fadeInUp" style={{animationDelay: '1.4s'}}>
        <Footer>
            <p className="text-xs text-gray-500">Your Partner in Product Intelligence.</p>
        </Footer>
      </div>
    </div>
  );
};

export default LandingPage;
