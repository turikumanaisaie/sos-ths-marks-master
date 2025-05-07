
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SOS Technical High School, Kigali</p>
          <div className="mt-2 md:mt-0">
            <p>Kinyinya Sector, GASABO District</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
