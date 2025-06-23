import React from 'react';
import { Contact } from '../types/Contact';
import { ContactCard } from './ContactCard';
import { Users, Inbox } from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  isLoading: boolean;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onEdit,
  onDelete,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Inbox size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start building your contact list by adding your first contact. Click the "Add Contact" button to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 text-gray-600">
        <Users size={20} />
        <span className="text-sm font-medium">
          {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, index) => (
          <ContactCard
          key={contact.id || contact.email || contact.phone || index}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        ))}
      </div>
    </div>
  );
};

