import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import ProcessTable from '../components/simulation/ProcessTable';
import AlgorithmSelector from '../components/simulation/AlgorithmSelector';
import TimeQuantumSelector from '../components/simulation/TimeQuantumSelector';
import PowerProfileSelector from '../components/simulation/PowerProfileSelector';
import SimulationResults from '../components/simulation/SimulationResults';
import { PlusCircle, Play, Settings, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const SimulationPage: React.FC = () => {
  const { 
    processes, 
    selectedAlgorithm, 
    setSelectedAlgorithm,
    timeQuantum,
    setTimeQuantum,
    simulationResults, 
    runningSimulation,
    powerProfile,
    setPowerProfile,
    addProcess, 
    startSimulation,
    clearResults,
  } = useSimulation();
  
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  
  const handleRunSimulation = () => {
    if (processes.length === 0) {
      toast.error('Please add at least one process');
      return;
    }
    
    startSimulation().catch((error) => {
      toast.error('Simulation failed: ' + error.message);
    });
  };

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          CPU Scheduling Simulator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Configure processes and algorithms to visualize scheduling decisions and their impact on performance and energy consumption.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                Algorithm Configuration
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Algorithm Selection */}
              <AlgorithmSelector 
                selectedAlgorithm={selectedAlgorithm}
                setSelectedAlgorithm={setSelectedAlgorithm}
              />
              
              {/* Time Quantum (for Round Robin) */}
              {selectedAlgorithm === 'Round Robin' && (
                <TimeQuantumSelector
                  timeQuantum={timeQuantum}
                  setTimeQuantum={setTimeQuantum}
                />
              )}
              
              {/* Advanced Options Toggle */}
              <div className="pt-2">
                <button 
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                  onClick={toggleAdvancedOptions}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Advanced Options
                  {showAdvancedOptions ? (
                    <ChevronUp className="w-4 h-4 ml-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1" />
                  )}
                </button>
                
                {/* Power Profile Settings */}
                {showAdvancedOptions && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <PowerProfileSelector
                      powerProfile={powerProfile}
                      setPowerProfile={setPowerProfile}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                Process Configuration
              </h2>
              <button 
                className="bg-white text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                onClick={addProcess}
                title="Add new process"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <ProcessTable />
              
              <div className="mt-6 flex space-x-4">
                <button
                  onClick={handleRunSimulation}
                  disabled={runningSimulation}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  <Play className="mr-2 h-5 w-5" />
                  {runningSimulation ? 'Simulating...' : 'Run Simulation'}
                </button>
                
                {simulationResults && (
                  <button
                    onClick={clearResults}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Results Panel */}
        <div className="lg:col-span-2">
          {simulationResults ? (
            <SimulationResults results={simulationResults} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Play className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Ready to Simulate
              </h3>
              <p className="text-gray-600 max-w-md mb-8">
                Configure your processes and algorithm settings, then click 'Run Simulation' to see the results and performance metrics.
              </p>
              <button
                onClick={handleRunSimulation}
                disabled={runningSimulation}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {runningSimulation ? 'Simulating...' : 'Run Simulation'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;