import React, { useState, useEffect } from 'react';
import BasicInput from '@/components/common/BasicInput';
import AlertModal from './AlertModal';
import { createItem } from '@/apis/item';
import { addInventoryItems } from '@/apis/inventory';

interface NewInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newItem: any) => void;
  inventoryId: string;
}

export default function NewInventoryModal({
  isOpen,
  onClose,
  onAdd,
  inventoryId,
}: NewInventoryModalProps) {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: '',
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

  const isFormValid = Object.values(formData).every((val) => val.trim() !== '');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';

      setFormData({ id: '', name: '', location: '', price: '' });
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const createResponse = await createItem({
        code: formData.id,
        name: formData.name,
        location: formData.location,
        price: Number(formData.price),
      });

      if (createResponse.isSuccess) {
        const newId = createResponse.result.itemId;

        const addResponse = await addInventoryItems(inventoryId, [newId]);

        if (addResponse.isSuccess) {
          onAdd(addResponse.result);

          setFormData({ id: '', name: '', location: '', price: '' });
          onClose();
        } else {
          setAlertModal({ isOpen: true, message: '품목 목록 추가에 실패했습니다.' });
        }
      } else {
        setAlertModal({ isOpen: true, message: '신규 품목 생성에 실패했습니다.' });
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || '';
      if (errorMessage.includes('이미 존재하는') || error?.response?.status === 409) {
        setAlertModal({
          isOpen: true,
          message: '이미 등록된 재고 번호입니다.\n번호를 다시 확인한 후 입력해주세요.',
        });
      } else {
        setAlertModal({ isOpen: true, message: '처리 중 오류가 발생했습니다.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[9999] flex items-center justify-center bg-black/50">
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
            <label className="font-pretendard text-[19px] font-bold text-black">물품명</label>
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
            disabled={!isFormValid || isSubmitting}
            className={`flex h-[50px] w-[113px] items-center justify-center gap-[10px] rounded-[10px] px-[15px] py-[5px] font-pretendard text-[19px] font-bold text-white transition-all ${
              isFormValid && !isSubmitting
                ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                : 'cursor-not-allowed bg-greyColor-grey300'
            }`}
          >
            {isSubmitting ? '추가 중...' : '추가하기'}
          </button>
        </div>
      </div>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
}
