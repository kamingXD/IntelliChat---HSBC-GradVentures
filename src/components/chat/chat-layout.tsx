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
