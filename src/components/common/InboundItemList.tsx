import React from 'react';

const ITEM_MOCK_DATA = [
  {
    id: 1,
    stockNumber: '재고 번호',
    itemName: '조기',
    reqQty: '-',
    currQty: '-',
    targetQty: 0,
    status: '미진행',
  },
  {
    id: 2,
    stockNumber: '재고 번호',
    itemName: '조기',
    reqQty: '-',
    currQty: '-',
    targetQty: 0,
    status: '미진행',
  },
  {
    id: 3,
    stockNumber: '재고 번호',
    itemName: '조기',
    reqQty: '-',
    currQty: '-',
    targetQty: 0,
    status: '미진행',
  },
  {
    id: 4,
    stockNumber: '재고 번호',
    itemName: '조기',
    reqQty: '-',
    currQty: '-',
    targetQty: 0,
    status: '미진행',
  },
  {
    id: 5,
    stockNumber: '재고 번호',
    itemName: '조기',
    reqQty: '-',
    currQty: '-',
    targetQty: 0,
    status: '미진행',
  },
];

interface InboundItemListProps {
  status: string;
}

const InboundItemList: React.FC<InboundItemListProps> = ({ status }) => {
  const isTaskAssignment = status === 'TASK_ASSIGNMENT';
  const displayItems = isTaskAssignment ? [] : ITEM_MOCK_DATA;

  type ItemKey = keyof (typeof ITEM_MOCK_DATA)[0];

  const isAllHyphen = (key: keyof (typeof ITEM_MOCK_DATA)[0]) => {
    if (displayItems.length === 0) return false;
    return displayItems.every((item) => item[key] === '-');
  };

  const columns: { label: string; width: string; key: ItemKey }[] = [
    { label: '재고 번호', width: 'w-[112px]', key: 'stockNumber' },
    { label: '물품명', width: 'w-[130px]', key: 'itemName' },
    { label: '입고 요청 수량', width: 'w-[140px]', key: 'reqQty' },
    { label: '현재 입고 수량', width: 'w-[140px]', key: 'currQty' },
    { label: '목표 입고 수량', width: 'w-[140px]', key: 'targetQty' },
    { label: '처리 상태', width: 'w-[150px]', key: 'status' },
  ];

  return (
    <div className="w-full overflow-hidden rounded-[10px] border-[2px] border-greyColor-grey200">
      <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
        {columns.map((col, idx) => {
          const grayHeader = isAllHyphen(col.key as keyof (typeof ITEM_MOCK_DATA)[0]);

          return (
            <div
              key={idx}
              className={`${col.width} flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold last:border-r-0 ${
                grayHeader ? 'text-greyColor-grey300' : 'text-black'
              }`}
            >
              {col.label}
            </div>
          );
        })}
      </div>

      {!isTaskAssignment && displayItems.length === 0 && (
        <div className="flex h-[40px] items-center justify-center bg-white">
          <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
        </div>
      )}
      {!isTaskAssignment &&
        displayItems.length > 0 &&
        displayItems.map((item) => (
          <div
            key={item.id}
            className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-white transition-colors last:border-b-0"
          >
            <div className="flex h-full w-[112px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] text-black">
              {item.stockNumber}
            </div>
            <div className="flex h-full w-[130px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] text-black">
              {item.itemName}
            </div>
            <div
              className={`flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] ${item.reqQty === '-' ? 'text-greyColor-grey300' : 'text-black'}`}
            >
              {item.reqQty}
            </div>
            <div
              className={`flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] ${item.currQty === '-' ? 'text-greyColor-grey300' : 'text-black'}`}
            >
              {item.currQty}
            </div>
            <div className="flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] text-black">
              {item.targetQty}
            </div>
            <div className="flex h-full w-[150px] items-center justify-center font-pretendard text-[14px]">
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
