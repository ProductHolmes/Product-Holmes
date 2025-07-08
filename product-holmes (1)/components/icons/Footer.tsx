
import React from 'react';

interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  return (
    <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-700/50 mt-12">
      {children && <div className="mb-4">{children}</div>}
      <p className="text-lg text-sky-500 font-orbitron mb-2">Uncover. Understand. Upgrade.</p>
      <p className="font-roboto-mono">&copy; {new Date().getFullYear()} Product Holmes. Uncovering insights, one product at a time.</p>
      <p className="mt-1 text-xs text-sky-600/70 font-roboto-mono">Futuristic AI&trade; Investigation Services</p>
    </footer>
  );
};

export default Footer;