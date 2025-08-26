
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  ticketsRemaining: number;
  contractStartDate: string;
  contractEndDate: string;
  company?: string;
  phone?: string;
}

export interface Ticket {
  ticketType: any;
  comments: any;
  id: string;
  title: string;
  description: string;
  status: 'raised' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedTo?: string;
  images?: string[];
  attachments?: string[];
  satisfactionRating?: number;
  responseTime?: number;
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  projectId?: string;
  ticketId?: string;
  fileUrl: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    company: string;
    phone?: string;
  }) => Promise<User>;
  updateUser: (updates: Partial<User>) => void;
  socket: any;
  isLoading: boolean;
}
