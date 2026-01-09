import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import InventoryStockListTable from '../../../components/common/InventoryStockListTable';

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

export default function InventoryStockListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockList, setStockList] = useState<InventoryStock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // TODO: API 연동 시 사용할 함수
  const fetchStock = () => {
    setIsLoading(true);

    // API 연동 전까지 빈 배열로 설정
    setTimeout(() => {
      setStockList([]);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchStock();
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex-1 pb-20 pl-[70px] pt-[60px]">
        <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
          재고 조회
        </h1>

        <div className="mt-[60px] w-[1040px]">
          <SearchBar
            placeholder="재고 번호 또는 품목명을 입력하세요."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="mt-[29px] pr-10">
          <InventoryStockListTable data={stockList} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
