'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Logo } from '../logo';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function ChatSidebar() {
  const { chats, deleteChat } = useChat();
  const params = useParams();
  const router = useRouter();
  const activeChatId = params.chatId;

  const handleNewChat = () => {
    router.push('/');
  };
  
  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if(deleteChat) deleteChat(chatId);
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-lg font-semibold font-headline">IntelliChat</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleNewChat}
        >
          <Plus />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {chats && chats.sort((a, b) => b.createdAt - a.createdAt).map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <Link href={`/chat/${chat.id}`} legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={activeChatId === chat.id}
                  className="flex-col items-start h-auto py-2"
                >
                  <a>
                    <span className="w-full truncate">{chat.title}</span>
                    <small className="w-full text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                    </small>
                  </a>
                </SidebarMenuButton>
              </Link>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                   <SidebarMenuAction showOnHover>
                      <Trash2 />
                    </SidebarMenuAction>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this
                      conversation.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className={cn(
                        "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      )}
                      onClick={(e) => handleDelete(e, chat.id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
