
import React from 'react';
import { Source, SourceType } from '../types';
import { YouTubeIcon } from './icons/YoutubeIcon';
import { GoogleDocsIcon } from './icons/GoogleDocsIcon'; // Changed from ArticleIcon
import { RedditIcon } from './icons/RedditIcon';
import { TwitterIcon } from './icons/TwitterIcon';
import { TrustpilotIcon } from './icons/TrustpilotIcon';

interface SourceLinkProps {
  source: Source;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  const getIcon = () => {
    switch (source.type) {
      case SourceType.YouTube:
        return <YouTubeIcon className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case SourceType.GoogleArticles: // Changed from GoogleArticle
        return <GoogleDocsIcon className="w-5 h-5 flex-shrink-0" />; 
      case SourceType.RedditPosts:    // Changed from RedditComment
        return <RedditIcon className="w-5 h-5 text-orange-500 flex-shrink-0" />;
      case SourceType.Tweets:         // Changed from TwitterPost
        return <TwitterIcon className="w-5 h-5 text-sky-500 flex-shrink-0" />;
      case SourceType.TrustpilotPosts: // Changed from TrustpilotReview
        return <TrustpilotIcon className="w-5 h-5 text-green-500 flex-shrink-0" />;
      default:
         return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>;
    }
  };

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center space-x-2.5 px-3 py-2 bg-gray-700/60 hover:bg-gray-600/80 rounded-lg transition-all duration-200 group text-sm border border-gray-600/50 hover:border-sky-500/70"
    >
      {getIcon()}
      <span className="text-gray-300 group-hover:text-sky-300 transition-colors duration-200 truncate flex-grow" title={source.title}>
        {source.title}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-500 group-hover:text-sky-400 ml-auto flex-shrink-0 transition-colors duration-200">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
    </a>
  );
};

export default SourceLink;