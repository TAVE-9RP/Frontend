import React, { TextareaHTMLAttributes } from 'react';

interface LargeInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

const LargeInput: React.FC<LargeInputProps> = ({ className = '', disabled = false, ...rest }) => {
  return (
    <textarea
      disabled={disabled}
      className={`w-full max-w-[812px] resize-none self-stretch rounded-[10px] border border-greyColor-grey300 p-4 font-pretendard text-base font-normal transition-colors duration-150 placeholder:text-greyColor-grey500 focus:outline-none ${
        disabled ? 'bg-greyColor-grey100 text-greyColor-grey500' : 'bg-white text-greyColor-grey900'
      } ${className}`}
      {...rest}
    />
  );
};

export default LargeInput;
