import React from 'react';
import { ContactAnalytics } from '../types/Contact';
import { 
  Users, Star, Building, Tag, TrendingUp, 
  Clock, BarChart3, PieChart 
} from 'lucide-react';

interface DashboardStatsProps {
  analytics: ContactAnalytics;
  selectedCount: number;
  filteredCount: number;
  className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  analytics,
  selectedCount,
  filteredCount,
  className = ''
}) => {
  const stats = [
    {
      label: 'Total Contacts',
      value: analytics.totalContacts,
      icon: Users,
      color: 'blue',
      trend: analytics.recentlyAdded > 0 ? `+${analytics.recentlyAdded} this week` : undefined
    },
    {
      label: 'Favorites',
      value: analytics.favoriteContacts,
      icon: Star,
      color: 'yellow',
      percentage: Math.round((analytics.favoriteContacts / analytics.totalContacts) * 100)
    },
    {
      label: 'Companies',
      value: analytics.companiesCount,
      icon: Building,
      color: 'purple',
      percentage: Math.round(((analytics.totalContacts - analytics.contactsWithoutCompany) / analytics.totalContacts) * 100)
    },
    {
      label: 'Tags Used',
      value: analytics.tagsCount,
      icon: Tag,
      color: 'green',
      trend: `${analytics.averageTagsPerContact.toFixed(1)} avg per contact`
    },
    {
      label: 'Recent Activity',
      value: analytics.recentlyUpdated,
      icon: Clock,
      color: 'indigo',
      trend: 'Updated this week'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        text: 'text-blue-900',
        accent: 'text-blue-500'
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        text: 'text-yellow-900',
        accent: 'text-yellow-500'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        text: 'text-purple-900',
        accent: 'text-purple-500'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        text: 'text-green-900',
        accent: 'text-green-500'
      },
      indigo: {
        bg: 'bg-indigo-50',
        icon: 'text-indigo-600',
        text: 'text-indigo-900',
        accent: 'text-indigo-500'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          const IconComponent = stat.icon;
          
          return (
            <div
              key={index}
              className={`${colors.bg} rounded-xl p-4 border border-opacity-20 hover:shadow-md transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 ${colors.bg} rounded-lg group-hover:scale-110 transition-transform`}>
                  <IconComponent size={20} className={colors.icon} />
                </div>
                {stat.percentage && (
                  <div className={`text-xs ${colors.accent} font-medium`}>
                    {stat.percentage}%
                  </div>
                )}
              </div>
              
              <div className={`text-2xl font-bold ${colors.text} mb-1`}>
                {stat.value.toLocaleString()}
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {stat.label}
              </div>
              
              {stat.trend && (
                <div className={`text-xs ${colors.accent} font-medium flex items-center space-x-1`}>
                  {stat.trend.startsWith('+') && <TrendingUp size={12} />}
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Companies */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Building size={18} className="text-purple-600" />
              <span>Top Companies</span>
            </h3>
            <BarChart3 size={16} className="text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analytics.topCompanies.slice(0, 5).map((company, index) => {
              const percentage = (company.count / analytics.totalContacts) * 100;
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {company.name}
                      </p>
                      <div className="mt-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {company.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {analytics.topCompanies.length === 0 && (
            <p className="text-gray-500 text-sm italic">No companies found</p>
          )}
        </div>

        {/* Top Tags */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Tag size={18} className="text-green-600" />
              <span>Popular Tags</span>
            </h3>
            <PieChart size={16} className="text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {analytics.topTags.slice(0, 10).map((tag, index) => {
              const intensity = Math.min(tag.count / Math.max(...analytics.topTags.map(t => t.count)), 1);
              const opacity = Math.max(0.3, intensity);
              
              return (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: `rgba(34, 197, 94, ${opacity})`,
                    color: intensity > 0.5 ? 'white' : 'rgb(21, 128, 61)'
                  }}
                >
                  <span>{tag.name}</span>
                  <span className="ml-2 text-xs opacity-75">
                    {tag.count}
                  </span>
                </div>
              );
            })}
          </div>
          
          {analytics.topTags.length === 0 && (
            <p className="text-gray-500 text-sm italic">No tags found</p>
          )}
        </div>
      </div>

      {/* Filter Summary */}
      {(selectedCount > 0 || filteredCount !== analytics.totalContacts) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {selectedCount > 0 && (
                <div className="flex items-center space-x-2 text-blue-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {selectedCount} selected
                  </span>
                </div>
              )}
              
              {filteredCount !== analytics.totalContacts && (
                <div className="flex items-center space-x-2 text-indigo-700">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm font-medium">
                    {filteredCount} of {analytics.totalContacts} shown
                  </span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-blue-600">
              {filteredCount !== analytics.totalContacts && (
                <span>{Math.round((filteredCount / analytics.totalContacts) * 100)}% of total</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Data Quality Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Complete Profiles</p>
              <p className="text-lg font-semibold text-gray-900">
                {analytics.totalContacts - analytics.contactsWithoutCompany - analytics.contactsWithoutPhone}
              </p>
            </div>
            <div className="text-green-500">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Contacts with company and phone
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Missing Company</p>
              <p className="text-lg font-semibold text-gray-900">
                {analytics.contactsWithoutCompany}
              </p>
            </div>
            <div className="text-orange-500">
              <Building size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((analytics.contactsWithoutCompany / analytics.totalContacts) * 100)}% of total
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Missing Phone</p>
              <p className="text-lg font-semibold text-gray-900">
                {analytics.contactsWithoutPhone}
              </p>
            </div>
            <div className="text-red-500">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {Math.round((analytics.contactsWithoutPhone / analytics.totalContacts) * 100)}% of total
          </div>
        </div>
      </div>
    </div>
  );
};