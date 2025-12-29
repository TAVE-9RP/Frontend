import React, { InputHTMLAttributes } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  iconSrc?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '검색어를 입력하세요.',
  iconSrc = '/src/assets/search.png',
  ...rest
}) => {
  return (
    <div className="border-greyColor-500 flex h-[45px] w-[500px] items-center justify-between rounded-[10px] border bg-white px-[20px] py-[10px]">
      <input
        type="text"
        placeholder={placeholder}
        className="h-full flex-1 border-none bg-transparent pr-[10px] font-pretendard text-[15px] font-normal outline-none"
        {...rest}
      />

      {iconSrc && (
        <img src={iconSrc} alt="Search Icon" width={20} height={20} className="cursor-pointer" />
      )}
    </div>
  );
};

export default SearchBar;
