/**
 * Client Management Types
 */

export interface ClientDocument {
  id: string;
  type: 'will' | 'inheritance-order' | 'probate-order' | 'poa' | 'attorney-fee' | 'pleading' | 'other';
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'completed' | 'sent' | 'signed';
}

export interface Client {
  id: string;
  name: string;
  idNumber: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  documents: ClientDocument[];
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface ClientSearchFilters {
  searchTerm?: string;
  documentType?: ClientDocument['type'];
  status?: ClientDocument['status'];
  sortBy?: 'name' | 'date' | 'documents';
  sortOrder?: 'asc' | 'desc';
}

export const documentTypeLabels: Record<ClientDocument['type'], string> = {
  'will': 'צוואה',
  'inheritance-order': 'צו ירושה',
  'probate-order': 'צו קיום צוואה',
  'poa': 'ייפוי כוח',
  'attorney-fee': 'הסכם שכר טרחה',
  'pleading': 'כתב טענות',
  'other': 'אחר',
};

export const statusLabels: Record<ClientDocument['status'], string> = {
  'draft': 'טיוטה',
  'completed': 'הושלם',
  'sent': 'נשלח ללקוח',
  'signed': 'נחתם',
};

export function createClient(data: Partial<Client>): Client {
  return {
    id: Date.now().toString(),
    name: data.name || '',
    idNumber: data.idNumber || '',
    phone: data.phone || '',
    email: data.email,
    address: data.address,
    notes: data.notes,
    documents: data.documents || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: data.tags || [],
  };
}

