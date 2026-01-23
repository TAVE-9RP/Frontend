import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import SearchBar from '@/components/common/SearchBar';
import AlertModal from './AlertModal';
import { getItems } from '@/apis/item';
import { addInventoryItems } from '@/apis/inventory';

interface InventoryItem {
  id: string;
  itemId: number;
  name: string;
  quantity: number;
  location: string;
  price: number;
}

interface ExistingInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (selectedItems: InventoryItem[]) => void;
  inventoryId?: string | number;
}

export default function ExistingInventoryModal({
  isOpen,
  onClose,
  onAdd,
  inventoryId,
}: ExistingInventoryModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

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

  useEffect(() => {
    const fetchItems = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const response = await getItems(searchTerm);
        if (response.isSuccess && response.result) {
          const mappedData: InventoryItem[] = response.result.map((item: any) => ({
            id: item.code,
            itemId: item.itemId,
            name: item.name,
            quantity: item.quantity,
            location: item.location,
            price: item.price,
          }));
          setInventoryData(mappedData);
        } else {
          setInventoryData([]);
        }
      } catch (error: any) {
        console.error('기존 재고 목록 가져오기 실패:', error);
        setInventoryData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [isOpen, searchTerm]);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIds([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative flex h-[609px] w-[95vw] max-w-[981px] flex-col rounded-[30px] bg-white p-[40px] shadow-xl md:p-[64px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            기존 재고 검색 및 추가
          </h2>
          <button
            onClick={onClose}
            className="absolute right-[30px] top-[30px] text-[30px] text-greyColor-grey600 hover:text-black md:right-[50px] md:top-[50px]"
          >
            ✕
          </button>
        </div>

        <div className="mt-[32px]">
          <SearchBar
            placeholder="재고 번호, 물품명, 위치를 검색하세요"
            className="h-[50px] w-full max-w-[520px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-[40px] max-h-[300px] w-full overflow-y-auto border-2 border-greyColor-grey200">
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <span className="font-pretendard text-[15px] text-greyColor-grey500">
                재고 목록을 불러오는 중...
              </span>
            </div>
          ) : (
            <table className="w-full table-fixed border-collapse font-pretendard">
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
                {inventoryData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="h-[40px] border-b-2 border-greyColor-grey200 text-center"
                    >
                      <span className="font-pretendard text-[14px] text-greyColor-grey400">
                        없음
                      </span>
                    </td>
                  </tr>
                ) : (
                  inventoryData.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id);
                    const isLastRow = index === inventoryData.length - 1;

                    return (
                      <tr
                        key={item.id}
                        className={`h-[40px] transition-colors ${isSelected ? 'bg-mainColor-blue050' : 'bg-white hover:bg-greyColor-grey50'}`}
                      >
                        <td
                          className={`border-r-2 border-greyColor-grey200 text-center ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleCheckboxChange(item.id)}
                              className="flex h-10 w-10 items-center justify-center"
                            >
                              <img
                                src={isSelected ? '/images/checkbox_check.png' : '/images/checkbox.png'}
                                alt="checkbox"
                                className="h-5 w-5 object-contain"
                              />
                            </button>
                          </div>
                        </td>
                        <td
                          className={`border-r-2 border-greyColor-grey200 ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          <div className="scrollbar-hide max-w-[160px] overflow-x-auto whitespace-nowrap px-4">
                            {item.id}
                          </div>
                        </td>
                        <td
                          className={`border-r-2 border-greyColor-grey200 ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          <div className="scrollbar-hide max-w-[160px] overflow-x-auto whitespace-nowrap px-4">
                            {item.name}
                          </div>
                        </td>
                        <td
                          className={`border-r-2 border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          {item.quantity}
                        </td>
                        <td
                          className={`border-r-2 border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          {item.location}
                        </td>
                        <td
                          className={`border-greyColor-grey200 px-4 ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          {item.price.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex-1" />

        <div className="mt-[40px] flex justify-end">
          <button
            onClick={async () => {
              if (!inventoryId) {
                setAlertModal({ isOpen: true, message: '입고 업무 ID가 없습니다.' });
                return;
              }
              const selectedItems = inventoryData.filter((item) => selectedIds.includes(item.id));
              if (selectedItems.length === 0) {
                setAlertModal({ isOpen: true, message: '추가할 재고를 선택해주세요.' });
                return;
              }
              setIsAdding(true);
              try {
                const itemIds = selectedItems.map((item) => item.itemId);
                const response = await addInventoryItems(inventoryId, itemIds);
                if (response.isSuccess) {
                  onAdd(selectedItems);
                  setSelectedIds([]);
                  onClose();
                } else {
                  setAlertModal({ isOpen: true, message: '재고 추가에 실패했습니다.' });
                }
              } catch (error: any) {
                setAlertModal({
                  isOpen: true,
                  message: `재고 추가 실패: ${error?.response?.data?.message || '오류가 발생했습니다.'}`,
                });
              } finally {
                setIsAdding(false);
              }
            }}
            disabled={inventoryData.length === 0 || selectedIds.length === 0 || isAdding}
            className={`h-[50px] w-[113px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-all ${
              inventoryData.length === 0 || selectedIds.length === 0 || isAdding
                ? 'cursor-not-allowed bg-greyColor-grey300'
                : 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
            }`}
          >
            {isAdding ? '추가 중...' : '추가하기'}
          </button>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />

    </div>,
    document.body,
  );
}