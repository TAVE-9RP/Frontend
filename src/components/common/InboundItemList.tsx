import React from 'react';

export interface InboundItem {
  id: string;
  stockNumber: string;
  itemName: string;
  reqQty: string | number;
  currQty: string | number;
  targetQty: string | number;
  status: string;
}

interface InboundItemListProps {
  status: string;
  items?: InboundItem[];
}

const InboundItemList: React.FC<InboundItemListProps> = ({ status, items = [] }) => {
  const isTaskAssignment = status === 'TASK_ASSIGNMENT';
  const hasItems = items && items.length > 0;

  const columns: { label: string; width: string }[] = [
    { label: '재고 번호', width: 'w-[150px]' },
    { label: '물품명', width: 'w-[180px]' },
    { label: '현재 입고 수량', width: 'w-[180px]' },
    { label: '목표 입고 수량', width: 'w-[180px]' },
    { label: '처리 상태', width: 'w-[180px]' },
  ];

  return (
    <div className="w-full overflow-hidden rounded-t-[10px] border-[2px] border-greyColor-grey200">
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

      {!isTaskAssignment && !hasItems && (
        <div className="flex h-[40px] items-center justify-center bg-white">
          <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
        </div>
      )}

      {!isTaskAssignment &&
        hasItems &&
        items.map((item) => (
          <div
            key={item.id}
            className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-white transition-colors last:border-b-0"
          >
            <div className="flex h-full w-[150px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] text-black">
              {item.stockNumber}
            </div>
            <div className="flex h-full w-[180px] items-center justify-center border-r-[2px] border-greyColor-grey200 px-2">
              <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-pretendard text-[14px] text-black">
                {item.itemName}
              </span>
            </div>
            <div
              className={`flex h-full w-[180px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] ${item.currQty === '-' ? 'text-greyColor-grey300' : 'text-black'}`}
            >
              {item.currQty}
            </div>
            <div className="flex h-full w-[180px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] text-black">
              {item.targetQty}
            </div>
            <div className="flex h-full w-[180px] items-center justify-center font-pretendard text-[14px]">
              <div
                className={`flex h-[24px] items-center justify-center gap-[15px] rounded-[50px] px-[8px] py-[8px] transition-colors ${
                  item.status === '완료'
                    ? 'bg-mainColor-blue050 text-mainColor-blue600'
                    : 'bg-greyColor-grey200 text-greyColor-grey600'
                }`}
              >
                <span className="font-pretendard text-[13px] font-bold leading-none">
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default InboundItemList;
