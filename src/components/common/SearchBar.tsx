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
    <div className="flex h-[40px] w-[450px] items-center justify-between rounded-[10px] border border-greyColor-grey400 bg-white px-[20px] py-[10px]">
      <input
        type="text"
        placeholder={placeholder}
        className="h-full flex-1 border-none bg-transparent pr-[10px] font-pretendard text-[17px] font-normal placeholder-greyColor-grey400 outline-none"
        {...rest}
      />

      {iconSrc && (
        <img src={iconSrc} alt="Search Icon" width={20} height={20} className="cursor-pointer" />
      )}
    </div>
  );
};

export default SearchBar;
