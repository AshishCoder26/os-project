import React from 'react';
import { Process } from '../../types/simulation';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface PerformanceMetricsProps {
  metrics: {
    averageWaitingTime: number;
    averageTurnaroundTime: number;
    averageResponseTime: number;
    cpuUtilization: number;
    throughput: number;
  };
  completedProcesses: Process[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics, completedProcesses }) => {
  
  // Prepare data for process-specific metrics chart
  const processNames = completedProcesses.map(p => p.name);
  const waitingTimes = completedProcesses.map(p => p.waitingTime || 0);
  const turnaroundTimes = completedProcesses.map(p => p.turnaroundTime || 0);
  const responseTimes = completedProcesses.map(p => p.responseTime || 0);
  
  const processData = {
    labels: processNames,
    datasets: [
      {
        label: 'Waiting Time',
        data: waitingTimes,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
      },
      {
        label: 'Turnaround Time',
        data: turnaroundTimes,
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1
      },
      {
        label: 'Response Time',
        data: responseTimes,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1
      }
    ]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Process Metrics Comparison'
      }
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
  };
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <MetricCard 
          title="Average Waiting Time" 
          value={metrics.averageWaitingTime.toFixed(2)}
          unit="time units"
          description="Average time processes wait in the ready queue"
          colorClass="bg-blue-100 text-blue-600"
        />
        <MetricCard 
          title="Average Turnaround Time" 
          value={metrics.averageTurnaroundTime.toFixed(2)}
          unit="time units"
          description="Average time from arrival to completion"
          colorClass="bg-orange-100 text-orange-600"
        />
        <MetricCard 
          title="Average Response Time" 
          value={metrics.averageResponseTime.toFixed(2)}
          unit="time units"
          description="Average time from arrival to first execution"
          colorClass="bg-teal-100 text-teal-600"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <MetricCard 
          title="CPU Utilization" 
          value={metrics.cpuUtilization.toFixed(2)}
          unit="%"
          description="Percentage of time CPU is doing useful work"
          colorClass="bg-purple-100 text-purple-600"
        />
        <MetricCard 
          title="Throughput" 
          value={metrics.throughput.toFixed(4)}
          unit="processes/time unit"
          description="Number of processes completed per unit time"
          colorClass="bg-green-100 text-green-600"
        />
      </div>
      
      <div className="mt-8 h-80">
        <Bar data={processData} options={chartOptions} />
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  description: string;
  colorClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, description, colorClass }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-sm font-medium text-gray-500 mb-1">{title}</h4>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900 mr-1">{value}</span>
        <span className="text-sm text-gray-600">{unit}</span>
      </div>
      <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${colorClass}`}>
        {description}
      </div>
    </div>
  );
};

export default PerformanceMetrics;