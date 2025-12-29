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

const MOCK_INVENTORY_LIST: InventoryStock[] = [
  {
    id: 1,
    inventoryNumber: '1111-1111',
    itemName: '애플망고',
    quantity: 1200,
    itemPrice: '1000',
    location: '위치입니다.',
    recentInboundDate: '2025-10-25',
    creationDate: '2025-10-25',
  },
  {
    id: 2,
    inventoryNumber: '1111-1112',
    itemName: '카피바라',
    quantity: 60000,
    itemPrice: '500000000',
    location: '위치입니다.',
    recentInboundDate: '2025-10-25',
    creationDate: '2025-10-25',
  },
  {
    id: 3,
    inventoryNumber: '1111-4444',
    itemName: '초코우유',
    quantity: 1200,
    itemPrice: '1500',
    location: '위치입니다.',
    recentInboundDate: '2025-10-25',
    creationDate: '2025-10-25',
  },
  {
    id: 4,
    inventoryNumber: '1111-7777',
    itemName: '바나나',
    quantity: 1200,
    itemPrice: '가격입니다.',
    location: '위치입니다.',
    recentInboundDate: '2025-10-25',
    creationDate: '2025-10-25',
  },
  {
    id: 5,
    inventoryNumber: '1111-8885',
    itemName: '김부각',
    quantity: 1200,
    itemPrice: '가격입니다.',
    location: '위치입니다.',
    recentInboundDate: '2025-10-25',
    creationDate: '2025-10-25',
  },
];

export default function InventoryStockListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockList, setStockList] = useState<InventoryStock[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchStock = () => {
    setIsLoading(true);

    setTimeout(() => {
      const filteredList = MOCK_INVENTORY_LIST.filter(
        (stock) =>
          stock.inventoryNumber.includes(searchTerm) || stock.itemName.includes(searchTerm),
      );

      setStockList(filteredList);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchStock();
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen w-full">
      <SideBar />

      <main className="flex-1 bg-white">
        <div className="mt-5 pl-[70px] pr-10 pt-10">
          <div className="mb-[24px] mt-12 w-[1040px]">
            <SearchBar
              placeholder="재고 번호 또는 품목명을 입력하세요."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="pl-[70px] pr-10">
          <InventoryStockListTable data={stockList} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
