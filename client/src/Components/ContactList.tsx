import React, { useState } from 'react';
import { Contact } from '../types/Contact';
import { ContactCard } from './ContactCard';
import { 
  Users, Inbox, Grid, List, SortAsc, SortDesc, 
  Filter, CheckSquare, Square, Star, Clock,
  ArrowUpDown, ChevronDown
} from 'lucide-react';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onToggleFavorite: (contact: Contact) => void;
  onView: (contact: Contact) => void;
  isLoading: boolean;
  selectedContacts: string[];
  onSelectContact: (contactId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalContacts: number;
}

export type SortOption = 'name' | 'email' | 'company' | 'updated' | 'created';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';
export type FilterOption = 'all' | 'favorites' | 'recent' | 'no-company';

interface ContactListState {
  viewMode: ViewMode;
  sortBy: SortOption;
  sortOrder: SortOrder;
  filterBy: FilterOption;
  showSortMenu: boolean;
  showFilterMenu: boolean;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onEdit,
  onDelete,
  onToggleFavorite,
  onView,
  isLoading,
  selectedContacts,
  onSelectContact,
  onSelectAll,
  onClearSelection,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalContacts
}) => {
  const [state, setState] = useState<ContactListState>({
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
    filterBy: 'all',
    showSortMenu: false,
    showFilterMenu: false
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode: mode }));
  };

  const handleSortChange = (sortBy: SortOption) => {
    setState(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      showSortMenu: false
    }));
  };

  const handleFilterChange = (filterBy: FilterOption) => {
    setState(prev => ({ ...prev, filterBy, showFilterMenu: false }));
  };

  const getSortIcon = (option: SortOption) => {
    if (state.sortBy !== option) return <ArrowUpDown size={16} className="text-gray-400" />;
    return state.sortOrder === 'asc' ? 
      <SortAsc size={16} className="text-blue-600" /> : 
      <SortDesc size={16} className="text-blue-600" />;
  };

  const getSortLabel = () => {
    const labels = {
      name: 'Name',
      email: 'Email',
      company: 'Company',
      updated: 'Last Updated',
      created: 'Date Added'
    };
    return `${labels[state.sortBy]} ${state.sortOrder === 'asc' ? '↑' : '↓'}`;
  };

  const getFilterLabel = () => {
    const labels = {
      all: 'All Contacts',
      favorites: 'Favorites',
      recent: 'Recently Added',
      'no-company': 'No Company'
    };
    return labels[state.filterBy];
  };

  const getFilterIcon = () => {
    switch (state.filterBy) {
      case 'favorites': return <Star size={16} className="text-yellow-500" />;
      case 'recent': return <Clock size={16} className="text-green-500" />;
      default: return <Filter size={16} />;
    }
  };

  const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length;
  const someSelected = selectedContacts.length > 0 && selectedContacts.length < contacts.length;

  // Loading State
  if (isLoading) {
    const skeletonCount = itemsPerPage || 12;
    return (
      <div className="space-y-6">
        {/* Loading Header */}
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Loading Grid */}
        <div className={state.viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
        }>
          {[...Array(skeletonCount)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
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
      </div>
    );
  }

  // Empty State
  if (contacts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Inbox size={48} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {state.filterBy === 'all' ? 'No contacts found' : `No ${getFilterLabel().toLowerCase()}`}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {state.filterBy === 'all' 
            ? "Start building your contact list by adding your first contact. Click the 'Add Contact' button to get started."
            : `No contacts match the current filter. Try changing the filter or add some contacts first.`
          }
        </p>
        {state.filterBy !== 'all' && (
          <button
            onClick={() => handleFilterChange('all')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Show All Contacts
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Side - Stats and Selection */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={allSelected ? onClearSelection : onSelectAll}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {allSelected ? (
                <CheckSquare size={20} className="text-blue-600" />
              ) : someSelected ? (
                <div className="w-5 h-5 bg-blue-600 rounded border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              ) : (
                <Square size={20} />
              )}
            </button>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Users size={20} />
              <span className="font-medium">
                {selectedContacts.length > 0 ? (
                  <span>
                    {selectedContacts.length} of {contacts.length} selected
                  </span>
                ) : (
                  <span>
                    {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'}
                    {totalContacts > contacts.length && (
                      <span className="text-gray-500"> (of {totalContacts} total)</span>
                    )}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedContacts.length > 0 && (
            <div className="flex items-center space-x-2 pl-4 border-l border-gray-300">
              <span className="text-sm text-gray-600">Bulk actions:</span>
              <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                Delete Selected
              </button>
              <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                Export Selected
              </button>
            </div>
          )}
        </div>

        {/* Right Side - View Controls */}
        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setState(prev => ({ 
                ...prev, 
                showFilterMenu: !prev.showFilterMenu,
                showSortMenu: false 
              }))}
              className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {getFilterIcon()}
              <span className="text-sm font-medium">{getFilterLabel()}</span>
              <ChevronDown size={16} />
            </button>

            {state.showFilterMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  {(['all', 'favorites', 'recent', 'no-company'] as FilterOption[]).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => handleFilterChange(filter)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        state.filterBy === filter 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {filter === 'favorites' && <Star size={16} />}
                      {filter === 'recent' && <Clock size={16} />}
                      {filter === 'all' && <Users size={16} />}
                      {filter === 'no-company' && <Filter size={16} />}
                      <span className="capitalize">
                        {filter === 'all' ? 'All Contacts' :
                         filter === 'no-company' ? 'No Company' :
                         filter === 'recent' ? 'Recently Added' :
                         'Favorites'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setState(prev => ({ 
                ...prev, 
                showSortMenu: !prev.showSortMenu,
                showFilterMenu: false 
              }))}
              className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {getSortIcon(state.sortBy)}
              <span className="text-sm font-medium">{getSortLabel()}</span>
              <ChevronDown size={16} />
            </button>

            {state.showSortMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="p-2">
                  {(['name', 'email', 'company', 'updated', 'created'] as SortOption[]).map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSortChange(option)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                        state.sortBy === option 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="capitalize">
                        {option === 'updated' ? 'Last Updated' :
                         option === 'created' ? 'Date Added' :
                         option}
                      </span>
                      {getSortIcon(option)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                state.viewMode === 'grid' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Grid view"
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                state.viewMode === 'list' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Grid/List */}
      <div className={
        state.viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-3"
      }>
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onView={onView}
            isSelected={selectedContacts.includes(contact.id)}
            onSelect={() => onSelectContact(contact.id)}
            viewMode={state.viewMode}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalContacts)} of {totalContacts} contacts
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNum = Math.max(1, currentPage - 2) + index;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Click outside handlers */}
      {(state.showSortMenu || state.showFilterMenu) && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setState(prev => ({ 
            ...prev, 
            showSortMenu: false, 
            showFilterMenu: false 
          }))}
        />
      )}
    </div>
  );
};