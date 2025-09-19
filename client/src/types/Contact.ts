export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
  lastViewed?: string;
  // New fields for enhanced functionality
  socialLinks?: SocialLinks;
  customFields?: CustomField[];
  contactSource?: string; // How this contact was added (manual, import, etc.)
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'inactive' | 'archived';
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  address: string;
  notes: string;
  tags: string[];
  avatar: string | null;
  socialLinks?: SocialLinks;
  customFields?: CustomField[];
  priority?: 'low' | 'medium' | 'high';
  status?: 'active' | 'inactive' | 'archived';
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  github?: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'email' | 'phone' | 'url' | 'date' | 'textarea';
}

// Enhanced search and filtering types
export interface ContactFilters {
  searchQuery: string;
  tags: string[];
  company: string[];
  isFavorite?: boolean;
  hasCompany?: boolean;
  status?: Contact['status'][];
  priority?: Contact['priority'][];
  dateRange?: {
    field: 'createdAt' | 'updatedAt' | 'lastViewed' | 'lastContactedAt';
    from?: Date;
    to?: Date;
  };
  customFields?: {
    fieldId: string;
    value: string;
  }[];
}

export interface ContactSortOptions {
  field: 'firstName' | 'lastName' | 'email' | 'company' | 'createdAt' | 'updatedAt' | 'lastViewed' | 'priority';
  direction: 'asc' | 'desc';
}

export interface ContactListState {
  contacts: Contact[];
  filteredContacts: Contact[];
  selectedContacts: string[];
  filters: ContactFilters;
  sortOptions: ContactSortOptions;
  viewMode: 'grid' | 'list';
  currentPage: number;
  itemsPerPage: number;
  totalContacts: number;
  isLoading: boolean;
  error: string | null;
}

// Import/Export types
export interface ImportMapping {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  address?: string;
  notes?: string;
  tags?: string;
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'vcard';
  fields: (keyof Contact)[];
  includeCustomFields: boolean;
  selectedOnly: boolean;
}

// Analytics and statistics
export interface ContactAnalytics {
  totalContacts: number;
  favoriteContacts: number;
  companiesCount: number;
  tagsCount: number;
  recentlyAdded: number; // Last 7 days
  recentlyUpdated: number; // Last 7 days
  averageTagsPerContact: number;
  topCompanies: { name: string; count: number }[];
  topTags: { name: string; count: number }[];
  contactsWithoutCompany: number;
  contactsWithoutPhone: number;
  contactsAddedPerMonth: { month: string; count: number }[];
  priorityDistribution: { priority: Contact['priority']; count: number }[];
  statusDistribution: { status: Contact['status']; count: number }[];
}

// Bulk operations
export interface BulkOperation {
  type: 'delete' | 'favorite' | 'unfavorite' | 'addTag' | 'removeTag' | 'updateStatus' | 'updatePriority' | 'export';
  contactIds: string[];
  payload?: {
    tag?: string;
    status?: Contact['status'];
    priority?: Contact['priority'];
    exportOptions?: ExportOptions;
  };
}

// Activity tracking
export interface ContactActivity {
  id: string;
  contactId: string;
  type: 'created' | 'updated' | 'viewed' | 'contacted' | 'favorited' | 'unfavorited' | 'tagged' | 'untagged';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Notification and reminder types
export interface ContactReminder {
  id: string;
  contactId: string;
  title: string;
  description?: string;
  dueDate: string;
  type: 'follow_up' | 'birthday' | 'meeting' | 'call' | 'custom';
  isCompleted: boolean;
  createdAt: string;
}

// Integration types
export interface IntegrationConfig {
  type: 'google_contacts' | 'outlook' | 'salesforce' | 'hubspot' | 'custom';
  settings: Record<string, any>;
  isEnabled: boolean;
  lastSyncAt?: string;
  syncErrors?: string[];
}

// API response types
export interface ApiResponse<T> {
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

export interface ContactListResponse extends ApiResponse<Contact[]> {
  analytics?: Partial<ContactAnalytics>;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}

// Settings and preferences
export interface UserPreferences {
  defaultViewMode: 'grid' | 'list';
  itemsPerPage: number;
  defaultSortField: ContactSortOptions['field'];
  defaultSortDirection: ContactSortOptions['direction'];
  showAvatars: boolean;
  compactMode: boolean;
  enableNotifications: boolean;
  autoSaveInterval: number; // in seconds
  theme: 'light' | 'dark' | 'auto';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  exportDefaultFormat: ExportOptions['format'];
}

// Backup and sync types
export interface BackupData {
  contacts: Contact[];
  activities: ContactActivity[];
  reminders: ContactReminder[];
  preferences: UserPreferences;
  customFields: CustomFieldDefinition[];
  exportedAt: string;
  version: string;
}

export interface CustomFieldDefinition {
  id: string;
  label: string;
  type: CustomField['type'];
  required: boolean;
  options?: string[]; // For select/radio types
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
  createdAt: string;
}

// Component prop types for better type safety
export interface BaseContactProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onToggleFavorite: (contact: Contact) => void;
}

export interface ContactCardProps extends BaseContactProps {
  onView: (contact: Contact) => void;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'grid' | 'list';
  showCheckbox?: boolean;
}

export interface ContactFormProps {
  contact?: Contact;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  customFields?: CustomFieldDefinition[];
  duplicateCheck?: (email: string) => Promise<Contact[]>;
}

export interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  error?: string | null;
  selectedContacts: string[];
  filters: ContactFilters;
  sortOptions: ContactSortOptions;
  viewMode: 'grid' | 'list';
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalContacts: number;
  onContactSelect: (contactId: string) => void;
  onContactsSelectAll: () => void;
  onContactsClearSelection: () => void;
  onFiltersChange: (filters: Partial<ContactFilters>) => void;
  onSortChange: (sortOptions: ContactSortOptions) => void;
  onViewModeChange: (viewMode: 'grid' | 'list') => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onBulkOperation: (operation: BulkOperation) => void;
} & BaseContactProps;

// Hook return types
export interface UseContactsReturn {
  state: ContactListState;
  actions: {
    loadContacts: () => Promise<void>;
    createContact: (data: ContactFormData) => Promise<Contact>;
    updateContact: (id: string, data: Partial<ContactFormData>) => Promise<Contact>;
    deleteContact: (id: string) => Promise<void>;
    deleteContacts: (ids: string[]) => Promise<void>;
    toggleFavorite: (id: string) => Promise<Contact>;
    selectContact: (id: string) => void;
    selectAllContacts: () => void;
    clearSelection: () => void;
    updateFilters: (filters: Partial<ContactFilters>) => void;
    updateSort: (sort: ContactSortOptions) => void;
    setViewMode: (mode: 'grid' | 'list') => void;
    setPage: (page: number) => void;
    setItemsPerPage: (count: number) => void;
    exportContacts: (options: ExportOptions) => Promise<string>;
    importContacts: (data: any[], mapping: ImportMapping) => Promise<Contact[]>;
    bulkOperation: (operation: BulkOperation) => Promise<void>;
    getAnalytics: () => Promise<ContactAnalytics>;
  };
}