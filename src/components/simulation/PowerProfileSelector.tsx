import React from 'react';
import { Battery, BatteryLow, BatteryMedium } from 'lucide-react';

interface PowerProfileSelectorProps {
  powerProfile: {
    active: number;
    idle: number;
    sleep: number;
  };
  setPowerProfile: (profile: { active: number; idle: number; sleep: number }) => void;
}

const PowerProfileSelector: React.FC<PowerProfileSelectorProps> = ({ 
  powerProfile, 
  setPowerProfile 
}) => {
  const handleChange = (key: keyof typeof powerProfile, value: number) => {
    setPowerProfile({
      ...powerProfile,
      [key]: value
    });
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Power Consumption Profile</h3>
      <p className="text-sm text-gray-600 mb-4">
        Adjust the power consumption values for different CPU states (in watts).
      </p>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Battery className="h-4 w-4 mr-1 text-green-600" />
              Active Power
            </label>
            <span className="text-sm text-gray-600">{powerProfile.active} W</span>
          </div>
          <input
            type="range"
            min="50"
            max="200"
            value={powerProfile.active}
            onChange={(e) => handleChange('active', parseInt(e.target.value))}
            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>50W</span>
            <span>200W</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <BatteryMedium className="h-4 w-4 mr-1 text-yellow-600" />
              Idle Power
            </label>
            <span className="text-sm text-gray-600">{powerProfile.idle} W</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={powerProfile.idle}
            onChange={(e) => handleChange('idle', parseInt(e.target.value))}
            className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>10W</span>
            <span>80W</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <BatteryLow className="h-4 w-4 mr-1 text-blue-600" />
              Sleep Power
            </label>
            <span className="text-sm text-gray-600">{powerProfile.sleep} W</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={powerProfile.sleep}
            onChange={(e) => handleChange('sleep', parseInt(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>1W</span>
            <span>20W</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-gray-700">
        <p>
          <strong>Note:</strong> These values simulate the power consumption of a CPU in different states. 
          Adjusting them will affect the energy efficiency calculations in the simulation results.
        </p>
      </div>
    </div>
  );
};

export default PowerProfileSelector;