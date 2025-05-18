import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full md:mx-auto md:shadow-lg md:min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;
