import React, { useState } from 'react';
import { OutboundItem, LogisticsStatus, ItemProcessingStatus } from '@/types/logistics';
import AlertModal from '@/components/modals/AlertModal';
import { getItemDetail } from '@/apis/logistics';

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
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });
  const currentStatus = status.toUpperCase();
  const isEditable = currentStatus === 'ASSIGNED' || currentStatus === 'REJECT';
  const isTaskAssignment = currentStatus === 'ASSIGNED';
  const isApprovalPending = currentStatus === 'PENDING';
  const isInProgress = currentStatus === 'IN_PROGRESS';
  const showHyphenInSelect = isTaskAssignment || isApprovalPending;

  const statusMap: Record<ItemProcessingStatus, string> = {
    NOT_STARTED: '미진행',
    IN_PROGRESS: '진행 중',
    COMPLETED: '완료',
  };

  const handleTargetQtyChange = async (item: ExtendedOutboundItem, value: string) => {
    if (value.includes('-')) {
      setAlertModal({
        isOpen: true,
        message: '목표 출하 수량은 1 이상이어야 합니다.',
      });
      return;
    }

    const rawValue = value.replace(/[^0-9]/g, '');
    const inputQty = rawValue === '' ? 0 : Number(rawValue);

    if (inputQty === 0) {
      onTargetQuantityChange?.(item.logisticsItemId, 0);
      return;
    }

    try {
      const response = await getItemDetail(item.itemId);
      if (response.isSuccess && response.result) {
        const currentStock = response.result.quantity;

        if (inputQty > currentStock) {
          setAlertModal({
            isOpen: true,
            message: `목표 출하 수량은 현재 재고보다 작거나 같아야 합니다.\n현재 재고: ${currentStock}개`,
          });
          return;
        }
      }
    } catch (error) {
      console.error('재고 정보 조회 실패:', error);
    }

    onTargetQuantityChange?.(item.logisticsItemId, inputQty);
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
    <div className="w-full overflow-hidden rounded-t-[10px] border-[2px] border-greyColor-grey200">
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
        const price = item.itemPrice ?? 0;
        const totalPrice = item.itemTotalPrice ?? 0;
        const currentProcessedQtyFromApi = item.processedQuantity ?? 0;
        const tempInputQty = item.tempProcessedQuantity ?? 0;
        const targetedQty = item.targetedQuantity ?? 0;

        return (
          <div
            key={item.logisticsItemId}
            className={`flex min-h-[40px] items-stretch border-b-[2px] border-greyColor-grey200 transition-colors last:border-b-0 ${
              isSelected ? 'bg-mainColor-blue050' : 'bg-white hover:bg-greyColor-grey50'
            }`}
          >
            <div className="flex min-h-[40px] w-[40px] items-center justify-center border-r-[2px] border-greyColor-grey200">
              {showHyphenInSelect ? (
                <span className="font-pretendard text-[14px] text-greyColor-grey300">-</span>
              ) : (
                <button
                  type="button"
                  onClick={() => !isItemCompleted && onSelect(item.logisticsItemId)}
                  disabled={isItemCompleted}
                  className={`flex min-h-[40px] w-full items-center justify-center ${
                    isItemCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                  }`}
                >
                  <img
                    src={isSelected ? '/images/checkbox_check.png' : '/images/checkbox.png'}
                    alt="checkbox"
                    className="h-[19.5px] w-[19.5px] object-contain"
                  />
                </button>
              )}
            </div>

            <div className="flex min-h-[40px] w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {item.itemCode || '-'}
            </div>

            <div className="flex min-h-[40px] w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 px-2">
              <span className="block w-full whitespace-normal break-words text-center font-pretendard text-[14px] leading-snug text-black">
                {item.itemName || '-'}
              </span>
            </div>

            <div className="flex min-h-[40px] w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200">
              {isInProgress ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={tempInputQty === 0 ? '' : tempInputQty}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const inputQty = value === '' ? 0 : Number(value);
                    const currentProcessed = item.processedQuantity ?? 0;
                    const targetQty = item.targetedQuantity ?? 0;
                    const remainingQty = targetQty - currentProcessed;

                    if (inputQty > remainingQty) {
                      setAlertModal({
                        isOpen: true,
                        message: `처리 가능한 수량을 초과했습니다.\n남은 수량: ${remainingQty}개`,
                      });
                      onProcessedQuantityChange?.(item.logisticsItemId, 0);
                      return;
                    }
                    onProcessedQuantityChange?.(item.logisticsItemId, inputQty);
                  }}
                  disabled={!isSelected || isItemCompleted}
                  className={`h-[30px] w-[80%] rounded border border-greyColor-grey300 text-center font-pretendard text-[14px] text-black focus:border-mainColor-blue600 focus:outline-none ${
                    !isSelected || isItemCompleted
                      ? 'cursor-not-allowed bg-greyColor-grey100'
                      : 'bg-white'
                  }`}
                />
              ) : (
                <span className="font-pretendard text-[14px] text-greyColor-grey300">-</span>
              )}
            </div>

            <div
              className={`flex min-h-[40px] w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] ${
                isTaskAssignment || isApprovalPending ? 'text-greyColor-grey300' : 'text-black'
              }`}
            >
              {isTaskAssignment || isApprovalPending ? '-' : currentProcessedQtyFromApi}
            </div>

            <div className="flex min-h-[40px] w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px]">
              {isEditable ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={targetedQty === 0 ? '' : targetedQty}
                  onChange={(e) => handleTargetQtyChange(item, e.target.value)}
                  className="h-[30px] w-[80%] rounded border border-greyColor-grey300 bg-white text-center font-pretendard text-[14px] text-black focus:border-mainColor-blue500 focus:outline-none"
                />
              ) : (
                <span className="text-black">{targetedQty}</span>
              )}
            </div>

            <div className="flex min-h-[40px] w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {price.toLocaleString()}
            </div>
            <div className="flex min-h-[40px] w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {totalPrice ? totalPrice.toLocaleString() : '-'}
            </div>

            <div className="flex min-h-[40px] w-[97px] items-center justify-center font-pretendard text-[14px]">
              {item.logisticsProcessingStatus === 'IN_PROGRESS' ? (
                <img
                  src="/images/management/진행중.png"
                  alt="진행 중"
                  className="h-auto w-[71px] object-contain"
                />
              ) : item.logisticsProcessingStatus === 'NOT_STARTED' ? (
                <img
                  src="/images/management/미진행.png"
                  alt="미진행"
                  className="h-auto w-[71px] object-contain"
                />
              ) : item.logisticsProcessingStatus === 'COMPLETED' ? (
                <img
                  src="/images/management/완료.png"
                  alt="완료"
                  className="h-auto w-[55px] object-contain"
                />
              ) : (
                <div className="flex h-[24px] items-center justify-center rounded-[50px] bg-greyColor-grey200 px-[8px] text-[13px] font-bold text-greyColor-grey600">
                  {statusMap[item.logisticsProcessingStatus] || '미진행'}
                </div>
              )}
            </div>
          </div>
        );
      })}

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
};

export default OutboundItemTable;
