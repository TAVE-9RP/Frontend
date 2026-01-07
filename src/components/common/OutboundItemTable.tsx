import React from 'react';
import checkboxImg from '@/assets/checkbox.png';
import checkboxCheckImg from '@/assets/checkbox_check.png';
import { OutboundItem, LogisticsStatus, ItemProcessingStatus } from '@/types/logistics';

interface OutboundItemListProps {
  items: OutboundItem[];
  selectedItemIds: number[];
  onSelect: (id: number) => void;
  status?: LogisticsStatus;
}

const OutboundItemTable: React.FC<OutboundItemListProps> = ({
  items,
  selectedItemIds,
  onSelect,
  status = 'ASSIGNED',
}) => {
  const currentStatus = status.toUpperCase();
  const isTaskAssignment = currentStatus === 'ASSIGNED';
  const isApprovalPending = currentStatus === 'PENDING';
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
        {columns.map((col, idx) => (
          <div
            key={idx}
            className={`${col.width} flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black last:border-r-0`}
          >
            {col.label}
          </div>
        ))}
      </div>

      {items.map((item) => {
        const isSelected = selectedItemIds.includes(item.logisticsItemId);
        const isCompleted = item.logisticsProcessingStatus === 'COMPLETED';
        const isProcessing = item.logisticsProcessingStatus === 'IN_PROGRESS';

        // 데이터 방어 로직: null이나 undefined일 경우 0으로 처리
        const processedQty = item.processedQuantity ?? 0;
        const targetedQty = item.targetedQuantity ?? 0;
        const price = item.itemPrice ?? 0;
        const totalPrice = item.itemTotalPrice ?? 0;

        return (
          <div
            key={item.logisticsItemId}
            className={`flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 transition-colors last:border-b-0 ${
              isSelected ? 'bg-mainColor-blue050' : 'bg-white'
            }`}
          >
            {/* 선택 체크박스 */}
            <div className="flex h-full w-[40px] items-center justify-center border-r-[2px] border-greyColor-grey200">
              {showHyphenInSelect || isProcessing ? (
                <span className="font-pretendard text-[14px] text-greyColor-grey300">-</span>
              ) : (
                <button
                  type="button"
                  onClick={() => !isCompleted && onSelect(item.logisticsItemId)}
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

            {/* 재고 번호 */}
            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {item.logisticsItemId}
            </div>

            {/* 물품명 */}
            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {item.itemName || '-'}
            </div>

            {/* 출하 수량 (현재 처리된 수량) */}
            <div
              className={`flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] ${processedQty === 0 ? 'text-greyColor-grey300' : 'text-black'}`}
            >
              {processedQty === 0 ? '-' : processedQty}
            </div>

            {/* 잔여 수량 (목표 - 현재) */}
            <div
              className={`flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] ${targetedQty - processedQty === 0 ? 'text-greyColor-grey300' : 'text-black'}`}
            >
              {targetedQty - processedQty === 0 ? '-' : targetedQty - processedQty}
            </div>

            {/* 목표 출하 수량 */}
            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {targetedQty}
            </div>

            {/* 판매액 (toLocaleString 호출 전 0 체크) */}
            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {price.toLocaleString()}
            </div>

            {/* 총 판매액 */}
            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {totalPrice.toLocaleString()}
            </div>

            {/* 처리 상태 */}
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
