import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Process, SchedulingAlgorithm, SimulationResult } from '../types/simulation';
import { runSimulation } from '../services/simulationService';

interface SimulationContextProps {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
  selectedAlgorithm: SchedulingAlgorithm;
  setSelectedAlgorithm: React.Dispatch<React.SetStateAction<SchedulingAlgorithm>>;
  timeQuantum: number;
  setTimeQuantum: React.Dispatch<React.SetStateAction<number>>;
  simulationResults: SimulationResult | null;
  runningSimulation: boolean;
  powerProfile: {
    active: number;
    idle: number;
    sleep: number;
  };
  setPowerProfile: React.Dispatch<React.SetStateAction<{
    active: number;
    idle: number;
    sleep: number;
  }>>;
  addProcess: () => void;
  removeProcess: (id: string) => void;
  updateProcess: (id: string, key: keyof Process, value: any) => void;
  startSimulation: () => Promise<void>;
  clearResults: () => void;
}

const defaultProcess: Process = {
  id: '1',
  name: 'Process 1',
  arrivalTime: 0,
  burstTime: 5,
  priority: 1,
};

const defaultPowerProfile = {
  active: 100, // watts
  idle: 30,    // watts
  sleep: 5,    // watts
};

const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export const SimulationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [processes, setProcesses] = useState<Process[]>([{ ...defaultProcess }]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState<number>(2);
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
  const [runningSimulation, setRunningSimulation] = useState<boolean>(false);
  const [powerProfile, setPowerProfile] = useState(defaultPowerProfile);

  const addProcess = () => {
    const newId = (processes.length + 1).toString();
    const newProcess: Process = {
      ...defaultProcess,
      id: newId,
      name: `Process ${newId}`,
    };
    setProcesses([...processes, newProcess]);
  };

  const removeProcess = (id: string) => {
    if (processes.length > 1) {
      setProcesses(processes.filter(p => p.id !== id));
    }
  };

  const updateProcess = (id: string, key: keyof Process, value: any) => {
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, [key]: value } : p
    ));
  };

  const startSimulation = async () => {
    setRunningSimulation(true);
    try {
      const results = await runSimulation(
        processes, 
        selectedAlgorithm, 
        timeQuantum,
        powerProfile
      );
      setSimulationResults(results);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setRunningSimulation(false);
    }
  };

  const clearResults = () => {
    setSimulationResults(null);
  };

  return (
    <SimulationContext.Provider value={{
      processes,
      setProcesses,
      selectedAlgorithm,
      setSelectedAlgorithm,
      timeQuantum,
      setTimeQuantum,
      simulationResults,
      runningSimulation,
      powerProfile,
      setPowerProfile,
      addProcess,
      removeProcess,
      updateProcess,
      startSimulation,
      clearResults,
    }}>
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};