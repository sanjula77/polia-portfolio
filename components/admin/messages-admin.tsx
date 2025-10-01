'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Calendar, User, Trash2, Reply } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { messageService, type Message } from '@/lib/database';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getAllAdmin();
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (message: Message) => {
    setSelectedMessage(message);
    if (!message.read) {
      try {
        await messageService.markAsRead(message.id);
        setMessages(messages.map(m =>
          m.id === message.id ? { ...m, read: true } : m
        ));
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await messageService.delete(id);
      setMessages(messages.filter(m => m.id !== id));
      toast.success('Message deleted successfully');
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleReply = () => {
    setIsReplyOpen(true);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    try {
      await messageService.markAsReplied(selectedMessage.id);
      setMessages(messages.map(m =>
        m.id === selectedMessage.id ? { ...m, replied: true } : m
      ));
      setIsReplyOpen(false);
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error marking message as replied:', error);
      toast.error('Failed to mark as replied');
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-muted animate-pulse rounded-lg h-32" />
            ))
          ) : messages.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center space-y-2">
                  <Mail className="w-8 h-8 mx-auto" />
                  <p>No messages yet</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedMessage?.id === message.id ? 'ring-2 ring-accent' : ''
                    } ${!message.read ? 'border-accent/50' : ''}`}
                  onClick={() => handleOpenMessage(message)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className={`text-base ${!message.read ? 'font-bold' : 'font-medium'}`}>
                            {message.name}
                          </CardTitle>
                          {!message.read && (
                            <Badge className="bg-accent text-accent-foreground">New</Badge>
                          )}
                          {message.replied && (
                            <Badge variant="outline">Replied</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(message.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-sm mb-2">{message.subject || 'No subject'}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Details */}
        <div className="space-y-4">
          {selectedMessage ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{selectedMessage.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{selectedMessage.email}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" onClick={handleReply}>
                        <Reply className="w-4 h-4 mr-2" />
                        Reply
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center space-y-2">
                  <Mail className="w-12 h-12 mx-auto" />
                  <p>Select a message to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendReply} className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To: {selectedMessage?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                Subject: Re: {selectedMessage?.subject}
              </p>
            </div>
            <Textarea
              placeholder="Type your reply here..."
              rows={6}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsReplyOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Reply</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}