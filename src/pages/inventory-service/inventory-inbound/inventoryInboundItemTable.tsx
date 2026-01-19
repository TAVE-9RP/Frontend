import React from 'react';

export interface InboundItem {
  id: string;
  inventoryItemId?: number;
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
  isProgress?: boolean;
  selectedItemIds: string[];
  onSelect: (id: string) => void;
  onTargetQtyChange?: (id: string, value: string) => void;
  onInboundQtyChange?: (id: string, value: string) => void;
  isDisabled?: boolean;
}

export default function InboundItemTable({
  items,
  isLoading,
  isProgress = false,
  selectedItemIds = [],
  onSelect,
  onTargetQtyChange,
  onInboundQtyChange,
  isDisabled = false,
}: InboundItemTableProps) {
  const isColumnEmpty = (key: keyof InboundItem) => {
    if (items.length === 0) return true;
    return items.every(
      (item) =>
        item[key] === '-' || item[key] === '' || item[key] === null || item[key] === undefined,
    );
  };

  const getHeaderTextColor = (key: keyof InboundItem | 'selection') => {
    if (key === 'selection')
      return isProgress ? 'text-greyColor-grey900' : 'text-greyColor-grey300';
    return isColumnEmpty(key) ? 'text-greyColor-grey300' : 'text-greyColor-grey900';
  };

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-[810px] items-center justify-center border border-greyColor-grey200 text-greyColor-grey500">
        물품 목록을 불러오는 중...
      </div>
    );
  }

  const cellBase =
    'flex h-[40px] items-center justify-center border-b border-r border-greyColor-grey200 shrink-0';
  const cell110 = `${cellBase} w-[110px]`;
  const cell40 = `${cellBase} w-[40px]`;

  return (
    <div className="flex w-full max-w-[1200px] flex-col self-stretch rounded-t-[10px] border-l border-t border-greyColor-grey200 bg-white font-pretendard">
      <div className="flex w-full bg-greyColor-grey100 text-center text-[14px] font-bold">
        <div className={`${cell40} ${getHeaderTextColor('selection')}`}>선택</div>
        <div className={`${cell110} ${getHeaderTextColor('id')}`}>재고 번호</div>
        <div className={`${cell110} ${getHeaderTextColor('name')}`}>물품명</div>
        <div className={`${cell110} ${getHeaderTextColor('price')}`}>물품 가격</div>
        <div
          className={`${cell110} ${isProgress ? 'text-greyColor-grey900' : getHeaderTextColor('inboundQty')}`}
        >
          입고 수량
        </div>
        <div
          className={`${cell110} ${isProgress ? 'text-greyColor-grey900' : getHeaderTextColor('currentQty')}`}
        >
          현재 입고 수량
        </div>
        <div className={`${cell110} text-greyColor-grey900`}>목표 입고 수량</div>
        <div className={`${cell110} text-greyColor-grey900`}>처리 상태</div>
      </div>

      <div className="flex w-full flex-col">
        {items.length === 0 ? (
          <div className="flex h-[120px] w-full items-center justify-center border-b border-r border-greyColor-grey200 text-greyColor-grey400">
            등록된 입고 물품이 없습니다.
          </div>
        ) : (
          items.map((item) => {
            const isSelected = selectedItemIds.includes(item.id);
            return (
              <div
                key={item.id}
                className={`flex w-full text-center text-[14px] transition-colors ${
                  isSelected ? 'bg-mainColor-blue050' : 'bg-white hover:bg-greyColor-grey50'
                }`}
              >
                <div className={cell40}>
                  {isProgress && item.status !== '완료' ? (
                    <button
                      onClick={() => onSelect(item.id)}
                      className="flex h-full w-full items-center justify-center"
                    >
                      <img
                        src={isSelected ? '/images/checkbox_check.png' : '/images/checkbox.png'}
                        alt="checkbox"
                        style={{ width: '19.5px', height: '19.5px' }}
                        className="object-contain"
                      />
                    </button>
                  ) : (
                    <span className="text-greyColor-grey300">-</span>
                  )}
                </div>

                <div className={`${cell110} text-greyColor-grey900`}>{item.id}</div>
                <div className={`${cell110} px-2 text-greyColor-grey900`}>
                  <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
                <div className={`${cell110} text-greyColor-grey900`}>
                  {typeof item.price === 'number' ? `${item.price.toLocaleString()}원` : item.price}
                </div>
                <div className={`${cell110} flex items-center justify-center`}>
                  {isProgress ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        item.inboundQty === '-' || item.inboundQty === 0 ? '' : item.inboundQty
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        onInboundQtyChange?.(item.id, value);
                      }}
                      disabled={!isSelected || item.status === '완료'}
                      className={`h-[30px] w-[100px] rounded-[5px] border border-greyColor-grey300 px-2 text-center font-pretendard text-[14px] text-black focus:border-mainColor-blue600 focus:outline-none ${
                        !isSelected || item.status === '완료'
                          ? 'cursor-not-allowed bg-greyColor-grey100'
                          : ''
                      }`}
                    />
                  ) : (
                    <span className="text-greyColor-grey900">
                      {item.inboundQty === '-' ? '' : item.inboundQty}
                    </span>
                  )}
                </div>
                <div className={`${cell110} text-greyColor-grey900`}>{item.currentQty}</div>
                <div className={`${cell110} flex items-center justify-center`}>
                  {isDisabled ? (
                    <span className="text-greyColor-grey900">
                      {item.targetQty === '-' ? '' : item.targetQty}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={item.targetQty === '-' ? '' : item.targetQty}
                      onChange={(e) => onTargetQtyChange?.(item.id, e.target.value)}
                      className="h-[30px] w-[100px] rounded-[5px] border border-greyColor-grey300 px-2 text-center font-pretendard text-[14px] text-black focus:border-mainColor-blue600 focus:outline-none"
                      min="0"
                    />
                  )}
                </div>
                <div className={cell110}>
                  {item.status === '진행중' ? (
                    <div className="flex items-center justify-center">
                      <img
                        src="/images/management/진행중.png"
                        alt="진행 중"
                        className="h-auto w-[71px] object-contain"
                      />
                    </div>
                  ) : item.status === '미진행' ? (
                    <div className="flex items-center justify-center">
                      <img
                        src="/images/management/미진행.png"
                        alt="미진행"
                        className="h-auto w-[71px] object-contain"
                      />
                    </div>
                  ) : item.status === '완료' ? (
                    <div className="flex items-center justify-center">
                      <img
                        src="/images/management/완료.png"
                        alt="완료"
                        className="h-auto w-[71px] object-contain"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex h-[24px] w-[50px] items-center justify-center rounded-[100px] bg-greyColor-grey200 text-[12px] font-medium text-greyColor-grey600`}
                    >
                      {item.status}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
