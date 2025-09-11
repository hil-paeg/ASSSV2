// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Ticket, Clock, CheckCircle, AlertCircle, Tag } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { getClientContractInfo, getTicketStats } from '@/app/dashboard/actions';

// interface ContractInfo {
//   client: {
//     name: string;
//     startDate: Date;
//   };
//   contract: {
//     allowed_tickets: number;
//     total_tickets_used: number;
//     ticket_typeRS1: number;
//     ticket_typeRS1_used: number;
//     ticket_typeRS2: number;
//     ticket_typeRS2_used: number;
//     ticket_typeRS3_1: number;
//     ticket_typeRS3_1_used: number;
//     ticket_typeRS3_2: number;
//     ticket_typeRS3_2_used: number;
//   } | null;
//   endDate: Date | null;
//   daysRemaining: number;
//   nextSiteVisitDate: Date | null;
// }

// const DashboardCards: React.FC = () => {
//   const { user } = useAuth();
//   const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
//   const [pendingTickets, setPendingTickets] = useState<number>(0);
//   const [highPriorityTickets, setHighPriorityTickets] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.clientId) {
//         setError('No client ID available');
//         setLoading(false);
//         return;
//       }
//       try {
//         const [contractData, ticketStats] = await Promise.all([
//           getClientContractInfo(user.clientId),
//           getTicketStats(user.clientId),
//         ]);
//         setContractInfo(contractData);
//         setPendingTickets(ticketStats.pendingTickets);
//         setHighPriorityTickets(ticketStats.highPriorityTickets);
//         setLoading(false);
//       } catch (err) {
//         console.error('fetchData Error:', err);
//         setError('Failed to load dashboard data');
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user?.clientId]);

//   if (loading) {
//     return <div>Loading dashboard...</div>;
//   }

//   if (error || !contractInfo || !contractInfo.contract) {
//     return <div>{error || 'No contract found for this client'}</div>;
//   }

//   const cards = [
//     {
//       title: 'Tickets Remaining',
//       value: contractInfo.contract.allowed_tickets - contractInfo.contract.total_tickets_used,
//       icon: Ticket,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//       display: (
//         <span className="text-3xl font-bold">
//           {contractInfo.contract.allowed_tickets - contractInfo.contract.total_tickets_used}
//         </span>
//       ),
//     },
//     {
//       title: 'Tickets Used',
//       value: contractInfo.contract.total_tickets_used,
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//       display: (
//         <span className="text-3xl font-bold">
//           {contractInfo.contract.total_tickets_used}
//         </span>
//       ),
//     },
//     {
//       title: 'Pending Tickets',
//       value: pendingTickets,
//       icon: Clock,
//       color: 'text-yellow-600',
//       bgColor: 'bg-yellow-50',
//       display: <span className="text-3xl font-bold">{pendingTickets}</span>,
//     },
//     {
//       title: 'High Priority',
//       value: highPriorityTickets,
//       icon: AlertCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-50',
//       display: <span className="text-3xl font-bold">{highPriorityTickets}</span>,
//     },
//     {
//       title: 'RS1 Tickets',
//       value: contractInfo.contract.ticket_typeRS1_used,
//       icon: Tag,
//       color: 'text-indigo-600',
//       bgColor: 'bg-indigo-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contractInfo.contract.ticket_typeRS1_used}</span>
//           <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS1}</span>
//         </div>
//       ),
//     },
//     {
//       title: 'RS2 Tickets',
//       value: contractInfo.contract.ticket_typeRS2_used,
//       icon: Tag,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contractInfo.contract.ticket_typeRS2_used}</span>
//           <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS2}</span>
//         </div>
//       ),
//     },
//     {
//       title: 'RS 3-1 Tickets',
//       value: contractInfo.contract.ticket_typeRS3_1_used,
//       icon: Tag,
//       color: 'text-pink-600',
//       bgColor: 'bg-pink-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contractInfo.contract.ticket_typeRS3_1_used}</span>
//           <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS3_1}</span>
//         </div>
//       ),
//     },
//     {
//       title: 'RS 3-2 Tickets',
//       value: contractInfo.contract.ticket_typeRS3_2_used,
//       icon: Tag,
//       color: 'text-teal-600',
//       bgColor: 'bg-teal-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contractInfo.contract.ticket_typeRS3_2_used}</span>
//           <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS3_2}</span>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {cards.map((card, index) => (
//         <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
//             <div className={`p-2 rounded-lg ${card.bgColor}`}>
//               <card.icon className={`h-5 w-5 ${card.color}`} />
//             </div>
//           </CardHeader>
//           <CardContent>{card.display}</CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default DashboardCards;





'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, Clock, CheckCircle, AlertCircle, Tag, TrendingUp, Calendar, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getClientContractInfo, getTicketStats } from '@/app/dashboard/actions';

interface ContractInfo {
  client: {
    name: string;
    startDate: Date;
  };
  contract: {
    allowed_tickets: number;
    total_tickets_used: number;
    ticket_typeRS1: number;
    ticket_typeRS1_used: number;
    ticket_typeRS2: number;
    ticket_typeRS2_used: number;
    ticket_typeRS3_1: number;
    ticket_typeRS3_1_used: number;
    ticket_typeRS3_2: number;
    ticket_typeRS3_2_used: number;
  } | null;
  endDate: Date | null;
  daysRemaining: number;
  nextSiteVisitDate: Date | null;
}

// Mini Progress Ring Component
const ProgressRing: React.FC<{ percentage: number; size?: number; strokeWidth?: number; color?: string }> = ({ 
  percentage, 
  size = 60, 
  strokeWidth = 6,
  color = '#3b82f6'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

// Mini Bar Chart Component
const MiniBarChart: React.FC<{ used: number; total: number; color: string }> = ({ used, total, color }) => {
  const percentage = total > 0 ? (used / total) * 100 : 0;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Used</span>
          <span>Total</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{used}</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};

// Status Indicator Component
const StatusIndicator: React.FC<{ value: number; threshold?: number; type?: 'warning' | 'danger' | 'success' }> = ({ 
  value, 
  threshold = 5,
  type = 'warning'
}) => {
  const getStatusColor = () => {
    if (type === 'danger' && value > threshold) return 'bg-red-100 text-red-800 border-red-200';
    if (type === 'warning' && value > 0) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
      {type === 'danger' && value > threshold && '🔴'}
      {type === 'warning' && value > 0 && '⚠️'}
      {(type === 'success' || (type === 'warning' && value === 0)) && '✅'}
      <span className="ml-1">{value}</span>
    </div>
  );
};

const DashboardCards: React.FC = () => {
  const { user } = useAuth();
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [pendingTickets, setPendingTickets] = useState<number>(0);
  const [highPriorityTickets, setHighPriorityTickets] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.clientId) {
        setError('No client ID available');
        setLoading(false);
        return;
      }
      try {
        const [contractData, ticketStats] = await Promise.all([
          getClientContractInfo(user.clientId),
          getTicketStats(user.clientId),
        ]);
        setContractInfo(contractData);
        setPendingTickets(ticketStats.pendingTickets);
        setHighPriorityTickets(ticketStats.highPriorityTickets);
        setLoading(false);
      } catch (err) {
        console.error('fetchData Error:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.clientId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-16 bg-gray-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !contractInfo || !contractInfo.contract) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">{error || 'No contract found for this client'}</p>
        </div>
      </div>
    );
  }

  const ticketsRemaining = contractInfo.contract.allowed_tickets - contractInfo.contract.total_tickets_used;
  const usagePercentage = (contractInfo.contract.total_tickets_used / contractInfo.contract.allowed_tickets) * 100;

  const cards = [
    {
      title: 'Tickets Overview',
      subtitle: 'Remaining vs Used',
      value: ticketsRemaining,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      display: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-600">{ticketsRemaining}</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
            <ProgressRing 
              percentage={100 - usagePercentage} 
              color="#3b82f6"
              size={70}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Used: {contractInfo.contract.total_tickets_used}</span>
            <span className="text-gray-600">Total: {contractInfo.contract.allowed_tickets}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Usage Analytics',
      subtitle: 'Total consumption',
      value: contractInfo.contract.total_tickets_used,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      display: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-emerald-600">{contractInfo.contract.total_tickets_used}</div>
              <div className="text-sm text-gray-500">Used</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-emerald-600">{usagePercentage.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Utilization</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Active Tickets',
      subtitle: 'Pending resolution',
      value: pendingTickets,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      display: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-amber-600">{pendingTickets}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <StatusIndicator value={pendingTickets} type="warning" />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>Avg. resolution: 2-3 days</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Priority Alerts',
      subtitle: 'High priority tickets',
      value: highPriorityTickets,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      display: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-red-600">{highPriorityTickets}</div>
              <div className="text-sm text-gray-500">High Priority</div>
            </div>
            <StatusIndicator value={highPriorityTickets} threshold={2} type="danger" />
          </div>       
        </div>
      ),
    },
    {
      title: 'RS1 Support',
      value: contractInfo.contract.ticket_typeRS1_used,
      icon: Tag,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      display: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-600">
                {contractInfo.contract.ticket_typeRS1_used}
                <span className="text-lg text-gray-500">/{contractInfo.contract.ticket_typeRS1}</span>
              </div>
            </div>
            <ProgressRing 
              percentage={(contractInfo.contract.ticket_typeRS1_used / contractInfo.contract.ticket_typeRS1) * 100}
              color="#4f46e5"
              size={50}
            />
          </div>
          <MiniBarChart 
            used={contractInfo.contract.ticket_typeRS1_used}
            total={contractInfo.contract.ticket_typeRS1}
            color="#4f46e5"
          />
        </div>
      ),
    },
    {
      title: 'RS2 Support',
      value: contractInfo.contract.ticket_typeRS2_used,
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      display: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {contractInfo.contract.ticket_typeRS2_used}
                <span className="text-lg text-gray-500">/{contractInfo.contract.ticket_typeRS2}</span>
              </div>
            </div>
            <ProgressRing 
              percentage={(contractInfo.contract.ticket_typeRS2_used / contractInfo.contract.ticket_typeRS2) * 100}
              color="#9333ea"
              size={50}
            />
          </div>
          <MiniBarChart 
            used={contractInfo.contract.ticket_typeRS2_used}
            total={contractInfo.contract.ticket_typeRS2}
            color="#9333ea"
          />
        </div>
      ),
    },
    {
      title: 'RS3-1 Support',
      value: contractInfo.contract.ticket_typeRS3_1_used,
      icon: Tag,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      display: (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-pink-600">
                {contractInfo.contract.ticket_typeRS3_1_used}
                <span className="text-lg text-gray-500">/{contractInfo.contract.ticket_typeRS3_1}</span>
              </div>
            </div>
            <ProgressRing 
              percentage={(contractInfo.contract.ticket_typeRS3_1_used / contractInfo.contract.ticket_typeRS3_1) * 100}
              color="#ec4899"
              size={50}
            />
          </div>
          <MiniBarChart 
            used={contractInfo.contract.ticket_typeRS3_1_used}
            total={contractInfo.contract.ticket_typeRS3_1}
            color="#ec4899"
          />
        </div>
      ),
    },
    {
      title: 'RS3-2 Support',
      value: contractInfo.contract.ticket_typeRS3_2_used,
      icon: Tag,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      display: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-teal-600">
                {contractInfo.contract.ticket_typeRS3_2_used}
                <span className="text-lg text-gray-500">/{contractInfo.contract.ticket_typeRS3_2}</span>
              </div>
            </div>
            <ProgressRing 
              percentage={(contractInfo.contract.ticket_typeRS3_2_used / contractInfo.contract.ticket_typeRS3_2) * 100}
              color="#0d9488"
              size={50}
            />
          </div>
          <MiniBarChart 
            used={contractInfo.contract.ticket_typeRS3_2_used}
            total={contractInfo.contract.ticket_typeRS3_2}
            color="#0d9488"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className={`hover:shadow-xl transition-all duration-300 border-l-4 ${card.borderColor} bg-gradient-to-br from-white to-gray-50/30 hover:scale-[1.02]`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="space-y-1">
              <CardTitle className=" font-semibold text-gray-700">{card.title}</CardTitle>
              {card.subtitle && (
                <p className="text-xs text-gray-500">{card.subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${card.bgColor} shadow-sm`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {card.display}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;