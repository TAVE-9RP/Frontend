import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="flex flex-col items-center justify-center gap-[46px] pt-[90px]">
      <div className="flex items-center justify-center">
        <Link to="/" aria-label="홈으로 이동">
          <img
            src="/images/logo.png"
            alt="NexERP 로고"
            className="h-[54px] w-[191px] cursor-pointer object-contain"
          />
        </Link>
      </div>

      <h1 className="mt-0 whitespace-nowrap text-center font-pretendard text-[32px] font-bold leading-normal text-black">
        {title}
      </h1>
    </header>
  );
}
