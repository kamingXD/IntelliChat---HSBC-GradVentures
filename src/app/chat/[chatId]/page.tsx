'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useChat } from '@/hooks/use-chat';
import ChatView from '@/components/chat/chat-view';
import { AlertTriangle } from 'lucide-react';

export default function ChatPage() {
  const params = useParams();
  const { setActiveChatId, activeChat } = useChat();

  const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

  useEffect(() => {
    if (chatId && setActiveChatId) {
      setActiveChatId(chatId);
    }
    return () => {
      if (setActiveChatId) {
        setActiveChatId(null);
      }
    };
  }, [chatId, setActiveChatId]);

  if (!activeChat) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
         <div className="flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10">
            <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-semibold font-headline tracking-tight">
            Chat not found
            </h2>
            <p className="text-muted-foreground mt-1">
            The chat you are looking for does not exist.
            </p>
        </div>
      </div>
    );
  }

  return <ChatView />;
}
