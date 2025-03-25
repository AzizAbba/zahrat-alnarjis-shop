
import React, { createContext, useContext, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export interface PageContent {
  id: string;
  page: string;
  section: string;
  title?: string;
  content: string;
  imageUrl?: string;
}

interface ContentContextType {
  siteContent: PageContent[];
  updatePageContent: (content: PageContent) => void;
  addPageContent: (content: PageContent) => void;
  getPageContent: (page: string, section: string) => PageContent | undefined;
  removePageContent: (id: string) => void;
}

const defaultContent: PageContent[] = [
  {
    id: 'home-hero-1',
    page: 'home',
    section: 'hero',
    title: 'زهرة النرجس',
    content: 'أفضل منتجات العناية بالبشرة الطبيعية',
    imageUrl: '/lovable-uploads/f1704d88-b08e-4a51-90be-eaeb1edea8ca.png'
  },
  {
    id: 'about-main-1',
    page: 'about',
    section: 'main',
    title: 'من نحن',
    content: 'نحن متجر متخصص في بيع منتجات العناية بالبشرة الطبيعية المصنوعة من أجود المكونات الطبيعية.',
    imageUrl: '/placeholder.svg'
  },
  {
    id: 'contact-info-1',
    page: 'contact',
    section: 'info',
    title: 'معلومات الاتصال',
    content: 'يمكنكم التواصل معنا عبر الهاتف أو البريد الإلكتروني أو من خلال النموذج أدناه.',
    imageUrl: ''
  }
];

export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
  pageName?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onSearch, pageName }) => {
  const [siteContent, setSiteContent] = useState<PageContent[]>([]);
  
  useEffect(() => {
    const storedContent = localStorage.getItem('siteContent');
    if (storedContent) {
      setSiteContent(JSON.parse(storedContent));
    } else {
      setSiteContent(defaultContent);
      localStorage.setItem('siteContent', JSON.stringify(defaultContent));
    }
  }, []);
  
  const updatePageContent = (content: PageContent) => {
    setSiteContent(prev => {
      const newContent = prev.map(item => 
        item.id === content.id ? content : item
      );
      localStorage.setItem('siteContent', JSON.stringify(newContent));
      return newContent;
    });
  };
  
  const addPageContent = (content: PageContent) => {
    setSiteContent(prev => {
      const newContent = [...prev, content];
      localStorage.setItem('siteContent', JSON.stringify(newContent));
      return newContent;
    });
  };
  
  const removePageContent = (id: string) => {
    setSiteContent(prev => {
      const newContent = prev.filter(item => item.id !== id);
      localStorage.setItem('siteContent', JSON.stringify(newContent));
      return newContent;
    });
  };
  
  const getPageContent = (page: string, section: string) => {
    return siteContent.find(item => item.page === page && item.section === section);
  };
  
  return (
    <ContentContext.Provider value={{
      siteContent,
      updatePageContent,
      addPageContent,
      getPageContent,
      removePageContent
    }}>
      <div className="flex flex-col min-h-screen">
        <Navbar onSearch={onSearch} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ContentContext.Provider>
  );
};

export default MainLayout;
