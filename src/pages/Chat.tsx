import ChatInterface from '@/components/Chat/ChatInterface';
import React from 'react';


const Chat: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with support team or manage user conversations</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border h-[calc(100%-5rem)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;