import React from 'react';
import { Contact } from '../types/Contact';
import { 
  X, Mail, Phone, Building, MapPin, Calendar, Clock, 
  Star, Edit, Trash2, Share2, Download, User, Tag,
  ExternalLink, Copy, Check
} from 'lucide-react';

interface ContactDetailModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onToggleFavorite: (contact: Contact) => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  contact,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  if (!isOpen || !contact) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return `${f}${l}`.toUpperCase() || '?';
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getStatusColor = (contact: Contact) => {
    if (contact.isFavorite) return 'from-yellow-500 to-orange-500';
    if (contact.lastViewed && new Date(contact.lastViewed) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
      return 'from-green-500 to-emerald-500';
    }
    return 'from-blue-500 to-blue-600';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${contact.firstName} ${contact.lastName}`,
          text: `Contact: ${contact.firstName} ${contact.lastName}`,
          url: `mailto:${contact.email}`
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy contact info to clipboard
      const contactInfo = `${contact.firstName} ${contact.lastName}\n${contact.email}\n${contact.phone}`;
      copyToClipboard(contactInfo, 'contact');
    }
  };

  const exportToVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contact.firstName} ${contact.lastName}
N:${contact.lastName};${contact.firstName};;;
EMAIL:${contact.email}
TEL:${contact.phone}
ORG:${contact.company}
TITLE:${contact.position}
ADR:;;${contact.address};;;;
NOTE:${contact.notes}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contact.firstName}_${contact.lastName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-gray-50 to-white p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={24} />
          </button>

          <div className="flex items-start space-x-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className={`w-24 h-24 bg-gradient-to-br ${getStatusColor(contact)} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                {contact.avatar ? (
                  <img src={contact.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(contact.firstName, contact.lastName)
                )}
              </div>
              {contact.isFavorite && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                  <Star size={16} className="text-white fill-current" />
                </div>
              )}
              {contact.lastViewed && new Date(contact.lastViewed) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" title="Recently viewed" />
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {contact.firstName} {contact.lastName}
              </h1>
              
              {(contact.position || contact.company) && (
                <div className="flex items-center space-x-2 mb-4">
                  <Building size={16} className="text-purple-500" />
                  <span className="text-lg text-gray-700">
                    {contact.position && contact.company ? (
                      <>
                        <span className="font-medium">{contact.position}</span>
                        <span className="text-gray-500 mx-2">at</span>
                        <span>{contact.company}</span>
                      </>
                    ) : (
                      contact.position || contact.company
                    )}
                  </span>
                </div>
              )}

              {/* Tags */}
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {contact.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium"
                    >
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onToggleFavorite(contact)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    contact.isFavorite
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {contact.isFavorite ? <Star size={16} className="fill-current" /> : <Star size={16} />}
                  <span>{contact.isFavorite ? 'Favorited' : 'Add to Favorites'}</span>
                </button>

                <button
                  onClick={() => onEdit(contact)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all"
                >
                  <Edit size={16} />
                  <span>Edit</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all"
                >
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <User size={20} />
                  <span>Contact Information</span>
                </h2>
                
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {/* Email */}
                  <div className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3 flex-1">
                      <Mail size={18} className="text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(contact.email, 'email')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"
                        title="Copy email"
                      >
                        {copiedField === 'email' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                      <a
                        href={`mailto:${contact.email}`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                        title="Send email"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  {contact.phone && (
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center space-x-3 flex-1">
                        <Phone size={18} className="text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-green-600 hover:text-green-800 font-medium hover:underline"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(contact.phone, 'phone')}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"
                          title="Copy phone"
                        >
                          {copiedField === 'phone' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                        <a
                          href={`tel:${contact.phone}`}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"
                          title="Call phone"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Address */}
                  {contact.address && (
                    <div className="flex items-center justify-between group">
                      <div className="flex items-center space-x-3 flex-1">
                        <MapPin size={18} className="text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-gray-800">{contact.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(contact.address, 'address')}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all"
                          title="Copy address"
                        >
                          {copiedField === 'address' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                        </button>
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-all"
                          title="View on map"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {contact.notes && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Activity Timeline */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock size={18} />
                  <span>Activity</span>
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600">Contact updated</p>
                      <p className="text-xs text-gray-500">{formatDateShort(contact.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-600">Contact created</p>
                      <p className="text-xs text-gray-500">{formatDateShort(contact.createdAt)}</p>
                    </div>
                  </div>

                  {contact.lastViewed && (
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">Last viewed</p>
                        <p className="text-xs text-gray-500">{formatDateShort(contact.lastViewed)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days since created</span>
                    <span className="font-medium text-gray-900">
                      {Math.floor((new Date().getTime() - new Date(contact.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Days since updated</span>
                    <span className="font-medium text-gray-900">
                      {Math.floor((new Date().getTime() - new Date(contact.updatedAt).getTime()) / (1000 * 60 * 60 * 24))}
                    </span>
                  </div>

                  {contact.lastViewed && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Days since viewed</span>
                      <span className="font-medium text-gray-900">
                        {Math.floor((new Date().getTime() - new Date(contact.lastViewed).getTime()) / (1000 * 60 * 60 * 24))}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total tags</span>
                    <span className="font-medium text-gray-900">{contact.tags?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={exportToVCard}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-all font-medium"
                  >
                    <Download size={16} />
                    <span>Export as vCard</span>
                  </button>

                  <button
                    onClick={() => onDelete(contact)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all font-medium"
                  >
                    <Trash2 size={16} />
                    <span>Delete Contact</span>
                  </button>
                </div>
              </div>

              {/* Detailed Timestamps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Calendar size={18} />
                  <span>Timestamps</span>
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-xs">
                  <div>
                    <p className="text-gray-600 font-medium">Created</p>
                    <p className="text-gray-800">{formatDate(contact.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 font-medium">Last Modified</p>
                    <p className="text-gray-800">{formatDate(contact.updatedAt)}</p>
                  </div>

                  {contact.lastViewed && (
                    <div>
                      <p className="text-gray-600 font-medium">Last Viewed</p>
                      <p className="text-gray-800">{formatDate(contact.lastViewed)}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};