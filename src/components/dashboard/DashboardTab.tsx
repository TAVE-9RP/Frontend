import React from 'react';

interface DashboardTabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const DashboardTab = ({ label, isActive, onClick }: DashboardTabProps) => {
  const activeClass = 'bg-mainColor-blue600 text-white border-transparent';
  const inactiveClass = 'bg-white text-greyColor-grey400 border-greyColor-grey400';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-[10px] rounded-[5px] border px-[10px] py-[5px] font-pretendard text-[12px] font-bold transition-all duration-200 ${isActive ? activeClass : inactiveClass} `}
    >
      {label}
    </button>
  );
};

export default DashboardTab;
