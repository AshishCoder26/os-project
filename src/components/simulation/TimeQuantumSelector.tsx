import React from 'react';
import { Clock } from 'lucide-react';

interface TimeQuantumSelectorProps {
  timeQuantum: number;
  setTimeQuantum: (quantum: number) => void;
}

const TimeQuantumSelector: React.FC<TimeQuantumSelectorProps> = ({ 
  timeQuantum, 
  setTimeQuantum 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setTimeQuantum(value);
    }
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center mb-3">
        <Clock className="h-5 w-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Time Quantum</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-3">
        Set the time quantum for Round Robin scheduling. Each process will run for this amount of time before being preempted.
      </p>
      
      <div className="flex items-center">
        <input
          type="range"
          min="1"
          max="10"
          value={timeQuantum}
          onChange={handleChange}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="ml-4 min-w-[40px] px-2 py-1 bg-blue-600 text-white rounded-md text-center">
          {timeQuantum}
        </span>
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>Short</span>
        <span>Long</span>
      </div>
    </div>
  );
};

export default TimeQuantumSelector;