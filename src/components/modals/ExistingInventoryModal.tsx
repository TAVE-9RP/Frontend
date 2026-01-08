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

const MOCK_INVENTORY_DATA: InventoryItem[] = [];

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

        <div className="mt-[40px] max-h-[300px] w-full overflow-y-auto overflow-x-hidden">
          {MOCK_INVENTORY_DATA.length === 0 ? (
            <div className="w-full overflow-hidden rounded-[10px] border-[2px] border-greyColor-grey200">
              <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
                <div className="w-[40px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  선택
                </div>
                <div className="w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  재고 번호
                </div>
                <div className="w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  물품명
                </div>
                <div className="w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  수량
                </div>
                <div className="w-[140px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  위치
                </div>
                <div className="w-[160px] flex h-full items-center justify-center font-pretendard text-[14px] font-bold text-black">
                  물품 가격
                </div>
              </div>
              <div className="flex h-[40px] items-center justify-center bg-white">
                <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-[10px] border-[2px] border-greyColor-grey200">
              <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
                <div className="w-[40px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  선택
                </div>
                <div className="w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  재고 번호
                </div>
                <div className="w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  물품명
                </div>
                <div className="w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  수량
                </div>
                <div className="w-[140px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                  위치
                </div>
                <div className="w-[160px] flex h-full items-center justify-center font-pretendard text-[14px] font-bold text-black">
                  물품 가격
                </div>
              </div>
              <div className="w-full bg-white">
                {MOCK_INVENTORY_DATA.map((item, index) => {
                  const isSelected = selectedIds.includes(item.id);
                  const isLastRow = index === MOCK_INVENTORY_DATA.length - 1;

                  return (
                    <div
                      key={item.id}
                      className={`flex h-[40px] items-center transition-colors ${isSelected ? 'bg-mainColor-blue050' : 'bg-white hover:bg-greyColor-grey50'}`}
                    >
                      <div
                        className={`w-[40px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
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
                      <div
                        className={`w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[15px] font-normal text-black ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.id}
                      </div>
                      <div
                        className={`w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[15px] font-normal text-black ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.name}
                      </div>
                      <div
                        className={`w-[160px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[15px] font-normal text-black ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.quantity}
                      </div>
                      <div
                        className={`w-[140px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[15px] font-normal text-black ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.location}
                      </div>
                      <div
                        className={`w-[160px] flex h-full items-center justify-center font-pretendard text-[15px] font-normal text-black ${!isLastRow ? 'border-b-[2px]' : ''}`}
                      >
                        {item.price.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
            disabled={MOCK_INVENTORY_DATA.length === 0 || selectedIds.length === 0}
            className={`h-[50px] w-[113px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-all ${
              MOCK_INVENTORY_DATA.length === 0 || selectedIds.length === 0
                ? 'cursor-not-allowed bg-greyColor-grey300'
                : 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
            }`}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
