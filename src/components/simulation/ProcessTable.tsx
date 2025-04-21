import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Trash2 } from 'lucide-react';

const ProcessTable: React.FC = () => {
  const { processes, updateProcess, removeProcess } = useSimulation();

  const handleInputChange = (id: string, key: string, value: any) => {
    // Convert string inputs to numbers where appropriate
    if (key === 'arrivalTime' || key === 'burstTime' || key === 'priority') {
      value = parseInt(value) || 0;
      // Ensure non-negative values
      value = Math.max(0, value);
    }
    
    updateProcess(id, key as any, value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full border-collapse">
        <thead className="bg-gray-50 text-left text-gray-700">
          <tr>
            <th className="py-3 px-4 text-sm font-medium">Process</th>
            <th className="py-3 px-4 text-sm font-medium">Arrival</th>
            <th className="py-3 px-4 text-sm font-medium">Burst</th>
            <th className="py-3 px-4 text-sm font-medium">Priority</th>
            <th className="py-3 px-4 text-sm font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {processes.map((process) => (
            <tr key={process.id} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <input
                  type="text"
                  value={process.name}
                  onChange={(e) => handleInputChange(process.id, 'name', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm"
                />
              </td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  min="0"
                  value={process.arrivalTime}
                  onChange={(e) => handleInputChange(process.id, 'arrivalTime', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm"
                />
              </td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  min="1"
                  value={process.burstTime}
                  onChange={(e) => handleInputChange(process.id, 'burstTime', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm"
                />
              </td>
              <td className="py-3 px-4">
                <input
                  type="number"
                  min="1"
                  value={process.priority}
                  onChange={(e) => handleInputChange(process.id, 'priority', e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm"
                />
              </td>
              <td className="py-3 px-4 text-right">
                <button
                  onClick={() => removeProcess(process.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1"
                  aria-label="Remove process"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {processes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No processes added yet. Click the + button to add a process.</p>
        </div>
      )}
    </div>
  );
};

export default ProcessTable;