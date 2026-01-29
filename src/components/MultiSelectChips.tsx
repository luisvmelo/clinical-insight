import { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MultiSelectChipsProps {
  label: string;
  placeholder: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  allowCustom?: boolean;
  searchable?: boolean;
}

export function MultiSelectChips({
  label,
  placeholder,
  options,
  selectedValues,
  onChange,
  allowCustom = false,
  searchable = false,
}: MultiSelectChipsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedValues.includes(option)
  );

  const handleSelect = (value: string) => {
    if (!selectedValues.includes(value)) {
      onChange([...selectedValues, value]);
    }
    setSearchTerm('');
    if (!searchable) {
      setIsOpen(false);
    }
  };

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      e.preventDefault();
      if (allowCustom || filteredOptions.includes(searchTerm.trim())) {
        handleSelect(searchTerm.trim());
      } else if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0]);
      }
    }
    if (e.key === 'Backspace' && !searchTerm && selectedValues.length > 0) {
      handleRemove(selectedValues[selectedValues.length - 1]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">{label}</label>
      <div ref={containerRef} className="relative">
        <div
          className={cn(
            "min-h-[42px] p-2 rounded-md border bg-card cursor-text flex flex-wrap gap-2 items-center transition-colors",
            isOpen ? "border-primary ring-2 ring-primary/20" : "border-input hover:border-muted-foreground/50"
          )}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          {selectedValues.map((value) => (
            <span key={value} className="chip-removable">
              {value}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(value);
                }}
                className="ml-1 p-0.5 rounded-full hover:bg-muted-foreground/20 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <div className="flex-1 flex items-center gap-1 min-w-[120px]">
            {searchable && <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder={selectedValues.length === 0 ? placeholder : ''}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground min-w-0"
            />
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )} />
        </div>

        {isOpen && (filteredOptions.length > 0 || (allowCustom && searchTerm.trim())) && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
            {allowCustom && searchTerm.trim() && !options.includes(searchTerm.trim()) && (
              <button
                type="button"
                onClick={() => handleSelect(searchTerm.trim())}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors flex items-center gap-2"
              >
                <span className="text-primary">+</span> Adicionar "{searchTerm.trim()}"
              </button>
            )}
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
