'use client';

import { continueConversation } from '@/lib/chat-actions';
import { suggestResponseOptions } from '@/ai/flows/suggest-response-options';
import type { Chat, Message } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  isLoading: boolean;
  isChatHookLoading: boolean;
  addChat: (productType: string) => string;
  deleteChat: (chatId: string) => void;
  setActiveChatId: (chatId: string | null) => void;
  sendMessage: (content: string) => Promise<void>;
  suggestions: string[];
  clearSuggestions: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const CHAT_STORAGE_KEY = 'intellichat_chats';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatHookLoading, setIsChatHookLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    try {
      const storedChats = localStorage.getItem(CHAT_STORAGE_KEY);
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error('Failed to load chats from local storage:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load your chat history.',
      });
    } finally {
        setIsChatHookLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    try {
      if(!isChatHookLoading) {
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
      }
    } catch (error) {
      console.error('Failed to save chats to local storage:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your chat history.',
      });
    }
  }, [chats, toast, isChatHookLoading]);
  
  const addChat = useCallback((productType: string) => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: `${productType} Conversation`,
      createdAt: Date.now(),
      productType,
      messages: [
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Hello! How can I help you with ${productType.toLowerCase()} today?`,
        },
      ],
    };
    setChats(prev => [newChat, ...prev]);
    return newChat.id;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    const isDeletingActiveChat = activeChatId === chatId;
    
    // Immediately navigate away if deleting the active chat
    if (isDeletingActiveChat) {
        router.push('/chat');
    }

    setChats(prev => prev.filter(c => c.id !== chatId));

  }, [activeChatId, router]);

  const activeChat = useMemo(() => chats.find(c => c.id === activeChatId) || null, [chats, activeChatId]);

  const updateChatMessages = useCallback((chatId: string, messages: Message[]) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages } : c));
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeChatId || !activeChat) return;

    clearSuggestions();
    setIsLoading(true);

    const newUserMessage: Message = { id: crypto.randomUUID(), role: 'user', content };
    const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' };
    
    const updatedMessages = [...activeChat.messages, newUserMessage];
    updateChatMessages(activeChatId, updatedMessages);
    
    try {
      const stream = await continueConversation(
        activeChat.messages.map(({ id, ...rest }) => rest), // Don't send ID to backend
        content
      );

      let accumulatedContent = '';
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      
      updateChatMessages(activeChatId, [...updatedMessages, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedContent += decoder.decode(value, { stream: true });
        assistantMessage.content = accumulatedContent;
        updateChatMessages(activeChatId, [...updatedMessages, { ...assistantMessage }]);
      }
      
      const conversationHistory = [...updatedMessages, assistantMessage].map(m => m.content);
      const suggestionResult = await suggestResponseOptions({ conversationHistory, currentMessage: assistantMessage.content });
      setSuggestions(suggestionResult);

    } catch (error) {
      console.error('Error streaming response:', error);
      assistantMessage.content = 'Sorry, I encountered an error. Please try again.';
      updateChatMessages(activeChatId, [...updatedMessages, assistantMessage]);
       toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Failed to get a response from the assistant.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeChat, activeChatId, clearSuggestions, toast, updateChatMessages]);

  const value = {
    chats,
    activeChat,
    addChat,
    deleteChat,
    setActiveChatId,
    sendMessage,
    isLoading,
    isChatHookLoading,
    suggestions,
    clearSuggestions
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
