'use client';

import { useChat } from '@/hooks/use-chat';
import { Button } from '@/components/ui/button';

export default function SuggestedResponses() {
  const { suggestions, sendMessage, isLoading, clearSuggestions } = useChat();

  const handleSuggestionClick = (suggestion: string) => {
    if (sendMessage && !isLoading) {
      sendMessage(suggestion);
      if(clearSuggestions) clearSuggestions();
    }
  };

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => handleSuggestionClick(suggestion)}
          disabled={isLoading}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
