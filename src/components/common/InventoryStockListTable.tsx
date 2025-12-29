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
    console.log(`재고 ID ${inventoryNumber} 상세 페이지로 이동`);
  };

  const tableHeaderClasses =
    'py-3 px-4 font-bold text-sm text-greyColor-grey700 bg-subColor-orange050 border-b border-subColor-orange100 border-r border-greyColor-grey200';

  const tableCellClasses =
    'py-3 px-4 text-sm text-greyColor-grey800 border-b border-greyColor-grey200 border-r border-greyColor-grey200';

  if (isLoading) {
    return <p className="py-10 text-center text-greyColor-grey500">재고 목록을 불러오는 중...</p>;
  }

  return (
    <div className="h-auto w-[1040px] overflow-x-auto border border-greyColor-grey200">
      <table className="min-w-full divide-y divide-greyColor-grey200">
        <thead className="bg-subColor-orange050">
          <tr>
            <th className={`${tableHeaderClasses} text-left`}>재고 번호</th>
            <th className={`${tableHeaderClasses} text-left`}>품목명</th>
            <th className={`${tableHeaderClasses} text-left`}>수량</th>
            <th className={`${tableHeaderClasses} text-left`}>품목 가격</th>
            <th className={`${tableHeaderClasses} text-left`}>위치</th>
            <th className={`${tableHeaderClasses} text-left`}>최근 입고일</th>
            <th className={`${tableHeaderClasses} border-r-0 text-left`}>생성일</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-greyColor-grey200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className={`${tableCellClasses} border-r-0 text-center text-greyColor-grey500`}
              >
                해당 재고 목록이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((stock) => (
              <tr
                key={stock.id}
                className="cursor-pointer transition duration-150 hover:bg-mainColor-blue050"
                onClick={() => handleRowClick(stock.inventoryNumber)}
              >
                <td className={`${tableCellClasses} font-mono`}>{stock.inventoryNumber}</td>
                <td className={tableCellClasses}>{stock.itemName}</td>
                <td className={tableCellClasses}>{stock.quantity}</td>
                <td className={tableCellClasses}>{stock.itemPrice}</td>
                <td className={tableCellClasses}>{stock.location}</td>
                <td className={tableCellClasses}>{stock.recentInboundDate}</td>
                <td className={`${tableCellClasses} border-r-0`}>{stock.creationDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
