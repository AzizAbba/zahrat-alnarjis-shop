
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
  updatePageContent: (content: PageContent) => void;
  addPageContent: (content: PageContent) => void;
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
    } else {
      // Initialize with default content if none exists
      const defaultContent: PageContent[] = [
        {
          id: 'home-hero',
          page: 'home',
          section: 'hero',
          title: 'منتجات التنظيف الأفضل',
          content: 'تسوق الآن واحصل على أفضل منتجات التنظيف بأسعار منافسة',
          imageUrl: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        },
        {
          id: 'products-header',
          page: 'products',
          section: 'header',
          title: 'منتجاتنا',
          content: 'تصفح مجموعتنا الواسعة من منتجات التنظيف عالية الجودة'
        },
        {
          id: 'about-header',
          page: 'about',
          section: 'header',
          title: 'من نحن',
          content: 'نقدم منتجات تنظيف عالية الجودة منذ أكثر من 10 سنوات'
        },
        {
          id: 'contact-header',
          page: 'contact',
          section: 'header',
          title: 'اتصل بنا',
          content: 'نحن هنا للمساعدة في أي استفسارات قد تكون لديك'
        }
      ];
      setSiteContent(defaultContent);
      localStorage.setItem('siteContent', JSON.stringify(defaultContent));
    }
  }, []);

  const getContentForPage = (page: string, section: string) => {
    return siteContent.find(content => content.page === page && content.section === section);
  };

  const updatePageContent = (updatedContent: PageContent) => {
    const newContent = siteContent.map(item => 
      item.id === updatedContent.id ? updatedContent : item
    );
    setSiteContent(newContent);
    localStorage.setItem('siteContent', JSON.stringify(newContent));
  };

  const addPageContent = (newContent: PageContent) => {
    const contentWithId = {
      ...newContent,
      id: newContent.id || `${newContent.page}-${newContent.section}-${Date.now()}`
    };
    const updatedContent = [...siteContent, contentWithId];
    setSiteContent(updatedContent);
    localStorage.setItem('siteContent', JSON.stringify(updatedContent));
  };

  // Make content functions available to child components through context
  const contentContextValue: ContentContextType = {
    siteContent,
    getContentForPage,
    updatePageContent,
    addPageContent
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
