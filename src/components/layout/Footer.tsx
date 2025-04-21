import React from 'react';
import { Cpu, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Cpu className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">EcoSchedule</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:space-x-8">
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-medium mb-2">Quick Links</h4>
              <ul className="space-y-1">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/algorithms" className="hover:text-white transition-colors">Algorithms</a></li>
                <li><a href="/simulation" className="hover:text-white transition-colors">Simulation</a></li>
              </ul>
            </div>
            
            <div className="mb-4 md:mb-0">
              <h4 className="text-white font-medium mb-2">Resources</h4>
              <ul className="space-y-1">
                <li><a href="/resources" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="/resources" className="hover:text-white transition-colors">Research Papers</a></li>
                <li><a href="/resources" className="hover:text-white transition-colors">References</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for energy-efficient computing
          </p>
          <p className="mt-1">© {new Date().getFullYear()} EcoSchedule. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;