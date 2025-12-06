'use client';

import { useRef, type FormEvent } from 'react';
import { useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import SuggestedResponses from './suggested-responses';

export default function ChatInput() {
  const { sendMessage, isLoading } = useChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const content = inputRef.current?.value.trim();
    if (content && sendMessage && !isLoading) {
      sendMessage(content);
      inputRef.current!.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  return (
    <div className="p-4 bg-card border-t">
      <SuggestedResponses />
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Textarea
          ref={inputRef}
          placeholder="Ask something..."
          rows={1}
          className="flex-1 resize-none max-h-48"
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="w-10 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
