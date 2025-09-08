import type React from 'react';

export type ToolCategory = 'Favorites' | 'Appraisal' | 'Spam' | 'WHOIS' | 'Social Media' | 'Google' | 'DNS History' | 'Extra Tools' | 'Trademark' | 'Domain Generator';

export interface Tool {
  id: string;
  title: string;
  description: string;
  urlTemplate: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  urlType?: 'domain' | 'domain_name';
  category: ToolCategory;
}