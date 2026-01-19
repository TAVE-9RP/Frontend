import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface InventoryItem {
  itemId: number;
  code: string;
  name: string;
  quantity: number;
  price: number;
  location: string;
}

interface InventorySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedItems: InventoryItem[]) => void;
}

const InventorySearchModal: React.FC<InventorySearchModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchInventoryData();
    } else {
      document.body.style.overflow = 'unset';
      setSearchTerm('');
      setSelectedIds([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchInventoryData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');

      const response = await axios.get('https://nexerp.site/items', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.isSuccess) {
        setInventory(response.data.result);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null;

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative flex h-[609px] w-[981px] flex-col rounded-[30px] bg-white p-[64px] shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            재고 검색 및 추가
          </h2>
          <button
            onClick={onClose}
            className="absolute right-[50px] top-[50px] text-[30px] text-greyColor-grey600 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-[32px]">
          <div className="relative h-[50px] w-[520px]">
            <input
              type="text"
              placeholder="재고 번호, 물품명, 위치 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-full w-full rounded-[10px] border border-greyColor-grey300 px-[20px] font-pretendard text-[16px] outline-none focus:border-mainColor-blue600"
            />
          </div>
        </div>

        <div className="mt-[40px] max-h-[300px] w-full overflow-y-auto border-[2px] border-greyColor-grey200">
          <table className="w-full border-collapse text-center font-pretendard">
            <thead className="sticky top-0 z-10 bg-greyColor-grey100">
              <tr className="h-[40px] text-[14px] font-bold text-black">
                <th className="w-[40px] border-b-[2px] border-r-[2px] border-greyColor-grey200">
                  선택
                </th>
                <th className="w-[160px] border-b-[2px] border-r-[2px] border-greyColor-grey200">
                  재고 번호
                </th>
                <th className="w-[160px] border-b-[2px] border-r-[2px] border-greyColor-grey200">
                  물품명
                </th>
                <th className="w-[160px] border-b-[2px] border-r-[2px] border-greyColor-grey200">
                  수량
                </th>
                <th className="w-[160px] border-b-[2px]">물품 가격</th>
              </tr>
            </thead>
            <tbody className="bg-white text-[14px] font-normal text-black">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="h-[40px]">
                    데이터 로딩 중...
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="h-[40px]">
                    재고 데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item, index) => {
                  const isSelected = selectedIds.includes(item.itemId);
                  const isLastRow = index === filteredInventory.length - 1;
                  return (
                    <tr
                      key={item.itemId}
                      className={`h-[40px] ${isSelected ? 'bg-mainColor-blue050' : 'hover:bg-greyColor-grey50'}`}
                    >
                      <td
                        className={`border-r-[2px] border-greyColor-grey200 ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        <button
                          onClick={() => handleCheckboxChange(item.itemId)}
                          className="flex w-full items-center justify-center"
                        >
                          <img
                            src={isSelected ? '/images/checkbox_check.png' : '/images/checkbox.png'}
                            className="h-[19.5px] w-[19.5px]"
                            alt="checkbox"
                          />
                        </button>
                      </td>
                      <td
                        className={`border-r-[2px] border-greyColor-grey200 ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.code}
                      </td>
                      <td
                        className={`border-r-[2px] border-greyColor-grey200 ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.name}
                      </td>
                      <td
                        className={`border-r-[2px] border-greyColor-grey200 ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.quantity}
                      </td>
                      <td className={`${!isLastRow ? 'border-b-[2px]' : ''}`}>
                        {item.price.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex-1" />
        <div className="mt-[40px] flex justify-end">
          <button
            onClick={() => {
              const itemsToAdd = inventory.filter((item) => selectedIds.includes(item.itemId));
              onAdd(itemsToAdd);
              onClose();
            }}
            className="h-[50px] w-[120px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white shadow-md hover:bg-mainColor-blue700"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventorySearchModal;
