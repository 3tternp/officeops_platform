import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Icon from '../AppIcon';
import ModernPagination from './ModernPagination';

const ModernDataTable = ({
  columns,
  data,
  loading = false,
  sortable = true,
  filterable = false,
  pagination = true,
  pageSize = 10,
  className = '',
  emptyMessage = 'No data available'
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (columnKey, value) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply filters
    if (filterable) {
      filtered = data.filter(row =>
        columns.every(column => {
          const filterValue = filters[column.key];
          if (!filterValue) return true;

          const cellValue = column.accessor ? column.accessor(row) : row[column.key];
          return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = columns.find(col => col.key === sortConfig.key)?.accessor
          ? columns.find(col => col.key === sortConfig.key).accessor(a)
          : a[sortConfig.key];
        const bValue = columns.find(col => col.key === sortConfig.key)?.accessor
          ? columns.find(col => col.key === sortConfig.key).accessor(b)
          : b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, columns, sortConfig, filters, filterable]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredAndSortedData;

    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`bg-card rounded-xl shadow-enterprise-md border border-border ${className}`}>
      {filterable && (
        <div className="p-4 border-b border-border bg-muted/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map(column => (
              <div key={column.key}>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">
                  {column.label}
                </label>
                <input
                  type="text"
                  placeholder={`Filter ${column.label.toLowerCase()}...`}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/60">
            <tr>
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-[0.16em] ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-muted' : ''
                  }`}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable && column.sortable !== false && (
                      <Icon
                        name={getSortIcon(column.key)}
                        size={14}
                        className="text-gray-400"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border/70">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-muted-foreground text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-muted/60 transition-colors duration-150"
                >
                  {columns.map(column => (
                    <td key={column.key} className="px-6 py-3 whitespace-nowrap text-sm text-foreground">
                      {column.accessor ? column.accessor(row) : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border bg-muted/40 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-xs sm:text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredAndSortedData.length)} of {filteredAndSortedData.length} results
            </div>
            <ModernPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernDataTable;
