import React from 'react';
import { EnergyMetrics as EnergyMetricsType } from '../../types/simulation';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EnergyMetricsProps {
  energy: EnergyMetricsType;
  totalExecutionTime: number;
}

const EnergyMetrics: React.FC<EnergyMetricsProps> = ({ energy, totalExecutionTime }) => {
  
  // Prepare data for energy distribution chart
  const energyDistributionData = {
    labels: ['Active Energy', 'Idle Energy', 'Sleep Energy'],
    datasets: [
      {
        data: [energy.activeEnergy, energy.idleEnergy, energy.sleepEnergy],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate energy over time data
  const timePoints = 10; // Number of data points to show
  const interval = Math.max(1, Math.floor(totalExecutionTime / timePoints));
  
  const labels = [];
  for (let i = 0; i <= totalExecutionTime; i += interval) {
    labels.push(i);
    if (labels.length >= timePoints) break;
  }
  
  // Simulate energy consumption over time (for visualization purposes)
  const energyOverTimeData = {
    labels,
    datasets: [
      {
        label: 'Cumulative Energy Consumption',
        data: labels.map(time => (energy.totalEnergy / totalExecutionTime) * time),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
      }
    ],
  };
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };
  
  // Calculate energy saved percentage compared to always active state
  const maxPossibleEnergy = totalExecutionTime * (energy.totalEnergy / totalExecutionTime);
  const energySavedPercentage = ((maxPossibleEnergy - energy.totalEnergy) / maxPossibleEnergy) * 100;

  // Determine efficiency class based on energy efficiency score
  let efficiencyClass = 'bg-red-100 text-red-600';
  if (energy.energyEfficiency >= 80) {
    efficiencyClass = 'bg-green-100 text-green-600';
  } else if (energy.energyEfficiency >= 50) {
    efficiencyClass = 'bg-yellow-100 text-yellow-600';
  } else if (energy.energyEfficiency >= 30) {
    efficiencyClass = 'bg-orange-100 text-orange-600';
  }
  
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Energy Consumption Metrics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Energy</h4>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 mr-1">{energy.totalEnergy.toFixed(2)}</span>
            <span className="text-sm text-gray-600">joules</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Total energy consumed during the entire execution</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Average Power</h4>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 mr-1">{energy.averagePower.toFixed(2)}</span>
            <span className="text-sm text-gray-600">watts</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Average power consumption throughout execution</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Efficiency Score</h4>
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-gray-900 mr-1">{energy.energyEfficiency.toFixed(1)}</span>
            <span className="text-sm text-gray-600">/100</span>
          </div>
          <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${efficiencyClass}`}>
            {energy.energyEfficiency >= 80 ? 'Excellent' : 
             energy.energyEfficiency >= 60 ? 'Good' : 
             energy.energyEfficiency >= 40 ? 'Average' : 
             energy.energyEfficiency >= 20 ? 'Poor' : 'Very Poor'}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Energy Distribution</h4>
          <div className="h-64">
            <Doughnut data={energyDistributionData} options={options} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <p className="font-medium text-gray-900">{energy.activeEnergy.toFixed(1)} J</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">{energy.idleEnergy.toFixed(1)} J</p>
              <p className="text-xs text-gray-500">Idle</p>
            </div>
            <div>
              <p className="font-medium text-gray-900">{energy.sleepEnergy.toFixed(1)} J</p>
              <p className="text-xs text-gray-500">Sleep</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Energy Over Time</h4>
          <div className="h-64">
            <Bar 
              data={energyOverTimeData} 
              options={{
                ...options,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Time'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Energy (joules)'
                    },
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-medium text-blue-800 mb-2">Energy Efficiency Insights</h4>
        <p className="text-blue-700 mb-4">
          This algorithm achieved an efficiency score of <strong>{energy.energyEfficiency.toFixed(1)}</strong> out of 100. 
          {energy.energyEfficiency >= 80 
            ? ' This is excellent and indicates very effective use of power-saving states.'
            : energy.energyEfficiency >= 60
              ? ' This is good, with effective utilization of lower power states.'
              : energy.energyEfficiency >= 40
                ? ' This shows average efficiency with some opportunity for improvement.'
                : ' This indicates poor efficiency with significant room for improvement.'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium text-blue-900 mb-1">Energy Saving Analysis</h5>
            <p className="text-sm text-blue-700">
              Compared to always operating at maximum power, this scheduling saved approximately{' '}
              <strong>{energySavedPercentage.toFixed(1)}%</strong> of energy.
            </p>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-blue-900 mb-1">Optimization Opportunity</h5>
            <p className="text-sm text-blue-700">
              {energy.energyEfficiency < 60 
                ? 'Consider grouping similar processes together to maximize longer idle/sleep periods.'
                : 'The algorithm is doing well at optimizing for energy efficiency.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyMetrics;