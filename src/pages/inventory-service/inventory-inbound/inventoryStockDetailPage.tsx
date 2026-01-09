import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import InventoryHistoryTable from '@/components/modals/InventoryHistoryTable';
import StockEditConfirmModal from '@/components/modals/StockEditConfirmModal';
import SuccessModal from '@/components/modals/SuccessModal';
import { getItems, getItemHistory } from '../../../apis/item';

const MOCK_INVENTORY_LIST = [
  {
    id: 1,
    inventoryNumber: '1111-1111',
    itemName: '애플망고',
    quantity: 1200,
    itemPrice: '1000',
    location: '위치입니다.',
    creationDate: '2025-10-25',
    targetQty: '2000',
    safetyQty: '500',
  },
  {
    id: 2,
    inventoryNumber: '1111-1112',
    itemName: '카피바라',
    quantity: 60000,
    itemPrice: '500000000',
    location: '위치입니다.',
    creationDate: '2025-10-25',
    targetQty: '70000',
    safetyQty: '10000',
  },
  {
    id: 3,
    inventoryNumber: '1111-4444',
    itemName: '초코우유',
    quantity: 1200,
    itemPrice: '1500',
    location: '위치입니다.',
    creationDate: '2025-10-25',
    targetQty: '1500',
    safetyQty: '300',
  },
  {
    id: 4,
    inventoryNumber: '1111-7777',
    itemName: '바나나',
    quantity: 1200,
    itemPrice: '가격입니다.',
    location: '위치입니다.',
    creationDate: '2025-10-25',
    targetQty: '1500',
    safetyQty: '200',
  },
  {
    id: 5,
    inventoryNumber: '1111-8885',
    itemName: '김부각',
    quantity: 1200,
    itemPrice: '가격입니다.',
    location: '위치입니다.',
    creationDate: '2025-10-25',
    targetQty: '1000',
    safetyQty: '100',
  },
];


const FormGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex w-[390px] flex-col">
    <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">{label}</label>
    {children}
  </div>
);

export default function InventoryStockDetailPage() {
  const { inventoryNumber } = useParams<{ inventoryNumber: string }>();

  const [inventoryDetail, setInventoryDetail] = useState<any>(null);
  const [isChanged, setIsChanged] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);

  const [isTargetChanged, setIsTargetChanged] = useState(false);
  const [isSafetyChanged, setIsSafetyChanged] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCompleteSuccessModalOpen, setIsCompleteSuccessModalOpen] = useState(false);

  // 날짜 포맷팅 함수 (ISO 형식에서 YYYY-MM-DD 형식으로)
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '-';
    const datePart = dateString.split('T')[0];
    return datePart || '-';
  };

  useEffect(() => {
    const fetchInventoryDetail = async () => {
      if (!inventoryNumber) return;

      try {
        // 재고 번호로 검색
        const response = await getItems(inventoryNumber);

        if (response.isSuccess && response.result) {
          const found = response.result.find((item: any) => item.code === inventoryNumber);

          if (found) {
            setInventoryDetail({
              id: found.itemId,
              inventoryNumber: found.code,
              itemName: found.name,
              quantity: found.quantity ?? 0,
              itemPrice: found.price ? String(found.price) : '-',
              location: found.location ?? '-',
              creationDate: found.createdAt ?? '-',
              targetQty: '-',
              safetyQty: '-',
            });

            // 입출고 이력 API 호출
            if (found.itemId) {
              try {
                const historyResponse = await getItemHistory(found.itemId);
                if (historyResponse.isSuccess && historyResponse.result) {
                  const mappedHistory = historyResponse.result.map((item: any) => ({
                    id: item.itemHistoryId,
                    type: item.taskType === 'INVENTORY' ? ('입고' as const) : ('출하' as const),
                    manager: item.memberName || '-',
                    date: formatDate(item.processedAt),
                    quantity: item.changeQuantity || 0,
                  }));
                  setHistoryData(mappedHistory);
                } else {
                  setHistoryData([]);
                }
              } catch (error) {
                console.error('입출고 이력 가져오기 실패:', error);
                setHistoryData([]);
              }
            }
          }
        }
      } catch (error) {
        console.error('재고 정보 가져오기 실패:', error);
        // API 실패 시 MOCK 데이터에서 찾기 (fallback)
        const found = MOCK_INVENTORY_LIST.find((item) => item.inventoryNumber === inventoryNumber);
        if (found) {
          setInventoryDetail(found);
        }
      }
    };

    fetchInventoryDetail();
  }, [inventoryNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventoryDetail((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'targetQty') setIsTargetChanged(true);
    if (name === 'safetyQty') setIsSafetyChanged(true);
    setIsChanged(true);
  };

  const handleApplyChange = (type: string) => {
    alert('변경되었습니다.');
    if (type === 'target') setIsTargetChanged(false);
    if (type === 'safety') setIsSafetyChanged(false);
  };

  const handleEditSubmit = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmEdit = () => {
    setIsConfirmModalOpen(false);
    setIsCompleteSuccessModalOpen(true);
    setIsChanged(false);
  };

  if (!inventoryDetail) {
    return (
      <div className="flex h-screen items-center justify-center">재고 데이터를 찾는 중...</div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />
      <main className="flex flex-1 justify-center pb-20 pt-[70px]">
        <div className="relative flex min-h-[1200px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-xl">
          <header>
            <h1 className="font-pretendard text-[24px] font-bold text-black">재고 상세</h1>
            <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
              내용 변경 시 자동으로 수정하기 버튼이 활성화됩니다.
            </p>
          </header>

          <div className="mt-[60px] flex flex-col gap-[60px]">
            <div className="flex justify-between">
              <FormGroup label="재고 번호">
                <BasicInput
                  name="inventoryNumber"
                  value={inventoryDetail.inventoryNumber}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup label="품목명">
                <BasicInput
                  name="itemName"
                  value={inventoryDetail.itemName}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>

            <div className="flex justify-between">
              <FormGroup label="수량">
                <BasicInput
                  name="quantity"
                  value={inventoryDetail.quantity}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup label="물품 가격">
                <BasicInput
                  name="itemPrice"
                  value={inventoryDetail.itemPrice}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>

            <div className="flex justify-between">
              <FormGroup label="위치">
                <BasicInput
                  name="location"
                  value={inventoryDetail.location}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup label="생성일">
                <BasicInput
                  name="creationDate"
                  value={inventoryDetail.creationDate}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>

            <div className="flex justify-between">
              <FormGroup label="현재 목표재고">
                <div className="flex items-end gap-[21px]">
                  <BasicInput
                    name="targetQty"
                    value={inventoryDetail.targetQty}
                    className="h-[50px] w-[275px]"
                    onChange={handleInputChange}
                  />
                  <button
                    onClick={() => handleApplyChange('target')}
                    className={`flex h-[50px] w-[60px] shrink-0 items-center justify-center rounded-[5px] text-[15px] font-bold transition-all ${
                      isTargetChanged
                        ? 'bg-mainColor-blue600 text-white'
                        : 'cursor-not-allowed bg-greyColor-grey300 text-white'
                    }`}
                  >
                    변경
                  </button>
                </div>
              </FormGroup>

              <FormGroup label="현재 안전재고">
                <div className="flex items-end gap-[21px]">
                  <BasicInput
                    name="safetyQty"
                    value={inventoryDetail.safetyQty}
                    className="h-[50px] w-[275px]"
                    onChange={handleInputChange}
                  />
                  <button
                    onClick={() => handleApplyChange('safety')}
                    className={`flex h-[50px] w-[60px] shrink-0 items-center justify-center rounded-[5px] text-[15px] font-bold transition-all ${
                      isSafetyChanged
                        ? 'bg-mainColor-blue600 text-white'
                        : 'cursor-not-allowed bg-greyColor-grey300 text-white'
                    }`}
                  >
                    변경
                  </button>
                </div>
              </FormGroup>
            </div>
          </div>

          <div className="mt-[80px]">
            <h2 className="mb-4 block font-pretendard text-[19px] font-bold text-black">
              입출고 이력
            </h2>
            <InventoryHistoryTable historyData={historyData} />
          </div>

          <div className="mt-auto flex justify-end pt-10">
            <button
              disabled={!isChanged}
              onClick={handleEditSubmit}
              className={`h-[50px] w-[113px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-all ${
                isChanged
                  ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                  : 'cursor-not-allowed bg-greyColor-grey300'
              }`}
            >
              수정하기
            </button>
          </div>
        </div>
      </main>
      <StockEditConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmEdit}
      />

      <SuccessModal
        isOpen={isCompleteSuccessModalOpen}
        onClose={() => setIsCompleteSuccessModalOpen(false)}
        title="수정 완료"
        description="수정사항이 저장되었어요"
      />
    </div>
  );
}
