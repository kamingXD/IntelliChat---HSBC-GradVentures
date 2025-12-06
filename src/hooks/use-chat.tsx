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
        // If there are no more chats, redirect to the home page.
        if (chats.length === 0 && activeChatId === null) {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Failed to save chats to local storage:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save your chat history.',
      });
    }
  }, [chats, toast, isChatHookLoading, router, activeChatId]);
  
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
        setActiveChatId(null);
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
    const updatedMessages = [...activeChat.messages, newUserMessage];
    updateChatMessages(activeChatId, updatedMessages);

    try {
      const stream = await continueConversation(
        updatedMessages.map(({ id, ...rest }) => ({...rest, role: rest.role === 'assistant' ? 'model' : 'user'} as {content: string; role: 'user' | 'model'})),
        content
      );

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: '' };
      let assistantMessageAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantMessage.content += chunk;
        
        // Sanitize response to remove extra newlines
        // Replace any sequence of two or more newlines with a single newline.
        const sanitizedContent = assistantMessage.content.replace(/\n{2,}/g, '\n');
        assistantMessage.content = sanitizedContent;


        if (!assistantMessageAdded) {
          updateChatMessages(activeChatId, [...updatedMessages, assistantMessage]);
          assistantMessageAdded = true;
        } else {
          setChats(prevChats => prevChats.map(chat => 
            chat.id === activeChatId 
              ? { ...chat, messages: chat.messages.map(m => m.id === assistantMessage.id ? { ...assistantMessage } : m) }
              : chat
          ));
        }
      }
      
      const finalMessages = [...updatedMessages, assistantMessage];
      const conversationHistory = finalMessages.map(m => `${m.role === 'assistant' ? 'model' : 'user'}: ${m.content}`);
      const suggestionResult = await suggestResponseOptions({ conversationHistory, currentMessage: assistantMessage.content });
      setSuggestions(suggestionResult);

    } catch (error) {
      console.error('Error streaming response:', error);
      const errorMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      updateChatMessages(activeChatId, [...updatedMessages, errorMessage]);
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
