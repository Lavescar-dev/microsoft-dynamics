import * as React from 'react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useLocale } from '../../contexts/LocaleContext';

interface EditableFieldControlProps {
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  options?: string[];
  placeholder?: string;
}

export function EditableFieldControl({
  value,
  onChange,
  type = 'text',
  options,
  placeholder,
}: EditableFieldControlProps) {
  const { tr } = useLocale();
  if (type === 'select' && options) {
    return (
      <Select value={String(value)} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {tr(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (type === 'textarea') {
    return <Textarea value={String(value)} onChange={(event) => onChange(event.target.value)} placeholder={placeholder ? tr(placeholder) : undefined} />;
  }

  return (
    <Input
      type={type}
      value={String(value)}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder ? tr(placeholder) : undefined}
    />
  );
}
