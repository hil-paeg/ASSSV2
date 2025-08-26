import { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, PlusCircle, ArrowUpCircle, UserPlus } from 'lucide-react';

const RecentActivityCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activities = [
    {
      date: 'Today',
      items: [
        { id: 1, status: 'raised', text: 'Ticket #1234 status - raised', time: '2 hours ago', color: 'bg-green-500', icon: CheckCircle },
        { id: 2, status: 'confirmed by OEM', text: 'Ticket #1235 status - confirmed by OEM', time: '4 hours ago', color: 'bg-yellow-500', icon: AlertCircle },
        { id: 3, status: 'resolved', text: 'Ticket #1239 status - resolved', time: '5 hours ago', color: 'bg-blue-500', icon: AlertCircle },
      ],
    },
    {
      date: 'Yesterday',
      items: [
        { id: 4, status: 'resolved', text: 'New ticket #1236 status - resolved', time: '1 day ago', color: 'bg-blue-500', icon: PlusCircle },
        { id: 5, status: 'confirmed by OEM', text: 'Ticket #1237 status - confirmed by OEM', time: '1 day ago', color: 'bg-red-500', icon: ArrowUpCircle },
        { id: 6, status: 'confirmed by OEM', text: 'Ticket #1238 status - confirmed by OEM', time: '1 day ago', color: 'bg-purple-500', icon: UserPlus },
      ],
    },
  ];

  return (
    <div className="min-w-[300px] max-w-[400px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mr-6">Recent Activity</h2>
      </div>
      <div className="px-10 pb-6">
        {activities.map((group, index) => (
          <div key={index} className="mb-6 mx-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{group.date}</h3>
            <div className="space-y-3 relative pl-4">
              {/* Timeline line */}
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
              
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group relative"
                >
                  {/* Timeline dot */}
                  <div className={`w-3 h-3 ${item.color} rounded-full absolute -left-1.5 top-1/2 transform -translate-y-1/2 group-hover:scale-125 transition-transform duration-200 z-10`}></div>
                  
                  {/* Content */}
                  <div className="flex items-center space-x-3 ml-6">
                    <item.icon className={`w-5 h-5 ${item.color.replace('bg-', 'text-')} opacity-80 group-hover:opacity-100 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-full mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="ml-1 w-4 h-4" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="ml-1 w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default RecentActivityCard;