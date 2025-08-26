import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, MessageCircle, Search, MoreVertical, Paperclip, X, Users, ChevronDown, Settings, UserPlus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import FilePreview from './FilePreview';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Attachment = {
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

type Chat = {
  id: string;
  name: string;
  isGroup: boolean;
  members: string[];
  admins: string[];
  lastMessage?: string;
  lastMessageTime?: number | null;
  unreadCount?: number;
  isOnline?: boolean;
};

type Message = {
  id: string;
  chatId: string;
  text: string;
  senderId: string;
  attachments?: Attachment[];
  timestamp: number;
  status?: 'sent' | 'delivered' | 'read';
  reactions?: Record<string, string[]>;
};

type PresenceMap = Record<string, boolean>;

const CLIENTS = [
  { id: 'JSL', name: 'JSL Corporation' },
  { id: 'TSK', name: 'TSK Industries' },
  { id: 'AMNSI', name: 'AMNSI Ltd' },
  { id: 'URJAA', name: 'URJAA Group' }
];

// Client Selector Component
const ClientSelector: React.FC<{
  selectedClients: string[];
  onClientSelect: (clientIds: string[]) => void;
  placeholder?: string;
  className?: string;
}> = ({ selectedClients, onClientSelect, placeholder = "Select clients", className = "" }) => {
  const handleClientToggle = (clientId: string) => {
    const isSelected = selectedClients.includes(clientId);
    if (isSelected) {
      onClientSelect(selectedClients.filter(id => id !== clientId));
    } else {
      onClientSelect([...selectedClients, clientId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedClients.length === CLIENTS.length) {
      onClientSelect([]);
    } else {
      onClientSelect(CLIENTS.map(client => client.id));
    }
  };

  const getDisplayText = () => {
    if (selectedClients.length === 0) return placeholder;
    if (selectedClients.length === 1) {
      const client = CLIENTS.find(c => c.id === selectedClients[0]);
      return client?.name || selectedClients[0];
    }
    return `${selectedClients.length} clients selected`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-between bg-background hover:bg-muted ${className}`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0 bg-popover border shadow-lg">
        <div className="p-3 border-b bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Select Clients</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs h-6 px-2 hover:bg-background"
            >
              {selectedClients.length === CLIENTS.length ? 'Clear All' : 'Select All'}
            </Button>
          </div>
        </div>
        <div className="p-2 max-h-48 overflow-y-auto">
          {CLIENTS.map((client) => (
            <div
              key={client.id}
              className="flex items-center space-x-3 py-2 px-2 rounded-md hover:bg-muted/50 cursor-pointer"
              onClick={() => handleClientToggle(client.id)}
            >
              <Checkbox
                id={client.id}
                checked={selectedClients.includes(client.id)}
                onChange={() => handleClientToggle(client.id)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={client.id}
                className="text-sm font-medium cursor-pointer flex-1"
              >
                {client.name}
              </Label>
              <span className="text-xs text-muted-foreground font-mono">
                {client.id}
              </span>
            </div>
          ))}
        </div>
        {selectedClients.length > 0 && (
          <div className="p-3 border-t bg-muted/50">
            <p className="text-xs text-muted-foreground">
              {selectedClients.length} of {CLIENTS.length} clients selected
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// User Status Component
const UserStatus: React.FC<{
  user: { id: string; name: string; role: string; company?: string };
  isOnline: boolean;
  isTyping?: boolean;
  showDetails?: boolean;
}> = ({ user, isOnline, isTyping = false, showDetails = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground font-medium">
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground truncate">
            {user.name}
          </h3>
          <Badge 
            variant="secondary" 
            className="text-xs px-2 py-0.5 bg-muted text-muted-foreground"
          >
            {user.role}
          </Badge>
        </div>
        
        {showDetails && (
          <div className="flex items-center gap-2 mt-1">
            {user.company && (
              <p className="text-sm text-muted-foreground truncate">
                {user.company}
              </p>
            )}
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-muted-foreground">
                {isTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Group Management Dialog Component
const GroupManagementDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  groupData?: { id?: string; name?: string; members?: string[] };
  onSubmit: (data: { name: string; memberIds: string[]; groupId?: string }) => void;
  onDeleteGroup?: (groupId: string) => void;
}> = ({ isOpen, onClose, mode, groupData, onSubmit, onDeleteGroup }) => {
  const [groupName, setGroupName] = useState(groupData?.name || '');
  const [selectedClients, setSelectedClients] = useState<string[]>(groupData?.members || []);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      toast({ title: 'Error', description: 'Please enter a group name' });
      return;
    }

    if (selectedClients.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one client' });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        name: groupName.trim(),
        memberIds: selectedClients,
        groupId: groupData?.id
      });
      onClose();
      setGroupName('');
      setSelectedClients([]);
    } catch (error) {
      console.error('Error managing group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!groupData?.id || !onDeleteGroup) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete the group "${groupData.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await onDeleteGroup(groupData.id);
      onClose();
    } catch (error) {
      console.error('Error deleting group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setGroupName('');
      setSelectedClients([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-background border shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {mode === 'create' ? 'Create New Group' : 'Manage Group'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === 'create'
              ? 'Create a new group chat with selected clients.'
              : 'Update group members or delete the group.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="group-name" className="text-sm font-medium">
              Group Name
            </Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Select Clients
            </Label>
            <ClientSelector
              selectedClients={selectedClients}
              onClientSelect={setSelectedClients}
              placeholder="Choose clients to add"
            />
          </div>

          {selectedClients.length > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Selected Clients:</p>
              <div className="flex flex-wrap gap-2">
                {selectedClients.map((clientId) => (
                  <span
                    key={clientId}
                    className="inline-flex items-center px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full"
                  >
                    {clientId}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {mode === 'edit' && onDeleteGroup && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
              className="mr-auto"
            >
              Delete Group
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !groupName.trim() || selectedClients.length === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isLoading ? 'Processing...' : mode === 'create' ? 'Create Group' : 'Update Group'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ChatInterface: React.FC = () => {
  const { user, socket } = useAuth();
  const isAdmin = user?.role === 'admin';
  const currentUserId = user?.id || '1';

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typingByChat, setTypingByChat] = useState<Record<string, string[]>>({});
  const [presence, setPresence] = useState<PresenceMap>({});
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupDialogMode, setGroupDialogMode] = useState<'create' | 'edit'>('create');
  const [editingGroup, setEditingGroup] = useState<Chat | null>(null);

  // sidebar collapsed state (both admin & client)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed(v => !v);

  const filteredChats = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return chats;
    return chats.filter(c => (c.name || '').toLowerCase().includes(term));
  }, [chats, searchTerm]);

  function formatTimeMs(ms?: number | null) {
    if (!ms) return '';
    const d = new Date(ms);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatRelative(ms?: number | null) {
    if (!ms) return '';
    const now = Date.now();
    const diffMin = Math.floor((now - ms) / (1000 * 60));
    if (diffMin < 1) return 'Now';
    if (diffMin < 60) return `${diffMin}m`;
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h`;
    return new Date(ms).toLocaleDateString();
  }

  // Load chats and setup socket events
  useEffect(() => {
    if (!user || !socket) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/chats?userId=${encodeURIComponent(user.id)}`);
        const data: Chat[] = await res.json();
        setChats(data);
        if (!selectedChatId && data.length > 0) {
          setSelectedChatId(data[0].id);
        }
      } catch (e) {
        // fallback: no chats
      }
      try {
        const pres = await fetch('/api/presence');
        const pm: PresenceMap = await pres.json();
        setPresence(pm);
      } catch {}
    };
    load();

    // Socket event listeners
    socket.on('message', (msg: Message) => {
      setMessagesByChat(prev => ({
        ...prev,
        [msg.chatId]: [...(prev[msg.chatId] || []), msg]
      }));
      const isOwn = msg.senderId === currentUserId;
      // Update conversation list: last message/time and unread count when not selected
      setChats(prev => prev.map(c => (
        c.id === msg.chatId
          ? {
              ...c,
              lastMessage: msg.text || (msg.attachments?.length ? 'Attachment' : ''),
              lastMessageTime: msg.timestamp,
              unreadCount: selectedChatId === msg.chatId || isOwn ? (c.unreadCount || 0) : (c.unreadCount || 0) + 1
            }
          : c
      )));
      const chat = chats.find(c => c.id === msg.chatId);
      if (!isOwn) {
        toast({ title: chat?.name || 'New message', description: msg.text || 'Attachment' });
        if (document.visibilityState === 'hidden' && 'Notification' in window) {
          if (Notification.permission === 'granted') new Notification(chat?.name || 'New message', { body: msg.text || 'Attachment' });
        }
      }
    });

    socket.on('typing', ({ chatId, userId: fromId, name: fromName }) => {
      if (fromId === currentUserId) return;
      setTypingByChat(prev => {
        const arr = new Set([...(prev[chatId] || [])]);
        arr.add(fromName || 'Someone');
        return { ...prev, [chatId]: Array.from(arr) };
      });
      setTimeout(() => {
        setTypingByChat(prev => ({ ...prev, [chatId]: [] }));
      }, 1500);
    });

    socket.on('presence', ({ userId, online }) => {
      setPresence(prev => ({ ...prev, [userId]: online }));
      setChats(prev => prev.map(c => ({
        ...c,
        isOnline: c.isGroup ? c.isOnline : c.members.some(m => m !== currentUserId && !!(online && m === userId))
      })));
    });

    socket.on('reaction', ({ chatId, messageId, reactions }) => {
      setMessagesByChat(prev => {
        const list = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: list.map(m => m.id === messageId ? { ...m, reactions } : m)
        };
      });
    });

    socket.on('chat_created', (chat: Chat) => {
      setChats(prev => [chat, ...prev]);
    });

    socket.on('chat_updated', (chat: Chat) => {
      setChats(prev => {
        const exists = prev.some(c => c.id === chat.id);
        const updated = exists ? prev.map(c => (c.id === chat.id ? chat : c)) : [chat, ...prev];
        return updated;
      });
      // if user removed from selected chat, deselect
      if (selectedChatId === chat.id && !chat.members.includes(currentUserId)) {
        setSelectedChatId('');
        toast({ title: 'Removed from group', description: chat.name });
      }
    });

    socket.on('chat_deleted', ({ id }: { id: string }) => {
      setChats(prev => prev.filter(c => c.id !== id));
      setMessagesByChat(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      if (selectedChatId === id) {
        setSelectedChatId('');
        toast({ title: 'Group deleted', description: 'This group was removed.' });
      }
    });

    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    return () => {
      socket.off('message');
      socket.off('typing');
      socket.off('presence');
      socket.off('reaction');
      socket.off('chat_created');
      socket.off('chat_updated');
      socket.off('chat_deleted');
    };
  }, [user, socket, currentUserId, selectedChatId, chats]);

  // Load messages when selecting chat
  useEffect(() => {
    if (!selectedChatId || !socket) return;
    (async () => {
      try {
        const res = await fetch(`/api/chats/${selectedChatId}/messages`);
        const data: Message[] = await res.json();
        setMessagesByChat(prev => ({ ...prev, [selectedChatId]: data }));
        socket.emit('join_chat', selectedChatId);
        // Mark read
        await fetch(`/api/chats/${selectedChatId}/read`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: currentUserId }) });
        // Reset unread count for this chat locally
        setChats(prev => prev.map(c => c.id === selectedChatId ? { ...c, unreadCount: 0 } : c));
      } catch {}
    })();
  }, [selectedChatId, currentUserId, socket]);

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text && pendingFiles.length === 0) return;
    const chatId = selectedChatId || chats[0]?.id;
    if (!chatId || !socket) return;

    let uploadedAttachments: Attachment[] = [];
    if (pendingFiles.length > 0) {
      const uploads: Attachment[] = [];
      for (const f of pendingFiles) {
        const fd = new FormData();
        fd.append('file', f);
        try {
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          const data = await res.json();
          if (data?.url) uploads.push(data as Attachment);
        } catch {}
      }
      uploadedAttachments = uploads;
    }

    socket.emit('send_message', { chatId, text, attachments: uploadedAttachments });
    setInputMessage('');
    setPendingFiles([]);
  };

  const handleTyping = () => {
    if (!selectedChatId || !socket) return;
    socket.emit('typing', { chatId: selectedChatId });
  };

  const handleReaction = (chatId: string, messageId: string, emoji: string) => {
    if (!socket) return;
    socket.emit('reaction', { chatId, messageId, emoji });
  };

  const removePendingFile = (index: number) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const messages = messagesByChat[selectedChatId] || [];
  const typingNames = typingByChat[selectedChatId] || [];

  // Group actions with client selector
  const handleCreateGroup = async (data: { name: string; memberIds: string[]; groupId?: string }) => {
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, memberIds: [currentUserId, ...data.memberIds], adminIds: [currentUserId] })
      });
      const chat: Chat = await res.json();
      setChats(prev => [chat, ...prev]);
      setSelectedChatId(chat.id);
      toast({ title: 'Success', description: `Group "${data.name}" created successfully` });
    } catch (e) {
      toast({ title: 'Failed to create group' });
    }
  };

  const handleUpdateGroup = async (data: { name: string; memberIds: string[]; groupId?: string }) => {
    if (!data.groupId) return;
    try {
      const res = await fetch(`/api/chats/${data.groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, memberIds: [currentUserId, ...data.memberIds] })
      });
      const chat: Chat = await res.json();
      setChats(prev => prev.map(c => (c.id === chat.id ? chat : c)));
      toast({ title: 'Success', description: 'Group updated successfully' });
    } catch (e) {
      toast({ title: 'Failed to update group' });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      await fetch(`/api/chats/${groupId}`, { method: 'DELETE' });
      setChats(prev => prev.filter(chat => chat.id !== groupId));
      if (selectedChatId === groupId) {
        setSelectedChatId('');
      }
      toast({ title: 'Success', description: 'Group deleted successfully' });
    } catch (e) {
      toast({ title: 'Failed to delete group' });
    }
  };

  const handleAddMembers = async () => {
    if (!selectedChatId) return;
    setGroupDialogMode('edit');
    setEditingGroup(chats.find(c => c.id === selectedChatId) || null);
    setGroupDialogOpen(true);
  };

  const handleRemoveMember = async () => {
    if (!selectedChatId) return;
    const userIdToRemove = window.prompt('Remove member user ID');
    if (!userIdToRemove) return;
    try {
      const res = await fetch(`/api/chats/${selectedChatId}/members/${encodeURIComponent(userIdToRemove)}`, {
        method: 'DELETE'
      });
      const chat: Chat = await res.json();
      setChats(prev => prev.map(c => (c.id === chat.id ? chat : c)));
      if (!chat.members.includes(currentUserId)) {
        setSelectedChatId('');
      }
    } catch (e) {
      toast({ title: 'Failed to remove member' });
    }
  };

  if (!isAdmin) {
    // User view - single conversation
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="border-b p-4">
          <UserStatus
            user={{
              id: '2',
              name: 'Admin Support',
              role: 'admin',
              company: 'AMC Support Team'
            }}
            isOnline={presence['2'] || false}
            isTyping={typingNames.length > 0}
            showDetails={true}
          />
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.senderId === currentUserId
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted'
                  }`}
                >
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="space-y-2 mb-2">
                      {message.attachments.map((att, idx) => (
                        <AttachmentPreview key={idx} attachment={att} />
                      ))}
                    </div>
                  )}
                  {message.text && <p className="text-sm">{message.text}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <p className={`text-xs ${
                      message.senderId === currentUserId ? 'text-blue-100' : 'text-muted-foreground'
                    }`}>
                      {formatTimeMs(message.timestamp)} {message.senderId === currentUserId && message.status ? `• ${message.status}` : ''}
                    </p>
                    <button className="text-xs opacity-70 hover:opacity-100" onClick={() => handleReaction(message.chatId, message.id, '👍')}>👍</button>
                  </div>
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="mt-1 flex gap-2 text-xs">
                      {Object.entries(message.reactions).map(([emoji, users]) => (
                        <span key={emoji} className="px-1.5 py-0.5 rounded bg-white/20">{emoji} {users.length}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          {pendingFiles.length > 0 && (
            <div className="mb-3 p-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">Attached files:</p>
              <div className="space-y-1">
                {pendingFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <span className="truncate flex-1">{file.name}</span>
                    <button
                      onClick={() => removePendingFile(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex gap-2 items-center">
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => setPendingFiles(Array.from(e.target.files || []))} />
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => { setInputMessage(e.target.value); handleTyping(); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Admin view - multiple conversations with client selector
  return (
    <div className="h-full flex bg-background">
      {/* Collapsible Conversations Sidebar (shared for admin & client) */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} border-r flex flex-col transition-[width] duration-150 overflow-hidden`}>
        <div className="p-3 border-b flex items-center justify-between gap-2">
          {!sidebarCollapsed ? <h2 className="font-semibold text-lg">Messages</h2> : <div className="text-sm font-medium">Msgs</div>}

          <div className="flex items-center gap-2">
            {/* New Group only for admin */}
            {isAdmin && !sidebarCollapsed && (
              <Button size="sm" onClick={() => { setGroupDialogMode('create'); setEditingGroup(null); setGroupDialogOpen(true); }}>
                New Group
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
              {/* simple chevron indicator */}
              {sidebarCollapsed ? '›' : '‹'}
            </Button>
          </div>
        </div>

        {/* Search: hide input when collapsed */}
        {!sidebarCollapsed && (
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((conversation) => (
              <div
                key={conversation.id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedChatId === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedChatId(conversation.id)}
                title={conversation.name}
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{(conversation.name || 'C').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-background"></div>}
                </div>

                {/* show details when expanded */}
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{conversation.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatRelative(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">{conversation.isGroup ? 'Group' : 'Direct'}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate flex-1">{conversation.lastMessage}</p>
                      {conversation.unreadCount && conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2 text-xs h-5 w-5 flex items-center justify-center p-0">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatId ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {chats.find(c => c.id === selectedChatId)?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {chats.find(c => c.id === selectedChatId)?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {typingByChat[selectedChatId]?.length ? `${typingByChat[selectedChatId][0]} is typing…` : (chats.find(c => c.id === selectedChatId)?.isGroup ? 'Group chat' : 'Direct chat')}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Chat Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => { setGroupDialogMode('create'); setEditingGroup(null); setGroupDialogOpen(true); }}>
                        <Users className="h-4 w-4 mr-2" />
                        New Group
                      </DropdownMenuItem>
                    )}
                    {chats.find(c => c.id === selectedChatId)?.isGroup && (
                      <>
                        <DropdownMenuItem onClick={handleAddMembers}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add/Remove Members
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteGroup(selectedChatId)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Group
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(messagesByChat[selectedChatId] || []).map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        message.senderId === currentUserId
                          ? 'bg-blue-600 text-white'
                          : 'bg-muted'
                      }`}
                    >
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="space-y-2 mb-2">
                          {message.attachments.map((att, idx) => (
                            <AttachmentPreview key={idx} attachment={att} />
                          ))}
                        </div>
                      )}
                      {message.text && <p className="text-sm">{message.text}</p>}
                      <div className="flex items-center gap-2 mt-1">
                        <p className={`text-xs ${
                          message.senderId === currentUserId ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
                          {formatTimeMs(message.timestamp)} {message.senderId === currentUserId && message.status ? `• ${message.status}` : ''}
                        </p>
                        <button className="text-xs opacity-70 hover:opacity-100" onClick={() => handleReaction(message.chatId, message.id, '👍')}>👍</button>
                      </div>
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="mt-1 flex gap-2 text-xs">
                          {Object.entries(message.reactions).map(([emoji, users]) => (
                            <span key={emoji} className="px-1.5 py-0.5 rounded bg-white/20">{emoji} {users.length}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              {pendingFiles.length > 0 && (
                <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Attached files:</p>
                  <div className="space-y-1">
                    {pendingFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="truncate flex-1">{file.name}</span>
                        <button
                          onClick={() => removePendingFile(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 items-center">
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => setPendingFiles(Array.from(e.target.files || []))} />
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => { setInputMessage(e.target.value); handleTyping(); }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Group Management Dialog with Client Selector */}
      <GroupManagementDialog
        isOpen={groupDialogOpen}
        onClose={() => setGroupDialogOpen(false)}
        mode={groupDialogMode}
        groupData={editingGroup ? {
          id: editingGroup.id,
          name: editingGroup.name,
          members: editingGroup.members.filter(id => id !== currentUserId)
        } : undefined}
        onSubmit={groupDialogMode === 'create' ? handleCreateGroup : handleUpdateGroup}
        onDeleteGroup={handleDeleteGroup}
      />
    </div>
  );
};

export default ChatInterface;

function AttachmentPreview({ attachment }: { attachment: Attachment }) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isImage = attachment.mimeType?.startsWith('image/');
  const isVideo = attachment.mimeType?.startsWith('video/');
  const isPDF = attachment.mimeType === 'application/pdf';
  const isDocument = attachment.mimeType?.includes('document') || 
                     attachment.mimeType?.includes('word') || 
                     attachment.mimeType?.includes('excel') || 
                     attachment.mimeType?.includes('powerpoint') ||
                     attachment.originalName?.match(/\.(doc|docx|xls|xlsx|ppt|pptx|txt|rtf)$/i);
  const isAudio = attachment.mimeType?.startsWith('audio/');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (isImage) return '🖼️';
    if (isVideo) return '🎥';
    if (isPDF) return '📄';
    if (isDocument) return '📝';
    if (isAudio) return '🎵';
    return '📎';
  };

  const handlePreview = () => {
    if (isImage || isVideo || isPDF || isAudio) {
      setIsPreviewOpen(true);
    } else {
      // Download for other file types
      window.open(attachment.url, '_blank');
    }
  };

  return (
    <>
      <div 
        className="flex items-center gap-3 p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-colors"
        onClick={handlePreview}
      >
        <div className="text-2xl">{getFileIcon()}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{attachment.originalName}</p>
          <p className="text-xs opacity-70">{formatFileSize(attachment.size)}</p>
        </div>
        <div className="text-xs opacity-70">
          {isImage || isVideo || isPDF || isAudio ? 'Preview' : 'Download'}
        </div>
      </div>

      <FilePreview
        file={attachment}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}