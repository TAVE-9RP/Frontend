import React from 'react';
import { useNavigate } from 'react-router-dom';

interface InventoryStock {
  id: number;
  inventoryNumber: string;
  itemName: string;
  quantity: number;
  itemPrice: string;
  location: string;
  recentInboundDate: string;
  creationDate: string;
}

interface InventoryStockListTableProps {
  data: InventoryStock[];
  isLoading: boolean;
}

export default function InventoryStockListTable({ data, isLoading }: InventoryStockListTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (itemId: number) => {
    navigate(`/inventory-stock/${itemId}`);
  };

  const commonCellClasses =
    'h-[40px] px-4 border-b border-r border-greyColor-grey200 flex items-center shrink-0 min-w-0';

  const headerTextClasses = 'font-pretendard text-[15px] font-bold text-black truncate';
  const bodyTextClasses = 'font-pretendard text-[15px] font-normal text-black truncate w-full';

  return (
    <div className="w-[1200px] overflow-hidden rounded-[10px] border-l border-r border-t border-greyColor-grey200">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-subColor-orange050">
          <tr className="flex">
            <th className={`${commonCellClasses} w-[16%] ${headerTextClasses}`}>재고 번호</th>
            <th className={`${commonCellClasses} w-[16%] ${headerTextClasses}`}>물품명</th>
            <th className={`${commonCellClasses} w-[14%] ${headerTextClasses}`}>수량</th>
            <th className={`${commonCellClasses} w-[12%] ${headerTextClasses}`}>품목 가격</th>
            <th className={`${commonCellClasses} w-[14%] ${headerTextClasses}`}>위치</th>
            <th className={`${commonCellClasses} w-[16%] ${headerTextClasses}`}>최근 입고일</th>
            <th className={`${commonCellClasses} w-[12%] border-r-0 ${headerTextClasses}`}>
              생성일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {isLoading ? (
            <tr className="flex">
              <td className="flex h-[100px] w-full items-center justify-center border-b border-greyColor-grey200 font-pretendard text-[16px] text-greyColor-grey500">
                재고 목록을 불러오는 중...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr className="flex">
              <td className="flex h-[100px] w-full items-center justify-center border-b border-greyColor-grey200 font-pretendard text-[15px] text-greyColor-grey400">
                조회된 재고 목록이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((stock) => {
              return (
                <tr
                  key={stock.id}
                  className="flex cursor-pointer transition duration-150 hover:bg-mainColor-blue050"
                  onClick={() => handleRowClick(stock.id)}
                >
                  <td className={`${commonCellClasses} w-[16%] justify-center`}>
                    <span className={bodyTextClasses}>{stock.inventoryNumber}</span>
                  </td>
                  <td className={`${commonCellClasses} w-[16%] justify-center`}>
                    <span className={bodyTextClasses}>{stock.itemName}</span>
                  </td>
                  <td className={`${commonCellClasses} w-[14%] justify-center`}>
                    <span className={bodyTextClasses}>{stock.quantity}</span>
                  </td>
                  <td className={`${commonCellClasses} w-[12%] justify-center`}>
                    <span className={bodyTextClasses}>{stock.itemPrice}</span>
                  </td>
                  <td className={`${commonCellClasses} w-[14%] justify-center`}>
                    <span className={bodyTextClasses}>{stock.location}</span>
                  </td>
                  <td className={`${commonCellClasses} w-[16%] justify-center`}>
                    <span className={bodyTextClasses}>{stock.recentInboundDate}</span>
                  </td>
                  <td className={`${commonCellClasses} w-[12%] justify-center border-r-0`}>
                    <span className={bodyTextClasses}>{stock.creationDate}</span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
