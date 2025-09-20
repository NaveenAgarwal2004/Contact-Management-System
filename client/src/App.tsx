import { useState, useEffect, useCallback } from 'react';
import { Contact, ContactFormData } from './types/Contact';
import { ContactList } from './Components/ContactList';
import { ContactForm } from './Components/ContactForm';
import { SearchBar } from './Components/SearchBar';
import { DeleteConfirmModal } from './Components/DeleteConfirmModal';
import { Users, Plus, AlertCircle, Download, Settings, Sun, Moon, Sparkles, X } from 'lucide-react';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showWelcome, setShowWelcome] = useState(false);

  // New state for selection and pagination
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Load contacts
  const loadContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // For now, we'll use mock data since the API might not be working
      const mockContacts = generateMockContacts(50);
      setContacts(mockContacts);
      setFilteredContacts(mockContacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate mock data function
  const generateMockContacts = (count: number): Contact[] => {
    const companies = ['Apple Inc.', 'Google LLC', 'Microsoft Corp.', 'Amazon', 'Meta', 'Tesla', 'Netflix', 'Spotify'];
    const positions = ['Software Engineer', 'Product Manager', 'Designer', 'Marketing Manager', 'Sales Director'];
    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Tom', 'Emily', 'Chris', 'Anna'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    const tags = ['work', 'personal', 'client', 'vendor', 'friend', 'family'];
    
    return Array.from({ length: count }, (_, i) => ({
      id: `contact-${i}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `contact${i}@example.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      company: Math.random() > 0.2 ? companies[Math.floor(Math.random() * companies.length)] : '',
      position: Math.random() > 0.3 ? positions[Math.floor(Math.random() * positions.length)] : '',
      address: `${Math.floor(Math.random() * 9999)} Main St, City, State`,
      notes: Math.random() > 0.5 ? `Sample notes for contact ${i}` : '',
      tags: Math.random() > 0.5 ? [tags[Math.floor(Math.random() * tags.length)]] : [],
      isFavorite: Math.random() > 0.8,
      avatar: Math.random() > 0.7 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}` : null,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  useEffect(() => {
    loadContacts();
    
    // Check if first visit
    const isFirstVisit = !localStorage.getItem('hasVisited');
    if (isFirstVisit) {
      setShowWelcome(true);
      localStorage.setItem('hasVisited', 'true');
    }

    // Load theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [loadContacts]);

  // Apply theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.firstName.toLowerCase().includes(query.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase()) ||
        contact.company.toLowerCase().includes(query.toLowerCase()) ||
        contact.position.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
    setCurrentPage(1);
    setSelectedContacts([]);
  }, [contacts]);

  // Handle form submission
  const handleFormSubmit = async (formData: ContactFormData) => {
    try {
      setError(null);
      if (editingContact) {
        // Update existing contact
        const updatedContact: Contact = {
          ...editingContact,
          ...formData,
          updatedAt: new Date().toISOString()
        };
        setContacts(prev => prev.map(c => c.id === editingContact.id ? updatedContact : c));
      } else {
        // Create new contact
        const newContact: Contact = {
          id: `contact-${Date.now()}`,
          ...formData,
          isFavorite: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setContacts(prev => [...prev, newContact]);
      }
      
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact');
      throw err;
    }
  };

  // Handle edit
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact);
  };

  const confirmDelete = async () => {
    if (!deletingContact) return;

    try {
      setIsDeleting(true);
      setError(null);
      setContacts(prev => prev.filter(c => c.id !== deletingContact.id));
      setDeletingContact(null);
      handleSearch(searchQuery); // Refresh the filtered contacts
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete contact');
      console.error('Error deleting contact:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle form close
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(undefined);
  };

  // Handle add new contact
  const handleAddContact = () => {
    setEditingContact(undefined);
    setIsFormOpen(true);
  };

  // Handle export
  const handleExport = async () => {
    try {
      const csvContent = [
        ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Position'].join(','),
        ...filteredContacts.map(c => [
          c.firstName,
          c.lastName,
          c.email,
          c.phone,
          c.company,
          c.position
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to export contacts');
    }
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Selection handlers
  const onSelectContact = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) ? prev.filter(id => id !== contactId) : [...prev, contactId]
    );
  };

  const onSelectAll = () => {
    const currentContacts = paginatedContacts.map(c => c.id);
    setSelectedContacts(currentContacts);
  };

  const onClearSelection = () => {
    setSelectedContacts([]);
  };

  // Pagination handler
  const onPageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setSelectedContacts([]);
  };

  // Pagination calculations
  const totalContacts = filteredContacts.length;
  const totalPages = Math.ceil(totalContacts / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers for onToggleFavorite and onView
  const onToggleFavorite = (contact: Contact) => {
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  };

  const onView = (_contact: Contact) => {
    // TODO: Implement view logic - could open a detail modal
    console.log('View contact:', _contact);
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' 
        ? 'dark bg-gray-900' 
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {/* Welcome Toast */}
      {showWelcome && (
        <div className="fixed top-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start space-x-3">
            <Sparkles size={20} className="mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold">Welcome to Contact Manager Pro!</h4>
              <p className="text-sm mt-1">You have {contacts.length} sample contacts to explore.</p>
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Users size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Contact Manager Pro
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Enhanced contact management with modern features
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 rounded-lg transition-all"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <Download size={20} />
                <span className="hidden sm:block">Export CSV</span>
              </button>

              {/* Add Contact Button */}
              <button
                onClick={handleAddContact}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                <span>Add Contact</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contacts</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{contacts.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Company</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {contacts.filter(c => c.company).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Settings size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Phone</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {contacts.filter(c => c.phone).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filtered</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{filteredContacts.length}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Users size={24} className="text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-md">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-300 p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Contact List */}
        <ContactList
          contacts={paginatedContacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleFavorite={onToggleFavorite}
          onView={onView}
          isLoading={isLoading}
          selectedContacts={selectedContacts}
          onSelectContact={onSelectContact}
          onSelectAll={onSelectAll}
          onClearSelection={onClearSelection}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          itemsPerPage={itemsPerPage}
          totalContacts={totalContacts}
        />

        {/* Contact Form Modal */}
        <ContactForm
          contact={editingContact}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          isOpen={isFormOpen}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          contact={deletingContact}
          isOpen={!!deletingContact}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingContact(null)}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}

export default App;