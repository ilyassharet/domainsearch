import type React from 'react';

interface NavbarProps {
  categories: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ categories, activeTab, onTabChange }) => {
  return (
    <nav className="border-b-2 border-light-border dark:border-dark-border pb-2">
      <div className="flex space-x-2 sm:space-x-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' as any }}>
        {categories.map((category) => {
          const isActive = category === activeTab;
          return (
            <button
              key={category}
              onClick={() => onTabChange(category)}
              title={category === 'All' ? 'Displays all available tools' : undefined}
              className={`whitespace-nowrap px-4 py-2 text-sm sm:text-base font-semibold rounded-t-md focus:outline-none transition-all duration-300 ${
                isActive
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {category}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;