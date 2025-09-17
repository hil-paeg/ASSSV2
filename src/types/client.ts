
export interface ClientFormData {
  client_id: string;
  client_username: string;
  client_password?: string;
  name: string;
  start_date: string;
  payment_cycle: string | null;
}

export interface MemberFormData {
  member_id?: number;
  client_id?: string;
  member_name: string;
  designation: string;
  email: string;
  phone_number: string | null;
  escalation_level: number;
  member_username: string;
  member_password?: string;
}

export interface ContractFormData {
  client_id: string;
  allowed_tickets: number;
  total_tickets_used: number;
  ticket_typeRS1: number;
  ticket_typeRS1_used: number;
  ticket_typeRS2: number;
  ticket_typeRS2_used: number;
  ticket_typeRS3_1: number;
  ticket_typeRS3_1_used: number;
  ticket_typeRS3_2: number;
  ticket_typeRS3_2_used: number;
  site_visit_frequency: number;
  site_visit_date: string;
  hil_admin_id: number | null;
  hil_admin_team: number[];
  escalation_matrix?: number[]; // [adminIdLevel0, adminIdLevel1, adminIdLevel2]
}

export interface AdminFormData {
  admin_id?: number;
  name: string;
  designation: string;
  username: string;
  password: string;
  email?: string;
  mobile_number?: string;
}
