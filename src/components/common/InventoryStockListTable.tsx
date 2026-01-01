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

  const handleRowClick = (inventoryNumber: string) => {
    navigate(`/inventory-stock/${inventoryNumber}`);
  };

  const commonCellClasses =
    'h-[40px] px-4 border-b border-r border-greyColor-grey200 flex items-center justify-center shrink-0';

  const headerTextClasses = 'font-pretendard text-[15px] font-bold text-black';

  const bodyTextClasses = 'font-pretendard text-[15px] font-normal text-black';

  if (isLoading) {
    return (
      <p className="py-10 text-center font-pretendard text-greyColor-grey500">
        재고 목록을 불러오는 중...
      </p>
    );
  }

  return (
    <div className="w-[1040px] overflow-hidden border-l border-t border-greyColor-grey200">
      <table className="w-full table-fixed border-collapse">
        <thead className="bg-subColor-orange050">
          <tr className="flex">
            <th className={`${commonCellClasses} w-[160px] ${headerTextClasses} justify-start`}>
              재고 번호
            </th>
            <th className={`${commonCellClasses} w-[160px] ${headerTextClasses} justify-start`}>
              품목명
            </th>
            <th className={`${commonCellClasses} w-[140px] ${headerTextClasses} justify-start`}>
              수량
            </th>
            <th className={`${commonCellClasses} w-[120px] ${headerTextClasses} justify-start`}>
              품목 가격
            </th>
            <th className={`${commonCellClasses} w-[140px] ${headerTextClasses} justify-start`}>
              위치
            </th>
            <th className={`${commonCellClasses} w-[160px] ${headerTextClasses} justify-start`}>
              최근 입고일
            </th>
            <th
              className={`${commonCellClasses} w-[160px] border-r-0 ${headerTextClasses} justify-start`}
            >
              생성일
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {data.length === 0 ? (
            <tr className="flex">
              <td className="flex h-[40px] w-full items-center justify-center border-b border-greyColor-grey200 font-pretendard text-[15px] text-greyColor-grey500">
                해당 재고 목록이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((stock) => (
              <tr
                key={stock.id}
                className="flex cursor-pointer transition duration-150 hover:bg-mainColor-blue050"
                onClick={() => handleRowClick(stock.inventoryNumber)}
              >
                <td className={`${commonCellClasses} w-[160px] ${bodyTextClasses}`}>
                  {stock.inventoryNumber}
                </td>
                <td className={`${commonCellClasses} w-[160px] ${bodyTextClasses}`}>
                  {stock.itemName}
                </td>
                <td className={`${commonCellClasses} w-[140px] ${bodyTextClasses}`}>
                  {stock.quantity}
                </td>
                <td className={`${commonCellClasses} w-[120px] ${bodyTextClasses}`}>
                  {stock.itemPrice}
                </td>
                <td className={`${commonCellClasses} w-[140px] ${bodyTextClasses}`}>
                  {stock.location}
                </td>
                <td className={`${commonCellClasses} w-[160px] ${bodyTextClasses}`}>
                  {stock.recentInboundDate}
                </td>
                <td className={`${commonCellClasses} w-[160px] border-r-0 ${bodyTextClasses}`}>
                  {stock.creationDate}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
