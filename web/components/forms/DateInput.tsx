'use client';

import { forwardRef, useState } from 'react';
import { Input, InputProps } from '../ui/Input';
import { validateBirthDate, validateDeathDate, calculateAge, formatHebrewDate } from '../../lib/validation/dates';

export type DateType = 'birth' | 'death' | 'will' | 'general';

interface DateInputProps extends Omit<InputProps, 'type'> {
  dateType?: DateType;
  onValidationChange?: (isValid: boolean) => void;
  onAgeChange?: (age: number | null) => void;
  onHebrewDateChange?: (hebrewDate: string) => void;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ dateType = 'general', onValidationChange, onAgeChange, onHebrewDateChange, onChange, onBlur, ...props }, ref) => {
    const [localError, setLocalError] = useState<string>();
    const [age, setAge] = useState<number | null>(null);
    const [hebrewDate, setHebrewDate] = useState<string>('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onChange?.(e);
      
      // ולידציה
      if (value) {
        let validation;
        
        switch (dateType) {
          case 'birth':
            validation = validateBirthDate(value);
            break;
          case 'death':
            validation = validateDeathDate(value);
            break;
          default:
            validation = { isValid: true };
        }
        
        if (validation.isValid) {
          setLocalError(undefined);
          onValidationChange?.(true);
          
          // חישוב גיל לתאריך לידה
          if (dateType === 'birth') {
            const calculatedAge = calculateAge(value);
            setAge(calculatedAge);
            onAgeChange?.(calculatedAge);
          }
          
          // פורמט תאריך עברי
          const formattedHebrewDate = formatHebrewDate(value);
          setHebrewDate(formattedHebrewDate);
          onHebrewDateChange?.(formattedHebrewDate);
        } else {
          setLocalError(validation.error);
          onValidationChange?.(false);
          setAge(null);
          onAgeChange?.(null);
          setHebrewDate('');
          onHebrewDateChange?.('');
        }
      } else {
        setLocalError(undefined);
        onValidationChange?.(false);
        setAge(null);
        onAgeChange?.(null);
        setHebrewDate('');
        onHebrewDateChange?.('');
      }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e);
    };
    
    const getError = () => {
      if (localError) return localError;
      if (props.error) return props.error;
      return undefined;
    };
    
    const getPlaceholder = () => {
      switch (dateType) {
        case 'birth':
          return 'תאריך לידה';
        case 'death':
          return 'תאריך פטירה';
        case 'will':
          return 'תאריך צוואה';
        default:
          return 'תאריך';
      }
    };
    
    return (
      <div className="space-y-1">
        <Input
          {...props}
          ref={ref}
          type="date"
          placeholder={getPlaceholder()}
          error={getError()}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        
        {/* הצגת מידע נוסף */}
        {age !== null && dateType === 'birth' && (
          <div className="text-xs text-gray-600">
            גיל: {age} שנים
          </div>
        )}
        
        {hebrewDate && (
          <div className="text-xs text-gray-600">
            {hebrewDate}
          </div>
        )}
      </div>
    );
  }
);

DateInput.displayName = 'DateInput';
