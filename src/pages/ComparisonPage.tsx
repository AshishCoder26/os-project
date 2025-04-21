import React, { useState } from 'react';
import { SchedulingAlgorithm, SimulationResult } from '../types/simulation';
import { useSimulation } from '../context/SimulationContext';
import { GitCompare as Compare, BarChart2, RefreshCw, ArrowRight, Zap, Clock } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ComparisonPage: React.FC = () => {
  const { processes, timeQuantum, powerProfile, runningSimulation } = useSimulation();
  const [comparing, setComparing] = useState(false);
  const [results, setResults] = useState<Record<SchedulingAlgorithm, SimulationResult | null>>({
    'FCFS': null,
    'SJF': null,
    'SRTF': null,
    'Round Robin': null,
    'Priority': null
  });
  
  const allAlgorithms: SchedulingAlgorithm[] = ['FCFS', 'SJF', 'SRTF', 'Round Robin', 'Priority'];
  
  const runAllSimulations = async () => {
    if (processes.length === 0) {
      return;
    }
    
    setComparing(true);
    
    try {
      // Import the simulation service dynamically to avoid circular dependencies
      const { runSimulation } = await import('../services/simulationService');
      
      // Run simulation for each algorithm
      const newResults: Record<SchedulingAlgorithm, SimulationResult | null> = {
        'FCFS': null,
        'SJF': null,
        'SRTF': null,
        'Round Robin': null,
        'Priority': null
      };
      
      for (const algorithm of allAlgorithms) {
        newResults[algorithm] = await runSimulation(
          processes,
          algorithm,
          timeQuantum,
          powerProfile
        );
      }
      
      setResults(newResults);
    } catch (error) {
      console.error('Comparison failed:', error);
    } finally {
      setComparing(false);
    }
  };
  
  const resetComparison = () => {
    setResults({
      'FCFS': null,
      'SJF': null,
      'SRTF': null,
      'Round Robin': null,
      'Priority': null
    });
  };
  
  // Check if we have results
  const hasResults = Object.values(results).some(result => result !== null);
  
  // Prepare data for performance comparison chart
  const performanceChartData = {
    labels: allAlgorithms,
    datasets: [
      {
        label: 'Average Waiting Time',
        data: allAlgorithms.map(algo => results[algo]?.metrics.averageWaitingTime || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Average Turnaround Time',
        data: allAlgorithms.map(algo => results[algo]?.metrics.averageTurnaroundTime || 0),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
      },
      {
        label: 'Average Response Time',
        data: allAlgorithms.map(algo => results[algo]?.metrics.averageResponseTime || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      }
    ]
  };
  
  // Prepare data for energy comparison chart
  const energyChartData = {
    labels: allAlgorithms,
    datasets: [
      {
        label: 'Total Energy Consumption (joules)',
        data: allAlgorithms.map(algo => results[algo]?.energy.totalEnergy || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
      {
        label: 'Energy Efficiency Score',
        data: allAlgorithms.map(algo => results[algo]?.energy.energyEfficiency || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        yAxisID: 'y1',
      }
    ]
  };
  
  const energyChartOptions = {
    responsive: true,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Energy (joules)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Efficiency Score'
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Algorithm Comparison
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Compare performance and energy efficiency metrics across different CPU scheduling algorithms.
        </p>
      </div>
      
      {!hasResults ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <Compare className="h-10 w-10 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Compare Scheduling Algorithms
            </h2>
            
            <p className="text-gray-600 mb-8">
              Run a comparative analysis of all scheduling algorithms using your current process configuration. 
              This will help you identify which algorithm is most efficient for your specific workload.
            </p>
            
            <div className="w-full max-w-md mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Current Configuration</h3>
              <p className="text-blue-700 mb-2">
                <strong>Number of Processes:</strong> {processes.length}
              </p>
              <p className="text-blue-700 mb-2">
                <strong>Time Quantum (Round Robin):</strong> {timeQuantum}
              </p>
              <p className="text-blue-700">
                <strong>Power Profile:</strong> Active: {powerProfile.active}W, 
                Idle: {powerProfile.idle}W, Sleep: {powerProfile.sleep}W
              </p>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={runAllSimulations}
                disabled={comparing || processes.length === 0 || runningSimulation}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                <BarChart2 className="mr-2 h-5 w-5" />
                {comparing ? 'Comparing...' : 'Run Comparison'}
              </button>
              
              <a
                href="/simulation"
                className="px-6 py-3 border border-gray-300 text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Configure Processes
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-end">
            <button
              onClick={resetComparison}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Comparison
            </button>
          </div>
          
          {/* Performance Metrics Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Performance Metrics Comparison</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Compare waiting time, turnaround time, and response time across different scheduling algorithms.
                Lower values indicate better performance.
              </p>
            </div>
            
            <div className="h-96">
              <Bar 
                data={performanceChartData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                    title: {
                      display: true,
                      text: 'Performance Metrics Comparison (Lower is Better)'
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Time Units'
                      }
                    }
                  }
                }} 
              />
            </div>
            
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Algorithm</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Avg. Waiting</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Avg. Turnaround</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Avg. Response</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">CPU Utilization</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Throughput</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allAlgorithms.map(algo => (
                    results[algo] && (
                      <tr key={algo} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{algo}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.metrics.averageWaitingTime.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.metrics.averageTurnaroundTime.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.metrics.averageResponseTime.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.metrics.cpuUtilization.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.metrics.throughput.toFixed(4)}
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Energy Metrics Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 text-yellow-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Energy Efficiency Comparison</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Compare energy consumption and efficiency scores across different scheduling algorithms.
                Lower energy consumption and higher efficiency scores are better.
              </p>
            </div>
            
            <div className="h-96">
              <Bar data={energyChartData} options={energyChartOptions} />
            </div>
            
            <div className="mt-8 overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Algorithm</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Total Energy</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Active Energy</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Idle Energy</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Sleep Energy</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Efficiency Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allAlgorithms.map(algo => (
                    results[algo] && (
                      <tr key={algo} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{algo}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.energy.totalEnergy.toFixed(2)} J
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.energy.activeEnergy.toFixed(2)} J
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.energy.idleEnergy.toFixed(2)} J
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {results[algo]?.energy.sleepEnergy.toFixed(2)} J
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            (results[algo]?.energy.energyEfficiency || 0) >= 80 ? 'bg-green-100 text-green-800' :
                            (results[algo]?.energy.energyEfficiency || 0) >= 60 ? 'bg-lime-100 text-lime-800' :
                            (results[algo]?.energy.energyEfficiency || 0) >= 40 ? 'bg-yellow-100 text-yellow-800' :
                            (results[algo]?.energy.energyEfficiency || 0) >= 20 ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {results[algo]?.energy.energyEfficiency.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Best Algorithm Recommendation */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Algorithm Recommendation</h3>
              
              {(() => {
                // Find best algorithms
                const validResults = allAlgorithms.filter(algo => results[algo] !== null);
                if (validResults.length === 0) return null;
                
                // For performance (lowest average waiting time)
                const bestPerformance = validResults.reduce((best, current) => 
                  (results[current]?.metrics.averageWaitingTime || Infinity) < 
                  (results[best]?.metrics.averageWaitingTime || Infinity) ? current : best, 
                  validResults[0]
                );
                
                // For energy efficiency (highest score)
                const bestEnergy = validResults.reduce((best, current) => 
                  (results[current]?.energy.energyEfficiency || 0) > 
                  (results[best]?.energy.energyEfficiency || 0) ? current : best, 
                  validResults[0]
                );
                
                // For balanced (combined ranking)
                const balanced = validResults.reduce((best, current) => {
                  const currentPerf = results[current]?.metrics.averageWaitingTime || Infinity;
                  const currentEnergy = results[current]?.energy.energyEfficiency || 0;
                  const bestPerf = results[best]?.metrics.averageWaitingTime || Infinity;
                  const bestEnergy = results[best]?.energy.energyEfficiency || 0;
                  
                  // Normalize and combine scores (lower waiting time is better, higher efficiency is better)
                  const currentScore = (1/currentPerf) + (currentEnergy/100);
                  const bestScore = (1/bestPerf) + (bestEnergy/100);
                  
                  return currentScore > bestScore ? current : best;
                }, validResults[0]);
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-blue-600 mb-1">Best for Performance</h4>
                      <p className="text-lg font-bold text-gray-900 mb-1">{bestPerformance}</p>
                      <p className="text-xs text-gray-600">
                        Lowest average waiting time: {results[bestPerformance]?.metrics.averageWaitingTime.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-green-600 mb-1">Best for Energy</h4>
                      <p className="text-lg font-bold text-gray-900 mb-1">{bestEnergy}</p>
                      <p className="text-xs text-gray-600">
                        Highest efficiency score: {results[bestEnergy]?.energy.energyEfficiency.toFixed(1)}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <h4 className="text-sm font-medium text-purple-600 mb-1">Best Balance</h4>
                      <p className="text-lg font-bold text-gray-900 mb-1">{balanced}</p>
                      <p className="text-xs text-gray-600">
                        Optimal balance between performance and energy efficiency
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;