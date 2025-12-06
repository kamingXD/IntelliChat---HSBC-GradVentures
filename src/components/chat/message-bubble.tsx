'use client';

import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import { HsbcLogo } from '../hsbc-logo';

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
        {!isUser && <HsbcLogo iconOnly className='p-1 bg-primary text-primary-foreground' />}
        <AvatarFallback className="text-xs bg-muted text-muted-foreground">
          {isUser ? 'YOU' : 'AI'}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'p-3 rounded-lg relative',
          isUser
            ? 'bg-muted text-foreground rounded-br-none'
            : 'bg-primary/10 text-foreground rounded-bl-none',
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
