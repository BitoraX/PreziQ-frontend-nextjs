
"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  sessionId: string;
}

export default function ChatPanel({ sessionId }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: { id: 'system', name: 'System', avatar: '' },
      content: 'Welcome to the game lobby! Chat with other players while waiting.',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, expanded]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // In a real app, you would send this to your API/socket
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: { id: 'currentUser', name: 'You', avatar: '/avatars/avatar1.png' },
      content: inputMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
  };

  if (!expanded) {
    return (
      <Button
        variant="outline"
        className="border-white/10 hover:bg-white/10 w-full"
        onClick={() => setExpanded(true)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Open Chat
      </Button>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md flex flex-col h-[300px]">
      <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
        <h3 className="font-medium flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          Lobby Chat
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setExpanded(false)}
          className="h-7 px-2 text-xs"
        >
          Minimize
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2">
            {message.sender.id === 'system' ? (
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-xs">
                S
              </div>
            ) : (
              <Avatar className="h-6 w-6">
                <AvatarImage src={message.sender.avatar} />
                <AvatarFallback>{message.sender.name.substring(0, 1)}</AvatarFallback>
              </Avatar>
            )}
            
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium ${message.sender.id === 'system' ? 'text-blue-400' : ''}`}>
                  {message.sender.name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-2 border-t border-white/10 flex gap-2">
        <Input
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="bg-white/5 border-white/10 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="icon" disabled={!inputMessage.trim()}>
          <SendHorizonal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}