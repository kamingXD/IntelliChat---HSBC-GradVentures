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

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const { chats, isChatHookLoading } = useChat();
  const router = useRouter();

  useEffect(() => {
    if (!isChatHookLoading && (!chats || chats.length === 0)) {
      router.push('/');
    }
  }, [chats, isChatHookLoading, router]);

  if (isChatHookLoading || !chats || chats.length === 0) {
    return null;
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
