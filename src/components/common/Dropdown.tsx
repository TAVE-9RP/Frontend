import React, { useState, useRef, useEffect } from 'react';
import ChevronDownIcon from '../../assets/chevron-down.png';

interface DropdownProps<T extends string> {
  options: T[];
  selectedValue: T;
  onSelect: (value: T) => void;
  className?: string;
  statusType?: 'default' | 'approval';
}

export default function Dropdown<T extends string>({
  options,
  selectedValue,
  onSelect,
  className = 'w-full',
  statusType = 'default',
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: T) => {
    onSelect(value);
    setIsOpen(false);
  };

  const getStatusClasses = (value: T) => {
    if (statusType === 'approval') {
      if (value === '요청 대기') return 'text-greyColor-grey800 border-greyColor-grey800 bg-white';
      if (value === '승인') return 'text-mainColor-blue600 border-mainColor-blue600 bg-white';
      if (value === '거절') return 'text-errorColor-red010 border-errorColor-red010 bg-white';
    }
    return 'border-greyColor-grey300 hover:border-mainColor-blue600 text-greyColor-grey800 bg-white';
  };

  const getIconColorVar = (value: T) => {
    if (statusType === 'approval') {
      if (value === '요청 대기') return 'greyColor-grey800';
      if (value === '승인') return 'mainColor-blue600';
      if (value === '거절') return 'errorColor-red010';
    }
    return 'greyColor-grey800';
  };

  const buttonClasses =
    'flex items-center justify-between px-3 py-2 text-sm font-medium border rounded-md cursor-pointer transition h-8';

  const listContainerClasses =
    'absolute z-10 mt-1 w-full bg-white border border-greyColor-grey300 rounded-md shadow-lg overflow-hidden';

  const itemClasses =
    'px-3 py-2 text-sm text-greyColor-grey800 cursor-pointer hover:bg-mainColor-blue050 transition';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        className={`${buttonClasses} ${getStatusClasses(selectedValue)}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{selectedValue}</span>

        <img
          src={ChevronDownIcon}
          alt="Dropdown icon"
          className="ml-2 h-4 w-4 transition-transform duration-200"
          style={{
            filter: `brightness(0) saturate(100%) var(--${getIconColorVar(selectedValue)})`,
          }}
        />
      </div>

      {isOpen && (
        <div className={listContainerClasses}>
          {options.map((option) => (
            <div key={option} onClick={() => handleSelect(option)} className={itemClasses}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
