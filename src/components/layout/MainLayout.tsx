
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onSearch }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onSearch={onSearch} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
