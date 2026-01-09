import React from 'react';

interface InboundItemListProps {
  status: string;
}

const InboundItemList: React.FC<InboundItemListProps> = ({ status }) => {
  const isTaskAssignment = status === 'TASK_ASSIGNMENT';

  const columns: { label: string; width: string }[] = [
    { label: '재고 번호', width: 'w-[112px]' },
    { label: '물품명', width: 'w-[130px]' },
    { label: '입고 요청 수량', width: 'w-[140px]' },
    { label: '현재 입고 수량', width: 'w-[140px]' },
    { label: '목표 입고 수량', width: 'w-[140px]' },
    { label: '처리 상태', width: 'w-[150px]' },
  ];

  return (
    <div className="w-full overflow-hidden rounded-[10px] border-[2px] border-greyColor-grey200">
      <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={`${col.width} flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black last:border-r-0`}
          >
            {col.label}
          </div>
        ))}
      </div>

      {!isTaskAssignment && (
        <div className="flex h-[40px] items-center justify-center bg-white">
          <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
        </div>
      )}
    </div>
  );
};

export default InboundItemList;
