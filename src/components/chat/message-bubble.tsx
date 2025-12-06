'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { Logo } from '../logo';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isLoading = message.role === 'assistant' && message.content === '';

  return (
    <div
      className={cn(
        'flex items-start gap-3 w-full max-w-xl',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto flex-row'
      )}
    >
      <Avatar className="w-8 h-8">
        {!isUser && <AvatarImage asChild src="/placeholder.svg"><Logo className='p-1' /></AvatarImage>}
        <AvatarFallback className="text-xs">
          {isUser ? 'YOU' : 'AI'}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'p-3 rounded-lg relative',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card border shadow-sm rounded-bl-none',
        )}
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-2">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  );
}
