'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from '@/components/ui/sidebar';
import ChatSidebar from '@/components/chat/chat-sidebar';

export function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          <ChatSidebar />
        </Sidebar>
        <SidebarInset className="p-0">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
