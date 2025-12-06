import { MessageSquareText } from 'lucide-react';

export default function ChatHomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/20">
        <MessageSquareText className="w-10 h-10 text-primary" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold font-headline tracking-tight">
          Select a conversation
        </h2>
        <p className="text-muted-foreground mt-1">
          Choose a chat from the sidebar or start a new one to begin.
        </p>
      </div>
    </div>
  );
}
