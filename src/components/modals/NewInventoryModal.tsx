import React, { useState, useEffect } from 'react';
import BasicInput from '@/components/common/BasicInput';

interface NewInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: any) => void;
}

export default function NewInventoryModal({ isOpen, onClose, onAdd }: NewInventoryModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    price: '',
  });

  const isFormValid = Object.values(formData).every((val) => val.trim() !== '');

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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    onAdd({
      ...formData,
      price: Number(formData.price),
      inboundQty: 0,
      currentQty: 0,
      targetQty: 0,
      status: '미진행',
    });
    setFormData({ id: '', name: '', location: '', price: '' }); // 초기화
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative h-[545px] w-[981px] rounded-[20px] bg-white p-[64px] shadow-xl">
        <h2 className="font-pretendard text-[24px] font-bold text-black">신규 재고 추가</h2>
        <button
          onClick={onClose}
          className="absolute right-[50px] top-[50px] text-[30px] text-greyColor-grey600"
        >
          ✕
        </button>

        <div className="mt-[48px] grid grid-cols-2 gap-x-[32px] gap-y-[32px]">
          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">재고 번호</label>
            <BasicInput
              placeholder="내용 입력"
              className="h-[50px] w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">품목명</label>
            <BasicInput
              placeholder="내용 입력"
              className="h-[50px] w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">위치</label>
            <BasicInput
              placeholder="내용 입력"
              className="h-[50px] w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">물품 가격</label>
            <BasicInput
              type="number"
              placeholder="내용 입력"
              className="h-[50px] w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>
        </div>

        <div className="absolute bottom-[64px] right-[64px]">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={`flex h-[50px] w-[113px] items-center justify-center gap-[10px] rounded-[10px] px-[15px] py-[5px] font-pretendard text-[19px] font-bold text-white transition-all ${isFormValid ? 'bg-mainColor-blue600' : 'cursor-not-allowed bg-greyColor-grey300'} `}
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
