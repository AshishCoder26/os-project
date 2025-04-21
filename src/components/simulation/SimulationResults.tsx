import React, { useState } from 'react';
import { SimulationResult } from '../../types/simulation';
import TimelineVisualization from './TimelineVisualization';
import PerformanceMetrics from './PerformanceMetrics';
import EnergyMetrics from './EnergyMetrics';
import { Clock, Zap, Table } from 'lucide-react';

interface SimulationResultsProps {
  results: SimulationResult;
}

const SimulationResults: React.FC<SimulationResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'performance' | 'energy'>('timeline');
  
  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: <Clock className="h-5 w-5" /> },
    { id: 'performance', label: 'Performance', icon: <Table className="h-5 w-5" /> },
    { id: 'energy', label: 'Energy', icon: <Zap className="h-5 w-5" /> }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Simulation Results</h2>
      </div>
      
      <div className="border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        {activeTab === 'timeline' && (
          <TimelineVisualization 
            timeline={results.timeline}
            completedProcesses={results.completedProcesses}
            totalExecutionTime={results.totalExecutionTime}
          />
        )}
        
        {activeTab === 'performance' && (
          <PerformanceMetrics 
            metrics={results.metrics}
            completedProcesses={results.completedProcesses}
          />
        )}
        
        {activeTab === 'energy' && (
          <EnergyMetrics 
            energy={results.energy}
            totalExecutionTime={results.totalExecutionTime}
          />
        )}
      </div>
    </div>
  );
};

export default SimulationResults;