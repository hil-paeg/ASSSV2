
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


export interface CloseTicket {
  close_id: number;
  ticket_id: number;
  summary: string | null;
  attachment: string | null;
  out_of_scope: boolean;
  experience: string | null;
  time_saved: number | null;
  rating: number | null;
  created_at: string;
}

// export interface Ticket {
//   id: number;
//   ticket_id: number;
//   userId: number;
//   client_id: string;
//   title: string;
//   issue_title: string;
//   issue_category: string;
//   issue_subcategory :  string;
//   priority: string | null;
//   description: string | null;
//   location: string | null;
//   actions_performed: string | null;
//   attachments: string | null;
//   creator_name: string | null;
//   status: "raised" | "in-progress" | "confirmed by oem" | "resolved" | "closed";
//   comments: string | null;
//   ticketType: string | null;
//   ticket_type: string | null;
//   createdAt: string;
//   created_at: string;
//   updatedAt: string;
//   updated_at: string;
//   closed_at: string | null;
//   summary: string | null;
//   out_of_scope: boolean;
//   clientClosed: boolean;
//   adminClosed: boolean;
//   feedback: string | null;
//   out_of_scope_reason: string | null;
//   client?: { client_username: string };
//   close_ticket?: CloseTicket;
// }

export interface Ticket {
  id: number;
  ticket_id: number;
  userId: number;
  client_id: string;  // Changed to string
  title: string;
  issue_title: string;
  issue_category: string | null;  // Added
  issue_subcategory: string | null;  // Added
  priority: string | null;
  description: string | null;
  location: string | null;
  actions_performed: string | null;
  attachments: string | null;
  creator_name: string | null;
  status: "raised" | "in-progress" | "confirmed by oem" | "resolved" | "closed";
  comments: string | null;
  ticketType: string | null;
  ticket_type: string | null;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
  closed_at: string | null;
  summary: string | null;
  out_of_scope: boolean;
  clientClosed: boolean;
  adminClosed: boolean;
  feedback: string | null;
  out_of_scope_reason: string | null;
  client?: { client_username: string };
  close_ticket?: CloseTicket;
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





// export interface Ticket {
//   id: number;
//   ticket_id: number;
//   userId: number;
//   client_id: number;
//   title: string;
//   issue_title: string;
//   priority: string | null;
//   description: string | null;
//   location: string | null;
//   actions_performed: string | null;
//   attachments: string | null;
//   creator_name: string | null;
//   status: 'closed' | 'resolved' | 'in-progress' | 'raised';
//   comments: string | null;
//   ticketType: string | null;
//   ticket_type: string | null;
//   createdAt: string;
//   created_at: string;
//   updatedAt: string;
//   updated_at: string;
//   closed_at: string | null;
//   summary: string | null;
//   out_of_scope: boolean;
//   clientClosed: boolean;
//   adminClosed: boolean;
//   feedback: string | null;
//   out_of_scope_reason: string | null;
//   client?: { client_username: string };
// }


// export interface Ticket {
//   ticketType: any;
//   comments: any;
//   id: string;
//   title: string;
//   description: string;
//   status: 'raised' | 'in-progress' | 'resolved';
//   priority: 'low' | 'medium' | 'high';
//   createdAt: string;
//   updatedAt: string;
//   userId: string;
//   assignedTo?: string;
//   images?: string[];
//   attachments?: string[];
//   satisfactionRating?: number;
//   responseTime?: number;
// }


// src/types/index.ts