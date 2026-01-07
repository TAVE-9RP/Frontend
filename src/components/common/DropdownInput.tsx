import React, { useState, useRef, useEffect } from 'react';

import ChevronDownIcon from '../../assets/chevron-down.png';
import CheckCircleChecked from '../../assets/checkmark-circle-checked.png';
import CheckCircleUnchecked from '../../assets/checkmark-circle-unchecked.png';

export interface DropdownOption {
  id: number;
  label: string;
  subLabel: string;
  team: string;
}

interface DropdownInputProps {
  onChange?: (selected: DropdownOption[]) => void;
  initialSelected?: DropdownOption[];
  disabled?: boolean;
  onOpen?: () => void;
  options?: DropdownOption[];
}

const defaultOptions: DropdownOption[] = [
  { id: 1, label: '홍길동', subLabel: '물류 1팀', team: '물류' },
  { id: 2, label: '김철수', subLabel: '물류 2팀', team: '물류' },
  { id: 3, label: '이영희', subLabel: '입고 2팀', team: '입고' },
  { id: 4, label: '박찬호', subLabel: '출고 3팀', team: '출고' },
  { id: 5, label: '목련호', subLabel: '입고 6팀', team: '입고' },
  { id: 6, label: '손흥민', subLabel: '입고 1팀', team: '입고' },
];

const DropdownInput: React.FC<DropdownInputProps> = ({
  onChange,
  initialSelected = [],
  disabled = false,
  onOpen,
  options = defaultOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<DropdownOption[]>(initialSelected);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedItems(initialSelected);
  }, [initialSelected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputClick = () => {
    if (disabled) {
      // disabled 상태에서도 onOpen 콜백 호출 (업무 할당 변경을 위해)
      if (onOpen) {
        onOpen();
      }
      return;
    }
    const wasClosed = !isOpen;
    setIsOpen((prev) => !prev);
    setIsFocused(true);
    // 드롭다운이 열릴 때 onOpen 콜백 호출
    if (wasClosed && onOpen) {
      onOpen();
    }
  };

  const handleOptionSelect = (option: DropdownOption) => {
    let newItems;
    if (selectedItems.some((item) => item.id === option.id)) {
      newItems = selectedItems.filter((i) => i.id !== option.id);
    } else {
      newItems = [...selectedItems, option];
    }

    setSelectedItems(newItems);
    if (onChange) onChange(newItems);
  };

  const handleChipRemove = (id: number) => (event: React.MouseEvent) => {
    event.stopPropagation();
    const newItems = selectedItems.filter((item) => item.id !== id);

    setSelectedItems(newItems);
    if (onChange) onChange(newItems);
  };

  const focusedBorderStyle = isFocused
    ? 'border-mainColor-blue700 shadow-mainColor-blue700/50'
    : 'border-greyColor-grey400';

  const disabledClasses = disabled
    ? 'bg-greyColor-grey100 cursor-not-allowed'
    : 'bg-white cursor-pointer';

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex h-[50px] w-[390px] items-center rounded-[10px] border transition-all duration-150 ${disabledClasses} ${focusedBorderStyle}`}
        onClick={handleInputClick}
      >
        <div className="flex w-[350px] flex-wrap items-center overflow-hidden px-4 py-[4px]">
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <Chip key={item.id} label={item.label} onRemove={handleChipRemove(item.id)} />
            ))
          ) : (
            <div
              className={`text-[17px] ${disabled ? 'text-greyColor-grey400' : 'text-greyColor-grey600'}`}
            ></div>
          )}
        </div>
        <div className="flex w-[40px] items-center justify-end pr-[10px]">
          <img
            src={ChevronDownIcon}
            alt="Dropdown icon"
            className={`h-[13px] w-[13px] ${disabled ? 'opacity-30' : 'opacity-100'}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 max-h-[300px] w-[390px] overflow-y-auto rounded-lg border border-greyColor-grey400 bg-white">
          {options.map((option) => {
            const isSelected = selectedItems.some((item) => item.id === option.id);
            return (
              <div
                key={option.id}
                className={`flex cursor-pointer items-center justify-between py-3 pl-6 pr-6 transition-colors duration-100 ${
                  isSelected ? 'bg-mainColor-blue050' : 'hover:bg-greyColor-grey100'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="flex items-center gap-16">
                  <span className="w-[90px] text-[17px] text-greyColor-grey600">
                    {option.subLabel}
                  </span>
                  <span className="text-[17px] font-medium text-black">{option.label}</span>
                </div>

                <img
                  src={isSelected ? CheckCircleChecked : CheckCircleUnchecked}
                  className="h-5 w-5"
                  alt="check icon"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownInput;

interface ChipProps {
  label: string;
  onRemove: (event: React.MouseEvent) => void;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => {
  return (
    <div
      className="m-1 flex h-[24px] items-center whitespace-nowrap rounded-full bg-mainColor-blue050 px-2 py-1 text-sm text-mainColor-blue700"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="font-bold">{label}</span>
    </div>
  );
};
