// import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Calendar, Building, Clock, Mail, Cpu, LifeBuoy, Truck, BookOpen, User } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// const ContractInfo = () => {
//   const { user } = useAuth();

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
//   };

//   const getDaysRemaining = () => {
//     if (!user?.contractEndDate) return 0;
//     const endDate = new Date(user.contractEndDate);
//     const today = new Date();
//     const diffTime = endDate.getTime() - today.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return Math.max(0, diffDays);
//   };

//   if (user?.role === 'admin') {
//     return null;
//   }

//   return (
//     <Card className="bg-white shadow-md border border-gray-200">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
//           <Building className="h-5 w-5 text-blue-600" />
//           Contract Information
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="p-6 space-y-6">
//         {/* Company Info Section */}
//         <div className="space-y-2">
//           <h3 className="text-xl font-semibold text-gray-700">Company Info</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">Start Date</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">
//                 {user?.contractStartDate ? formatDate(user.contractStartDate) : 'N/A'}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">End Date</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">
//                 {user?.contractEndDate ? formatDate(user.contractEndDate) : 'N/A'}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Clock className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">Days Remaining</span>
//               </div>
//               <span className="text-sm font-semibold text-red-600">
//                 {getDaysRemaining()} days
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Building className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">Company</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">
//                 {user?.company || 'N/A'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Ticket Distribution Section */}
//         <div className="space-y-2">
//           <h3 className="text-xl font-semibold text-gray-700">Ticket Distribution</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Mail className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">RS 1</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">1</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Cpu className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">RS 2</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">5</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <LifeBuoy className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">RS 3-1</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">3</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <LifeBuoy className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">RS 3-2</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">3</span>
//             </div>
//           </div>
//         </div>

//         {/* OEM Activities Section */}
//         <div className="space-y-2">
//           <h3 className="text-xl font-semibold text-gray-700">OEM Activities</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Truck className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">Site Visit by OEM</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">
//                 {formatDate('2025-07-29')}
//               </span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <BookOpen className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">Training by OEM</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">NA</span>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <User className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm font-medium text-gray-600">First Person of Contact</span>
//               </div>
//               <span className="text-sm font-semibold text-blue-600">HIL</span>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ContractInfo;



"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Building,
  Clock,
  Mail,
  Cpu,
  LifeBuoy,
  Truck,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getClientContractInfo } from "@/app/dashboard/actions";

const ContractInfo: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (user?.role === "admin") return;

    (async () => {
      if (!user?.clientId) return;
      const info = await getClientContractInfo(user.clientId);
      setData(info);
    })();
  }, [user]);

  const formatDate = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A";

  if (!user || user.role === "admin") return null;

  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
          <Building className="h-5 w-5 text-blue-600" />
          Contract Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Company Info */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700">Company Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Start Date</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {formatDate(data?.client.startDate) ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">End Date</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {formatDate(data?.endDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Days Remaining</span>
              </div>
              <span className="text-sm font-semibold text-red-600">
                {data?.daysRemaining ?? 0} days
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Company</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">{data?.client.name ?? "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Ticket Distribution */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700">Ticket Distribution</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            {([
              { label: "RS 1", usedKey: "ticket_typeRS1_used", totalKey: "ticket_typeRS1", Icon: Mail },
              { label: "RS 2", usedKey: "ticket_typeRS2_used", totalKey: "ticket_typeRS2", Icon: Cpu },
              { label: "RS 3‑1", usedKey: "ticket_typeRS3_1_used", totalKey: "ticket_typeRS3_1", Icon: LifeBuoy },
              { label: "RS 3‑2", usedKey: "ticket_typeRS3_2_used", totalKey: "ticket_typeRS3_2", Icon: LifeBuoy },
            ] as const).map(({ label, usedKey, totalKey, Icon }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">
                  {data?.contract ? `${data.contract[usedKey as keyof typeof data.contract]} / ${data.contract[totalKey as keyof typeof data.contract]}` : "0 / 0"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* OEM Activities */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-700">OEM Activities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Site Visit by OEM</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {formatDate(data?.nextSiteVisitDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LifeBuoy className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-600">Training by OEM</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">N/A</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractInfo;
