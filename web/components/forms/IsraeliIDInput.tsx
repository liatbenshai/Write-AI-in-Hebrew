'use client';

import { forwardRef, useState } from 'react';
import { Input, InputProps } from '../ui/Input';
import { validateIsraeliID, formatIsraeliID } from '../../lib/validation/israeli-id';

interface IsraeliIDInputProps extends Omit<InputProps, 'type'> {
  onValidationChange?: (isValid: boolean) => void;
}

export const IsraeliIDInput = forwardRef<HTMLInputElement, IsraeliIDInputProps>(
  ({ onValidationChange, onChange, onBlur, ...props }, ref) => {
    const [localError, setLocalError] = useState<string>();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, ''); // רק ספרות
      
      if (value.length > 9) {
        return; // לא מאפשר יותר מ-9 ספרות
      }
      
      // עדכון הערך
      e.target.value = value;
      onChange?.(e);
      
      // ולידציה
      if (value.length === 9) {
        const isValid = validateIsraeliID(value);
        setLocalError(isValid ? undefined : 'תעודת זהות לא תקינה');
        onValidationChange?.(isValid);
      } else {
        setLocalError(undefined);
        onValidationChange?.(false);
      }
    };
    
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      
      if (value.length === 9 && validateIsraeliID(value)) {
        e.target.value = formatIsraeliID(value);
      }
      
      onBlur?.(e);
    };
    
    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="numeric"
        maxLength={9}
        placeholder="9 ספרות"
        error={localError || props.error}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    );
  }
);

IsraeliIDInput.displayName = 'IsraeliIDInput';

