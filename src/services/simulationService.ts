import { Process, ProcessTimeline, SchedulingAlgorithm, SimulationResult } from '../types/simulation';

// Helper function to deep clone a process array
const cloneProcesses = (processes: Process[]): Process[] => {
  return processes.map(p => ({...p, remainingTime: p.burstTime}));
};

// First-Come, First-Served (FCFS) Algorithm
const simulateFCFS = (processes: Process[]): { timeline: ProcessTimeline[], completedProcesses: Process[] } => {
  const processQueue = cloneProcesses(processes).sort((a, b) => a.arrivalTime - b.arrivalTime);
  const timeline: ProcessTimeline[] = [];
  const completedProcesses: Process[] = [];
  
  let currentTime = 0;
  
  processQueue.forEach(process => {
    // If there's a gap between processes, advance the current time
    if (process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }
    
    const startTime = currentTime;
    process.startTime = startTime;
    process.waitingTime = startTime - process.arrivalTime;
    process.responseTime = process.waitingTime;
    
    // Execute the process
    currentTime += process.burstTime;
    
    process.completionTime = currentTime;
    process.turnaroundTime = process.completionTime - process.arrivalTime;
    
    timeline.push({
      processId: process.id,
      startTime,
      endTime: currentTime
    });
    
    completedProcesses.push({...process});
  });
  
  return { timeline, completedProcesses };
};

// Shortest Job First (SJF) Algorithm
const simulateSJF = (processes: Process[]): { timeline: ProcessTimeline[], completedProcesses: Process[] } => {
  const processQueue = cloneProcesses(processes);
  const timeline: ProcessTimeline[] = [];
  const completedProcesses: Process[] = [];
  
  let currentTime = 0;
  let remainingProcesses = [...processQueue];
  
  while (remainingProcesses.length > 0) {
    // Find arrived processes
    const arrivedProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (arrivedProcesses.length === 0) {
      // No processes have arrived yet, advance time to the next arrival
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find the shortest job among arrived processes
    const shortestJob = arrivedProcesses.reduce(
      (shortest, current) => current.burstTime < shortest.burstTime ? current : shortest,
      arrivedProcesses[0]
    );
    
    // Remove the process from remaining processes
    remainingProcesses = remainingProcesses.filter(p => p.id !== shortestJob.id);
    
    // Execute the process
    const startTime = currentTime;
    shortestJob.startTime = startTime;
    shortestJob.waitingTime = startTime - shortestJob.arrivalTime;
    shortestJob.responseTime = shortestJob.waitingTime;
    
    currentTime += shortestJob.burstTime;
    
    shortestJob.completionTime = currentTime;
    shortestJob.turnaroundTime = shortestJob.completionTime - shortestJob.arrivalTime;
    
    timeline.push({
      processId: shortestJob.id,
      startTime,
      endTime: currentTime
    });
    
    completedProcesses.push({...shortestJob});
  }
  
  return { timeline, completedProcesses };
};

// Shortest Remaining Time First (SRTF) Algorithm
const simulateSRTF = (processes: Process[]): { timeline: ProcessTimeline[], completedProcesses: Process[] } => {
  const processQueue = cloneProcesses(processes);
  const timeline: ProcessTimeline[] = [];
  const completedProcesses: Process[] = [];
  
  let currentTime = 0;
  let remainingProcesses = processQueue.map(p => ({...p, remainingTime: p.burstTime, startTime: undefined as number | undefined}));
  
  // Sort by arrival time initially
  remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  // Create a map to track response times
  const responseTimeMap = new Map<string, number>();
  
  let currentProcessId: string | null = null;
  let processStartTime = 0;
  
  while (remainingProcesses.length > 0) {
    // Get arrived processes
    const arrivedProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (arrivedProcesses.length === 0) {
      // No processes have arrived, advance time to next arrival
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find the process with shortest remaining time
    const shortestProcess = arrivedProcesses.reduce(
      (shortest, current) => 
        (current.remainingTime as number) < (shortest.remainingTime as number) ? current : shortest,
      arrivedProcesses[0]
    );
    
    // If we're switching processes, add the previous execution to timeline
    if (currentProcessId !== null && currentProcessId !== shortestProcess.id) {
      timeline.push({
        processId: currentProcessId,
        startTime: processStartTime,
        endTime: currentTime
      });
    }
    
    // If this is the first time the process is being executed, record response time
    if (!responseTimeMap.has(shortestProcess.id)) {
      responseTimeMap.set(shortestProcess.id, currentTime - shortestProcess.arrivalTime);
      
      // Also record the first start time
      if (shortestProcess.startTime === undefined) {
        shortestProcess.startTime = currentTime;
      }
    }
    
    // Set current process and start time
    currentProcessId = shortestProcess.id;
    processStartTime = currentTime;
    
    // Determine how long this process will run
    let runTime = shortestProcess.remainingTime as number;
    
    // Check if another process will arrive before this one completes
    const nextArrival = remainingProcesses
      .filter(p => p.arrivalTime > currentTime)
      .sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
    
    if (nextArrival && nextArrival.arrivalTime < currentTime + runTime) {
      runTime = nextArrival.arrivalTime - currentTime;
    }
    
    // Execute the process for the calculated run time
    currentTime += runTime;
    shortestProcess.remainingTime = (shortestProcess.remainingTime as number) - runTime;
    
    // If process is complete, add to completed list
    if (shortestProcess.remainingTime === 0) {
      shortestProcess.completionTime = currentTime;
      shortestProcess.turnaroundTime = shortestProcess.completionTime - shortestProcess.arrivalTime;
      shortestProcess.waitingTime = shortestProcess.turnaroundTime - shortestProcess.burstTime;
      shortestProcess.responseTime = responseTimeMap.get(shortestProcess.id)!;
      
      completedProcesses.push({...shortestProcess});
      
      // Remove from remaining processes
      remainingProcesses = remainingProcesses.filter(p => p.id !== shortestProcess.id);
      
      // Add final execution to timeline
      timeline.push({
        processId: currentProcessId,
        startTime: processStartTime,
        endTime: currentTime
      });
      
      currentProcessId = null;
    }
  }
  
  return { timeline, completedProcesses };
};

// Round Robin Algorithm
const simulateRoundRobin = (processes: Process[], timeQuantum: number): { timeline: ProcessTimeline[], completedProcesses: Process[] } => {
  const processQueue = cloneProcesses(processes);
  const timeline: ProcessTimeline[] = [];
  const completedProcesses: Process[] = [];
  
  let currentTime = 0;
  let readyQueue: Process[] = [];
  let remainingProcesses = processQueue.map(p => ({
    ...p, 
    remainingTime: p.burstTime,
    startTime: undefined as number | undefined,
    firstExecution: true
  }));
  
  // Sort by arrival time initially
  remainingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  while (remainingProcesses.length > 0 || readyQueue.length > 0) {
    // Move all arrived processes to ready queue
    const newlyArrived = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    readyQueue.push(...newlyArrived);
    remainingProcesses = remainingProcesses.filter(p => p.arrivalTime > currentTime);
    
    if (readyQueue.length === 0) {
      // No processes in ready queue, advance time to next arrival
      if (remainingProcesses.length > 0) {
        currentTime = remainingProcesses[0].arrivalTime;
        continue;
      } else {
        break; // No more processes to execute
      }
    }
    
    // Get the next process from ready queue
    const currentProcess = readyQueue.shift()!;
    
    // Record start time and response time if it's the first execution
    if (currentProcess.firstExecution) {
      currentProcess.startTime = currentTime;
      currentProcess.responseTime = currentTime - currentProcess.arrivalTime;
      currentProcess.firstExecution = false;
    }
    
    // Determine execution time (time quantum or remaining time, whichever is smaller)
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime as number);
    
    // Execute the process
    const startTime = currentTime;
    currentTime += executionTime;
    currentProcess.remainingTime = (currentProcess.remainingTime as number) - executionTime;
    
    // Add to timeline
    timeline.push({
      processId: currentProcess.id,
      startTime,
      endTime: currentTime
    });
    
    // Check if process is complete
    if (currentProcess.remainingTime === 0) {
      currentProcess.completionTime = currentTime;
      currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;
      currentProcess.waitingTime = currentProcess.turnaroundTime - currentProcess.burstTime;
      
      completedProcesses.push({...currentProcess});
    } else {
      // If not complete, add back to ready queue
      // First, check if more processes have arrived during execution
      const newArrivals = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
      readyQueue.push(...newArrivals);
      remainingProcesses = remainingProcesses.filter(p => p.arrivalTime > currentTime);
      
      // Add current process back to ready queue
      readyQueue.push(currentProcess);
    }
  }
  
  return { timeline, completedProcesses };
};

// Priority Scheduling Algorithm
const simulatePriority = (processes: Process[]): { timeline: ProcessTimeline[], completedProcesses: Process[] } => {
  const processQueue = cloneProcesses(processes);
  const timeline: ProcessTimeline[] = [];
  const completedProcesses: Process[] = [];
  
  let currentTime = 0;
  let remainingProcesses = [...processQueue];
  
  while (remainingProcesses.length > 0) {
    // Find arrived processes
    const arrivedProcesses = remainingProcesses.filter(p => p.arrivalTime <= currentTime);
    
    if (arrivedProcesses.length === 0) {
      // No processes have arrived yet, advance time to the next arrival
      const nextArrival = Math.min(...remainingProcesses.map(p => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }
    
    // Find the highest priority job (lower value means higher priority)
    const highestPriorityJob = arrivedProcesses.reduce(
      (highest, current) => current.priority < highest.priority ? current : highest,
      arrivedProcesses[0]
    );
    
    // Remove the process from remaining processes
    remainingProcesses = remainingProcesses.filter(p => p.id !== highestPriorityJob.id);
    
    // Execute the process
    const startTime = currentTime;
    highestPriorityJob.startTime = startTime;
    highestPriorityJob.waitingTime = startTime - highestPriorityJob.arrivalTime;
    highestPriorityJob.responseTime = highestPriorityJob.waitingTime;
    
    currentTime += highestPriorityJob.burstTime;
    
    highestPriorityJob.completionTime = currentTime;
    highestPriorityJob.turnaroundTime = highestPriorityJob.completionTime - highestPriorityJob.arrivalTime;
    
    timeline.push({
      processId: highestPriorityJob.id,
      startTime,
      endTime: currentTime
    });
    
    completedProcesses.push({...highestPriorityJob});
  }
  
  return { timeline, completedProcesses };
};

// Calculate energy consumption based on the timeline and power profile
const calculateEnergyMetrics = (
  timeline: ProcessTimeline[], 
  totalTime: number,
  powerProfile: { active: number, idle: number, sleep: number }
): any => {
  // Create an array representing the CPU state at each time unit
  const cpuStates: ('active' | 'idle' | 'sleep')[] = new Array(totalTime).fill('idle');
  
  // Mark active periods on the timeline
  timeline.forEach(slot => {
    for (let i = slot.startTime; i < slot.endTime; i++) {
      cpuStates[i] = 'active';
    }
  });
  
  // Calculate consecutive idle periods longer than 3 time units and mark them as sleep
  let idleStart = -1;
  for (let i = 0; i <= cpuStates.length; i++) {
    if (i === cpuStates.length || cpuStates[i] === 'active') {
      // End of an idle period or end of array
      if (idleStart !== -1) {
        const idleLength = i - idleStart;
        if (idleLength > 3) {
          // Mark first 2 and last 1 time units as idle (transition costs)
          for (let j = idleStart + 2; j < i - 1; j++) {
            cpuStates[j] = 'sleep';
          }
        }
        idleStart = -1;
      }
    } else if (cpuStates[i] === 'idle' && idleStart === -1) {
      // Start of a new idle period
      idleStart = i;
    }
  }
  
  // Calculate energy consumption based on CPU states
  const activePeriods = cpuStates.filter(state => state === 'active').length;
  const idlePeriods = cpuStates.filter(state => state === 'idle').length;
  const sleepPeriods = cpuStates.filter(state => state === 'sleep').length;
  
  // Energy in joules (power in watts × time in seconds)
  // Assuming each time unit is 1 second for simplicity
  const activeEnergy = activePeriods * powerProfile.active;
  const idleEnergy = idlePeriods * powerProfile.idle;
  const sleepEnergy = sleepPeriods * powerProfile.sleep;
  const totalEnergy = activeEnergy + idleEnergy + sleepEnergy;
  
  // Calculate energy efficiency metrics
  // Theoretical minimum energy (if all non-active time was in sleep mode)
  const minPossibleEnergy = activePeriods * powerProfile.active + 
                          (totalTime - activePeriods) * powerProfile.sleep;
  
  // Theoretical maximum energy (if all time was in active mode)
  const maxPossibleEnergy = totalTime * powerProfile.active;
  
  // Energy efficiency score (0-100, higher is better)
  const energyEfficiency = 100 - ((totalEnergy - minPossibleEnergy) / 
                               (maxPossibleEnergy - minPossibleEnergy) * 100);
  
  const averagePower = totalEnergy / totalTime;
  
  return {
    totalEnergy,
    activeEnergy,
    idleEnergy,
    sleepEnergy,
    energyEfficiency,
    averagePower
  };
};

// Calculate performance metrics
const calculateMetrics = (completedProcesses: Process[], totalTime: number) => {
  const totalProcesses = completedProcesses.length;
  
  const totalWaitingTime = completedProcesses.reduce((sum, p) => sum + (p.waitingTime || 0), 0);
  const totalTurnaroundTime = completedProcesses.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0);
  const totalResponseTime = completedProcesses.reduce((sum, p) => sum + (p.responseTime || 0), 0);
  const totalBurstTime = completedProcesses.reduce((sum, p) => sum + p.burstTime, 0);
  
  return {
    averageWaitingTime: totalWaitingTime / totalProcesses,
    averageTurnaroundTime: totalTurnaroundTime / totalProcesses,
    averageResponseTime: totalResponseTime / totalProcesses,
    cpuUtilization: (totalBurstTime / totalTime) * 100,
    throughput: totalProcesses / totalTime
  };
};

// Main simulation function that runs the appropriate algorithm
export const runSimulation = async (
  processes: Process[], 
  algorithm: SchedulingAlgorithm, 
  timeQuantum: number,
  powerProfile: { active: number, idle: number, sleep: number }
): Promise<SimulationResult> => {
  // Clone processes to avoid modifying the original array
  const processesClone = JSON.parse(JSON.stringify(processes));
  
  let result;
  
  // Run the appropriate algorithm
  switch (algorithm) {
    case 'FCFS':
      result = simulateFCFS(processesClone);
      break;
    case 'SJF':
      result = simulateSJF(processesClone);
      break;
    case 'SRTF':
      result = simulateSRTF(processesClone);
      break;
    case 'Round Robin':
      result = simulateRoundRobin(processesClone, timeQuantum);
      break;
    case 'Priority':
      result = simulatePriority(processesClone);
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
  
  const { timeline, completedProcesses } = result;
  
  // Calculate total execution time
  const totalExecutionTime = timeline.length > 0 
    ? Math.max(...timeline.map(t => t.endTime))
    : 0;
  
  // Calculate performance metrics
  const metrics = calculateMetrics(completedProcesses, totalExecutionTime);
  
  // Calculate energy metrics
  const energy = calculateEnergyMetrics(timeline, totalExecutionTime, powerProfile);
  
  // Return the simulation results
  return {
    timeline,
    completedProcesses,
    metrics,
    energy,
    totalExecutionTime
  };
};

// For server-side API simulation
export const simulateAlgorithm = async (req: any, res: any) => {
  try {
    const { processes, algorithm, timeQuantum, powerProfile } = req.body;
    
    if (!processes || !algorithm) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const result = await runSimulation(
      processes, 
      algorithm, 
      timeQuantum || 2,
      powerProfile || { active: 100, idle: 30, sleep: 5 }
    );
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Simulation API error:', error);
    return res.status(500).json({ error: 'Simulation failed' });
  }
};