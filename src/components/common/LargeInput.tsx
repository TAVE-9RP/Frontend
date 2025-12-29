import React, { TextareaHTMLAttributes } from 'react';

interface LargeInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder?: string;
}

const LargeInput: React.FC<LargeInputProps> = ({ ...rest }) => {
  return (
    <textarea
      className="h-[170px] w-full max-w-[812px] resize-none self-stretch rounded-[10px] border border-greyColor-grey300 bg-white p-4 font-pretendard text-base font-normal text-greyColor-grey900 placeholder:text-greyColor-grey500 focus:outline-none"
      {...rest}
    />
  );
};

export default LargeInput;
