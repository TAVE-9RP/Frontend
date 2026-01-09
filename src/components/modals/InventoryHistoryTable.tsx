import React from 'react';

interface HistoryItem {
  id: number;
  type: '입고' | '출고';
  manager: string;
  date: string;
  quantity: number;
}

interface InventoryHistoryTableProps {
  historyData: HistoryItem[];
}

export default function InventoryHistoryTable({ historyData }: InventoryHistoryTableProps) {
  const cellClasses =
    'flex h-[40px] w-[203px] items-center justify-center border-r-[2px] border-b-[2px] border-greyColor-grey200 shrink-0';

  const headerTextClasses = 'font-pretendard text-[17px] font-bold text-black';
  const bodyTextClasses = 'font-pretendard text-[17px] font-normal text-black';

  return (
    <div className="w-fit overflow-hidden rounded-[10px] border-[2px] border-greyColor-grey200">
      <div className="flex bg-greyColor-grey100">
        <div className={`${cellClasses} ${headerTextClasses}`}>구분</div>
        <div className={`${cellClasses} ${headerTextClasses}`}>담당자</div>
        <div className={`${cellClasses} ${headerTextClasses}`}>처리일</div>
        <div className={`${cellClasses} ${headerTextClasses}`}>수량</div>
      </div>

      <div className="flex flex-col bg-white">
        {historyData.length === 0 ? (
          <div className="flex h-[40px] items-center justify-center bg-white">
            <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
          </div>
        ) : (
          historyData.map((item) => (
            <div key={item.id} className="flex">
              <div className={cellClasses}>
                {item.type === '입고' ? (
                  <span className="flex h-[25px] items-center justify-center rounded-[30px] bg-mainColor-blue050 px-[10px] py-[5px] font-pretendard text-[17px] font-bold text-mainColor-blue600">
                    입고
                  </span>
                ) : (
                  <span className="flex h-[25px] items-center justify-center rounded-[30px] bg-subColor-orange100 px-[10px] py-[5px] font-pretendard text-[17px] font-bold text-subColor-orange900">
                    출고
                  </span>
                )}
              </div>

              <div className={`${cellClasses} ${bodyTextClasses}`}>{item.manager}</div>
              <div className={`${cellClasses} ${bodyTextClasses}`}>{item.date}</div>

              <div className={`${cellClasses} ${bodyTextClasses}`}>
                {item.type === '입고' ? `+${item.quantity}` : `-${item.quantity}`}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
