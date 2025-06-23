import React, { useState, useEffect, useCallback } from 'react';
import { Contact, ContactFormData } from './types/Contact';
import { contactsApi } from './services/api';
import { ContactList } from './Components/ContactList';
import { ContactForm } from './Components/ContactForm';
import { SearchBar } from './Components/SearchBar';
import { DeleteConfirmModal } from './Components/DeleteConfirmModel';
import { Users, Plus, AlertCircle } from 'lucide-react';

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

  // Load contacts
  const loadContacts = useCallback(async (search?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await contactsApi.getContacts(search);
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

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
  }, [contacts]);

  // Handle form submission
  const handleFormSubmit = async (formData: ContactFormData) => {
    try {
      setError(null);
      if (editingContact) {
        await contactsApi.updateContact(editingContact.id, formData);
      } else {
        await contactsApi.createContact(formData);
      }
      
      await loadContacts(searchQuery); // Reload contacts from backend to ensure data consistency
      handleCloseForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save contact');
      throw err; // Re-throw to let form handle the error
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
      await contactsApi.deleteContact(deletingContact.id);
      setContacts(prev => prev.filter(c => c.id !== deletingContact.id));
      setDeletingContact(null);
      // Refresh the filtered contacts based on current search
      handleSearch(searchQuery);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Contact Manager</h1>
                <p className="text-gray-600 mt-1">Organize and manage your contacts efficiently</p>
              </div>
            </div>
            <button
              onClick={handleAddContact}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              <span>Add Contact</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="max-w-md">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Contact List */}
        <ContactList
          contacts={filteredContacts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
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