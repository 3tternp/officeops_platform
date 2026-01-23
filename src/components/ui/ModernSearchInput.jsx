import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../AppIcon';

const ModernSearchInput = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  suggestions = [],
  onSuggestionSelect,
  loading = false,
  size = 'md',
  className = '',
  debounceMs = 300
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      if (onSearch && value) {
        onSearch(value);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, debounceMs, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange(suggestion.label);
    setShowSuggestions(false);
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className={`flex items-center bg-white border-2 rounded-lg transition-colors duration-200 ${
          isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'
        }`}>
          <Icon
            name="Search"
            size={iconSizes[size]}
            className="ml-3 text-gray-400"
          />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(value.length > 0 && suggestions.length > 0);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`flex-1 ${sizeClasses[size]} bg-transparent outline-none text-gray-900 placeholder-gray-500`}
          />
          {loading && (
            <div className="mr-3">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            </div>
          )}
          {value && !loading && (
            <button
              onClick={() => {
                onChange('');
                setShowSuggestions(false);
              }}
              className="mr-3 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <Icon name="X" size={iconSizes[size]} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                {suggestion.icon && (
                  <Icon
                    name={suggestion.icon}
                    size={16}
                    className={`mr-3 ${suggestion.iconColor || 'text-gray-600'}`}
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{suggestion.label}</div>
                  {suggestion.description && (
                    <div className="text-sm text-gray-500">{suggestion.description}</div>
                  )}
                </div>
                {suggestion.badge && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {suggestion.badge}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ModernSearchInput;