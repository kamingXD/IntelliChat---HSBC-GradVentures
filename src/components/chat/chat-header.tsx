'use client';

import { Ellipsis, BookText, Trash2, Loader2 } from 'lucide-react';
import { useChat } from '@/hooks/use-chat';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { summarizeChatHistory } from '@/ai/flows/summarize-chat-history';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { cn } from '@/lib/utils';

export default function ChatHeader() {
  const { activeChat, deleteChat } = useChat();
  const { toast } = useToast();
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleSummarize = async () => {
    if (!activeChat || activeChat.messages.length < 2) {
      toast({
        description: 'Not enough messages to summarize.',
      });
      return;
    }
    setIsSummarizing(true);
    try {
      const history = activeChat.messages.map(m => `${m.role}: ${m.content}`).join('\n');
      const result = await summarizeChatHistory({ chatHistory: history });
      toast({
        title: 'Conversation Summary',
        description: result.summary,
        duration: 10000,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to summarize the chat.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleDelete = () => {
    if(activeChat && deleteChat) {
      deleteChat(activeChat.id);
    }
  }

  if (!activeChat) return null;

  return (
    <header className="flex items-center justify-between p-2 md:p-4 border-b bg-card">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <h2 className="text-lg font-semibold font-headline truncate">{activeChat.title}</h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Ellipsis className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSummarize} disabled={isSummarizing}>
            {isSummarizing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <BookText className="mr-2 h-4 w-4" />
            )}
            <span>Summarize</span>
          </DropdownMenuItem>
          <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                    <span className='text-destructive'>Delete Chat</span>
                </DropdownMenuItem>
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
                    onClick={handleDelete}
                    className={cn("bg-destructive text-destructive-foreground hover:bg-destructive/90")}
                >
                    Continue
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
