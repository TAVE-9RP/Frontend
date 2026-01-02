import React, { useState, useEffect } from 'react';
import checkboxImg from '@/assets/checkbox.png';
import checkboxCheckImg from '@/assets/checkbox_check.png';

export interface InventoryItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface InventorySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedItems: InventoryItem[]) => void;
}

const InventorySearchModal: React.FC<InventorySearchModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [mockInventory] = useState<InventoryItem[]>([
    { id: 'INV-001', name: '카피바라 인형', qty: 100, price: 15000 },
    { id: 'INV-002', name: '애플망고', qty: 50, price: 20000 },
    { id: 'INV-003', name: '강아지 간식', qty: 200, price: 5000 },
  ]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="relative flex h-[609px] w-[981px] flex-col rounded-[30px] bg-white p-[64px] shadow-xl">
        <div className="flex items-start justify-between">
          <h2 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            재고 검색 및 추가
          </h2>
          <button
            onClick={onClose}
            className="absolute right-[50px] top-[50px] text-[30px] text-greyColor-grey600 transition-colors hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-[32px]">
          <div className="relative h-[50px] w-[520px]">
            <input
              type="text"
              placeholder="이름, 부서, 직급 검색"
              className="h-full w-full rounded-[10px] border border-greyColor-grey300 px-[20px] font-pretendard text-[16px] outline-none focus:border-mainColor-blue600"
            />
          </div>
        </div>

        <div className="mt-[40px] max-h-[300px] w-full overflow-y-auto border-[2px] border-greyColor-grey200">
          <table className="w-full border-collapse font-pretendard">
            <thead className="sticky top-0 z-10 bg-greyColor-grey100">
              <tr className="h-[40px] text-[14px] font-bold text-black">
                <th className="w-[40px] border-b-[2px] border-r-[2px] border-greyColor-grey200 text-center">
                  선택
                </th>
                <th className="w-[160px] border-b-[2px] border-r-[2px] border-greyColor-grey200 px-4 text-center">
                  재고 번호
                </th>
                <th className="w-[160px] border-b-[2px] border-r-[2px] border-greyColor-grey200 px-4 text-center">
                  물품명
                </th>
                <th className="w-[160px] border-b-[2px] border-r-[2px] border-greyColor-grey200 px-4 text-center">
                  수량
                </th>
                <th className="w-[160px] border-b-[2px] border-greyColor-grey200 px-4 text-center">
                  물품 가격
                </th>
              </tr>
            </thead>
            <tbody className="bg-white text-[14px] font-normal text-black">
              {mockInventory.map((item, index) => {
                const isSelected = selectedIds.includes(item.id);
                const isLastRow = index === mockInventory.length - 1;

                return (
                  <tr
                    key={item.id}
                    className={`h-[40px] transition-colors ${
                      isSelected ? 'bg-mainColor-blue050' : 'bg-white hover:bg-greyColor-grey50'
                    }`}
                  >
                    <td
                      className={`w-[40px] border-r-[2px] border-greyColor-grey200 text-center ${
                        !isLastRow ? 'border-b-[2px]' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleCheckboxChange(item.id)}
                          className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center"
                        >
                          <img
                            src={isSelected ? checkboxCheckImg : checkboxImg}
                            alt="checkbox"
                            className="h-[19.5px] w-[19.5px] object-contain"
                          />
                        </button>
                      </div>
                    </td>
                    <td
                      className={`w-[160px] border-r-[2px] border-greyColor-grey200 px-4 text-center ${
                        !isLastRow ? 'border-b-[2px]' : ''
                      }`}
                    >
                      {item.id}
                    </td>
                    <td
                      className={`w-[160px] border-r-[2px] border-greyColor-grey200 px-4 text-center ${
                        !isLastRow ? 'border-b-[2px]' : ''
                      }`}
                    >
                      {item.name}
                    </td>
                    <td
                      className={`w-[160px] border-r-[2px] border-greyColor-grey200 px-4 text-center ${
                        !isLastRow ? 'border-b-[2px]' : ''
                      }`}
                    >
                      {item.qty}
                    </td>
                    <td
                      className={`w-[160px] px-4 text-center ${!isLastRow ? 'border-b-[2px]' : ''}`}
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
              const itemsToAdd = mockInventory.filter((item) => selectedIds.includes(item.id));
              onAdd(itemsToAdd);
              setSelectedIds([]);
              onClose();
            }}
            className="h-[50px] w-[120px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white shadow-md transition-all hover:bg-mainColor-blue700"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventorySearchModal;
