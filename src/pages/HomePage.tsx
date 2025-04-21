import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, BarChart2, Zap, Clock, Battery, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
                Energy-Efficient <span className="text-blue-600">CPU Scheduling</span> Algorithms
              </h1>
              <p className="text-xl text-gray-600">
                Explore, visualize, and compare different CPU scheduling algorithms and their impact on energy consumption and system performance.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/simulation"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                >
                  Start Simulation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/algorithms"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 transition-colors duration-300"
                >
                  Learn About Algorithms
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative h-96 w-full bg-blue-100 rounded-lg overflow-hidden shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Cpu className="h-48 w-48 text-blue-800 opacity-20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-6 px-8">
                    <div className="h-6 bg-blue-200 rounded-full w-3/4 animate-pulse"></div>
                    <div className="h-6 bg-blue-300 rounded-full w-2/3 animate-pulse delay-100"></div>
                    <div className="h-6 bg-blue-400 rounded-full w-5/6 animate-pulse delay-200"></div>
                    <div className="h-6 bg-blue-300 rounded-full w-1/2 animate-pulse delay-300"></div>
                    <div className="h-6 bg-blue-200 rounded-full w-2/3 animate-pulse delay-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Understand CPU Scheduling And Energy Efficiency</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform helps you learn about various scheduling algorithms and their impact on system performance and energy consumption.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-blue-600" />}
              title="Scheduling Algorithms"
              description="Learn about FCFS, SJF, Round Robin, Priority, and other scheduling algorithms through interactive visualizations."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-blue-600" />}
              title="Energy Efficiency"
              description="Understand how different scheduling decisions affect power consumption and battery life in computing systems."
            />
            <FeatureCard
              icon={<BarChart2 className="h-10 w-10 text-blue-600" />}
              title="Performance Metrics"
              description="Compare waiting time, turnaround time, throughput, and other key performance indicators across algorithms."
            />
            <FeatureCard
              icon={<Battery className="h-10 w-10 text-blue-600" />}
              title="Power Profiles"
              description="Simulate different power consumption profiles and see their impact on overall energy usage."
            />
            <FeatureCard
              icon={<Cpu className="h-10 w-10 text-blue-600" />}
              title="Interactive Simulation"
              description="Create your own process set and watch how different algorithms schedule them in real-time."
            />
            <FeatureCard
              icon={<ArrowRight className="h-10 w-10 text-blue-600" />}
              title="Educational Resources"
              description="Access comprehensive guides, research papers, and references on CPU scheduling and energy efficiency."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Ready to Explore CPU Scheduling?</h2>
            <p className="mt-4 text-xl text-blue-100 max-w-3xl mx-auto">
              Start learning about energy-efficient CPU scheduling algorithms through our interactive tools.
            </p>
            <div className="mt-8">
              <Link
                to="/simulation"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-300"
              >
                Start Simulating Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </div>
  );
};

export default HomePage;