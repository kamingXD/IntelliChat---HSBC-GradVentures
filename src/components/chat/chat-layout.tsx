'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import ChatSidebar from '@/components/chat/chat-sidebar';
import { useChat } from '@/hooks/use-chat';
import { Skeleton } from '../ui/skeleton';

export function ChatLayout({ children }: { children: React.ReactNode }) {
  const { isChatHookLoading } = useChat();

  if (isChatHookLoading) {
    return (
      <div className="flex h-screen w-full">
        <div className="w-64 border-r p-4 hidden md:flex flex-col gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-full" />
             <Skeleton className="h-16 w-full mt-4" />
             <Skeleton className="h-16 w-full" />
             <Skeleton className="h-16 w-full" />
        </div>
        <div className="flex-1" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="offcanvas" side="left">
          <ChatSidebar />
        </Sidebar>
        <SidebarInset className="p-0">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
