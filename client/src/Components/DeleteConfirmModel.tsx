import React from 'react';
import { Contact } from '../types/Contact';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  contact: Contact | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  contact,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Contact</h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this contact? This action cannot be undone.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {(contact.firstName?.charAt(0) || '')}{(contact.lastName?.charAt(0) || '')}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {contact.firstName} {contact.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{contact.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Trash2 size={18} />
              <span>{isDeleting ? 'Deleting...' : 'Delete Contact'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};