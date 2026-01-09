import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import InventoryStockListTable from '../../../components/common/InventoryStockListTable';
import { getItems } from '../../../apis/item';

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

  // null 값을 "-"로 변환하는 헬퍼 함수
  const formatNullValue = (value: string | null | undefined): string => {
    return value ?? '-';
  };

  // API에서 데이터 가져오기
  const fetchStock = async () => {
    setIsLoading(true);
    try {
      // 검색어가 있으면 keyword로 전달, 없으면 공백으로 전달
      const keyword = searchTerm.trim();
      const response = await getItems(keyword);
      
      if (response.isSuccess && response.result) {
        // API 응답을 InventoryStock 형식으로 변환
        const mappedStocks: InventoryStock[] = response.result.map((item: any) => ({
          id: item.itemId,
          inventoryNumber: formatNullValue(item.code),
          itemName: formatNullValue(item.name),
          quantity: item.quantity ?? 0,
          itemPrice: item.price ? String(item.price) : '-',
          location: formatNullValue(item.location),
          recentInboundDate: formatNullValue(item.receivedAt),
          creationDate: formatNullValue(item.createdAt),
        }));

        setStockList(mappedStocks);
      } else {
        setStockList([]);
      }
    } catch (error) {
      console.error('재고 목록 가져오기 실패:', error);
      setStockList([]);
    } finally {
      setIsLoading(false);
    }
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
