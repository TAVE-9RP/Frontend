import React, { useState, useEffect } from 'react';
import BasicInput from '@/components/common/BasicInput';
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

  const isFormValid = Object.values(formData).every((val) => val.trim() !== '');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // 모달이 닫힐 때 폼 초기화
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
      console.log('요청 데이터:', {
        code: formData.id,
        name: formData.name,
        location: formData.location,
        price: Number(formData.price),
      });

      const response = await createItem({
        code: formData.id,
        name: formData.name,
        location: formData.location,
        price: Number(formData.price),
      });

      console.log('=== 신규 재고 추가 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        console.log('신규 재고 추가 성공, itemId:', response.result?.itemId);
        // 성공 시 모달 닫기 (부모 컴포넌트에서 목록 새로고침 필요)
        setFormData({ id: '', name: '', location: '', price: '' });
        onClose();
      } else {
        alert('신규 재고 추가에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('신규 재고 추가 실패:', error);
      console.error('에러 응답:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 메시지:', error?.message);
      alert(
        `신규 재고 추가 실패: ${error?.response?.data?.message || error?.message || '알 수 없는 오류가 발생했습니다.'}`,
      );
    } finally {
      setIsSubmitting(false);
    }
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
    </div>
  );
}
