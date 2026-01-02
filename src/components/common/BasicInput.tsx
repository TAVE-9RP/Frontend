import React, { InputHTMLAttributes } from 'react';

interface BasicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

const BasicInput: React.FC<BasicInputProps> = ({
  placeholder = '내용을 입력해주세요.',
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <div
      className={`flex items-center rounded-[10px] border border-greyColor-grey400 transition-colors duration-150 ${
        disabled ? 'bg-greyColor-grey100' : 'bg-white'
      }`}
      style={{
        width: '390px',
        height: '50px',
        padding: '15px 16px',
      }}
    >
      <input
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={`h-full w-full border-none bg-transparent font-pretendard text-base font-normal outline-none placeholder:text-greyColor-grey400 ${
          disabled
            ? 'text-greyColor-grey500'
            : className.includes('text-')
              ? className
              : `text-greyColor-grey900 ${className}`
        }`}
        {...rest}
      />
    </div>
  );
};

export default BasicInput;
