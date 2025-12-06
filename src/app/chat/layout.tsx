import { ChatLayout } from '@/components/chat/chat-layout';

export default function ChatSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatLayout>{children}</ChatLayout>
  );
}
