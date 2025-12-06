export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
};

export type Chat = {
  id:string;
  title: string;
  createdAt: number;
  messages: Message[];
  productType: string;
};
