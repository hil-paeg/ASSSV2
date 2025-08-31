// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Ticket, Clock, CheckCircle, AlertCircle, Tag } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// const DashboardCards: React.FC = () => {
//   const { user } = useAuth();

//   const cards = [
//     {
//       title: 'Tickets Remaining',
//       value: user?.ticketsRemaining || 0,
//       icon: Ticket,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50',
//       display: <span className="text-3xl font-bold">{user?.ticketsRemaining || 0}</span>,
//     },
//     {
//       title: 'Tickets Used',
//       value: user?.role === 'user' ? 12 - (user?.ticketsRemaining || 12) : 45,
//       icon: CheckCircle,
//       color: 'text-green-600',
//       bgColor: 'bg-green-50',
//       display: <span className="text-3xl font-bold">{user?.role === 'user' ? 12 - (user?.ticketsRemaining || 12) : 45}</span>,
//     },
//     {
//       title: 'Pending Tickets',
//       value: 2,
//       icon: Clock,
//       color: 'text-yellow-600',
//       bgColor: 'bg-yellow-50',
//       display: <span className="text-3xl font-bold">2</span>,
//     },
//     {
//       title: 'High Priority',
//       value: 1,
//       icon: AlertCircle,
//       color: 'text-red-600',
//       bgColor: 'bg-red-50',
//       display: <span className="text-3xl font-bold">1</span>,
//     },
//     {
//       title: 'RS1 Tickets',
//       value: 3,
//       icon: Tag,
//       color: 'text-indigo-600',
//       bgColor: 'bg-indigo-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>3</span>
//           <span className="text-base text-gray-500">/ 12</span>
//         </div>
//       ),
//     },
//     {
//       title: 'RS2 Tickets',
//       value: 1,
//       icon: Tag,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>1</span>
//           <span className="text-base text-gray-500">/ 12</span>
//         </div>
//       ),
//     },
//     {
//       title: 'RS 3-1 Tickets',
//       value: 0,
//       icon: Tag,
//       color: 'text-pink-600',
//       bgColor: 'bg-pink-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>0</span>
//           <span className="text-base text-gray-500">/ 12</span>
//         </div>
//       ),
//     },
//     {
//       title: 'RS 3-2 Tickets',
//       value: 2,
//       icon: Tag,
//       color: 'text-teal-600',
//       bgColor: 'bg-teal-50',
//       display: (
//         <div className="text-3xl font-bold flex items-baseline gap-1">
//           <span>2</span>
//           <span className="text-base text-gray-500">/ 12</span>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {cards.map((card, index) => (
//         <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-gray-600">
//               {card.title}
//             </CardTitle>
//             <div className={`p-2 rounded-lg ${card.bgColor}`}>
//               <card.icon className={`h-5 w-5 ${card.color}`} />
//             </div>
//           </CardHeader>
//           <CardContent>
//             {card.display}
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default DashboardCards;


"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
  Tag,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getContractualTicket } from "@/app/dashboard/actions";

const DashboardCards: React.FC = () => {
  const { user } = useAuth();
  const [contract, setContract] = useState<any>(null);

  useEffect(() => {
    const fetchContract = async () => {
      if (!user?.clientId) return;
      const data = await getContractualTicket(user.clientId);
      setContract(data);
    };

    fetchContract();
  }, [user?.clientId]);

  const cards = [
    {
      title: "Tickets Remaining",
      value: contract
        ? contract.allowed_tickets - contract.total_tickets_used
        : 0,
      icon: Ticket,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      display: (
        <span className="text-3xl font-bold">
          {contract
            ? contract.allowed_tickets - contract.total_tickets_used
            : 0}
        </span>
      ),
    },
    {
      title: "Tickets Used",
      value: contract?.total_tickets_used || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      display: (
        <span className="text-3xl font-bold">
          {contract?.total_tickets_used || 0}
        </span>
      ),
    },
    {
      title: "Pending Tickets",
      value: 2, // static for now
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      display: <span className="text-3xl font-bold">2</span>,
    },
    {
      title: "High Priority",
      value: 0,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      display: <span className="text-3xl font-bold">0</span>,
    },
    {
      title: "RS1 Tickets",
      value: contract?.ticket_typeRS1_used || 0,
      icon: Tag,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contract?.ticket_typeRS1_used || 0}</span>
          <span className="text-base text-gray-500">
            / {contract?.ticket_typeRS1 || 0}
          </span>
        </div>
      ),
    },
    {
      title: "RS2 Tickets",
      value: contract?.ticket_typeRS2_used || 0,
      icon: Tag,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contract?.ticket_typeRS2_used || 0}</span>
          <span className="text-base text-gray-500">
            / {contract?.ticket_typeRS2 || 0}
          </span>
        </div>
      ),
    },
    {
      title: "RS 3-1 Tickets",
      value: contract?.ticket_typeRS3_1_used || 0,
      icon: Tag,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contract?.ticket_typeRS3_1_used || 0}</span>
          <span className="text-base text-gray-500">
            / {contract?.ticket_typeRS3_1 || 0}
          </span>
        </div>
      ),
    },
    {
      title: "RS 3-2 Tickets",
      value: contract?.ticket_typeRS3_2_used || 0,
      icon: Tag,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      display: (
        <div className="text-3xl font-bold flex items-baseline gap-1">
          <span>{contract?.ticket_typeRS3_2_used || 0}</span>
          <span className="text-base text-gray-500">
            / {contract?.ticket_typeRS3_2 || 0}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
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
