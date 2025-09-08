import React, { useState, useRef, useLayoutEffect } from 'react';
import { ChevronDownIcon } from './icons';

interface NavbarProps {
  categories: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ categories, activeTab, onTabChange }) => {
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    const calculateVisibleTabs = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const moreButtonWidth = 85; // A reasonable estimate for the "More" button
      let currentWidth = 0;
      let newVisibleCount = 0;

      for (let i = 0; i < categories.length; i++) {
        const tab = tabRefs.current[i];
        if (tab) {
          const tabWidth = tab.offsetWidth;
          
          // Check if adding this tab plus a potential "More" button would exceed the width.
          const requiresMoreButton = i < categories.length - 1;
          const spaceNeeded = currentWidth + tabWidth + (requiresMoreButton ? moreButtonWidth : 0);

          if (spaceNeeded <= containerWidth) {
            currentWidth += tabWidth;
            newVisibleCount = i + 1;
          } else {
            break; // Stop when tabs no longer fit
          }
        }
      }
      
      // Use a functional update to prevent re-renders if the count hasn't changed.
      setVisibleCount(prevCount => {
        if (prevCount !== newVisibleCount) {
          return newVisibleCount;
        }
        return prevCount;
      });
    };

    // Use ResizeObserver to automatically recalculate when the container size changes
    const observer = new ResizeObserver(calculateVisibleTabs);
    const containerElement = containerRef.current;
    if (containerElement) {
      observer.observe(containerElement);
    }
    
    // Initial calculation after the first render
    calculateVisibleTabs();

    return () => {
        if (containerElement) {
            observer.unobserve(containerElement);
        }
    };
  }, [categories]);

  const handleTabClick = (category: string) => {
    onTabChange(category);
    setIsDropdownOpen(false);
  };
  
  const dropdownCategories = categories.slice(visibleCount);
  const isActiveInDropdown = dropdownCategories.includes(activeTab);

  return (
    <nav className="relative border-b-2 border-light-border dark:border-dark-border pb-2">
      {/* 
        This is a hidden container used ONLY for measuring the width of all tabs.
        It's positioned absolutely and has zero opacity so it doesn't affect layout or visibility.
        The refs are attached here to ensure we always measure the full, unhidden elements.
      */}
      <div className="absolute -z-10 opacity-0 pointer-events-none flex items-center space-x-2 sm:space-x-4" aria-hidden="true">
        {categories.map((category, index) => (
            <button
              key={`${category}-measure`}
              ref={(el) => { tabRefs.current[index] = el; }}
              className="whitespace-nowrap px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold"
            >
              {category}
            </button>
        ))}
      </div>

      <div ref={containerRef} className="flex items-center space-x-2 sm:space-x-4">
        {/* Render only the visible category buttons */}
        {categories.slice(0, visibleCount).map((category) => {
          const isActive = category === activeTab;
          return (
            <button
              key={category}
              onClick={() => handleTabClick(category)}
              className={`whitespace-nowrap px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold rounded-t-md focus:outline-none transition-colors ${
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

        {/* Dropdown for hidden tabs */}
        {dropdownCategories.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className={`flex items-center whitespace-nowrap px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold rounded-t-md focus:outline-none transition-colors ${
                isActiveInDropdown
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary'
              }`}
            >
              More
              <ChevronDownIcon className={`w-4 h-4 ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <div 
                className="absolute top-full right-0 mt-2 w-48 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md shadow-lg z-20"
              >
                <div className="py-1">
                  {dropdownCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleTabClick(category)}
                      className={`w-full text-left block px-4 py-2 text-sm ${activeTab === category ? 'font-bold text-primary' : 'text-light-text-primary dark:text-dark-text-primary'} hover:bg-light-bg dark:hover:bg-dark-bg`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;