// import { useState } from 'react';
// import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, PlusCircle, ArrowUpCircle, UserPlus } from 'lucide-react';

// const RecentActivityCard = () => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   const activities = [
//     {
//       date: 'Today',
//       items: [
//         { id: 1, status: 'raised', text: 'Ticket #1234 status - raised', time: '2 hours ago', color: 'bg-green-500', icon: CheckCircle },
//         { id: 2, status: 'confirmed by OEM', text: 'Ticket #1235 status - confirmed by OEM', time: '4 hours ago', color: 'bg-yellow-500', icon: AlertCircle },
//         { id: 3, status: 'resolved', text: 'Ticket #1239 status - resolved', time: '5 hours ago', color: 'bg-blue-500', icon: AlertCircle },
//       ],
//     },
//     {
//       date: 'Yesterday',
//       items: [
//         { id: 4, status: 'resolved', text: 'New ticket #1236 status - resolved', time: '1 day ago', color: 'bg-blue-500', icon: PlusCircle },
//         { id: 5, status: 'confirmed by OEM', text: 'Ticket #1237 status - confirmed by OEM', time: '1 day ago', color: 'bg-red-500', icon: ArrowUpCircle },
//         { id: 6, status: 'confirmed by OEM', text: 'Ticket #1238 status - confirmed by OEM', time: '1 day ago', color: 'bg-purple-500', icon: UserPlus },
//       ],
//     },
//   ];

//   return (
//     <div className="min-w-[300px] max-w-[400px] bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl">
//       <div className="px-6 pt-6 pb-4">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight mr-6">Recent Activity</h2>
//       </div>
//       <div className="px-10 pb-6">
//         {activities.map((group, index) => (
//           <div key={index} className="mb-6 mx-6">
//             <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{group.date}</h3>
//             <div className="space-y-3 relative pl-4">
//               {/* Timeline line */}
//               <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600"></div>
              
//               {group.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex items-center space-x-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group relative"
//                 >
//                   {/* Timeline dot */}
//                   <div className={`w-3 h-3 ${item.color} rounded-full absolute -left-1.5 top-1/2 transform -translate-y-1/2 group-hover:scale-125 transition-transform duration-200 z-10`}></div>
                  
//                   {/* Content */}
//                   <div className="flex items-center space-x-3 ml-6">
//                     <item.icon className={`w-5 h-5 ${item.color.replace('bg-', 'text-')} opacity-80 group-hover:opacity-100 flex-shrink-0`} />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.text}</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//         <button
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="flex items-center justify-center w-full mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
//         >
//           {isExpanded ? (
//             <>
//               Show Less <ChevronUp className="ml-1 w-4 h-4" />
//             </>
//           ) : (
//             <>
//               Show More <ChevronDown className="ml-1 w-4 h-4" />
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RecentActivityCard;




import React, { useState } from 'react';
import { Phone, Mail, User, ChevronUp, AlertCircle, Info, MessageSquare } from 'lucide-react';

const EscalationPyramid = () => {
  const [hoveredLevel, setHoveredLevel] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const escalationData = [
    {
      level: 1,
      name: "Atish Thakur",
      designation: "Senior Executive",
      email: "atish.thakur@company.com",
      phone: "+91 98765 43210",
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-900",
      accentColor: "bg-blue-600",
      description: "First point of contact for general inquiries and support"
    },
    {
      level: 2,
      name: "Swapnil Randive",
      designation: "Manager",
      email: "swapnil.randive@company.com",
      phone: "+91 98765 43211",
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
      textColor: "text-orange-900",
      accentColor: "bg-orange-600",
      description: "Handles complex issues and team coordination"
    },
    {
      level: 3,
      name: "Rajesh Kadu",
      designation: "DGM ",
      email: "rajesh.kadu@company.com",
      phone: "+91 98765 43212",
      color: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      textColor: "text-red-900",
      accentColor: "bg-red-600",
      description: "Final escalation point for critical issues"
    }
  ];

 const ContactCard = ({ person, isVisible, delay }) => (
  <div 
    className={`absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 mr-6 bg-white rounded-lg shadow-lg border border-gray-200 p-6 min-w-80 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
    }`}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className={`w-12 h-12 ${person.accentColor} rounded-lg flex items-center justify-center`}>
        <User className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-900">{person.name}</h3>
        <p className="text-sm text-gray-600">{person.designation}</p>
      </div>
    </div>
    
    <p className="text-sm text-gray-600 mb-4">{person.description}</p>
    
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer group">
        <Mail className="w-3 h-3 text-gray-500 group-hover:text-blue-600" />
        <span className="text-xs text-gray-700">{person.email}</span>
      </div>
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer group">
        <Phone className="w-3 h-3 text-gray-500 group-hover:text-green-600" />
        <span className="text-xs text-gray-700">{person.phone}</span>
      </div>
    </div>
  </div>
);
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Issue Escalation Matrix</h1>
          </div>
        
        </div>

        {/* Process Flow */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-4 bg-gray-50 rounded-lg px-6 py-3 border border-gray-200">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-700 font-medium">Start from Level 1 → Escalate if unresolved within 24 hours</span>
          </div>
        </div>

        {/* Pyramid Structure */}
        <div className="relative flex flex-col items-center gap-8">
          {escalationData.reverse().map((person, index) => (
            <div
              key={person.level}
              className="relative"
              onMouseEnter={() => setHoveredLevel(person.level)}
              onMouseLeave={() => setHoveredLevel(null)}
              onClick={() => setSelectedLevel(selectedLevel === person.level ? null : person.level)}
            >
              {/* Pyramid Level */}
              <div 
                className="relative transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                style={{
                  width: `${320 + (index * 80)}px`,
                  height: '100px'
                }}
              >
                <div 
                  className={`w-full h-full bg-gradient-to-r ${person.color} rounded-lg border-2 ${person.borderColor} 
                    flex items-center justify-between px-6 relative group
                    ${hoveredLevel === person.level ? 'shadow-lg border-opacity-100' : 'shadow-sm border-opacity-50'}
                    ${selectedLevel === person.level ? 'ring-2 ring-blue-200' : ''}`}
                >
                  {/* Level Indicator */}
                  <div className="flex items-center gap-4">
                    <div className={`${person.accentColor} rounded-lg p-3 text-white font-bold text-lg min-w-12 text-center`}>
                      L{person.level}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${person.textColor}`}>{person.name}</h3>
                      <p className={`text-sm ${person.textColor} opacity-80`}>{person.designation}</p>
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className={`transition-all duration-300 ${
                    hoveredLevel === person.level ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
                  }`}>
                    <MessageSquare className={`w-5 h-5 ${person.textColor}`} />
                  </div>
                </div>

                {/* Escalation Arrow */}
                {index < escalationData.length - 1 && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="flex flex-col items-center">
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                      <span className="text-xs text-gray-500 font-medium mt-1">ESCALATE</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Card */}
              <ContactCard 
                person={person}
                isVisible={hoveredLevel === person.level || selectedLevel === person.level}
                delay={150}
              />
            </div>
          ))}
        </div>

        {/* Guidelines */}
      
        {/* Contact Instructions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Tip:</strong> Hover over each level to view detailed contact information
          </p>
        </div>
      </div>
    </div>
  );
};

export default EscalationPyramid;