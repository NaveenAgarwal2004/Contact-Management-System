// services/api.ts
import { Contact, ContactFormData } from '../types/Contact';
import { config } from '../config/environment';

// API Response types
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

interface ContactListResponse extends ApiResponse<Contact[]> {
  count: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.apiUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      headers: { ...defaultHeaders, ...options.headers },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to parse error response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // If error response is not JSON, use the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
      
      // Re-throw other errors
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request('/health');
  }

  // Get all contacts with optional search and pagination
  async getContacts(params: {
    search?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<ContactListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const endpoint = `/api/contacts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<ContactListResponse>(endpoint);
  }

  // Get single contact by ID
  async getContact(id: string): Promise<ApiResponse<Contact>> {
    return this.request<ApiResponse<Contact>>(`/api/contacts/${id}`);
  }

  // Create new contact
  async createContact(contactData: ContactFormData): Promise<ApiResponse<Contact>> {
    return this.request<ApiResponse<Contact>>('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Update existing contact
  async updateContact(id: string, contactData: ContactFormData): Promise<ApiResponse<Contact>> {
    return this.request<ApiResponse<Contact>>(`/api/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  }

  // Delete single contact
  async deleteContact(id: string): Promise<ApiResponse<Contact>> {
    return this.request<ApiResponse<Contact>>(`/api/contacts/${id}`, {
      method: 'DELETE',
    });
  }

  // Bulk delete contacts
  async deleteContacts(ids: string[]): Promise<ApiResponse<{ deletedCount: number }>> {
    return this.request<ApiResponse<{ deletedCount: number }>>('/api/contacts', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });
  }

  // Get analytics data
  async getAnalytics(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/api/analytics');
  }
}

// Create and export singleton instance
export const contactsApi = new ApiService();

// Export individual methods for convenience
export const {
  healthCheck,
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  deleteContacts,
  getAnalytics,
} = contactsApi;