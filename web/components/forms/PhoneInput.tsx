'use client';

import { forwardRef, useState } from 'react';
import { Input, InputProps } from '../ui/Input';
import { validateIsraeliPhone, formatIsraeliPhone, getPhoneType } from '../../lib/validation/phone';

interface PhoneInputProps extends Omit<InputProps, 'type'> {
  onValidationChange?: (isValid: boolean) => void;
  onPhoneTypeChange?: (type: 'mobile' | 'landline' | 'invalid') => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ onValidationChange, onPhoneTypeChange, onChange, onBlur, ...props }, ref) => {
    const [localError, setLocalError] = useState<string>();
    const [phoneType, setPhoneType] = useState<'mobile' | 'landline' | 'invalid'>('invalid');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value.replace(/[\s\-\(\)]/g, ''); // רק ספרות
      
      // הגבלת אורך
      if (value.length > 10) {
        return;
      }
      
      // עדכון הערך
      e.target.value = value;
      onChange?.(e);
      
      // ולידציה
      if (value.length >= 9) {
        const isValid = validateIsraeliPhone(value);
        const type = getPhoneType(value);
        
        setPhoneType(type);
        onPhoneTypeChange?.(type);
        
        if (isValid) {
          setLocalError(undefined);
          onValidationChange?.(true);
        } else {
          setLocalError('מספר טלפון לא תקין');
          onValidationChange?.(false);
        }
      } else {
        setLocalError(undefined);
        setPhoneType('invalid');
        onPhoneTypeChange?.('invalid');
        onValidationChange?.(false);
      }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if (value.length >= 9 && validateIsraeliPhone(value)) {
        e.target.value = formatIsraeliPhone(value);
        const type = getPhoneType(value);
        setPhoneType(type);
        onPhoneTypeChange?.(type);
      }
      
      onBlur?.(e);
    };
    
    const getPlaceholder = () => {
      switch (phoneType) {
        case 'mobile':
          return '050-123-4567';
        case 'landline':
          return '02-123-4567';
        default:
          return 'מספר טלפון';
      }
    };
    
    const getError = () => {
      if (localError) return localError;
      if (props.error) return props.error;
      return undefined;
    };
    
    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        inputMode="tel"
        maxLength={13} // כולל מקפים
        placeholder={getPlaceholder()}
        error={getError()}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
