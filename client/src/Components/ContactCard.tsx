import React from 'react';
import { Contact } from '../types/Contact';
import { Mail, Phone, Building, MapPin, User, Edit, Trash2 } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  const getInitials = (firstName?: string, lastName?: string) => {
  const f = firstName?.charAt(0) || '';
  const l = lastName?.charAt(0) || '';
  return `${f}${l}`.toUpperCase() || '?';
};

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
            {getInitials(contact.firstName, contact.lastName)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {contact.firstName} {contact.lastName}
            </h3>
            {contact.position && contact.company && (
              <p className="text-gray-600 text-sm">
                {contact.position} at {contact.company}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(contact)}
            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
            title="Edit contact"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(contact)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete contact"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {contact.email && (
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail size={16} className="text-blue-500 flex-shrink-0" />
            <a
              href={`mailto:${contact.email}`}
              className="text-sm hover:text-blue-600 transition-colors truncate"
            >
              {contact.email}
            </a>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-center space-x-3 text-gray-600">
            <Phone size={16} className="text-green-500 flex-shrink-0" />
            <a
              href={`tel:${contact.phone}`}
              className="text-sm hover:text-green-600 transition-colors"
            >
              {contact.phone}
            </a>
          </div>
        )}

        {contact.company && (
          <div className="flex items-center space-x-3 text-gray-600">
            <Building size={16} className="text-purple-500 flex-shrink-0" />
            <span className="text-sm truncate">{contact.company}</span>
          </div>
        )}

        {contact.address && (
          <div className="flex items-center space-x-3 text-gray-600">
            <MapPin size={16} className="text-red-500 flex-shrink-0" />
            <span className="text-sm truncate">{contact.address}</span>
          </div>
        )}

        {contact.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <User size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600 leading-relaxed">{contact.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">
          Updated {new Date(contact.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};