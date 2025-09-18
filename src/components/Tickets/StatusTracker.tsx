

// 'use client';

// import React from 'react';
// import { FileText, PlayCircle, Shield, CheckCircle, XCircle } from 'lucide-react';

// interface StatusTrackerProps {
//   status: 'raised' | 'in-progress' | 'confirmed by oem' | 'resolved' | 'closed';
//   priority?: string;
//   createdAt: string;
// }

// export const StatusTracker: React.FC<StatusTrackerProps> = ({ status, priority, createdAt }) => {
//   const statuses = [
//     { key: 'raised', label: 'Raised', icon: FileText },
//     { key: 'confirmed by oem', label: 'Confirmed by OEM', icon: Shield },
//     { key: 'resolved', label: 'Resolved', icon: CheckCircle },
//     { key: 'closed', label: 'Closed', icon: XCircle }
//   ];

//   const getStatusIndex = (currentStatus: string) => {
//     return statuses.findIndex(s => s.key === currentStatus);
//   };

//   const currentIndex = getStatusIndex(status);

//   // const getStatusColor = (index: number) => {
//   //   if (index <= currentIndex) {
//   //     return 'text-emerald-600 bg-emerald-100 border-emerald-300';
//   //   }
//   //   return 'text-slate-400 bg-slate-100 border-slate-200';
//   // };

//   const getLineColor = (index: number) => {
//     if (index < currentIndex) {
//       return 'bg-emerald-500';
//     }
//     return 'bg-slate-200';
//   };

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between relative">
//         {statuses.map((statusItem, index) => {
//           const Icon = statusItem.icon;
//           const isActive = index <= currentIndex;
//           const isCompleted = index < currentIndex;
          
//           return (
//             <div key={statusItem.key} className="flex flex-col items-center relative z-10">
//               {/* Status Icon */}
//               <div className={`
//                 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
              
//                 ${isActive ? 'shadow-md' : ''}
//               `}>
//                 <Icon className="h-5 w-5" />
//               </div>
              
//               {/* Status Label */}
//               <span className={`
//                 text-xs font-medium mt-2 text-center max-w-20
//                 ${isActive ? 'text-slate-700' : 'text-slate-400'}
//               `}>
//                 {statusItem.label}
//               </span>
//             </div>
//           );
//         })}
        
//         {/* Connecting Lines */}
//         <div className="absolute top-5 left-0 right-0 flex items-center justify-between px-5">
//           {statuses.slice(0, -1).map((_, index) => (
//             <div
//               key={index}
//               className={`
//                 h-0.5 flex-1 mx-2 transition-all duration-500
//                 ${getLineColor(index)}
//               `}
//             />
//           ))}
//         </div>
//       </div>
      
//       {/* Timeline Info */}
//       <div className="mt-4 text-center">
//         <p className="text-xs text-slate-500">
//           Created: {new Date(createdAt).toLocaleDateString('en-US', { 
//             year: 'numeric', 
//             month: 'short', 
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })}
//         </p>
//       </div>
//     </div>
//   );
// };



'use client';

import React from 'react';
import { FileText, PlayCircle, Shield, CheckCircle, XCircle } from 'lucide-react';

interface StatusTrackerProps {
  status: 'raised' | 'in-progress' | 'confirmed by oem' | 'resolved' | 'closed';
  priority?: string | null;
  createdAt: string;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({ status, priority, createdAt }) => {
  const statuses = [
    { key: 'raised', label: 'Raised', icon: FileText },
    { key: 'confirmed by oem', label: 'Confirmed by OEM', icon: Shield },
    { key: 'resolved', label: 'Resolved', icon: CheckCircle },
    { key: 'closed', label: 'Closed', icon: XCircle },
  ];

  const getStatusIndex = (currentStatus: string) => {
    return statuses.findIndex(s => s.key === currentStatus);
  };

  const currentIndex = getStatusIndex(status);

  const getStatusColor = (index: number) => {
    if (index <= currentIndex) {
      return 'bg-emerald-500 text-white border-emerald-600';
    }
    return 'bg-slate-200 text-slate-400 border-slate-300';
  };

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
          
          return (
            <div key={statusItem.key} className="flex flex-col items-center relative z-10">
              {/* Status Icon */}
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
                ${getStatusColor(index)}
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