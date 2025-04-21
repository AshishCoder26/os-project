import React from 'react';
import { SchedulingAlgorithm } from '../../types/simulation';
import { ChevronsRight, Clock, Activity, LayoutGrid, ArrowDownAZ } from 'lucide-react';

interface AlgorithmSelectorProps {
  selectedAlgorithm: SchedulingAlgorithm;
  setSelectedAlgorithm: (algorithm: SchedulingAlgorithm) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ 
  selectedAlgorithm,
  setSelectedAlgorithm
}) => {
  const algorithms = [
    { 
      id: 'FCFS',
      name: 'First-Come, First-Served', 
      description: 'Processes are executed in the order they arrive', 
      icon: <ChevronsRight className="h-5 w-5" /> 
    },
    { 
      id: 'SJF',
      name: 'Shortest Job First', 
      description: 'Process with the shortest burst time is selected', 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      id: 'SRTF',
      name: 'Shortest Remaining Time First', 
      description: 'Preemptive version of SJF', 
      icon: <Activity className="h-5 w-5" /> 
    },
    { 
      id: 'Round Robin',
      name: 'Round Robin', 
      description: 'Each process gets a fixed time slice in a cyclic way', 
      icon: <LayoutGrid className="h-5 w-5" /> 
    },
    { 
      id: 'Priority',
      name: 'Priority Scheduling', 
      description: 'Process with highest priority is selected first', 
      icon: <ArrowDownAZ className="h-5 w-5" /> 
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Scheduling Algorithm</h3>
      <div className="space-y-2">
        {algorithms.map((algorithm) => (
          <div 
            key={algorithm.id}
            className={`flex items-start p-3 rounded-lg cursor-pointer transition-colors border ${
              selectedAlgorithm === algorithm.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedAlgorithm(algorithm.id as SchedulingAlgorithm)}
          >
            <div className={`rounded-full p-2 mr-3 ${
              selectedAlgorithm === algorithm.id
                ? 'bg-blue-100 text-blue-600'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {algorithm.icon}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{algorithm.name}</h4>
              <p className="text-sm text-gray-600">{algorithm.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelector;