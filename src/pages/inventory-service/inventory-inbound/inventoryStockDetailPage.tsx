import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';

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

const SmallChangeButton = () => (
  <button className="flex h-[50px] w-[60px] items-center justify-center rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 text-[15px] font-bold text-greyColor-grey600 transition-all hover:bg-greyColor-grey200">
    변경
  </button>
);

export default function InventoryStockDetailPage() {
  const { inventoryNumber } = useParams<{ inventoryNumber: string }>();

  const [inventoryDetail, setInventoryDetail] = useState<any>(null);

  useEffect(() => {
    const found = MOCK_INVENTORY_LIST.find((item) => item.inventoryNumber === inventoryNumber);
    if (found) {
      setInventoryDetail(found);
    }
  }, [inventoryNumber]);

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
                  value={inventoryDetail.inventoryNumber}
                  readOnly
                  className="bg-greyColor-grey100 text-greyColor-grey400"
                />
              </FormGroup>
              <FormGroup label="품목명">
                <BasicInput value={inventoryDetail.itemName} />
              </FormGroup>
            </div>

            <div className="flex justify-between">
              <FormGroup label="수량">
                <BasicInput value={inventoryDetail.quantity} />
              </FormGroup>
              <FormGroup label="물품 가격">
                <BasicInput value={inventoryDetail.itemPrice} />
              </FormGroup>
            </div>

            <div className="flex justify-between">
              <FormGroup label="위치">
                <BasicInput value={inventoryDetail.location} />
              </FormGroup>
              <FormGroup label="생성일">
                <BasicInput value={inventoryDetail.creationDate} />
              </FormGroup>
            </div>

            <div className="flex justify-between">
              <FormGroup label="현재 목표재고">
                <div className="flex gap-[10px]">
                  <BasicInput value={inventoryDetail.targetQty} className="flex-1" />
                  <SmallChangeButton />
                </div>
              </FormGroup>
              <FormGroup label="현재 안전재고">
                <div className="flex gap-[10px]">
                  <BasicInput value={inventoryDetail.safetyQty} className="flex-1" />
                  <button className="flex h-[50px] w-[60px] items-center justify-center rounded-[5px] bg-mainColor-blue600 text-[15px] font-bold text-white transition-all hover:bg-mainColor-blue700">
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
            <div className="flex h-[200px] w-full items-center justify-center border-y border-greyColor-grey200 bg-white text-greyColor-grey400">
              이력 데이터가 없습니다.
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-10">
            <button className="h-[54px] w-[140px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white transition-all hover:bg-mainColor-blue700">
              수정하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
