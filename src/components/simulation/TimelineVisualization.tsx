import React from 'react';
import { ProcessTimeline, Process } from '../../types/simulation';

interface TimelineVisualizationProps {
  timeline: ProcessTimeline[];
  completedProcesses: Process[];
  totalExecutionTime: number;
}

const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({
  timeline,
  completedProcesses,
  totalExecutionTime
}) => {
  // Generate a color for each process
  const processColors: Record<string, string> = {};
  const colorPalette = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500'
  ];
  
  completedProcesses.forEach((process, index) => {
    processColors[process.id] = colorPalette[index % colorPalette.length];
  });
  
  // Sort the timeline by start time
  const sortedTimeline = [...timeline].sort((a, b) => a.startTime - b.startTime);
  
  // Create timeline grid with tickmarks
  const tickMarks = [];
  const timelineWidth = 100;
  const tickInterval = Math.max(1, Math.ceil(totalExecutionTime / 20)); // Maximum 20 ticks
  
  for (let i = 0; i <= totalExecutionTime; i += tickInterval) {
    tickMarks.push(
      <div 
        key={i} 
        className="absolute h-3 border-l border-gray-300"
        style={{ left: `${(i / totalExecutionTime) * timelineWidth}%` }}
      >
        <div className="text-xs text-gray-600 mt-2 transform -translate-x-1/2">{i}</div>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Execution Timeline</h3>
      
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 mb-4">
          {completedProcesses.map((process) => (
            <div key={process.id} className="flex items-center">
              <div className={`w-4 h-4 rounded-sm mr-1 ${processColors[process.id]}`}></div>
              <span className="text-sm text-gray-700">{process.name}</span>
            </div>
          ))}
        </div>
        
        <div className="relative mt-8">
          {/* Timeline tickmarks */}
          <div className="h-8 relative mb-2">
            {tickMarks}
          </div>
          
          {/* Timeline grid */}
          <div className="h-16 bg-gray-100 rounded relative">
            {sortedTimeline.map((segment, index) => (
              <div
                key={index}
                className={`absolute h-full ${processColors[segment.processId]} opacity-80 hover:opacity-100 transition-opacity`}
                style={{
                  left: `${(segment.startTime / totalExecutionTime) * timelineWidth}%`,
                  width: `${((segment.endTime - segment.startTime) / totalExecutionTime) * timelineWidth}%`
                }}
                title={`${completedProcesses.find(p => p.id === segment.processId)?.name}: ${segment.startTime} - ${segment.endTime}`}
              >
                <div className="text-white text-xs font-medium truncate px-1 pt-1">
                  {completedProcesses.find(p => p.id === segment.processId)?.name}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>0</span>
              <span>Time Units</span>
              <span>{totalExecutionTime}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Process</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Burst</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turnaround</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waiting</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {completedProcesses.map((process) => (
              <tr key={process.id}>
                <td className="px-4 py-3 text-sm text-gray-900">{process.name}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{process.arrivalTime}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{process.burstTime}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{process.startTime}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{process.completionTime}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{process.turnaroundTime}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{process.waitingTime}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{process.responseTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimelineVisualization;