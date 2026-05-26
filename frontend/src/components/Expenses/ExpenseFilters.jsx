import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * ExpenseFilters Component
 * Provides filtering controls for expenses
 */
function ExpenseFilters({ filters, onFiltersChange, categories }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      startDate: '',
      endDate: '',
      categoryId: '',
      paymentMethod: '',
      minAmount: '',
      maxAmount: '',
      search: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== '');

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              Active
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="md:hidden text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {/* Filters Content */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Description
          </label>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Search by description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.categoryId}
            onChange={(e) => handleInputChange('categoryId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <div className="space-y-2">
            {['cash', 'card', 'bank'].map((method) => (
              <label key={method} className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={filters.paymentMethod === method}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{method}</span>
              </label>
            ))}
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value=""
                checked={filters.paymentMethod === ''}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm text-gray-700">All</span>
            </label>
          </div>
        </div>

        {/* Amount Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Min Amount
            </label>
            <input
              type="number"
              id="minAmount"
              value={filters.minAmount}
              onChange={(e) => handleInputChange('minAmount', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Max Amount
            </label>
            <input
              type="number"
              id="maxAmount"
              value={filters.maxAmount}
              onChange={(e) => handleInputChange('maxAmount', e.target.value)}
              placeholder="999999"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Active Filters Badges */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2 mb-2">
              {filters.search && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  Search: {filters.search}
                  <button
                    onClick={() => handleInputChange('search', '')}
                    className="ml-1 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.categoryId && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  Category
                  <button
                    onClick={() => handleInputChange('categoryId', '')}
                    className="ml-1 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.paymentMethod && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded capitalize">
                  {filters.paymentMethod}
                  <button
                    onClick={() => handleInputChange('paymentMethod', '')}
                    className="ml-1 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(filters.minAmount || filters.maxAmount) && (
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  Amount Range
                  <button
                    onClick={() => {
                      handleInputChange('minAmount', '');
                      handleInputChange('maxAmount', '');
                    }}
                    className="ml-1 text-gray-600 hover:text-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <button
              onClick={handleClearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ExpenseFilters.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    categoryId: PropTypes.string,
    paymentMethod: PropTypes.string,
    minAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    search: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })
  ),
};

ExpenseFilters.defaultProps = {
  categories: [],
};

export default ExpenseFilters;
