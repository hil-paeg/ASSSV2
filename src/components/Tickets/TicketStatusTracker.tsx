import React from 'react';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface TicketStatusTrackerProps {
  status: 'raised' | 'confirmed by oem' | 'resolved' | 'closed';
}

const TicketStatusTracker: React.FC<TicketStatusTrackerProps> = ({ status }) => {
  const steps = [
    { key: 'raised', label: 'Raised', icon: AlertCircle },
    { key: 'confirmed by oem', label: 'Confirmed by OEM', icon: Clock },
    { key: 'resolved', label: 'Resolved', icon: CheckCircle },
    { key: 'closed', label: 'Closed', icon: XCircle },
  ];

  const getStepIndex = (stepKey: string) => {
    return steps.findIndex(step => step.key === stepKey);
  };

  const currentStepIndex = getStepIndex(status);

  return (
    <div className="flex items-center justify-between w-full max-w-lg">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;
        const isNext = index === currentStepIndex + 1;

        return (
          <div key={step.key} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                isCompleted || isCurrent
                  ? 'bg-green-500 border-green-500 text-white'
                  : isNext
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>

            <div className="ml-2 text-center">
              <p
                className={`text-xs font-medium ${
                  isCompleted || isCurrent || isNext ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-colors duration-300 ${
                  index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TicketStatusTracker;