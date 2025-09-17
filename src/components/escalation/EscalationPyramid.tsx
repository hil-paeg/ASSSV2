'use client';

import React, { useState } from 'react';
import { Phone, Mail, User, ChevronUp, AlertCircle, Info, MessageSquare } from 'lucide-react';

interface Admin {
  admin_id: number;
  name: string;
  designation: string;
  email?: string;
  mobile_number?: string;
}

interface EscalationPyramidProps {
  admins: Admin[];
}

const EscalationPyramid: React.FC<EscalationPyramidProps> = ({ admins }) => {
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Assign colors & styles dynamically by level
  const levelStyles = [
    {
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      accentColor: 'bg-blue-600',
    },
    {
      color: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-900',
      accentColor: 'bg-orange-600',
    },
    {
      color: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      accentColor: 'bg-red-600',
    },
    {
      color: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-900',
      accentColor: 'bg-purple-600',
    },
  ];

  const ContactCard = ({ person, isVisible, delay }: { person: Admin & any; isVisible: boolean; delay: number }) => (
    <div
      className={`absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 mr-6 
        bg-white rounded-lg shadow-lg border border-gray-200 p-6 min-w-80 z-50 transition-all duration-300
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'}`}
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

      <div className="space-y-2">
        {person.email && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer group">
            <Mail className="w-3 h-3 text-gray-500 group-hover:text-blue-600" />
            <span className="text-xs text-gray-700">{person.email}</span>
          </div>
        )}
        {person.mobile_number && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors cursor-pointer group">
            <Phone className="w-3 h-3 text-gray-500 group-hover:text-green-600" />
            <span className="text-xs text-gray-700">{person.mobile_number}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white p-6">
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
            <span className="text-sm text-gray-700 font-medium">
              Start from Level 0 → Escalate if unresolved within 24 hours
            </span>
          </div>
        </div>

        {/* Pyramid Structure */}
        <div className="relative flex flex-col items-center gap-8">
          {admins
            .map((admin, index) => ({
              ...admin,
              level: index,
              ...(levelStyles[index % levelStyles.length]), // assign style based on index
            }))
            .reverse()
            .map((person, index, arr) => (
              <div
                key={person.admin_id}
                className="relative"
                onMouseEnter={() => setHoveredLevel(person.level)}
                onMouseLeave={() => setHoveredLevel(null)}
                onClick={() => setSelectedLevel(selectedLevel === person.level ? null : person.level)}
              >
                {/* Pyramid Level */}
                <div
                  className="relative transform transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  style={{
                    width: `${320 + index * 80}px`,
                    height: '100px',
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
                      <div
                        className={`${person.accentColor} rounded-lg p-3 text-white font-bold text-lg min-w-12 text-center`}
                      >
                        L{person.level}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${person.textColor}`}>{person.name}</h3>
                        <p className={`text-sm ${person.textColor} opacity-80`}>{person.designation}</p>
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    <div
                      className={`transition-all duration-300 ${
                        hoveredLevel === person.level ? 'opacity-100 scale-100' : 'opacity-50 scale-90'
                      }`}
                    >
                      <MessageSquare className={`w-5 h-5 ${person.textColor}`} />
                    </div>
                  </div>

                  {/* Escalation Arrow */}
                  {index < arr.length - 1 && (
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

        {/* Tip */}
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
