import { Client, ClientSearchFilters } from '@/types/client';

const CLIENTS_KEY = 'clients-database';

/**
 * Load all clients from localStorage
 */
export function loadClients(): Client[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(CLIENTS_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse clients:', error);
    return [];
  }
}

/**
 * Save all clients to localStorage
 */
export function saveClients(clients: Client[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

/**
 * Add a new client
 */
export function addClient(client: Client): void {
  const clients = loadClients();
  clients.push(client);
  saveClients(clients);
}

/**
 * Update an existing client
 */
export function updateClient(clientId: string, updates: Partial<Client>): void {
  const clients = loadClients();
  const index = clients.findIndex(c => c.id === clientId);
  
  if (index !== -1) {
    clients[index] = {
      ...clients[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveClients(clients);
  }
}

/**
 * Delete a client
 */
export function deleteClient(clientId: string): void {
  const clients = loadClients();
  const filtered = clients.filter(c => c.id !== clientId);
  saveClients(filtered);
}

/**
 * Get a single client by ID
 */
export function getClient(clientId: string): Client | undefined {
  const clients = loadClients();
  return clients.find(c => c.id === clientId);
}

/**
 * Search and filter clients
 */
export function searchClients(filters: ClientSearchFilters): Client[] {
  let clients = loadClients();
  
  // Search by term (name, ID, phone, email)
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    clients = clients.filter(c => 
      c.name.toLowerCase().includes(term) ||
      c.idNumber.includes(term) ||
      c.phone.includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  }
  
  // Filter by document type
  if (filters.documentType) {
    clients = clients.filter(c => 
      c.documents.some(d => d.type === filters.documentType)
    );
  }
  
  // Filter by status
  if (filters.status) {
    clients = clients.filter(c => 
      c.documents.some(d => d.status === filters.status)
    );
  }
  
  // Sort
  if (filters.sortBy) {
    clients.sort((a, b) => {
      let compareValue = 0;
      
      switch (filters.sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name, 'he');
          break;
        case 'date':
          compareValue = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case 'documents':
          compareValue = a.documents.length - b.documents.length;
          break;
      }
      
      return filters.sortOrder === 'desc' ? -compareValue : compareValue;
    });
  }
  
  return clients;
}

/**
 * Get clients statistics
 */
export function getClientsStats() {
  const clients = loadClients();
  
  return {
    totalClients: clients.length,
    totalDocuments: clients.reduce((sum, c) => sum + c.documents.length, 0),
    recentClients: clients
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5),
  };
}

