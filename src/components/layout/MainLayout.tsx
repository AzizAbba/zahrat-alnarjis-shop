
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

interface PageContent {
  id: string;
  page: string;
  section: string;
  title?: string;
  content: string;
  imageUrl?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onSearch }) => {
  const [siteContent, setSiteContent] = useState<PageContent[]>([]);

  useEffect(() => {
    const content = localStorage.getItem('siteContent');
    if (content) {
      setSiteContent(JSON.parse(content));
    }
  }, []);

  const getContentForPage = (page: string, section: string) => {
    return siteContent.find(content => content.page === page && content.section === section);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onSearch={onSearch} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
