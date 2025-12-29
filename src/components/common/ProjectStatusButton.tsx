import React from 'react';

interface ProjectStatusButtonProps {
  label: string;
  count: number;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

export default function ProjectStatusButton({
  label,
  count,
  isActive,
  onClick,
  className = '',
}: ProjectStatusButtonProps) {
  const baseClasses = `
  flex px-[12px] py-[8px] justify-center items-center gap-[5px] rounded-[50px] cursor-pointer text-center transition-colors duration-200 whitespace-nowrap ${className}
  `;

  const activeClasses = `border border-mainColor-blue600 bg-mainColor-blue050 text-mainColor-blue600
  `;

  const inactiveClasses = `border border-greyColor-grey400 bg-white text-greyColor-grey400 hover:border-mainColor-blue300 hover:text-mainColor-blue300
  `;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="text-[15px] font-bold leading-normal">{label}</span>
      <span className="text-[15px] font-bold leading-normal">{count}</span>
    </button>
  );
}
