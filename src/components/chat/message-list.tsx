'use client';

import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './message-bubble';
import { AnimatePresence, motion } from 'framer-motion';

export default function MessageList() {
  const { activeChat, isLoading } = useChat();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [activeChat?.messages, isLoading]);

  if (!activeChat) return null;
  
  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 md:p-6 space-y-6">
        {activeChat.messages.map((message, index) => (
            <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && activeChat.messages[activeChat.messages.length - 1]?.role !== 'assistant' && (
          <MessageBubble
            message={{ id: 'loading', role: 'assistant', content: '' }}
          />
        )}
      </div>
    </ScrollArea>
  );
}
