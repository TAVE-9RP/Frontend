import React from 'react';
import checkboxImg from '@/assets/checkbox.png';
import checkboxCheckImg from '@/assets/checkbox_check.png';
import { OutboundItem, LogisticsStatus, ItemProcessingStatus } from '@/types/logistics';

interface ExtendedOutboundItem extends OutboundItem {
  tempProcessedQuantity?: number;
}

interface OutboundItemListProps {
  items: ExtendedOutboundItem[];
  selectedItemIds: number[];
  onSelect: (id: number) => void;
  onTargetQuantityChange?: (id: number, quantity: number) => void;
  status?: LogisticsStatus;
  onProcessedQuantityChange?: (id: number, quantity: number) => void;
}

const OutboundItemTable: React.FC<OutboundItemListProps> = ({
  items,
  selectedItemIds,
  onSelect,
  onTargetQuantityChange,
  onProcessedQuantityChange,
  status = 'ASSIGNED',
}) => {
  const currentStatus = status.toUpperCase();
  const isEditable = currentStatus === 'ASSIGNED' || currentStatus === 'REJECT';
  const isTaskAssignment = currentStatus === 'ASSIGNED';
  const isApprovalPending = currentStatus === 'PENDING';
  const isInProgress = currentStatus === 'IN_PROGRESS';
  const isCompletedStatus = currentStatus === 'COMPLETED';
  const showHyphenInSelect = isTaskAssignment || isApprovalPending;

  const statusMap: Record<ItemProcessingStatus, string> = {
    NOT_STARTED: '미진행',
    IN_PROGRESS: '진행 중',
    COMPLETED: '완료',
  };

  const columns = [
    { label: '선택', width: 'w-[40px]' },
    { label: '재고 번호', width: 'w-[97px]' },
    { label: '물품명', width: 'w-[97px]' },
    { label: '출하 수량', width: 'w-[97px]' },
    { label: '현재 출하 수량', width: 'w-[97px]' },
    { label: '목표 출하 수량', width: 'w-[97px]' },
    { label: '판매액', width: 'w-[97px]' },
    { label: '총 판매액', width: 'w-[97px]' },
    { label: '처리 상태', width: 'w-[97px]' },
  ];

  return (
    <div className="w-full overflow-hidden border-[2px] border-greyColor-grey200">
      <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
        {columns.map((col, idx) => {
          const isQuantityHeader = col.label === '출하 수량' || col.label === '현재 출하 수량';
          const headerTextColor =
            isQuantityHeader && isTaskAssignment ? 'text-greyColor-grey300' : 'text-black';

          return (
            <div
              key={idx}
              className={`${col.width} flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold ${headerTextColor} last:border-r-0`}
            >
              {col.label}
            </div>
          );
        })}
      </div>

      {items.map((item) => {
        const isSelected = selectedItemIds.includes(item.logisticsItemId);
        const isItemCompleted = item.logisticsProcessingStatus === 'COMPLETED';
        const isItemProcessing = item.logisticsProcessingStatus === 'IN_PROGRESS';

        const price = item.itemPrice ?? 0;
        const totalPrice = item.itemTotalPrice ?? 0;

        const currentProcessedQtyFromApi = item.processedQuantity ?? 0;

        const tempInputQty = item.tempProcessedQuantity ?? 0;

        const targetedQty = item.targetedQuantity ?? 0;

        return (
          <div
            key={item.logisticsItemId}
            className={`flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 transition-colors last:border-b-0 ${
              isSelected ? 'bg-mainColor-blue050' : 'bg-white'
            }`}
          >
            <div className="flex h-full w-[40px] items-center justify-center border-r-[2px] border-greyColor-grey200">
              {showHyphenInSelect ? (
                <span className="font-pretendard text-[14px] text-greyColor-grey300">-</span>
              ) : (
                <button
                  type="button"
                  onClick={() => !isItemCompleted && onSelect(item.logisticsItemId)}
                  disabled={isItemCompleted}
                  className={`${isItemCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
              {item.itemCode || '-'}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {item.itemName || '-'}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200">
              {isInProgress && !isItemCompleted ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={tempInputQty === 0 ? '' : tempInputQty}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    onProcessedQuantityChange?.(
                      item.logisticsItemId,
                      value === '' ? 0 : Number(value),
                    );
                  }}
                  className="w-[80%] rounded border border-greyColor-grey200 text-center font-pretendard text-[14px] focus:outline-none"
                />
              ) : (
                <span className="font-pretendard text-[14px] text-greyColor-grey300">-</span>
              )}
            </div>

            <div
              className={`flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] ${
                isTaskAssignment || isApprovalPending ? 'text-greyColor-grey300' : 'text-black'
              }`}
            >
              {isTaskAssignment || isApprovalPending ? '-' : currentProcessedQtyFromApi}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px]">
              {isEditable ? (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={targetedQty === 0 ? '' : targetedQty}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    onTargetQuantityChange?.(
                      item.logisticsItemId,
                      value === '' ? 0 : Number(value),
                    );
                  }}
                  className="w-[80%] rounded border border-greyColor-grey300 bg-white px-1 text-center font-pretendard text-[14px] text-black focus:border-mainColor-blue500 focus:outline-none"
                />
              ) : (
                <span>{targetedQty}</span>
              )}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {price.toLocaleString()}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {totalPrice ? totalPrice.toLocaleString() : '-'}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center font-pretendard text-[14px]">
              <div
                className={`flex h-[24px] items-center justify-center rounded-[50px] px-[8px] py-[8px] ${
                  isItemCompleted || isCompletedStatus
                    ? 'bg-mainColor-blue050 text-mainColor-blue600'
                    : isItemProcessing
                      ? 'bg-[#FFEEBC] text-[#FF803B]'
                      : 'bg-greyColor-grey200 text-greyColor-grey600'
                }`}
              >
                <span className="font-pretendard text-[13px] font-bold leading-none">
                  {statusMap[item.logisticsProcessingStatus] || '미진행'}
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
