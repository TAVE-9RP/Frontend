import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import BasicInput from '@/components/common/BasicInput';
import AlertModal from './AlertModal';
import { createItem } from '@/apis/item';

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
      console.log('=== 신규 재고 추가 API 호출 ===');
      const response = await createItem({
        code: formData.id,
        name: formData.name,
        location: formData.location,
        price: Number(formData.price),
      });

      if (response.isSuccess) {
        setFormData({ id: '', name: '', location: '', price: '' });
        onClose();
      } else {
        const msg = response.message || '신규 재고 추가에 실패했습니다.';
        setAlertModal({ isOpen: true, message: msg });
      }
    } catch (error: any) {
      console.error('신규 재고 추가 실패:', error);

      const errorMsg = error?.response?.data?.message || error?.message || '';
      const status = error?.response?.status;

      if (status === 403 || errorMsg.includes('권한')) {
        setAlertModal({
          isOpen: true,
          message: '해당 업무에 대한 접근 권한이 없습니다.',
        });
      } else {
        setAlertModal({
          isOpen: true,
          message: `신규 재고 추가 실패: ${errorMsg || '알 수 없는 오류가 발생했습니다.'}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50">
      <div
        className="relative h-[545px] w-[95vw] max-w-[981px] rounded-[20px] bg-white p-[40px] shadow-xl md:p-[64px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-pretendard text-[24px] font-bold text-black">신규 재고 추가</h2>
        <button
          onClick={onClose}
          className="absolute right-[30px] top-[30px] text-[30px] text-greyColor-grey600 hover:text-black md:right-[50px] md:top-[50px]"
        >
          ✕
        </button>

        <div className="mt-[48px] grid grid-cols-1 gap-x-[32px] gap-y-[32px] md:grid-cols-2">
          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">재고 번호</label>
            <BasicInput
              placeholder="내용 입력"
              className="h-[50px] w-full max-w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">물품명</label>
            <BasicInput
              placeholder="내용 입력"
              className="h-[50px] w-full max-w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">위치</label>
            <BasicInput
              placeholder="내용 입력"
              className="h-[50px] w-full max-w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[15px]">
            <label className="font-pretendard text-[19px] font-bold text-black">물품 가격</label>
            <BasicInput
              type="number"
              placeholder="내용 입력"
              className="h-[50px] w-full max-w-[390px] text-[17px] text-greyColor-grey800"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
            />
          </div>
        </div>

        <div className="absolute bottom-[40px] right-[40px] md:bottom-[64px] md:right-[64px]">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`flex h-[50px] w-[113px] items-center justify-center rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-all ${
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
    </div>,
    document.body,
  );
}
