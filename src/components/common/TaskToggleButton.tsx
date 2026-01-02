import React from 'react';

interface TaskToggleButtonProps {
  viewMode: 'ALL' | 'MY';
  onChange: (mode: 'ALL' | 'MY') => void;
}

export default function TaskToggleButton({ viewMode, onChange }: TaskToggleButtonProps) {
  const baseItemStyle =
    'flex w-[80px] h-[30px] px-[5px] py-[8px] justify-center items-center gap-[4px] font-pretendard text-[17px] font-bold cursor-pointer transition-all duration-200';
  const activeStyle =
    'rounded-[5px] bg-white shadow-[0_0_5px_0_rgba(0,0,0,0.15)] text-mainColor-blue600';
  const inactiveStyle = 'text-greyColor-grey400';

  return (
    <div className="inline-flex h-[40px] items-center justify-center gap-[4px] rounded-[7px] bg-greyColor-grey200 p-[5px]">
      <div
        className={`${baseItemStyle} ${viewMode === 'ALL' ? activeStyle : inactiveStyle}`}
        onClick={() => onChange('ALL')}
      >
        모든 업무
      </div>
      <div
        className={`${baseItemStyle} ${viewMode === 'MY' ? activeStyle : inactiveStyle}`}
        onClick={() => onChange('MY')}
      >
        나의 업무
      </div>
    </div>
  );
}
