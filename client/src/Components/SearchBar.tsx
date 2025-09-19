import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Clock, Star, Building, Mail, User } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  placeholder?: string;
  recentSearches?: string[];
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
}

export interface SearchFilters {
  searchIn?: ('name' | 'email' | 'company' | 'position' | 'notes')[];
  favorites?: boolean;
  hasCompany?: boolean;
  tags?: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface SearchSuggestion {
  type: 'contact' | 'company' | 'tag' | 'recent';
  value: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search contacts...',
  recentSearches = [],
  suggestions = [],
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchIn: ['name', 'email', 'company'],
    favorites: false,
    hasCompany: false,
    tags: []
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample suggestions for demonstration
  const defaultSuggestions: SearchSuggestion[] = [
    { type: 'company', value: 'apple', label: 'Apple Inc.', count: 5, icon: <Building size={14} /> },
    { type: 'company', value: 'google', label: 'Google LLC', count: 3, icon: <Building size={14} /> },
    { type: 'tag', value: 'client', label: 'Client', count: 12, icon: <Star size={14} /> },
    { type: 'tag', value: 'partner', label: 'Partner', count: 8, icon: <Star size={14} /> },
  ];

  const combinedSuggestions = [...suggestions, ...defaultSuggestions];

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, onSearch]);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filters.favorites) count++;
    if (filters.hasCompany) count++;
    if (filters.tags && filters.tags.length > 0) count += filters.tags.length;
    if (filters.searchIn && filters.searchIn.length < 5) count++;
    setActiveFilterCount(count);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowAdvancedFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length > 0 || recentSearches.length > 0);
  };

  const handleInputFocus = () => {
    setShowSuggestions(query.length > 0 || recentSearches.length > 0);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'recent' || suggestion.type === 'contact') {
      setQuery(suggestion.value);
    } else if (suggestion.type === 'company') {
      setQuery(`company:"${suggestion.value}"`);
    } else if (suggestion.type === 'tag') {
      setQuery(`tag:"${suggestion.value}"`);
    }
    setShowSuggestions(false);
  };

  const handleRecentSearchClick = (searchTerm: string) => {
    setQuery(searchTerm);
    setShowSuggestions(false);
  };

  const toggleFilter = (filterKey: keyof SearchFilters, value?: any) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value !== undefined ? value : !prev[filterKey as keyof SearchFilters]
    }));
  };

  const toggleSearchIn = (field: 'name' | 'email' | 'company' | 'position' | 'notes') => {
    setFilters(prev => ({
      ...prev,
      searchIn: prev.searchIn?.includes(field) 
        ? prev.searchIn.filter(f => f !== field)
        : [...(prev.searchIn || []), field]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchIn: ['name', 'email', 'company'],
      favorites: false,
      hasCompany: false,
      tags: []
    });
  };

  const filteredSuggestions = combinedSuggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  const searchInOptions = [
    { key: 'name' as const, label: 'Name', icon: <User size={14} /> },
    { key: 'email' as const, label: 'Email', icon: <Mail size={14} /> },
    { key: 'company' as const, label: 'Company', icon: <Building size={14} /> },
    { key: 'position' as const, label: 'Position', icon: <Building size={14} /> },
    { key: 'notes' as const, label: 'Notes', icon: <Search size={14} /> }
  ];

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className={`transition-colors ${isLoading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm text-gray-900"
          placeholder={placeholder}
        />

        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-4">
          {/* Active Filters Badge */}
          {activeFilterCount > 0 && (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
              <Filter size={12} />
              <span>{activeFilterCount}</span>
            </div>
          )}

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`p-1 rounded-md transition-colors ${
              showAdvancedFilters || activeFilterCount > 0
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Advanced filters"
          >
            <Filter size={16} />
          </button>

          {/* Clear Button */}
          {query && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 p-4">
          <div className="space-y-4">
            {/* Search In Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search in:
              </label>
              <div className="flex flex-wrap gap-2">
                {searchInOptions.map(option => (
                  <button
                    key={option.key}
                    onClick={() => toggleSearchIn(option.key)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
                      filters.searchIn?.includes(option.key)
                        ? 'bg-blue-50 border-blue-200 text-blue-800'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {option.icon}
                    <span className="text-sm">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick filters:
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleFilter('favorites')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
                    filters.favorites
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Star size={14} />
                  <span className="text-sm">Favorites only</span>
                </button>
                
                <button
                  onClick={() => toggleFilter('hasCompany')}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border transition-all ${
                    filters.hasCompany
                      ? 'bg-purple-50 border-purple-200 text-purple-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Building size={14} />
                  <span className="text-sm">Has company</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all filters
              </button>
              <button
                onClick={() => setShowAdvancedFilters(false)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && !showAdvancedFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
          {/* Recent Searches */}
          {query === '' && recentSearches.length > 0 && (
            <div className="p-2 border-b border-gray-100">
              <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700">
                <Clock size={14} />
                <span>Recent searches</span>
              </div>
              {recentSearches.slice(0, 3).map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center space-x-2"
                >
                  <Clock size={12} className="text-gray-400" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {query && filteredSuggestions.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Search size={14} />
                <span>Suggestions</span>
              </div>
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    {suggestion.icon}
                    <span>{suggestion.label}</span>
                  </div>
                  {suggestion.count && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {suggestion.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Quick Search Tips */}
          {query === '' && recentSearches.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              <div className="space-y-2">
                <p className="font-medium">Search tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Type a name, email, or company</li>
                  <li>• Use "company:Apple" to search within Apple</li>
                  <li>• Use "tag:client" to find tagged contacts</li>
                  <li>• Click the filter icon for advanced options</li>
                </ul>
              </div>
            </div>
          )}

          {/* No Results */}
          {query && filteredSuggestions.length === 0 && (
            <div className="p-4 text-sm text-gray-500 text-center">
              <p>No suggestions found for "{query}"</p>
              <p className="text-xs mt-1">Press Enter to search anyway</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};