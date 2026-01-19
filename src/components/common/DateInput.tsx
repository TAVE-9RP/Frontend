import React from 'react';

interface DateInputProps {
  placeholder: string;
  unit: string;
  width: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({
  placeholder,
  unit,
  width,
  name,
  value,
  onChange,
  disabled = false,
}) => {
  const defaultPlaceholder = `(예)${placeholder}`;
  const isFilled = value.length > 0;

  const colorClasses = disabled
    ? 'bg-greyColor-grey100 border-greyColor-grey400 text-greyColor-grey400 cursor-not-allowed'
    : isFilled
      ? 'bg-mainColor-blue050 border-mainColor-blue600 text-greyColor-grey900'
      : 'bg-white border-greyColor-grey400 text-greyColor-grey500';

  return (
    <div className="flex items-center gap-[6px] font-pretendard">
      <input
        type="text"
        name={name}
        placeholder={isFilled ? '' : defaultPlaceholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-[50px] rounded-[10px] border text-center text-[19px] font-light transition-colors duration-150 focus:outline-none ${colorClasses}`}
        style={{ width }}
      />
      <span className="text-[17px] font-medium text-greyColor-grey600">{unit}</span>
    </div>
  );
};

export default DateInput;
