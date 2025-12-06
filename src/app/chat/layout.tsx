import { ChatLayout } from '@/components/chat/chat-layout';
import { ChatProvider } from '@/hooks/use-chat';

export default function ChatSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatProvider>
      <ChatLayout>{children}</ChatLayout>
    </ChatProvider>
  );
}
