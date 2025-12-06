'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import ChatSidebar from '@/components/chat/chat-sidebar';
import { useChat } from '@/hooks/use-chat';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '../ui/skeleton';

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const { chats, isChatHookLoading } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!isChatHookLoading && (!chats || chats.length === 0)) {
      router.push('/');
    }
  }, [chats, isChatHookLoading, router]);

  if (isChatHookLoading || !chats || chats.length === 0) {
     return (
        <div className="flex h-screen w-full">
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
            <div className="w-72 border-l p-4 hidden md:flex flex-col gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SidebarInset className="p-0">
          {children}
        </SidebarInset>
        <Sidebar collapsible="offcanvas" side="right">
          <ChatSidebar />
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
