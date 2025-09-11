// import { Badge } from "@/components/ui/badge";

// interface StatusTrackerProps {
//   status: string;
//   priority: string;
//   createdAt: string;
// }

// export const StatusTracker = ({ status, priority, createdAt }: StatusTrackerProps) => {
//   const statusConfig = {
//     'raised': { label: 'Raised', color: 'bg-blue-100 text-blue-800 border-blue-200' },
//     'in-progress': { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
//     'confirmed by oem': { label: 'Confirmed by OEM', color: 'bg-purple-100 text-purple-800 border-purple-200' },
//     'resolved': { label: 'Resolved', color: 'bg-green-100 text-green-800 border-green-200' },
//     'closed': { label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-200' }
//   };

//   const priorityColors = {
//     'high': 'bg-red-500',
//     'medium': 'bg-yellow-500',
//     'low': 'bg-green-500',
//     'default': 'bg-gray-500'
//   };

//   const statusOrder = ['raised', 'in-progress', 'confirmed by oem', 'resolved', 'closed'];
//   const currentStatusIndex = statusOrder.indexOf(status.toLowerCase());
//   const progressPercentage = (currentStatusIndex / (statusOrder.length - 1)) * 100;

//   return (
//     <div className="space-y-4 md:space-y-5 w-full">
//       <div className="flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//           <span className="text-sm font-medium text-gray-600">Status:</span>
//           <Badge 
//             variant="outline" 
//             className={`text-sm md:text-base px-2.5 py-1.5 rounded-md border ${statusConfig[status.toLowerCase()]?.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}
//           >
//             {statusConfig[status.toLowerCase()]?.label || status}
//           </Badge>
//         </div>
//         <div className="flex items-center space-x-2">
//           <span 
//             className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${priorityColors[priority.toLowerCase() as keyof typeof priorityColors] || priorityColors.default}`}
//             title={`${priority} priority`}
//             aria-label={`Priority ${priority}`}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between text-xs md:text-sm text-gray-500">
//           <span>Step {currentStatusIndex + 1} of {statusOrder.length}</span>
//         </div>
//         <div className="grid grid-cols-5 gap-1.5 md:gap-2">
//           {statusOrder.map((statusItem, index) => {
//             const isFilled = index <= currentStatusIndex;
//             return (
//               <div
//                 key={`seg-${statusItem}`}
//                 className={`h-2 md:h-2.5 rounded-full transition-colors ${isFilled ? 'bg-blue-600' : 'bg-gray-200'}`}
//                 title={statusConfig[statusItem]?.label || statusItem}
//               />
//             );
//           })}
//         </div>
//       </div>

//       <div className="grid grid-cols-5 gap-3 md:gap-4 text-center">
//         {statusOrder.map((statusItem, index) => {
//           const isCompleted = index <= currentStatusIndex;
//           const isCurrent = index === currentStatusIndex;
          
//           return (
//             <div key={statusItem} className="flex flex-col items-center">
//               <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full mb-1 ${
//                 isCompleted ? 'bg-blue-600' : 'bg-gray-200'
//               }`} />
//               <span 
//                 className={`text-[10px] md:text-xs ${isCurrent ? 'font-semibold text-blue-700' : 'text-gray-400'}`}
//                 title={statusConfig[statusItem]?.label || statusItem}
//               >
//                 {statusConfig[statusItem]?.label || statusItem}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };


'use client';

import React from 'react';
import { FileText, PlayCircle, Shield, CheckCircle, XCircle } from 'lucide-react';

interface StatusTrackerProps {
  status: 'raised' | 'in-progress' | 'confirmed by oem' | 'resolved' | 'closed';
  priority?: string;
  createdAt: string;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ status, priority, createdAt }) => {
  const statuses = [
    { key: 'raised', label: 'Raised', icon: FileText },
    { key: 'confirmed by oem', label: 'Confirmed by OEM', icon: Shield },
    { key: 'resolved', label: 'Resolved', icon: CheckCircle },
    { key: 'closed', label: 'Closed', icon: XCircle }
  ];

  const getStatusIndex = (currentStatus: string) => {
    return statuses.findIndex(s => s.key === currentStatus);
  };

  const currentIndex = getStatusIndex(status);

  // const getStatusColor = (index: number) => {
  //   if (index <= currentIndex) {
  //     return 'text-emerald-600 bg-emerald-100 border-emerald-300';
  //   }
  //   return 'text-slate-400 bg-slate-100 border-slate-200';
  // };

  const getLineColor = (index: number) => {
    if (index < currentIndex) {
      return 'bg-emerald-500';
    }
    return 'bg-slate-200';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {statuses.map((statusItem, index) => {
          const Icon = statusItem.icon;
          const isActive = index <= currentIndex;
          const isCompleted = index < currentIndex;
          
          return (
            <div key={statusItem.key} className="flex flex-col items-center relative z-10">
              {/* Status Icon */}
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
              
                ${isActive ? 'shadow-md' : ''}
              `}>
                <Icon className="h-5 w-5" />
              </div>
              
              {/* Status Label */}
              <span className={`
                text-xs font-medium mt-2 text-center max-w-20
                ${isActive ? 'text-slate-700' : 'text-slate-400'}
              `}>
                {statusItem.label}
              </span>
            </div>
          );
        })}
        
        {/* Connecting Lines */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-between px-5">
          {statuses.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={`
                h-0.5 flex-1 mx-2 transition-all duration-500
                ${getLineColor(index)}
              `}
            />
          ))}
        </div>
      </div>
      
      {/* Timeline Info */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Created: {new Date(createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
};
