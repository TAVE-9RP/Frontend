import React from 'react';

export interface OutboundItem {
  id: string | number;
  itemName: string;
  currQty: number;
  targetQty: number;
  unitPrice: number;
  status: string;
  totalPrice: number | null;
}

interface OutboundItemListProps {
  status: string;
  items?: OutboundItem[];
}

const OutboundItemList: React.FC<OutboundItemListProps> = ({ status, items = [] }) => {
  const isTaskAssignment = status === 'TASK_ASSIGNMENT' || status === 'ASSIGNED';
  const isApprovalPending = status === 'APPROVAL_PENDING' || status === 'PENDING';
  const hasItems = items && items.length > 0;

  // 총 판매액 계산 (모든 아이템의 processedQuantity * itemPrice 합계)
  const totalSalesAmount = hasItems
    ? items.reduce((acc, cur) => acc + cur.currQty * cur.unitPrice, 0)
    : 0;

  const isColumnAllHyphen = (key: string) => {
    if (!hasItems) return false;
    return false;
  };

  const columns = [
    { label: '물품명', width: 'w-[130px]', key: 'itemName' },
    { label: '현재 출하 수량', width: 'w-[140px]', key: 'currQty' },
    { label: '목표 출하 수량', width: 'w-[140px]', key: 'targetQty' },
    { label: '판매액', width: 'w-[140px]', key: 'unitPrice' },
    { label: '총 판매액', width: 'w-[140px]', key: 'total' },
    { label: '처리 상태', width: 'w-[122px]', key: 'status' },
  ];
  return (
    <div className="box-border w-full overflow-hidden rounded-t-[10px] border-[2px] border-greyColor-grey200">
      <div className="box-border flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
        {columns.map((col, idx) => {
          const isCurrQtyHeader = col.key === 'currQty';
          const headerColor =
            isCurrQtyHeader && isApprovalPending
              ? '#9CA3AF'
              : isColumnAllHyphen(col.key)
                ? '#9CA3AF'
                : '#131517';

          return (
            <div
              key={idx}
              style={{
                width: col.width.match(/\d+/)?.[0] + 'px',
                color: headerColor,
              }}
              className="box-border flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] font-bold last:border-r-0"
            >
              {col.label}
            </div>
          );
        })}
      </div>

      {!hasItems && (
        <div className="flex h-[40px] items-center justify-center bg-white">
          <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
        </div>
      )}

      {hasItems && (
        <div className="box-border flex flex-col">
          {items.map((item, rowIdx) => {
            // 판매액: itemPrice (단가)
            const salesAmount = item.unitPrice;
            // 총 판매액: processedQuantity * itemPrice
            const itemTotalPrice = item.currQty * item.unitPrice;

            return (
              <div
                key={item.id}
                className={`box-border flex h-[40px] items-center bg-white ${
                  rowIdx !== items.length - 1 ? 'border-b-[2px] border-greyColor-grey200' : ''
                }`}
              >
                <div className="box-border flex h-full w-[130px] items-center justify-center border-r-[2px] border-greyColor-grey200 px-2">
                  <span className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-center font-pretendard text-[13px] text-black">
                    {item.itemName}
                  </span>
                </div>
                <div className="box-border flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px]">
                  <span style={{ color: isApprovalPending ? '#9CA3AF' : '#000000' }}>
                    {isApprovalPending && item.currQty === 0 ? '-' : item.currQty.toLocaleString()}
                  </span>
                </div>
                <div className="box-border flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] text-black">
                  {item.targetQty.toLocaleString()}
                </div>
                <div className="box-border flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] text-black">
                  {salesAmount.toLocaleString()}원
                </div>
                <div className="box-border flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] text-black">
                  {itemTotalPrice.toLocaleString()}원
                </div>
                <div className="box-border flex h-full w-[122px] items-center justify-center font-pretendard text-[13px]">
                  <div
                    className={`flex h-[24px] items-center justify-center rounded-[50px] px-[8px] ${item.status === '완료' ? 'bg-mainColor-blue050 text-mainColor-blue600' : 'bg-greyColor-grey200 text-greyColor-grey600'}`}
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
      )}
    </div>
  );
};

export default OutboundItemList;
