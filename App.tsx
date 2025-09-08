import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ErrorBoundary from './components/ErrorBoundary';
import About from './components/About';

const App: React.FC = () => {
  const [researchedDomain, setResearchedDomain] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // Apply theme class to HTML element and save to localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  }, [theme]);

  // Load favorites from localStorage on initial render
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('domainToolFavorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      setFavorites([]);
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('domainToolFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage", error);
    }
  }, [favorites]);

  // Automatically focus the input field when on the dashboard page
  useEffect(() => {
    if (location.pathname === '/') {
      inputRef.current?.focus();
    }
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleToggleFavorite = (toolId: string) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(toolId)) {
        return prevFavorites.filter(id => id !== toolId);
      } else {
        return [...prevFavorites, toolId];
      }
    });
  };
  
  const sanitizeDomain = (domain: string): string => {
    let sanitized = domain.trim().toLowerCase();
    
    // Aggressively strip any characters not valid in a domain name for XSS protection
    sanitized = sanitized.replace(/[^a-z0-9.\-]/g, '');

    // Remove protocol
    sanitized = sanitized.replace(/^https?:\/\//, '');
    
    // Remove www.
    sanitized = sanitized.replace(/^www\./, '');
    
    // Remove path
    const slashIndex = sanitized.indexOf('/');
    if (slashIndex !== -1) {
      sanitized = sanitized.substring(0, slashIndex);
    }
    
    return sanitized;
  };

  const handleDomainSubmit = useCallback((domain: string) => {
    const sanitized = sanitizeDomain(domain);
    setResearchedDomain(sanitized);
    setActiveTab('All'); // Reset to 'All' tab on new search
    navigate('/'); // Navigate to dashboard on new search
  }, [navigate]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg font-sans text-light-text-primary dark:text-dark-text-primary transition-colors duration-300 flex flex-col">
      <main className="container mx-auto px-4 py-4 sm:py-8 flex-grow">
        <Header 
          ref={inputRef}
          onDomainSubmit={handleDomainSubmit}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <div className="mt-8">
          <ErrorBoundary>
            <Routes>
              <Route path="/about" element={<About />} />
              <Route path="/" element={
                <Dashboard 
                  domain={researchedDomain} 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab} 
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              } />
            </Routes>
          </ErrorBoundary>
        </div>
      </main>
       <footer className="text-center py-6 text-light-text-secondary dark:text-dark-text-secondary text-sm">
        <p>Domain Research Dashboard &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;