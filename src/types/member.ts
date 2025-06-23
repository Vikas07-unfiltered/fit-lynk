
export interface Member {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  whatsapp_number?: string;
  plan: string;
  status: string;
  join_date: string;
  last_payment: string | null;
  photo_url?: string;
}

export interface NewMember {
  name: string;
  phone: string;
  whatsapp_number: string;
  plan: string;
}
