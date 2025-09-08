import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-light-text-primary dark:text-dark-text-primary animate-fade-in">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6">About the Domain Research Dashboard</h2>
      
      <div className="bg-light-card dark:bg-dark-card p-4 sm:p-6 md:p-8 rounded-lg shadow-lg dark:border dark:border-dark-border space-y-6">
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">What is this Tool?</h3>
          <p className="text-base sm:text-lg text-light-text-secondary dark:text-dark-text-secondary">
            The Domain Research Dashboard is a comprehensive, all-in-one tool designed to streamline the process of researching domain names. Whether you're a domain investor, a startup founder, a marketer, or just curious about a website, this dashboard provides instant access to a curated collection of powerful, third-party research services.
          </p>
        </section>

        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">Key Features</h3>
          <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-light-text-secondary dark:text-dark-text-secondary">
            <li><strong>Centralized Access:</strong> No more juggling dozens of browser tabs. Access appraisal, spam checks, WHOIS data, social media presence, and more from a single, clean interface.</li>
            <li><strong>Instant Results:</strong> Simply enter a domain, and all tool links are instantly populated and ready to be explored in a new tab.</li>
            <li><strong>Comprehensive Categories:</strong> Tools are organized into logical categories like Appraisal, Spam, WHOIS, Social Media, Trademark, and DNS History for targeted research.</li>
            <li><strong>Personalization:</strong> Mark your most-used tools as 'Favorites' for quick access on a dedicated tab.</li>
            <li><strong>Modern UI:</strong> Enjoy a clean, responsive, and modern interface with both Light and Dark modes to suit your preference.</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3">How It Works</h3>
          <p className="text-base sm:text-lg text-light-text-secondary dark:text-dark-text-secondary">
            This dashboard acts as a smart aggregator and a launchpad. It doesn't host the research tools itself; instead, it provides direct, pre-populated links to trusted and well-known external services. When you enter a domain and click on a tool card, you are taken directly to that service's website with your query already filled in, saving you time and effort.
          </p>
          <p className="mt-4 text-sm text-light-text-secondary dark:text-dark-text-secondary">
            <strong>Disclaimer:</strong> This tool is a facilitator. The accuracy and availability of the data are dependent on the third-party services linked.
          </p>
        </section>

        <div className="text-center pt-4">
          <Link to="/" className="inline-block bg-primary text-white font-bold text-lg px-6 py-3 rounded-md hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg transition-all">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;