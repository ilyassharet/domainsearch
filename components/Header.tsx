import React, { useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, InfoIcon } from './icons';

interface HeaderProps {
  onDomainSubmit: (domain: string) => void;
  theme: string;
  toggleTheme: () => void;
}

const Header = forwardRef<HTMLInputElement, HeaderProps>(({ onDomainSubmit, theme, toggleTheme }, ref) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string>('');

  const validateDomain = (domain: string): string | null => {
    const trimmedDomain = domain.trim();

    if (!trimmedDomain) {
      return 'Please enter a domain name.';
    }

    if (trimmedDomain.length > 253) {
      return 'Domain is too long (maximum 253 characters).';
    }

    if (/[^a-zA-Z0-9.-]/.test(trimmedDomain)) {
      return 'Domain contains invalid characters. Use only letters, numbers, hyphens, and periods.';
    }

    if (!trimmedDomain.includes('.')) {
      return 'Invalid format. A domain must include a TLD (e.g., ".com").';
    }
    
    const labels = trimmedDomain.split('.');
    
    if (labels.some(label => label.length === 0)) {
        return 'Invalid format. Found consecutive or trailing periods.';
    }

    for (const label of labels) {
      if (label.length > 63) {
        return `A part of the domain ("${label}") is too long (maximum 63 characters).`;
      }
      if (label.startsWith('-') || label.endsWith('-')) {
        return 'Domain parts cannot start or end with a hyphen.';
      }
    }

    const tld = labels[labels.length - 1];
    if (/^[0-9]+$/.test(tld)) {
        return 'The Top-Level Domain (TLD) cannot be composed entirely of numbers.';
    }

    // This regex validates the domain structure, ensuring TLDs are at least 2 chars, start with a letter, and can contain digits/hyphens.
    const domainRegex = new RegExp(/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z][a-zA-Z0-9-]{1,}$/);
    if (!domainRegex.test(trimmedDomain)) {
      return 'Invalid domain format. Please use a format like "example.com".';
    }

    return null; 
  };


  const handleSearchClick = () => {
    const errorMessage = validateDomain(inputValue);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    setError('');
    onDomainSubmit(inputValue);
  };
  
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchClick();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (newValue === '') {
      onDomainSubmit('');
    }
    if (error) {
      setError('');
    }
  };
  
  const handleClearInput = () => {
    setInputValue('');
    setError('');
    onDomainSubmit('');
    if (ref && typeof ref !== 'function' && ref.current) {
      ref.current.focus();
    }
  };

  return (
    <header className="py-6 px-4 sm:px-6 lg:px-8">
      {/* Responsive Navbar using Flexbox for robust centering */}
      <div className="flex items-center w-full mb-8">
        {/* Left Spacer: Balances the right icons to keep the title centered. */}
        <div className="flex-1" />

        {/* Site Title: Takes natural width. Will wrap on small screens instead of truncating. */}
        <div className="px-2 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-light-text-primary dark:text-dark-text-primary">
                Domain Research <span className="block sm:inline text-primary">Dashboard</span>
            </h1>
        </div>

        {/* Icons: Pushed to the right by the flex container. */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Link
                to="/about"
                className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                aria-label="About this application"
            >
                <InfoIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-light-text-secondary dark:text-dark-text-secondary hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                aria-label="Toggle theme"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            >
                {theme === 'light' ? <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6" /> : <SunIcon className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="text-center">
        <p className="text-base md:text-lg text-light-text-secondary dark:text-dark-text-secondary mb-8 max-w-2xl mx-auto">
          Enter a domain to access a suite of powerful research tools instantly.
        </p>
        <form onSubmit={handleFormSubmit} className="max-w-xl mx-auto flex flex-col items-center">
          <div className="flex w-full">
            <div className="relative w-full">
                <input
                  ref={ref}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="e.g., example.com"
                  className="w-full pl-5 pr-12 py-3 text-base sm:text-lg bg-light-card dark:bg-dark-card text-light-text-primary dark:text-dark-text-primary border-2 border-light-border dark:border-dark-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-input-strong tracking-wide"
                  aria-invalid={!!error}
                  aria-describedby="domain-error"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClearInput}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-colors focus:outline-none"
                    aria-label="Clear input"
                  >
                    <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
            </div>
            <button
              type="submit"
              className="px-4 sm:px-6 py-3 bg-primary text-white font-bold text-base sm:text-lg rounded-r-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg transition-all"
            >
              Research
            </button>
          </div>
          {error && (
            <p id="domain-error" className="text-red-500 dark:text-red-400 mt-2 text-sm animate-fade-in" role="alert">
              {error}
            </p>
          )}
        </form>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;