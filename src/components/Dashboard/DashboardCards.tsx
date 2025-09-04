


// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Ticket,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Tag,
// } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { getContractualTicket } from "@/app/dashboard/actions";

// const DashboardCards: React.FC = () => {
//   const { user } = useAuth();
//   const [contract, setContract] = useState<any>(null);

//   useEffect(() => {
//     const fetchContract = async () => {
//       if (!user?.clientId) return;
//       const data = await getContractualTicket(user.clientId);
//       setContract(data);
//     };

//     fetchContract();
//   }, [user?.clientId]);

//   const cards = [
//     {
//       title: "Tickets Remaining",
//       value: contract
//         ? contract.allowed_tickets - contract.total_tickets_used
//         : 0,
//       icon: Ticket,
//       color: "text-blue-600",
//       bgColor: "bg-blue-50",
//       display: (
//         <span className="text-3xl font-bold">
//           {contract
//             ? contract.allowed_tickets - contract.total_tickets_used
//             : 0}
//         </span>
//       ),
//     },
//     {
//       title: "Tickets Used",
//       value: contract?.total_tickets_used || 0,
//       icon: CheckCircle,
//       color: "text-green-600",
//       bgColor: "bg-green-50",
//       display: (
//         <span className="text-3xl font-bold">
//           {contract?.total_tickets_used || 0}
//         </span>
//       ),
//     },
//     {
//       title: "Pending Tickets",
//       value: 2, // static for now
//       icon: Clock,
//       color: "text-yellow-600",
//       bgColor: "bg-yellow-50",
//       display: <span className="text-3xl font-bold">2</span>,
//     },
//     {
//       title: "High Priority",
//       value: 0,
//       icon: AlertCircle,
//       color: "text-red-600",
//       bgColor: "bg-red-50",
//       display: <span className="text-3xl font-bold">0</span>,
//     },
//     {
//       title: "RS1 Tickets",
//       value: contract?.ticket_typeRS1_used || 0,
//       icon: Tag,
//       color: "text-indigo-600",
//       bgColor: "bg-indigo-50",
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contract?.ticket_typeRS1_used || 0}</span>
//           <span className="text-base text-gray-500">
//             / {contract?.ticket_typeRS1 || 0}
//           </span>
//         </div>
//       ),
//     },
//     {
//       title: "RS2 Tickets",
//       value: contract?.ticket_typeRS2_used || 0,
//       icon: Tag,
//       color: "text-purple-600",
//       bgColor: "bg-purple-50",
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contract?.ticket_typeRS2_used || 0}</span>
//           <span className="text-base text-gray-500">
//             / {contract?.ticket_typeRS2 || 0}
//           </span>
//         </div>
//       ),
//     },
//     {
//       title: "RS 3-1 Tickets",
//       value: contract?.ticket_typeRS3_1_used || 0,
//       icon: Tag,
//       color: "text-pink-600",
//       bgColor: "bg-pink-50",
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contract?.ticket_typeRS3_1_used || 0}</span>
//           <span className="text-base text-gray-500">
//             / {contract?.ticket_typeRS3_1 || 0}
//           </span>
//         </div>
//       ),
//     },
//     {
//       title: "RS 3-2 Tickets",
//       value: contract?.ticket_typeRS3_2_used || 0,
//       icon: Tag,
//       color: "text-teal-600",
//       bgColor: "bg-teal-50",
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>{contract?.ticket_typeRS3_2_used || 0}</span>
//           <span className="text-base text-gray-500">
//             / {contract?.ticket_typeRS3_2 || 0}
//           </span>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {cards.map((card, index) => (
//         <Card
//           key={index}
//           className="hover:shadow-lg transition-shadow duration-200"
//         >
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               {card.title}
//             </CardTitle>
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
import { Ticket, Clock, CheckCircle, AlertCircle, Tag } from 'lucide-react';
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
    return <div>Loading dashboard...</div>;
  }

  if (error || !contractInfo || !contractInfo.contract) {
    return <div>{error || 'No contract found for this client'}</div>;
  }

  const cards = [
    {
      title: 'Tickets Remaining',
      value: contractInfo.contract.allowed_tickets - contractInfo.contract.total_tickets_used,
      icon: Ticket,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      display: (
        <span className="text-3xl font-bold">
          {contractInfo.contract.allowed_tickets - contractInfo.contract.total_tickets_used}
        </span>
      ),
    },
    {
      title: 'Tickets Used',
      value: contractInfo.contract.total_tickets_used,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      display: (
        <span className="text-3xl font-bold">
          {contractInfo.contract.total_tickets_used}
        </span>
      ),
    },
    {
      title: 'Pending Tickets',
      value: pendingTickets,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      display: <span className="text-3xl font-bold">{pendingTickets}</span>,
    },
    {
      title: 'High Priority',
      value: highPriorityTickets,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      display: <span className="text-3xl font-bold">{highPriorityTickets}</span>,
    },
    {
      title: 'RS1 Tickets',
      value: contractInfo.contract.ticket_typeRS1_used,
      icon: Tag,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contractInfo.contract.ticket_typeRS1_used}</span>
          <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS1}</span>
        </div>
      ),
    },
    {
      title: 'RS2 Tickets',
      value: contractInfo.contract.ticket_typeRS2_used,
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contractInfo.contract.ticket_typeRS2_used}</span>
          <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS2}</span>
        </div>
      ),
    },
    {
      title: 'RS 3-1 Tickets',
      value: contractInfo.contract.ticket_typeRS3_1_used,
      icon: Tag,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contractInfo.contract.ticket_typeRS3_1_used}</span>
          <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS3_1}</span>
        </div>
      ),
    },
    {
      title: 'RS 3-2 Tickets',
      value: contractInfo.contract.ticket_typeRS3_2_used,
      icon: Tag,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contractInfo.contract.ticket_typeRS3_2_used}</span>
          <span className="text-base text-gray-500">/ {contractInfo.contract.ticket_typeRS3_2}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>{card.display}</CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardCards;
