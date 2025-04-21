import React from 'react';
import { Book, FileText, Link as LinkIcon, ExternalLink, GraduationCap, Code } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  const resources = [
    {
      category: 'Documentation',
      icon: <Book className="h-6 w-6 text-blue-600" />,
      items: [
        {
          title: 'CPU Scheduling Fundamentals',
          description: 'A comprehensive guide to CPU scheduling algorithms and their performance characteristics.',
          link: '#'
        },
        {
          title: 'Energy Efficiency in Computing',
          description: 'Learn about energy consumption in modern processors and techniques for energy-aware scheduling.',
          link: '#'
        },
        {
          title: 'Power States and Transitions',
          description: 'Detailed explanation of processor power states (C-states) and the energy costs of transitions.',
          link: '#'
        }
      ]
    },
    {
      category: 'Research Papers',
      icon: <FileText className="h-6 w-6 text-green-600" />,
      items: [
        {
          title: 'Energy-Aware Task Scheduling in Real-Time Systems',
          authors: 'A. Smith, B. Johnson',
          journal: 'IEEE Transactions on Computing Systems, 2022',
          link: '#'
        },
        {
          title: 'Performance Analysis of Energy-Efficient Scheduling Algorithms',
          authors: 'C. Williams, D. Miller',
          journal: 'ACM Journal of Computing, 2021',
          link: '#'
        },
        {
          title: 'DVFS-Based Energy Optimization in Multicore Systems',
          authors: 'E. Davis, F. Garcia',
          journal: 'International Journal of Green Computing, 2023',
          link: '#'
        }
      ]
    },
    {
      category: 'External References',
      icon: <LinkIcon className="h-6 w-6 text-purple-600" />,
      items: [
        {
          title: 'Operating Systems Concepts',
          description: 'Classic textbook covering CPU scheduling algorithms and principles.',
          link: 'https://www.os-book.com'
        },
        {
          title: 'Energy-Efficient Computing',
          description: 'Research initiatives and best practices for energy-efficient software.',
          link: 'https://green-computing.org'
        },
        {
          title: 'Advanced Scheduling Techniques',
          description: 'Modern approaches to CPU scheduling in cloud and distributed environments.',
          link: 'https://advanced-scheduling.edu'
        }
      ]
    },
    {
      category: 'Learning Resources',
      icon: <GraduationCap className="h-6 w-6 text-orange-600" />,
      items: [
        {
          title: 'Interactive CPU Scheduling Tutorials',
          description: 'Step-by-step tutorials for understanding different scheduling algorithms.',
          link: '#'
        },
        {
          title: 'Energy Efficiency in Operating Systems',
          description: 'Online course covering power management and energy-aware scheduling.',
          link: '#'
        },
        {
          title: 'Advanced Scheduling Algorithms',
          description: 'Deep dive into modern scheduling approaches with case studies.',
          link: '#'
        }
      ]
    }
  ];
  
  const codeExamples = [
    {
      title: 'FCFS Implementation',
      language: 'typescript',
      code: `function simulateFCFS(processes) {
  // Sort by arrival time
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  
  let currentTime = 0;
  const results = [];
  
  for(const process of sortedProcesses) {
    // If there's a gap, move time forward
    if(process.arrivalTime > currentTime) {
      currentTime = process.arrivalTime;
    }
    
    const waitingTime = currentTime - process.arrivalTime;
    const startTime = currentTime;
    
    // Execute the process
    currentTime += process.burstTime;
    
    results.push({
      id: process.id,
      waitingTime,
      turnaroundTime: currentTime - process.arrivalTime,
      completionTime: currentTime
    });
  }
  
  return results;
}`
    },
    {
      title: 'Round Robin Implementation',
      language: 'typescript',
      code: `function simulateRoundRobin(processes, timeQuantum) {
  const readyQueue = [];
  const results = Array(processes.length).fill().map(() => ({
    waitingTime: 0,
    turnaroundTime: 0,
    completionTime: 0
  }));
  
  // Clone processes and initialize remaining time
  const remainingProcesses = processes.map(p => ({
    ...p,
    remainingTime: p.burstTime
  }));
  
  let currentTime = 0;
  let completed = 0;
  
  // Add initially arrived processes to ready queue
  remainingProcesses
    .filter(p => p.arrivalTime <= currentTime)
    .forEach(p => readyQueue.push(p));
  
  while(completed < processes.length) {
    if(readyQueue.length === 0) {
      // Find the next process to arrive
      const nextArrival = remainingProcesses
        .filter(p => p.remainingTime > 0 && p.arrivalTime > currentTime)
        .reduce((min, p) => p.arrivalTime < min.arrivalTime ? p : min);
      
      currentTime = nextArrival.arrivalTime;
      readyQueue.push(nextArrival);
      continue;
    }
    
    const currentProcess = readyQueue.shift();
    const executionTime = Math.min(timeQuantum, currentProcess.remainingTime);
    
    currentTime += executionTime;
    currentProcess.remainingTime -= executionTime;
    
    // Check for newly arrived processes
    remainingProcesses
      .filter(p => 
        p.remainingTime > 0 && 
        p.arrivalTime > currentTime - executionTime && 
        p.arrivalTime <= currentTime &&
        p.id !== currentProcess.id
      )
      .forEach(p => readyQueue.push(p));
    
    if(currentProcess.remainingTime > 0) {
      readyQueue.push(currentProcess);
    } else {
      completed++;
      
      // Record results
      const index = processes.findIndex(p => p.id === currentProcess.id);
      results[index].completionTime = currentTime;
      results[index].turnaroundTime = currentTime - processes[index].arrivalTime;
      results[index].waitingTime = results[index].turnaroundTime - processes[index].burstTime;
    }
  }
  
  return results;
}`
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Resources</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Explore our collection of documentation, research papers, and learning resources on CPU scheduling and energy efficiency.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {resources.map((category, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center">
              <span className="mr-3">{category.icon}</span>
              <h2 className="text-xl font-bold text-white">{category.category}</h2>
            </div>
            
            <div className="p-6">
              <ul className="space-y-6">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex items-start">
                      <ExternalLink className="h-5 w-5 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">
                          <a href={item.link} className="hover:text-blue-600 transition-colors">
                            {item.title}
                          </a>
                        </h3>
                        
                        {'description' in item && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                        
                        {'authors' in item && (
                          <div className="mt-1">
                            <p className="text-gray-700 text-sm font-medium">{item.authors}</p>
                            <p className="text-gray-500 text-sm italic">{item.journal}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 flex items-center">
          <Code className="h-6 w-6 text-yellow-400 mr-3" />
          <h2 className="text-xl font-bold text-white">Code Examples</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {codeExamples.map((example, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2 border-b">
                  <h3 className="font-medium text-gray-900">{example.title}</h3>
                </div>
                <div className="bg-gray-900 p-4 overflow-x-auto">
                  <pre className="text-gray-100 text-sm">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-8 text-center mb-12">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Have a Question?</h2>
        <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
          If you have any questions about CPU scheduling algorithms, energy efficiency, or how to use the simulator effectively, please don't hesitate to reach out.
        </p>
        <a 
          href="mailto:support@ecoscheduler.com" 
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default ResourcesPage;