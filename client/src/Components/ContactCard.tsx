import React from 'react';
import { Contact } from '../types/Contact';
import { 
  Mail, Phone, Building, MapPin, User, Edit, Trash2, 
  Star, Eye, Calendar, Clock, StarOff 
} from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onToggleFavorite: (contact: Contact) => void;
  onView: (contact: Contact) => void;
  isSelected: boolean;
  onSelect: () => void;
  viewMode: 'grid' | 'list';
}

export const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  onView,
  isSelected,
  onSelect,
  viewMode = 'grid'
}) => {
  const getInitials = (firstName?: string, lastName?: string) => {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return `${f}${l}`.toUpperCase() || '?';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusColor = (contact: Contact) => {
    if (contact.isFavorite) return 'from-yellow-500 to-orange-500';
    if (contact.lastViewed && new Date(contact.lastViewed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return 'from-green-500 to-emerald-500';
    }
    return 'from-blue-500 to-blue-600';
  };

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-blue-500 border-blue-300' 
          : 'border-gray-200 hover:border-blue-200'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              {/* Selection Checkbox */}
              <div className="flex-shrink-0">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={onSelect}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <div className={`w-12 h-12 bg-gradient-to-br ${getStatusColor(contact)} rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm`}>
                  {contact.avatar ? (
                    <img src={contact.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(contact.firstName, contact.lastName)
                  )}
                </div>
                {contact.isFavorite && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star size={12} className="text-white fill-current" />
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {contact.firstName} {contact.lastName}
                  </h3>
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {contact.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="text-xs text-gray-500">+{contact.tags.length - 2}</span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-600 truncate">{contact.email}</span>
                  {contact.phone && (
                    <span className="text-sm text-gray-500 hidden sm:block">{contact.phone}</span>
                  )}
                </div>
              </div>

              {/* Company & Position - Hidden on small screens */}
              <div className="hidden md:flex flex-col min-w-0 w-48">
                <span className="text-sm text-gray-900 truncate">{contact.company || 'No Company'}</span>
                <span className="text-xs text-gray-500 truncate">{contact.position || 'No Position'}</span>
              </div>

              {/* Last Updated - Hidden on small screens */}
              <div className="hidden lg:flex flex-col w-32">
                <span className="text-xs text-gray-500">Updated</span>
                <span className="text-xs text-gray-700">{formatDate(contact.updatedAt)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button
                onClick={() => onToggleFavorite(contact)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  contact.isFavorite 
                    ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                }`}
                title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                {contact.isFavorite ? <Star size={16} className="fill-current" /> : <Star size={16} />}
              </button>
              <button
                onClick={() => onView(contact)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="View contact details"
              >
                <Eye size={16} />
              </button>
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
        </div>
      </div>
    );
  }

  // Grid View Layout (Enhanced)
  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border group relative overflow-hidden ${
      isSelected 
        ? 'ring-2 ring-blue-500 border-blue-300 shadow-lg' 
        : 'border-gray-100 hover:border-blue-200'
    }`}>
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
        />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-50" />
      
      <div className="relative p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4 pl-8">
          <div className="flex items-center space-x-4">
            {/* Enhanced Avatar */}
            <div className="relative">
              <div className={`w-16 h-16 bg-gradient-to-br ${getStatusColor(contact)} rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg transform transition-transform group-hover:scale-105`}>
                {contact.avatar ? (
                  <img src={contact.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(contact.firstName, contact.lastName)
                )}
              </div>
              {contact.isFavorite && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Star size={12} className="text-white fill-current" />
                </div>
              )}
              {contact.lastViewed && new Date(contact.lastViewed) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" title="Recently viewed" />
              )}
            </div>

            {/* Contact Name & Title */}
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 truncate">
                {contact.firstName} {contact.lastName}
              </h3>
              {contact.position && contact.company && (
                <p className="text-gray-600 text-sm mt-1 truncate">
                  <span className="font-medium">{contact.position}</span>
                  <span className="text-gray-400 mx-1">at</span>
                  <span>{contact.company}</span>
                </p>
              )}
              
              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {contact.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                  {contact.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{contact.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={() => onToggleFavorite(contact)}
              className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
                contact.isFavorite 
                  ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              title={contact.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {contact.isFavorite ? <Star size={18} className="fill-current" /> : <Star size={18} />}
            </button>
            <button
              onClick={() => onView(contact)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
              title="View contact details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
              title="Edit contact"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(contact)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
              title="Delete contact"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-3">
          {contact.email && (
            <div className="flex items-center space-x-3 text-gray-600 group/item hover:text-blue-600 transition-colors">
              <Mail size={16} className="text-blue-500 flex-shrink-0" />
              <a
                href={`mailto:${contact.email}`}
                className="text-sm truncate hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {contact.email}
              </a>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center space-x-3 text-gray-600 group/item hover:text-green-600 transition-colors">
              <Phone size={16} className="text-green-500 flex-shrink-0" />
              <a
                href={`tel:${contact.phone}`}
                className="text-sm hover:underline"
                onClick={(e) => e.stopPropagation()}
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
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {contact.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <Calendar size={12} />
              <span>Updated {formatDate(contact.updatedAt)}</span>
            </div>
            {contact.lastViewed && (
              <div className="flex items-center space-x-1">
                <Clock size={12} />
                <span>Viewed {formatDate(contact.lastViewed)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};