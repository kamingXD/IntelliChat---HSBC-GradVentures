'use client';

import {
  Landmark,
  ShieldCheck,
  CreditCard,
  TrendingUp,
  PiggyBank,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useChat } from '@/hooks/use-chat';
import { HsbcLogo } from '@/components/hsbc-logo';

const productTypes = [
  {
    name: 'Loans',
    icon: Landmark,
    description: 'Get advice on personal, home, or auto loans.',
  },
  {
    name: 'Insurance',
    icon: ShieldCheck,
    description: 'Find the best life, health, or property insurance.',
  },
  {
    name: 'Credit Cards',
    icon: CreditCard,
    description: 'Compare credit cards and find the right one for you.',
  },
  {
    name: 'Investments',
    icon: TrendingUp,
    description: 'Explore investment opportunities and strategies.',
  },
  {
    name: 'Saving Accounts',
    icon: PiggyBank,
    description: 'Learn about high-yield savings and money market accounts.',
  },
];

export default function ProductSelectionPage() {
  const router = useRouter();
  const { addChat } = useChat();

  const handleProductSelect = (productType: string) => {
    if (addChat) {
      const newChatId = addChat(productType);
      router.push(`/chat/${newChatId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <header className="mb-8 text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
          <HsbcLogo className="h-12 w-12" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
            IntelliChat
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to your personal financial assistant. Select a topic to start a conversation.
        </p>
      </header>
      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productTypes.map((product) => (
            <Card
              key={product.name}
              onClick={() => handleProductSelect(product.name)}
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <product.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {product.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} IntelliChat. All rights reserved.</p>
      </footer>
    </div>
  );
}
