import React, { useState, useRef, useEffect } from 'react';

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
}

const options: DropdownOption[] = [
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItems, setSelectedItems] = useState<DropdownOption[]>(initialSelected);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onChange) onChange(selectedItems);
  }, [selectedItems, onChange]);

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
    if (disabled) return;
    setIsOpen((prev) => !prev);
    setIsFocused(true);
  };

  const handleOptionSelect = (option: DropdownOption) => {
    setSelectedItems((prev) =>
      prev.some((item) => item.id === option.id)
        ? prev.filter((i) => i.id !== option.id)
        : [...prev, option],
    );
  };

  const handleChipRemove = (id: number) => (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const baseInputStyle: React.CSSProperties = {
    width: '390px',
    height: '50px',
    borderRadius: '10px',
    // 삼항 연산자를 사용하여 disabled 상태에 따라 배경색을 결정합니다.
    background: disabled ? 'var(--greyColor-grey100, #F3F4F6)' : '#FFF',
    // disabled일 때 클릭할 수 없다는 시각적 피드백을 위해 cursor 속성도 추가하는 것이 좋습니다.
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  const focusedBorderStyle = isFocused
    ? 'border-mainColor-blue700 shadow-mainColor-blue700/50'
    : 'border-greyColor-grey400';

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex items-center border transition-all duration-150 ${focusedBorderStyle}`}
        style={baseInputStyle}
        onClick={handleInputClick}
      >
        <div
          className="flex flex-wrap items-center overflow-hidden"
          style={{ padding: '4px 16px', width: '350px' }}
        >
          {selectedItems.length > 0 ? (
            selectedItems.map((item) => (
              <Chip key={item.id} label={item.label} onRemove={handleChipRemove(item.id)} />
            ))
          ) : (
            <div
              className={`text-[17px] ${disabled ? 'text-greyColor-grey400' : 'text-greyColor-grey600'}`}
            >
              {disabled ? '' : ''}
            </div>
          )}
        </div>
        <div
          className="flex items-center justify-end"
          style={{ width: '40px', paddingRight: '10px' }}
        >
          <img
            src="src/assets/chevron-down.png"
            alt="Dropdown icon"
            style={{ width: '13px', height: '13px', opacity: disabled ? 0.3 : 1 }}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-full rounded-lg border border-greyColor-grey400 bg-white"
          style={{ width: '390px', maxHeight: '300px', overflowY: 'auto' }}
        >
          {options.map((option) => {
            const isSelected = selectedItems.some((item) => item.id === option.id);
            return (
              <div
                key={option.id}
                className={`flex cursor-pointer items-center justify-between pr-6 transition-colors duration-100 ${isSelected ? 'bg-mainColor-blue050' : 'hover:bg-greyColor-grey100'}`}
                style={{ paddingLeft: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="flex items-center gap-16">
                  <span className="w-[90px] text-[17px] text-greyColor-grey600">
                    {option.subLabel}
                  </span>
                  <span className="text-[17px] font-medium text-black">{option.label}</span>
                </div>

                <img
                  src={
                    isSelected
                      ? 'src/assets/checkmark-circle-checked.png'
                      : 'src/assets/checkmark-circle-unchecked.png'
                  }
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
      className="m-1 flex items-center rounded-full bg-mainColor-blue050 px-2 py-1 text-sm text-mainColor-blue700"
      style={{
        whiteSpace: 'nowrap',
        height: '24px',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="font-bold">{label}</span>
    </div>
  );
};
