

import type React from 'react';
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
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar
        categories={CATEGORIES}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
      {renderContent()}
    </>
  );
};

export default Dashboard;