import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isError?: boolean;
  name: string;
  guideText?: string;
}

export const InputField = ({
  label,
  name,
  placeholder = '',
  type = 'text',
  value,
  onChange,
  isError = false,
  guideText,
}: InputFieldProps) => {
  const defaultBorderClass = 'border-gray-400';

  const dynamicBorderClass = isError
    ? 'border-red-500 focus:border-red-500'
    : 'focus:border-blue-500';

  const placeholderClass = 'placeholder-gray-400';

  const paddingClass = 'px-[23px] py-[23px]';

  return (
    <div className="flex w-full flex-col">
      <label className="mb-2 text-[19px] font-bold text-black">{label}</label>

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`h-[50px] w-[535px] items-center ${paddingClass} rounded-[10px] border border-[1px] bg-white text-[19px] font-normal text-black outline-none transition duration-150 ${defaultBorderClass} ${dynamicBorderClass} ${placeholderClass} `}
      />

      {guideText && (
        <p className={`mt-1 text-sm ${isError ? 'text-red-500' : 'text-gray-500'}`}>{guideText}</p>
      )}
    </div>
  );
};

export default InputField;
