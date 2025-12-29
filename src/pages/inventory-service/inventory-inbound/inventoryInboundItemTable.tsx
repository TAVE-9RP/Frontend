import React from 'react';

export interface InboundItem {
  id: string;
  name: string;
  price: number | string;
  inboundQty: number | string;
  currentQty: number | string;
  targetQty: number | string;
  status: string;
}

interface InboundItemTableProps {
  items: InboundItem[];
  isLoading?: boolean;
}

export default function InboundItemTable({ items, isLoading }: InboundItemTableProps) {
  const isColumnEmpty = (key: keyof InboundItem) => {
    if (items.length === 0) return true;
    return items.every(
      (item) =>
        item[key] === '-' || item[key] === '' || item[key] === null || item[key] === undefined,
    );
  };

  const getHeaderTextColor = (key: keyof InboundItem | 'selection') => {
    if (key === 'selection') return 'text-greyColor-grey300';

    return isColumnEmpty(key) ? 'text-greyColor-grey300' : 'text-greyColor-grey900';
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-[811px] items-center justify-center border border-greyColor-grey200 text-greyColor-grey500">
        물품 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex w-[811px] flex-col self-stretch border-l border-t border-greyColor-grey200 bg-white">
      <div className="flex h-[40px] w-full bg-greyColor-grey100 text-center text-[14px] font-bold">
        <div
          className={`flex w-[60px] items-center justify-center border-b border-r border-greyColor-grey200 ${getHeaderTextColor('selection')}`}
        >
          선택
        </div>
        <div
          className={`flex flex-1 items-center justify-center border-b border-r border-greyColor-grey200 ${getHeaderTextColor('id')}`}
        >
          재고 번호
        </div>
        <div
          className={`flex flex-1 items-center justify-center border-b border-r border-greyColor-grey200 ${getHeaderTextColor('name')}`}
        >
          물품명
        </div>
        <div
          className={`flex flex-1 items-center justify-center border-b border-r border-greyColor-grey200 ${getHeaderTextColor('price')}`}
        >
          물품 가격
        </div>
        <div
          className={`flex w-[80px] items-center justify-center border-b border-r border-greyColor-grey200 ${getHeaderTextColor('inboundQty')}`}
        >
          입고 수량
        </div>
        <div
          className={`flex w-[100px] items-center justify-center border-b border-r border-greyColor-grey200 ${getHeaderTextColor('currentQty')}`}
        >
          현재 입고 수량
        </div>
        <div
          className={`flex w-[100px] items-center justify-center border-b border-r border-greyColor-grey200 ${getHeaderTextColor('targetQty')}`}
        >
          목표 입고 수량
        </div>
        <div className="flex w-[90px] items-center justify-center border-b border-r border-greyColor-grey200 text-greyColor-grey900">
          처리 상태
        </div>
      </div>

      <div className="flex w-full flex-col">
        {items.length === 0 ? (
          <div className="flex h-[120px] w-full items-center justify-center border-b border-r border-greyColor-grey200 text-greyColor-grey400">
            등록된 입고 물품이 없습니다.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex h-[40px] w-full text-center text-[14px] text-greyColor-grey900 hover:bg-greyColor-grey50"
            >
              <div className="flex w-[60px] items-center justify-center border-b border-r border-greyColor-grey200">
                -
              </div>
              <div className="flex flex-1 items-center justify-center border-b border-r border-greyColor-grey200">
                {item.id}
              </div>
              <div className="flex flex-1 items-center justify-center border-b border-r border-greyColor-grey200">
                {item.name}
              </div>
              <div className="flex flex-1 items-center justify-center border-b border-r border-greyColor-grey200">
                {typeof item.price === 'number' ? `${item.price}원` : item.price}
              </div>
              <div className="flex w-[80px] items-center justify-center border-b border-r border-greyColor-grey200">
                {item.inboundQty}
              </div>
              <div className="flex w-[100px] items-center justify-center border-b border-r border-greyColor-grey200">
                {item.currentQty}
              </div>
              <div className="flex w-[100px] items-center justify-center border-b border-r border-greyColor-grey200">
                {item.targetQty}
              </div>
              <div className="flex w-[90px] items-center justify-center border-b border-r border-greyColor-grey200">
                <div
                  className={`flex h-[24px] w-[50px] items-center justify-center rounded-[100px] text-[12px] font-medium ${item.status === '완료' ? 'bg-mainColor-blue050 text-mainColor-blue600' : 'bg-greyColor-grey200 text-greyColor-grey600'}`}
                >
                  {item.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
