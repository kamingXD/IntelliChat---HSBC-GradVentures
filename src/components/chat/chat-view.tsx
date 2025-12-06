'use client';

import ChatHeader from './chat-header';
import MessageList from './message-list';
import ChatInput from './chat-input';

export default function ChatView() {
  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <MessageList />
      <ChatInput />
    </div>
  );
}
