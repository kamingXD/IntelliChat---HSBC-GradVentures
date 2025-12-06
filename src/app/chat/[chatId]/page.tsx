'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useChat } from '@/hooks/use-chat';
import ChatView from '@/components/chat/chat-view';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatPage() {
  const params = useParams();
  const { setActiveChatId, activeChat, isChatHookLoading } = useChat();

  const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

  useEffect(() => {
    if (chatId && setActiveChatId) {
      setActiveChatId(chatId);
    }
  }, [chatId, setActiveChatId]);

  if (isChatHookLoading || !activeChat) {
    return (
        <div className="flex flex-col h-screen">
            <div className="flex items-center justify-between p-2 md:p-4 border-b bg-card">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 md:hidden" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-8 w-8" />
            </div>
            <div className="flex-1 p-4 md:p-6 space-y-6">
                <div className="flex items-start gap-3 mr-auto w-full max-w-xl">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-12 w-48" />
                </div>
                <div className="flex items-start gap-3 ml-auto w-full max-w-xl flex-row-reverse">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-16 w-64" />
                </div>
            </div>
            <div className="p-4 bg-card border-t">
                <Skeleton className="h-10 w-full" />
            </div>
      </div>
    );
  }

  return <ChatView />;
}
