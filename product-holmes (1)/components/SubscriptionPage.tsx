
import React from 'react';
import { CheckIcon } from './icons/CheckIcon';
import { StarIcon } from './icons/StarIcon';

interface SubscriptionPageProps {
  currentPlan: string | null;
  onSelectPlan: (planName: string) => void;
}

interface TierFeature {
  text: string;
  highlight?: boolean; // Kept for potential future use, but color is now overridden
}

interface Tier {
  key: string;
  name: string;
  price?: string; // e.g., "Free", "$XX/month"
  description: string;
  searchFrequency: string;
  automation: string;
  productScope: string;
  dataSources: TierFeature[];
  features: TierFeature[];
  useCase: string;
  ctaText: string;
  isPopular?: boolean;
  borderColorClass: string;
  buttonClass: string;
  buttonHoverClass: string;
  pulseColorClass: string; // For selected plan pulse
}

const tiersData: Tier[] = [
  {
    key: 'free',
    name: 'Free Tier',
    price: 'Free',
    description: 'For individuals or small teams trying out basic functionality.',
    searchFrequency: 'Manual search, once per month.',
    automation: 'No automated searches.',
    productScope: "Limited to user's company products.",
    dataSources: [
      { text: 'Google Articles (up to 10)' },
      { text: 'YouTube Transcripts (up to 10 videos)' },
    ],
    features: [
      { text: 'Source links for all identified issues' },
      { text: 'Basic dashboard to view results' },
    ],
    useCase: 'Ideal for a high-level overview without financial commitment.',
    ctaText: 'Select Free Plan',
    borderColorClass: 'border-gray-600',
    buttonClass: 'bg-gray-600',
    buttonHoverClass: 'hover:bg-gray-500',
    pulseColorClass: 'animate-subtlePulseBorder' // Generic gray/blue pulse
  },
  {
    key: 'pro',
    name: 'Pro Tier',
    price: '$149/month',
    description: 'For growing businesses needing frequent, broader feedback analysis.',
    searchFrequency: 'Automated weekly searches.',
    automation: 'Weekly automated reports to dashboard.',
    productScope: "Limited to user's company products.",
    dataSources: [
      { text: 'Google Articles (up to 50)' },
      { text: 'YouTube (Transcripts & Comments, up to 50 videos)', highlight: true },
      { text: 'Twitter (up to 5,000 tweets)', highlight: true },
    ],
    features: [
      { text: 'All Free tier features' },
      { text: 'Semantic duplicate detection', highlight: true },
      { text: 'Issue prioritization by mention frequency', highlight: true },
      { text: 'Data export to Excel or CSV' },
    ],
    useCase: 'Best for proactive feedback monitoring and integration.',
    ctaText: 'Select Pro Plan',
    isPopular: true,
    borderColorClass: 'border-sky-500',
    buttonClass: 'bg-sky-600',
    buttonHoverClass: 'hover:bg-sky-500',
    pulseColorClass: 'animate-subtlePulseBorderSky'
  },
  {
    key: 'max',
    name: 'Max Tier',
    price: '$299/month',
    description: 'Ultimate solution for data-driven companies needing comprehensive market understanding.',
    searchFrequency: 'Automated weekly searches.',
    automation: 'Fully automated weekly searches with advanced reporting.',
    productScope: 'Unlimited (own and competitor products)',
    dataSources: [
      { text: 'Google Articles (up to 100)' },
      { text: 'YouTube (Transcripts & Comments, up to 100 videos)' },
      { text: 'Twitter (up to 10,000 tweets)' },
      { text: 'Reddit (up to 5,000 comments/posts)', highlight: true },
      { text: 'Trustpilot (up to 5,000 reviews)', highlight: true },
    ],
    features: [
      { text: 'All Pro tier features' },
      { text: 'Competitive analysis dashboard', highlight: true },
      { text: 'API access (Jira, Slack, etc.)', highlight: true },
      { text: 'Advanced filtering & trend analysis' },
      { text: 'Dedicated account manager & priority support' },
    ],
    useCase: 'Essential for large organizations and competitive intelligence.',
    ctaText: 'Select Max Plan',
    borderColorClass: 'border-purple-500',
    buttonClass: 'bg-purple-600',
    buttonHoverClass: 'hover:bg-purple-500',
    pulseColorClass: 'animate-subtlePulseBorder' // Generic pulse, or create a purple one
  },
];

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ currentPlan, onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center p-4 pt-16 md:pt-20 relative overflow-y-auto screen-root-animate">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-sky-900/10 opacity-70 z-0"></div>
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <header className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-orbitron">
            <span className="text-sky-400">ProductHolmes</span>
            <span className="text-gray-100"> Subscriptions</span>
          </h1>
          <p className="text-md text-sky-300/90 mt-2 tracking-normal font-orbitron">
            Uncover. Understand. Upgrade.
          </p>
          <p className="text-md md:text-lg text-sky-300/80 mt-3 tracking-wider font-roboto-mono">
            Choose the intel level that fits your mission.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {tiersData.map((tier) => (
            <div 
              key={tier.key}
              className={`bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl border-2 ${tier.borderColorClass} flex flex-col overflow-hidden transition-all duration-300 hover:shadow-sky-500/30 hover:scale-[1.02] relative 
                ${currentPlan === tier.key ? `ring-4 ring-offset-2 ring-offset-gray-900 ${tier.borderColorClass} ${tier.pulseColorClass}` : ''}
              `}
            >
              {tier.isPopular && (
                <div className="absolute top-0 right-0 bg-sky-500 text-white text-xs font-semibold px-3 py-1.5 rounded-bl-lg rounded-tr-lg font-roboto-mono tracking-wide z-10">
                  POPULAR
                </div>
              )}
              <div className="p-6 md:p-8 flex-grow">
                <h2 className={`text-2xl md:text-3xl font-orbitron font-bold mb-1 ${tier.key === 'free' ? 'text-gray-300' : tier.key === 'pro' ? 'text-sky-400' : 'text-purple-400'}`}>
                  {tier.name}
                </h2>
                {tier.price && (
                  <p className={`text-xl font-roboto-mono font-semibold mb-3 ${tier.key === 'free' ? 'text-gray-400' : tier.key === 'pro' ? 'text-sky-300' : 'text-purple-300'}`}>
                    {tier.price}
                  </p>
                )}
                <p className="text-sm text-gray-400 mb-6 h-12">{tier.description}</p>

                <div className="space-y-4 mb-8 text-sm">
                  <div>
                    <h4 className="font-semibold text-sky-300/90 mb-1 font-roboto-mono">Search Frequency:</h4>
                    <p className="text-gray-300">{tier.searchFrequency}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-300/90 mb-1 font-roboto-mono">Automation:</h4>
                    <p className="text-gray-300">{tier.automation}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-300/90 mb-1 font-roboto-mono">Product Scope:</h4>
                    <p className="text-gray-300">{tier.productScope}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sky-300/90 mb-2 font-roboto-mono">Data Sources:</h4>
                    <ul className="space-y-1.5 pl-1">
                      {tier.dataSources.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-green-500" />
                          <span className="text-gray-300">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sky-300/90 mb-2 font-roboto-mono">Feature Set:</h4>
                    <ul className="space-y-1.5 pl-1">
                      {tier.features.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <StarIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-yellow-400" />
                           <span className="text-yellow-300">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-semibold text-sky-300/90 mb-1 font-roboto-mono">Use Case:</h4>
                    <p className="text-gray-400 italic text-xs">{tier.useCase}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 mt-auto">
                <button
                  onClick={() => onSelectPlan(tier.key)}
                  disabled={currentPlan === tier.key}
                  className={`w-full flex items-center justify-center px-6 py-3.5 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 group text-base font-orbitron tracking-wider
                    ${currentPlan === tier.key 
                      ? 'bg-gray-500 cursor-not-allowed opacity-80' 
                      : `${tier.buttonClass} ${tier.buttonHoverClass} focus:ring-${tier.key === 'free' ? 'gray' : tier.key === 'pro' ? 'sky' : 'purple'}-400`
                    }`}
                >
                  {currentPlan === tier.key ? 'Current Plan' : tier.ctaText}
                   {currentPlan !== tier.key && <StarIcon className="w-4 h-4 ml-2 opacity-70 group-hover:opacity-100 transition-opacity" />}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-xs text-gray-500/80 mt-12 md:mt-16 font-roboto-mono">
          All plans are billed conceptually. For inquiries, contact Galactic Support.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
