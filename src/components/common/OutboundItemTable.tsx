import React from 'react';
import checkboxImg from '@/assets/checkbox.png';
import checkboxCheckImg from '@/assets/checkbox_check.png';
import 진행중Img from '@/assets/management/진행중.png';
import 미진행Img from '@/assets/management/미진행.png';
import 완료Img from '@/assets/management/완료.png';
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
              isSelected ? 'bg-mainColor-blue050' : 'bg-white hover:bg-greyColor-grey50'
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
                  className={`flex h-full w-full items-center justify-center ${isItemCompleted ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
              {isInProgress ? (
                <input
                  type="text"
                  inputMode="numeric"
                  value={tempInputQty === 0 ? '' : tempInputQty}
                  // 108번 라인 근처 <input> 태그 안의 onChange 부분입니다.
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    const inputQty = value === '' ? 0 : Number(value); // 현재 사용자가 입력 중인 숫자

                    // 1. 계산에 필요한 변수들 정의
                    const currentProcessed = item.processedQuantity ?? 0; // 서버에 이미 반영된 수량 (현재 출하 수량)
                    const targetQty = item.targetedQuantity ?? 0; // 목표 출하 수량
                    const remainingQty = targetQty - currentProcessed; // 남은 출하 가능 수량

                    // 2. 마이너스 방지 로직 (핵심)
                    // 입력한 값이 '남은 수량'보다 크면 계산 결과가 마이너스가 되므로 차단합니다.
                    if (inputQty > remainingQty) {
                      alert(
                        `처리 가능한 수량을 초과했습니다.\n` + `남은 수량: ${remainingQty}개\n`,
                      );
                      // 입력값을 0으로 초기화하거나 이전 값으로 유지
                      onProcessedQuantityChange?.(item.logisticsItemId, 0);
                      return;
                    }

                    // 3. 통과 시 부모 컴포넌트에게 값 전달
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
                  value={targetedQty === 0 ? '' : targetedQty}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    onTargetQuantityChange?.(
                      item.logisticsItemId,
                      value === '' ? 0 : Number(value),
                    );
                  }}
                  className="h-[30px] w-[80%] rounded border border-greyColor-grey300 bg-white text-center font-pretendard text-[14px] text-black focus:border-mainColor-blue500 focus:outline-none"
                />
              ) : (
                <span className="text-black">{targetedQty}</span>
              )}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {price.toLocaleString()}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center border-r-[2px] border-greyColor-grey200 text-center font-pretendard text-[14px] text-black">
              {totalPrice ? totalPrice.toLocaleString() : '-'}
            </div>

            <div className="flex h-full w-[97px] items-center justify-center font-pretendard text-[14px]">
              {item.logisticsProcessingStatus === 'IN_PROGRESS' ? (
                <div className="flex items-center justify-center">
                  <img src={진행중Img} alt="진행 중" className="h-auto w-[71px] object-contain" />
                </div>
              ) : item.logisticsProcessingStatus === 'NOT_STARTED' ? (
                <div className="flex items-center justify-center">
                  <img src={미진행Img} alt="미진행" className="h-auto w-[71px] object-contain" />
                </div>
              ) : item.logisticsProcessingStatus === 'COMPLETED' ? (
                <div className="flex items-center justify-center">
                  <img src={완료Img} alt="완료" className="h-auto w-[71px] object-contain" />
                </div>
              ) : (
                <div
                  className={`flex h-[24px] items-center justify-center rounded-[50px] bg-greyColor-grey200 px-[8px] text-[13px] font-bold leading-none text-greyColor-grey600`}
                >
                  {statusMap[item.logisticsProcessingStatus] || '미진행'}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OutboundItemTable;
