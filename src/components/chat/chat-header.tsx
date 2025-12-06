'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { HsbcLogo } from '../hsbc-logo';
import { useSidebar } from '../ui/sidebar';

export default function ChatHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm">
      <div className="flex items-center gap-2">
        <HsbcLogo className="h-7 w-7" />
      </div>
      <h2 className="text-lg font-semibold">Chat</h2>
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
    </header>
  );
}
