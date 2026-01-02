import React from 'react';
import checkboxImg from '@/assets/checkbox.png';
import checkboxCheckImg from '@/assets/checkbox_check.png';

export interface OutboundItem {
  id: string;
  name: string;
  outboundQty: string | number;
  currentQty: string | number;
  targetQty: string | number;
  price: number;
  status: '미진행' | '완료' | '진행 중';
}

interface OutboundItemListProps {
  items: OutboundItem[];
  selectedItemIds: string[];
  onSelect: (id: string) => void;
  status?: string;
}

const OutboundItemTable: React.FC<OutboundItemListProps> = ({
  items,
  selectedItemIds,
  onSelect,
  status = '',
}) => {
  const currentStatus = status.toUpperCase();
  const isTaskAssignment = currentStatus === 'TASK_ASSIGNMENT';
  const isApprovalPending = currentStatus === 'APPROVAL_PENDING';
  const showHyphenInSelect = isTaskAssignment || isApprovalPending;
  const displayItems = isTaskAssignment ? [] : items;

  const isAllHyphen = (key: keyof OutboundItem) => {
    if (displayItems.length === 0) return false;
    return displayItems.every((item) => item[key] === '-');
  };

  const columns: { label: string; width: string; key?: keyof OutboundItem }[] = [
    { label: '선택', width: 'w-[40px]' },
    { label: '재고 번호', width: 'w-[97px]', key: 'id' },
    { label: '물품명', width: 'w-[97px]', key: 'name' },
    { label: '출하 수량', width: 'w-[97px]', key: 'outboundQty' },
    { label: '현재 출하 수량', width: 'w-[97px]', key: 'currentQty' },
    { label: '목표 출하 수량', width: 'w-[97px]', key: 'targetQty' },
    { label: '판매액', width: 'w-[97px]', key: 'price' },
    { label: '총 판매액', width: 'w-[97px]' },
    { label: '처리 상태', width: 'w-[97px]', key: 'status' },
  ];

  return (
    <div className="w-full overflow-hidden border-[2px] border-greyColor-grey200">
      <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
        {columns.map((col, idx) => {
          const grayHeader = col.key ? isAllHyphen(col.key) : false;
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

      {!isTaskAssignment &&
        displayItems.map((item) => {
          const isSelected = selectedItemIds.includes(item.id);
          const isCompleted = item.status === '완료';
          const isProcessing = item.status === '진행 중';
          const qty = typeof item.targetQty === 'number' ? item.targetQty : 0;
          const totalPrice = item.price * qty;

          return (
            <div
              key={item.id}
              className={`flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 transition-colors last:border-b-0 ${
                isSelected ? 'bg-mainColor-blue050' : 'bg-white'
              }`}
            >
              <div className="flex h-full w-[40px] items-center justify-center border-r-[2px] border-greyColor-grey200">
                {showHyphenInSelect || isProcessing ? (
                  <span className="font-pretendard text-[14px] text-greyColor-grey300">-</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => !isCompleted && onSelect(item.id)}
                    disabled={isCompleted}
                    className={`${isCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  >
                    <img
                      src={isSelected ? checkboxCheckImg : checkboxImg}
                      alt="checkbox"
                      className="h-[19.5px] w-[19.5px] object-contain"
                    />
                  </button>
                )}
              </div>

              <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
                {item.id}
              </div>
              <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
                {item.name}
              </div>
              <div
                className={`flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] ${item.outboundQty === '-' ? 'text-greyColor-grey300' : 'text-black'}`}
              >
                {item.outboundQty}
              </div>
              <div
                className={`flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] ${item.currentQty === '-' ? 'text-greyColor-grey300' : 'text-black'}`}
              >
                {item.currentQty}
              </div>
              <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
                {item.targetQty}
              </div>
              <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
                {item.price.toLocaleString()}
              </div>
              <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
                {totalPrice.toLocaleString()}
              </div>

              <div className="flex h-full w-[97px] items-center justify-center font-pretendard text-[14px]">
                <div
                  className={`flex h-[24px] items-center justify-center rounded-[50px] px-[8px] py-[8px] ${
                    isCompleted
                      ? 'bg-mainColor-blue050 text-mainColor-blue600'
                      : isProcessing
                        ? 'bg-[#FFEEBC] text-[#FF803B]'
                        : 'bg-greyColor-grey200 text-greyColor-grey600'
                  }`}
                >
                  <span className="font-pretendard text-[13px] font-bold leading-none">
                    {item.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default OutboundItemTable;
