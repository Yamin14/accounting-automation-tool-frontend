import React from 'react';

const ChatMessage: React.FC<{ role: 'user' | 'bot'; message: string }> = ({ role, message }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${isUser ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'bg-gray-100 text-gray-900'} max-w-[80%] p-3 rounded-2xl`}>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
      </div>
    </div>
  );
};

export default React.memo(ChatMessage);