import React, { useState } from 'react';
import { ArrowRight, Clock, Zap, Activity, CpuIcon } from 'lucide-react';

const AlgorithmsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('fcfs');

  const algorithms = [
    {
      id: 'fcfs',
      name: 'First-Come, First-Served (FCFS)',
      description: 'Processes are executed in the order they arrive in the ready queue.',
      energyEfficiency: 'Low to Medium',
      advantages: [
        'Simple to implement and understand',
        'No starvation (every process gets executed)',
        'Fair for processes that arrive in efficiency-optimal order'
      ],
      disadvantages: [
        'Can lead to the "convoy effect" (short processes stuck behind long ones)',
        'High average waiting time',
        'Not energy-efficient as it doesn\'t consider process characteristics',
        'No opportunity for energy-saving idle periods'
      ],
      energyDescription: 'FCFS doesn\'t optimize for energy consumption. Long-running CPU-bound processes prevent the system from entering low-power states, while I/O-bound processes may be delayed unnecessarily, increasing overall energy usage. It also doesn\'t group similar processes together to maximize processor idle periods.',
      image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'sjf',
      name: 'Shortest Job First (SJF)',
      description: 'Processes with the shortest burst time are scheduled first.',
      energyEfficiency: 'Medium',
      advantages: [
        'Minimizes average waiting time',
        'Potentially creates gaps for processor to enter sleep states',
        'Efficiently groups short processes together'
      ],
      disadvantages: [
        'Can lead to starvation of longer processes',
        'Requires prediction of burst time (not always feasible)',
        'Not always energy-optimal without power state consideration'
      ],
      energyDescription: 'SJF can be more energy-efficient than FCFS as it minimizes waiting time and can potentially create longer idle periods by grouping short jobs. However, it doesn\'t explicitly consider energy states or I/O characteristics, so it\'s not optimized for energy savings.',
      image: 'https://images.pexels.com/photos/1181325/pexels-photo-1181325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'srtf',
      name: 'Shortest Remaining Time First (SRTF)',
      description: 'Preemptive version of SJF where the process with shortest remaining time is executed.',
      energyEfficiency: 'Medium',
      advantages: [
        'Minimizes average waiting time even further than SJF',
        'Responsive to new short processes',
        'Can potentially group energy-similar processes together'
      ],
      disadvantages: [
        'Increased context switching overhead (energy cost)',
        'Requires continuous monitoring of remaining times',
        'Can lead to starvation of longer processes',
        'Context switches consume additional energy'
      ],
      energyDescription: 'SRTF introduces more context switches, which have energy costs due to cache invalidation and processor state changes. While it optimizes waiting time, the frequent preemption may prevent the processor from entering deeper sleep states, potentially reducing energy efficiency.',
      image: 'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'rr',
      name: 'Round Robin (RR)',
      description: 'Each process gets a small unit of CPU time (time quantum), and processes are scheduled in a circular queue.',
      energyEfficiency: 'Low',
      advantages: [
        'Fair allocation of CPU time',
        'No starvation',
        'Good for time-sharing systems',
        'Predictable response times'
      ],
      disadvantages: [
        'Higher context switching overhead',
        'Time quantum selection is critical',
        'Not energy-efficient due to frequent context switches',
        'Prevents processor from entering deep sleep states'
      ],
      energyDescription: 'Round Robin is generally energy-inefficient due to frequent context switches and the inability to leverage processor idle periods effectively. The constant cycling between processes prevents the CPU from entering lower power states for meaningful durations.',
      image: 'https://images.pexels.com/photos/230635/pexels-photo-230635.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    {
      id: 'priority',
      name: 'Priority Scheduling',
      description: 'Processes are scheduled based on priority values assigned to them.',
      energyEfficiency: 'Medium to High (if energy-aware)',
      advantages: [
        'Important processes can be prioritized',
        'Can be modified to be energy-aware by considering energy characteristics',
        'Flexible framework for incorporating various scheduling goals'
      ],
      disadvantages: [
        'Potential for starvation of low-priority processes',
        'Priority assignment can be complex',
        'Not inherently energy-efficient without explicit energy considerations'
      ],
      energyDescription: 'Priority scheduling can be adapted for energy efficiency by incorporating energy awareness into priority calculations. By assigning higher priorities to processes that have similar energy profiles or that benefit from being scheduled together, this algorithm can be tuned for better energy performance.',
      image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ];

  const currentAlgorithm = algorithms.find(algo => algo.id === activeTab);

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">CPU Scheduling Algorithms</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn about different CPU scheduling algorithms and their impact on performance and energy efficiency.
        </p>
      </div>

      {/* Algorithm Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-1 min-w-max border-b border-gray-200">
          {algorithms.map(algo => (
            <button
              key={algo.id}
              onClick={() => setActiveTab(algo.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors duration-200 rounded-t-lg
                ${activeTab === algo.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {algo.name}
            </button>
          ))}
        </div>
      </div>

      {currentAlgorithm && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Algorithm Description */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{currentAlgorithm.name}</h2>
              <p className="text-gray-700 mb-6">{currentAlgorithm.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    Advantages
                  </h3>
                  <ul className="space-y-2">
                    {currentAlgorithm.advantages.map((advantage, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                    <Activity className="mr-2 h-5 w-5 text-red-600" />
                    Disadvantages
                  </h3>
                  <ul className="space-y-2">
                    {currentAlgorithm.disadvantages.map((disadvantage, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                  <Zap className="mr-2 h-5 w-5 text-yellow-600" />
                  Energy Efficiency Analysis
                </h3>
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 mr-2">Efficiency Rating:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentAlgorithm.energyEfficiency.includes('High') 
                      ? 'bg-green-100 text-green-800' 
                      : currentAlgorithm.energyEfficiency.includes('Medium')
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {currentAlgorithm.energyEfficiency}
                  </span>
                </div>
                <p className="text-gray-700">{currentAlgorithm.energyDescription}</p>
              </div>
            </div>
          </div>

          {/* Algorithm Visualization */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-52 overflow-hidden">
              <img 
                src={currentAlgorithm.image} 
                alt={currentAlgorithm.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
              <div className="absolute bottom-0 left-0 p-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <CpuIcon className="mr-1 h-4 w-4" />
                  {currentAlgorithm.id.toUpperCase()}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Try in Simulation</h3>
              <p className="text-gray-600 mb-6">
                Experience how {currentAlgorithm.name} works in practice by running our interactive simulation.
              </p>
              <a 
                href="/simulation" 
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Run Simulation
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlgorithmsPage;