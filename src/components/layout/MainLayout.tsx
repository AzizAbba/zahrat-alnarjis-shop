
import React, { useEffect, useState, createContext, useContext } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  pageName?: string;
}

export interface PageContent {
  id: string;
  page: string;
  section: string;
  title?: string;
  content: string;
  imageUrl?: string;
}

// Create a context for site content
interface ContentContextType {
  siteContent: PageContent[];
  getContentForPage: (page: string, section: string) => PageContent | undefined;
}

export const ContentContext = createContext<ContentContextType | null>(null);

// Custom hook to use the content context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children, onSearch, pageName }) => {
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

  // Make getContentForPage available to child components through context
  const contentContextValue = {
    siteContent,
    getContentForPage
  };

  return (
    <ContentContext.Provider value={contentContextValue}>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar onSearch={onSearch} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </div>
    </ContentContext.Provider>
  );
};

export default MainLayout;
// Remove the duplicate export here
