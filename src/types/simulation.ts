export type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'SRTF' | 'Round Robin' | 'Priority';

export interface Process {
  id: string;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime?: number;
  completionTime?: number;
  turnaroundTime?: number;
  waitingTime?: number;
  responseTime?: number;
  startTime?: number;
}

export interface ProcessTimeline {
  processId: string;
  startTime: number;
  endTime: number;
}

export interface EnergyMetrics {
  totalEnergy: number;       // in joules
  activeEnergy: number;      // energy consumed during active CPU usage
  idleEnergy: number;        // energy consumed during idle periods
  sleepEnergy: number;       // energy consumed during sleep states
  energyEfficiency: number;  // normalized score (0-100)
  averagePower: number;      // average power consumption (watts)
}

export interface SimulationResult {
  timeline: ProcessTimeline[];
  completedProcesses: Process[];
  metrics: {
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    averageResponseTime: number;
    cpuUtilization: number;
    throughput: number;
  };
  energy: EnergyMetrics;
  totalExecutionTime: number;
}