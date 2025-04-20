'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, SmilePlus } from 'lucide-react';
import { 
  useStreamVideoClient, 
  Call,
  CallType,
  StreamVideoClient,
} from '@stream-io/video-react-sdk';
import { toast } from 'sonner';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name?: string;
  image?: string;
}

interface Reaction {
  emoji: string;
  userId: string;
  userName?: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: string | Date;
  user: User;
  reactions?: Record<string, Reaction[]>; // emoji -> array of users who reacted
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  call?: Call; // Pass the call directly
}

// Simple logging helper
const log = (message: string, data?: any) => {
  if (data) {
    console.log(`[CHAT] ${message}:`, data);
  } else {
    console.log(`[CHAT] ${message}`);
  }
};

const CHAT_EVENT_TYPE = 'chat-message';
const REACTION_EVENT_TYPE = 'chat-reaction';

const EMOJI_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

const ChatPanel = ({ isOpen, onClose, call }: ChatPanelProps) => {
  const client = useStreamVideoClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const messagesRef = useRef<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Extract user information from client
  const currentUserId = client ? (client as any).user?.id || 'unknown' : 'unknown';
  const currentUserName = client ? (client as any).user?.name || currentUserId : 'User';
  const currentUserImage = client ? (client as any).user?.image : undefined;
  
  // Keep messages ref updated
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to chat events
  useEffect(() => {
    if (!call) {
      log('No active call available');
      return;
    }

    log(`Setting up chat for call: ${call.id}`);
    
    // Handle incoming chat events
    const handleCustomEvent = (event: any) => {
      log('Received event', event);
      
      // Check if this is a chat message
      if (event.type === 'custom' && event.custom?.type === CHAT_EVENT_TYPE) {
        try {
          const data = event.custom.data;
          
          // Validate message data
          if (!data || !data.text) {
            log('Invalid message data', data);
            return;
          }
          
          // Create a message ID if one isn't provided
          const messageId = data.id || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          
          // Avoid duplicate messages
          if (messagesRef.current.some(m => m.id === messageId)) {
            log('Skipping duplicate message', messageId);
            return;
          }
          
          const newMessage: Message = {
            id: messageId,
            text: data.text,
            timestamp: data.timestamp || new Date().toISOString(),
            user: {
              id: data.senderId || 'unknown',
              name: data.senderName || 'Unknown',
              image: data.senderImage,
            },
            reactions: data.reactions || {},
          };
          
          log('Adding message to chat', newMessage);
          
          // Update state with new message
          setMessages(prev => [...prev, newMessage]);
        } catch (error) {
          log('Error processing message', error);
        }
      }
      // Check if this is a reaction event
      else if (event.type === 'custom' && event.custom?.type === REACTION_EVENT_TYPE) {
        try {
          const data = event.custom.data;
          
          // Validate reaction data
          if (!data || !data.messageId || !data.emoji) {
            log('Invalid reaction data', data);
            return;
          }
          
          log('Processing reaction', data);
          
          // Update the message with the new reaction
          setMessages(prevMessages => {
            return prevMessages.map(msg => {
              if (msg.id === data.messageId) {
                // Initialize reactions object if it doesn't exist
                const reactions = msg.reactions || {};
                
                // Initialize emoji array if it doesn't exist
                const emojiReactions = reactions[data.emoji] || [];
                
                // Check if user already reacted with this emoji
                const existingReactionIndex = emojiReactions.findIndex(
                  reaction => reaction.userId === data.userId
                );
                
                let updatedEmojiReactions = [...emojiReactions];
                
                if (data.remove && existingReactionIndex !== -1) {
                  // Remove the reaction
                  updatedEmojiReactions.splice(existingReactionIndex, 1);
                } else if (!data.remove && existingReactionIndex === -1) {
                  // Add the reaction
                  updatedEmojiReactions.push({
                    emoji: data.emoji,
                    userId: data.userId,
                    userName: data.userName,
                  });
                }
                
                // Only keep the emoji in reactions if there are any reactions
                const updatedReactions = { ...reactions };
                
                if (updatedEmojiReactions.length > 0) {
                  updatedReactions[data.emoji] = updatedEmojiReactions;
                } else {
                  delete updatedReactions[data.emoji];
                }
                
                return {
                  ...msg,
                  reactions: updatedReactions,
                };
              }
              return msg;
            });
          });
        } catch (error) {
          log('Error processing reaction', error);
        }
      }
    };

    // Register event handler
    log('Registering event handler');
    call.on('custom', handleCustomEvent);
    
    // Testing: Send a ping message
    setTimeout(() => {
      try {
        log('Sending test ping');
        call.sendCustomEvent({
          type: CHAT_EVENT_TYPE,
          data: {
            text: '👋 Chat connected',
            id: `system-${Date.now()}`,
            senderId: 'system',
            senderName: 'System',
            timestamp: new Date().toISOString(),
          }
        });
      } catch (error) {
        log('Error sending test message', error);
      }
    }, 2000);

    return () => {
      log('Cleaning up chat handler');
      call.off('custom', handleCustomEvent);
    };
  }, [call]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !call || !client) {
      return;
    }
    
    if (isSending) {
      return;
    }
    
    setIsSending(true);
    const trimmedText = messageText.trim();
    
    try {
      // Create a unique message ID
      const messageId = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const timestamp = new Date().toISOString();
      
      log('Sending message', { text: trimmedText });
      
      // Send through the call
      await call.sendCustomEvent({
        type: CHAT_EVENT_TYPE,
        data: {
          text: trimmedText,
          id: messageId,
          senderId: currentUserId,
          senderName: currentUserName,
          senderImage: currentUserImage,
          timestamp,
        }
      });
      
      // IMPORTANT: We don't need to add the message locally anymore
      // because the event handler will already add it when the sender
      // receives their own message back from the Stream service
      
      setMessageText('');
      log('Message sent successfully');
    } catch (error) {
      log('Failed to send message', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e as unknown as React.FormEvent);
    }
  };

  const addReaction = async (messageId: string, emoji: string) => {
    if (!call || !client) {
      toast.error('Cannot add reaction: no active call');
      return;
    }
    
    try {
      // Find the message
      const message = messages.find(m => m.id === messageId);
      if (!message) {
        log('Message not found for reaction', messageId);
        return;
      }
      
      // Check if user already reacted with this emoji
      const hasReacted = message.reactions?.[emoji]?.some(
        reaction => reaction.userId === currentUserId
      );
      
      // Send reaction event
      await call.sendCustomEvent({
        type: REACTION_EVENT_TYPE,
        data: {
          messageId,
          emoji,
          userId: currentUserId,
          userName: currentUserName,
          remove: hasReacted, // Toggle the reaction if already added
          timestamp: new Date().toISOString(),
        }
      });
      
      log('Reaction sent', { messageId, emoji, remove: hasReacted });
      
      // Close emoji picker
      setActiveReactionMessageId(null);
    } catch (error) {
      log('Failed to send reaction', error);
      toast.error('Failed to add reaction');
    }
  };

  return (
    <div
      className={cn(
        'fixed right-0 top-0 z-10 h-[calc(100vh-86px)] w-80 bg-gray-950/90 backdrop-blur-lg border-l border-gray-800/50 transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-gray-800/50 p-4">
          <h3 className="text-lg font-semibold text-white">Meeting Chat</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-gray-500">
                <p>No messages yet. Start the conversation!</p>
                <p className="mt-2 text-xs">
                  {call ? 
                    `Connected to call: ${call.id.substring(0, 8)}...` : 
                    'Not connected to a call'}
                </p>
                <p className="mt-1 text-xs">
                  {call?.state.participants.length || 0} participants in call
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-2',
                    msg.user.id === currentUserId ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.user.id !== currentUserId && (
                    <Avatar className="h-8 w-8">
                      {msg.user.image ? (
                        <AvatarImage src={msg.user.image} alt={msg.user.name} />
                      ) : (
                        <AvatarFallback className="bg-blue-600 text-xs font-medium text-white">
                          {msg.user.name?.charAt(0) || msg.user.id.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={cn(
                        'max-w-[80%] rounded-lg p-3 relative group',
                        msg.user.id === currentUserId
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-100'
                      )}
                    >
                      {msg.user.id !== currentUserId && (
                        <p className="mb-1 text-xs font-medium">
                          {msg.user.name}
                        </p>
                      )}
                      <p className="text-sm">{msg.text}</p>
                      <p className="mt-1 text-right text-xs opacity-70">
                        {typeof msg.timestamp === 'string' 
                          ? new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : msg.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                        }
                      </p>
                      
                      {/* Reaction button */}
                      <button
                        onClick={() => setActiveReactionMessageId(activeReactionMessageId === msg.id ? null : msg.id)}
                        className={cn(
                          "absolute -top-2 -left-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                          msg.user.id === currentUserId ? "-left-2 -right-auto" : "-right-2 -left-auto",
                          msg.user.id === currentUserId ? "bg-blue-700" : "bg-gray-700",
                        )}
                        title="Add reaction"
                      >
                        <SmilePlus size={14} className="text-white" />
                      </button>
                      
                      {/* Emoji picker */}
                      {activeReactionMessageId === msg.id && (
                        <div 
                          className={cn(
                            "absolute top-0 p-1 bg-gray-900 rounded-md shadow-lg border border-gray-700 flex gap-1 z-10",
                            msg.user.id === currentUserId ? "right-full mr-2" : "left-full ml-2"
                          )}
                        >
                          {EMOJI_OPTIONS.map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(msg.id, emoji)}
                              className="hover:bg-gray-700 p-1 rounded-md transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Display reactions */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div 
                        className={cn(
                          "flex flex-wrap gap-1 mt-1",
                          msg.user.id === currentUserId ? "justify-end" : "justify-start"
                        )}
                      >
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(msg.id, emoji)}
                            className={cn(
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                              users.some(u => u.userId === currentUserId) 
                                ? "bg-blue-600/20 text-blue-300" 
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            )}
                            title={users.map(u => u.userName || u.userId).join(', ')}
                          >
                            <span>{emoji}</span>
                            <span>{users.length}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <form
          onSubmit={sendMessage}
          className="border-t border-gray-800/50 p-4"
        >
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              className="flex-1 rounded-full border-gray-700 bg-gray-800 text-white placeholder:text-gray-400 focus:border-blue-500"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={!messageText.trim() || isSending}
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel; 