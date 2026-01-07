import React from 'react';

const OUTBOUND_ITEM_MOCK_DATA = [
  {
    id: 1,
    itemName: '강아지 껌',
    currQty: 50,
    targetQty: 100,
    unitPrice: 5000,
    status: '진행중',
  },
  {
    id: 2,
    itemName: '강아지 간식',
    currQty: 30,
    targetQty: 50,
    unitPrice: 3000,
    status: '완료',
  },
];

interface OutboundItemListProps {
  status: string;
}

const OutboundItemList: React.FC<OutboundItemListProps> = ({ status }) => {
  const isTaskAssignment = status === 'TASK_ASSIGNMENT';
  // status가 빈 문자열이거나 유효하지 않으면 샘플 데이터를 표시하지 않음
  const displayItems = !status || status === '' || isTaskAssignment ? [] : OUTBOUND_ITEM_MOCK_DATA;

  // 총 판매액 계산? 아님 API로 받아오는지
  const totalSalesAmount = displayItems.reduce((acc, cur) => acc + cur.currQty * cur.unitPrice, 0);

  const isColumnAllHyphen = (key: string) => {
    if (displayItems.length === 0) return false;
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

      {!isTaskAssignment && displayItems.length > 0 && (
        <div className="box-border flex flex-col">
          {displayItems.map((item, rowIdx) => (
            <div
              key={item.id}
              className={`box-border flex h-[40px] items-center bg-white ${
                rowIdx !== displayItems.length - 1 ? 'border-b-[2px] border-greyColor-grey200' : ''
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
                {(item.currQty * item.unitPrice).toLocaleString()}
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
                {totalSalesAmount.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutboundItemList;
