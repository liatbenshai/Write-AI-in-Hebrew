'use client';

import { forwardRef, useState } from 'react';
import { Input, InputProps } from '../ui/Input';
import { validateEmail, suggestEmailCorrections } from '../../lib/validation/email';

interface EmailInputProps extends Omit<InputProps, 'type'> {
  onValidationChange?: (isValid: boolean) => void;
  onSuggestionsChange?: (suggestions: string[]) => void;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ onValidationChange, onSuggestionsChange, onChange, onBlur, ...props }, ref) => {
    const [localError, setLocalError] = useState<string>();
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onChange?.(e);
      
      // ולידציה
      if (value.length > 0) {
        const isValid = validateEmail(value);
        
        if (isValid) {
          setLocalError(undefined);
          setSuggestions([]);
          setShowSuggestions(false);
          onValidationChange?.(true);
        } else {
          const emailSuggestions = suggestEmailCorrections(value);
          setSuggestions(emailSuggestions);
          setShowSuggestions(emailSuggestions.length > 0);
          onSuggestionsChange?.(emailSuggestions);
          
          if (value.includes('@')) {
            setLocalError('כתובת אימייל לא תקינה');
          } else {
            setLocalError('חסר @ בכתובת האימייל');
          }
          onValidationChange?.(false);
        }
      } else {
        setLocalError(undefined);
        setSuggestions([]);
        setShowSuggestions(false);
        onValidationChange?.(false);
      }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setShowSuggestions(false);
      onBlur?.(e);
    };
    
    const handleSuggestionClick = (suggestion: string) => {
      const syntheticEvent = {
        target: { value: suggestion }
      } as React.ChangeEvent<HTMLInputElement>;
      
      handleChange(syntheticEvent);
      setShowSuggestions(false);
    };
    
    const getError = () => {
      if (localError) return localError;
      if (props.error) return props.error;
      return undefined;
    };
    
    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="email"
          inputMode="email"
          placeholder="example@domain.com"
          error={getError()}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={() => setShowSuggestions(suggestions.length > 0)}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
            <div className="p-2 text-xs text-gray-600 border-b">
              הצעות לתיקון:
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-right px-3 py-2 hover:bg-gray-50 text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

EmailInput.displayName = 'EmailInput';
