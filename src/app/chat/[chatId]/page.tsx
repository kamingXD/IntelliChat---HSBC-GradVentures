'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChat } from '@/hooks/use-chat';
import ChatView from '@/components/chat/chat-view';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { setActiveChatId, activeChat, isLoading: isChatHookLoading, chats } = useChat();
  const { toast } = useToast();

  const chatId = Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;

  useEffect(() => {
    if (chatId && setActiveChatId) {
      setActiveChatId(chatId);
    }
    // No cleanup function needed here, active chat is managed by the page lifecycle
  }, [chatId, setActiveChatId]);

  useEffect(() => {
    // Wait until the initial load of all chats is done before checking for existence
    if (isChatHookLoading === false && chats.length > 0) {
      const chatExists = chats.some(c => c.id === chatId);
      if (!chatExists) {
        toast({
            variant: 'destructive',
            title: 'Chat not found',
            description: "The conversation you're looking for doesn't exist.",
        })
        router.push('/');
      }
    }
  }, [isChatHookLoading, chats, chatId, router, toast]);

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
