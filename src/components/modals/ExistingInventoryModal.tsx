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
        console.log('=== 기존 재고 목록 API 호출 ===');
        console.log('keyword:', searchTerm);
        const response = await getItems(searchTerm);
        console.log('=== 기존 재고 목록 API 응답 ===');
        console.log('응답:', response);

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
          console.log('=== 매핑된 데이터 ===');
          console.log('mappedData:', mappedData);
        } else {
          setInventoryData([]);
        }
      } catch (error: any) {
        console.error('기존 재고 목록 가져오기 실패:', error);
        console.error('에러 응답:', error?.response?.data);
        console.error('에러 상태 코드:', error?.response?.status);
        console.error('에러 메시지:', error?.message);
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

        <div className="mt-[40px] max-h-[300px] w-full overflow-y-auto overflow-x-hidden border-2 border-greyColor-grey200">
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <span className="font-pretendard text-[15px] text-greyColor-grey500">
                재고 목록을 불러오는 중...
              </span>
            </div>
          ) : (
            <table className="w-full border-collapse font-pretendard">
              <thead className="sticky top-0 z-10 bg-greyColor-grey100">
                <tr className="h-[40px] text-[15px] font-bold text-black">
                  <th className="w-[40px] text-nowrap border-b-2 border-r-2 border-greyColor-grey200 text-center">
                    선택
                  </th>
                  <th className="w-[160px] text-nowrap border-b-2 border-r-2 border-greyColor-grey200 px-4 text-left overflow-hidden">
                    <div className="overflow-x-auto px-2">
                      재고 번호
                    </div>
                  </th>
                  <th className="w-[160px] text-nowrap border-b-2 border-r-2 border-greyColor-grey200 overflow-hidden text-left">
                    <div className="overflow-x-auto px-2">
                      물품명
                    </div>
                  </th>
                  <th className="w-[160px] text-nowrap border-b-2 border-r-2 border-greyColor-grey200 px-4 text-left">
                    수량
                  </th>
                  <th className="w-[140px] text-nowrap border-b-2 border-r-2 border-greyColor-grey200 px-4 text-left">
                    위치
                  </th>
                  <th className="w-[160px] text-nowrap border-b-2 border-greyColor-grey200 px-4 text-left">
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
                          className={`w-[40px] border-r-2 border-greyColor-grey200 text-center ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleCheckboxChange(item.id)}
                              className="flex h-10 w-10 items-center justify-center"
                            >
                              <img
                                src={
                                  isSelected ? '/images/checkbox_check.png' : '/images/checkbox.png'
                                }
                                alt="checkbox"
                                className="h-5 w-5 object-contain"
                              />
                            </button>
                          </div>
                        </td>
                        <td
                          className={`w-[160px] border-r-2 border-greyColor-grey200 overflow-hidden ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          <div className="overflow-x-auto max-w-[160px] px-2">
                            {item.id}
                          </div>
                        </td>
                        <td
                          className={`w-[160px] border-r-2 border-greyColor-grey200 overflow-hidden ${!isLastRow ? 'border-b-2' : ''}`}
                        >
                          <div className="overflow-x-auto max-w-[160px] px-2">
                            {item.name}
                          </div>
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
                console.log('=== 재고 추가 API 호출 ===');
                console.log('inventoryId:', inventoryId);
                const itemIds = selectedItems.map((item) => item.itemId);
                console.log('itemIds:', itemIds);

                const response = await addInventoryItems(inventoryId, itemIds);
                console.log('=== 재고 추가 API 응답 ===');
                console.log('응답:', response);

                if (response.isSuccess) {
                  console.log('재고 추가 성공:', response.result);
                  onAdd(selectedItems);
                  setSelectedIds([]);
                  onClose();
                } else {
                  setAlertModal({ isOpen: true, message: '재고 추가에 실패했습니다.' });
                }
              } catch (error: any) {
                console.error('재고 추가 실패:', error);
                console.error('에러 응답:', error?.response?.data);

                const errorMessage = error?.response?.data?.message || error?.message || '';
                const errorStatus = error?.response?.status;

                if (
                  errorStatus === 403 ||
                  errorMessage.includes('접근 권한') ||
                  errorMessage.includes('권한이 없음') ||
                  errorMessage.includes('해당 업무에 접근')
                ) {
                  setAlertModal({
                    isOpen: true,
                    message: '해당 업무에 대한 접근 권한이 없습니다.',
                  });
                } else {
                  setAlertModal({
                    isOpen: true,
                    message: `재고 추가 실패: ${errorMessage || '알 수 없는 오류가 발생했습니다.'}`,
                  });
                }
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
