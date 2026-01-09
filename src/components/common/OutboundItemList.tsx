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
  const isTaskAssignment = status === 'TASK_ASSIGNMENT';
  const hasItems = items && items.length > 0;

  // 총 판매액 계산 (모든 아이템의 processedQuantity * itemPrice 합계)
  const totalSalesAmount = hasItems
    ? items.reduce((acc, cur) => acc + (cur.currQty * cur.unitPrice), 0)
    : 0;

  const isColumnAllHyphen = (key: string) => {
    if (!hasItems) return false;
    return false;
  };

  const columns = [
    { label: '품목명', width: 'w-[130px]', key: 'itemName' },
    { label: '현재 출하 수량', width: 'w-[140px]', key: 'currQty' },
    { label: '목표 출하 수량', width: 'w-[140px]', key: 'targetQty' },
    { label: '판매액', width: 'w-[140px]', key: 'unitPrice' },
    { label: '처리 상태', width: 'w-[122px]', key: 'status' },
    { label: '총 판매액', width: 'w-[140px]', key: 'total' },
  ];
  return (
    <div className="box-border w-full overflow-hidden rounded-[10px] border-[2px] border-greyColor-grey200">
      <div className="box-border flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
        {columns.map((col, idx) => (
          <div
            key={idx}
            style={{ width: col.width.match(/\d+/)?.[0] + 'px' }}
            className={`box-border flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] font-bold last:border-r-0 ${
              isColumnAllHyphen(col.key) ? 'text-greyColor-grey300' : 'text-[#131517]'
            }`}
          >
            {col.label}
          </div>
        ))}
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
                <div className="box-border flex h-full w-[130px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] text-black">
                  {item.itemName}
                </div>
                <div className="box-border flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] text-black">
                  {item.currQty.toLocaleString()}
                </div>
                <div className="box-border flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] text-black">
                  {item.targetQty.toLocaleString()}
                </div>
                <div className="box-border flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[13px] text-black">
                  {salesAmount.toLocaleString()}원
                </div>
                <div className="box-border flex h-full w-[122px] items-center justify-center border-r-[2px] border-greyColor-grey200">
                  <div
                    className={`flex h-[24px] items-center justify-center rounded-[50px] px-[8px] ${item.status === '완료' ? 'bg-mainColor-blue050 text-mainColor-blue600' : 'bg-greyColor-grey200 text-greyColor-grey600'}`}
                  >
                    <span className="font-pretendard text-[13px] font-bold leading-none">
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="box-border flex h-full w-[140px] items-center justify-center font-pretendard text-[13px] text-black">
                  {itemTotalPrice.toLocaleString()}원
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
