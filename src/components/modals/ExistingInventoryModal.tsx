import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/common/SearchBar';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  location: string;
  price: number;
}

interface ExistingInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedItems: InventoryItem[]) => void;
}

const MOCK_INVENTORY_DATA: InventoryItem[] = [
  { id: 'INV-001', name: '카피바라 인형', quantity: 100, location: 'A-1 창고', price: 15000 },
  { id: 'INV-002', name: '애플망고', quantity: 50, location: 'B-3 냉동고', price: 20000 },
  { id: 'INV-003', name: '강아지 간식', quantity: 200, location: 'C-2 선반', price: 5000 },
];

export default function ExistingInventoryModal({
  isOpen,
  onClose,
  onAdd,
}: ExistingInventoryModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative flex h-[609px] w-[981px] flex-col rounded-[30px] bg-white p-[64px] shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            기존 재고 검색 및 추가
          </h2>
          <button
            onClick={onClose}
            className="absolute right-[50px] top-[50px] text-[30px] text-greyColor-grey600 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-[32px]">
          <SearchBar placeholder="이름, 부서, 직급 검색" className="h-[50px] w-[520px]" />
        </div>

        <div className="mt-[40px] max-h-[300px] w-full overflow-y-auto overflow-x-hidden border-2 border-greyColor-grey200">
          <table className="w-full border-collapse font-pretendard">
            <thead className="sticky top-0 z-10 bg-greyColor-grey100">
              <tr className="h-[40px] text-[15px] font-bold text-black">
                <th className="w-[40px] border-b-2 border-r-2 border-greyColor-grey200 text-center">
                  선택
                </th>
                <th className="w-[160px] border-b-2 border-r-2 border-greyColor-grey200 px-4 text-left">
                  재고 번호
                </th>
                <th className="w-[160px] border-b-2 border-r-2 border-greyColor-grey200 px-4 text-left">
                  물품명
                </th>
                <th className="w-[160px] border-b-2 border-r-2 border-greyColor-grey200 px-4 text-left">
                  수량
                </th>
                <th className="w-[140px] border-b-2 border-r-2 border-greyColor-grey200 px-4 text-left">
                  위치
                </th>
                <th className="w-[160px] border-b-2 border-greyColor-grey200 px-4 text-left">
                  물품 가격
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-[15px] font-normal text-black">
              {MOCK_INVENTORY_DATA.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const isLastRow = index === MOCK_INVENTORY_DATA.length - 1;

                return (
                  <tr
                    key={item.id}
                    className={`h-[40px] transition-colors ${isSelected ? 'bg-mainColor-blue050' : 'bg-white hover:bg-greyColor-grey50'}`}
                  >
                    <td
                      className={`w-[40px] border-r-2 border-greyColor-grey200 text-center ${!isLastRow ? 'border-b-2' : ''}`}
                    >
                      <div className="flex justify-center">
                        <button
                          onClick={() => handleCheckboxChange(item.id)}
                          className="flex h-10 w-10 items-center justify-center"
                        >
                          <img
                            src={
                              isSelected
                                ? '/src/assets/checkbox_check.png'
                                : '/src/assets/checkbox.png'
                            }
                            alt="checkbox"
                            className="h-5 w-5 object-contain"
                          />
                        </button>
                      </div>
                    </td>
                    <td
                      className={`w-[160px] border-r-2 border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                    >
                      {item.id}
                    </td>
                    <td
                      className={`w-[160px] border-r-2 border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                    >
                      {item.name}
                    </td>
                    <td
                      className={`w-[160px] border-r-2 border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                    >
                      {item.quantity}
                    </td>
                    <td
                      className={`w-[140px] border-r-2 border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                    >
                      {item.location}
                    </td>
                    <td
                      className={`w-[160px] border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                    >
                      {item.price.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex-1" />

        <div className="mt-[40px] flex justify-end">
          <button
            onClick={() => {
              const selectedItems = MOCK_INVENTORY_DATA.filter((item) =>
                selectedIds.includes(item.id),
              );

              onAdd(selectedItems);

              setSelectedIds([]);
            }}
            className="h-[50px] w-[113px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white transition-all hover:bg-mainColor-blue700"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
