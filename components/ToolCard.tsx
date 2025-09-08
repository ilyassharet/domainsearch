import React, { useState, useEffect } from 'react';
import type { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  domain: string;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, domain, isFavorite, onToggleFavorite }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [finalUrl, setFinalUrl] = useState<string>('');

  useEffect(() => {
    try {
      const getDomainPart = (fullDomain: string, type: 'domain' | 'domain_name' | undefined): string => {
        if (type === 'domain_name') {
          return fullDomain.split('.')[0] || fullDomain;
        }
        return fullDomain;
      };

      const domainPart = getDomainPart(domain, tool.urlType);
      const url = tool.urlTemplate
        .replace('{{DOMAIN}}', domain)
        .replace('{{DOMAIN_NAME}}', domainPart);
      
      // Validate that the constructed URL is valid
      new URL(url);
      setFinalUrl(url);
      setStatus('idle');
    } catch (e) {
      setFinalUrl('#');
      setStatus('error');
    }
  }, [tool, domain]);
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (status === 'error' || !finalUrl || finalUrl === '#') {
      e.preventDefault();
      return;
    }
    
    // Provide brief visual feedback on click without unreliable checking
    setStatus('loading');
    setTimeout(() => {
      setStatus('idle');
    }, 1500);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(tool.id);
  };
  
  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex items-center text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-light-text-secondary dark:text-dark-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Opening...</span>
          </div>
        );
      case 'error':
        return <p className="text-sm text-red-500 dark:text-red-400">Invalid link configured.</p>;
      default:
        return <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{tool.description}</p>;
    }
  };

  const cardClasses = `block p-6 bg-light-card dark:bg-dark-card rounded-lg shadow-lg dark:border dark:border-dark-border transform transition-all duration-300 group animate-fade-in ${
    status === 'error'
      ? 'opacity-70 cursor-not-allowed'
      : 'hover:shadow-2xl hover:scale-105 dark:hover:bg-dark-border'
  }`;

  return (
    <a
      href={finalUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cardClasses}
      aria-label={`Open ${tool.title} for ${domain}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <tool.Icon className={`h-8 w-8 text-primary transition-colors duration-300 ${status !== 'error' ? 'group-hover:text-primary' : ''}`} />
        </div>
        <div className="w-full min-w-0">
          <div className="flex justify-between items-start mb-1">
             <h3 className={`text-lg font-bold text-light-text-primary dark:text-dark-text-primary transition-colors duration-300 truncate pr-2 ${status !== 'error' ? 'group-hover:text-primary' : ''}`}>{tool.title}</h3>
             <button
                onClick={handleFavoriteClick}
                className={`flex-shrink-0 text-gray-400 dark:text-gray-500 transition-colors duration-200 rounded-full p-1 -mt-1 -mr-2 z-10 ${isFavorite ? 'text-yellow-400' : 'hover:text-yellow-400'}`}
                aria-label={isFavorite ? `Remove ${tool.title} from favorites` : `Add ${tool.title} to favorites`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
             </button>
          </div>
          {getStatusContent()}
        </div>
      </div>
    </a>
  );
};

export default ToolCard;