import React, { useState, useCallback } from 'react';
import { TOOLS, CATEGORIES } from '../constants';
import ToolCard from './ToolCard';
import Navbar from './Navbar';
import type { Tool } from '../types';

interface DashboardProps {
  domain: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  favorites: string[];
  onToggleFavorite: (toolId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ domain, activeTab, onTabChange, favorites, onToggleFavorite }) => {
  const [isMultiOpen, setIsMultiOpen] = useState(false);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const handleToggleMultiOpen = () => {
    setIsMultiOpen(prev => {
      // When toggling off, reset selections
      if (prev) {
        setSelectedTools([]);
      }
      return !prev;
    });
  };

  const handleSelectTool = useCallback((toolId: string) => {
    setSelectedTools(prevSelected =>
      prevSelected.includes(toolId)
        ? prevSelected.filter(id => id !== toolId)
        : [...prevSelected, toolId]
    );
  }, []);

  const handleOpenSelected = () => {
    // Iterate directly through selected tools and open them.
    // This single-loop approach ensures `window.open` is called as quickly as possible
    // after the user's click, which can help avoid browser pop-up blockers.
    selectedTools.forEach(toolId => {
      const tool = TOOLS.find(t => t.id === toolId);
      if (!tool) return; // Skip if tool not found

      try {
        const domainPart = tool.urlType === 'domain_name' 
          ? (domain.split('.')[0] || domain) 
          : domain;
        
        const url = tool.urlTemplate
          .replace('{{DOMAIN}}', domain)
          .replace('{{DOMAIN_NAME}}', domainPart);
        
        // Attempt to open the generated URL in a new tab
        window.open(url, '_blank', 'noopener,noreferrer');

      } catch (e) {
        // Log an error if URL generation fails, but continue the loop
        console.error(`Could not generate or open link for "${tool.title}". Please check its URL template.`, e);
      }
    });
  };
  
  if (!domain) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">Enter a domain above to start your research.</p>
      </div>
    );
  }

  const filteredTools = (() => {
    if (activeTab === 'All') {
      return TOOLS;
    }
    if (activeTab === 'Favorites') {
      return TOOLS.filter(tool => favorites.includes(tool.id));
    }
    return TOOLS.filter((tool: Tool) => tool.category === activeTab);
  })();

  const handleSelectAll = () => {
    const currentToolIds = filteredTools.map(t => t.id);
    setSelectedTools(prevSelected => {
      // Use a Set to efficiently merge previous selections with the current page's tools
      const newSelected = new Set([...prevSelected, ...currentToolIds]);
      return Array.from(newSelected);
    });
  };

  const handleDeselectAll = () => {
    const currentToolIds = new Set(filteredTools.map(t => t.id));
    setSelectedTools(prevSelected => prevSelected.filter(id => !currentToolIds.has(id)));
  };

  // Determine if all tools in the current view are selected
  const currentToolIds = filteredTools.map(t => t.id);
  const selectedToolsSet = new Set(selectedTools);
  const areAllSelected = currentToolIds.length > 0 && currentToolIds.every(id => selectedToolsSet.has(id));

  const handleToggleSelectAll = () => {
    if (areAllSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
  };

  const renderContent = () => {
    if (activeTab === 'Favorites' && filteredTools.length === 0) {
      return (
        <div className="text-center py-10 mt-6">
          <p className="text-lg text-light-text-secondary dark:text-dark-text-secondary">You haven't favorited any tools yet.</p>
          <p className="text-sm text-gray-500">Click the star icon on any tool card to add it to your favorites.</p>
        </div>
      );
    }

    return (
      <div key={activeTab} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTools.map((tool, index) => (
          <div 
            key={tool.id} 
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }} 
            className="opacity-0 animate-fade-in"
          >
            <ToolCard 
              tool={tool} 
              domain={domain} 
              isFavorite={favorites.includes(tool.id)}
              onToggleFavorite={onToggleFavorite}
              isMultiOpen={isMultiOpen}
              isSelected={selectedTools.includes(tool.id)}
              onSelectTool={handleSelectTool}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <div className="flex-grow">
          <Navbar
            categories={CATEGORIES}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
        </div>
      </div>
      
      {/* Centered controls container */}
      <div className="flex justify-center items-center gap-4 my-4 min-h-[36px]">
        {/* Multi-Open toggle - only shown on 'All' tab */}
        {activeTab === 'All' && (
          <div className="flex items-center space-x-2 animate-fade-in">
            <span className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary whitespace-nowrap">
              Multi-Open
            </span>
            <button
              onClick={handleToggleMultiOpen}
              role="switch"
              aria-checked={isMultiOpen}
              title={isMultiOpen ? 'Disable Multi-Open' : 'Enable Multi-Open'}
              className={`${
                isMultiOpen ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-dark-bg`}
            >
              <span
                className={`${
                  isMultiOpen ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>
        )}

        {/* Select/Deselect All button - shown on all tabs when multi-open is active */}
        {isMultiOpen && filteredTools.length > 0 && (
          <div className="animate-fade-in">
            <button
              onClick={handleToggleSelectAll}
              className="px-3 py-1 text-sm font-semibold bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-text-secondary dark:text-dark-text-secondary rounded-md hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              title={`${areAllSelected ? 'Deselect' : 'Select'} all tools in the "${activeTab}" category`}
            >
              {areAllSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        )}
      </div>
      
      {isMultiOpen && selectedTools.length > 0 && (
        <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 animate-fade-in">
          <button
            onClick={handleOpenSelected}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-primary text-white font-bold text-base sm:text-lg rounded-full shadow-lg hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg transition-all flex items-center space-x-2"
          >
            <span>Open Selected ({selectedTools.length})</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      )}

      {renderContent()}
    </>
  );
};

export default Dashboard;