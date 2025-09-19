import React from 'react';
import { Contact } from '../types/Contact';
import { AlertTriangle, X, Trash2, User } from 'lucide-react';

interface DeleteConfirmModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
  isBulkDelete?: boolean;
  contactCount?: number;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  contact,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting,
  isBulkDelete = false,
  contactCount = 1
}) => {
  if (!isOpen) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    const f = firstName?.charAt(0) || '';
    const l = lastName?.charAt(0) || '';
    return `${f}${l}`.toUpperCase() || '?';
  };

  const getTitle = () => {
    if (isBulkDelete) {
      return `Delete ${contactCount} Contact${contactCount > 1 ? 's' : ''}`;
    }
    return 'Delete Contact';
  };

  const getMessage = () => {
    if (isBulkDelete) {
      return `Are you sure you want to delete ${contactCount} contact${contactCount > 1 ? 's' : ''}? This action cannot be undone.`;
    }
    return 'Are you sure you want to delete this contact? This action cannot be undone.';
  };

  const getButtonText = () => {
    if (isDeleting) {
      return isBulkDelete ? 'Deleting Contacts...' : 'Deleting Contact...';
    }
    return isBulkDelete ? `Delete ${contactCount} Contact${contactCount > 1 ? 's' : ''}` : 'Delete Contact';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{getTitle()}</h2>
            </div>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all disabled:cursor-not-allowed"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{getMessage()}</p>
            
            {/* Contact Preview */}
            {contact && !isBulkDelete && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {getInitials(contact.firstName, contact.lastName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{contact.email}</p>
                    {contact.company && (
                      <p className="text-xs text-gray-500 truncate">{contact.company}</p>
                    )}
                  </div>
                  {contact.isFavorite && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-xs">★</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Additional Info */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span>
                      <br />
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>
                      <br />
                      {new Date(contact.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {contact.tags && contact.tags.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium text-xs text-gray-600">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bulk Delete Preview */}
            {isBulkDelete && contactCount && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <User size={24} className="text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {contactCount} contact{contactCount > 1 ? 's' : ''} selected for deletion
                    </p>
                    <p className="text-sm text-gray-600">
                      Including any favorites and associated data
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning Box */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">This action is irreversible!</p>
                  <ul className="text-xs space-y-1">
                    <li>• All contact information will be permanently deleted</li>
                    <li>• Any associated notes and tags will be removed</li>
                    <li>• This contact will be removed from all exports and backups</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 min-w-[140px] justify-center"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>{getButtonText()}</span>
                </>
              )}
            </button>
          </div>

          {/* Progress indicator for bulk operations */}
          {isDeleting && isBulkDelete && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600">
                  Processing deletion... Please do not close this window.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};