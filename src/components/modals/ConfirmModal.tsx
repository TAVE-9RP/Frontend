import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 top-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex h-[230px] w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[32px]">
          <img src="/images/questionmark.png" alt="질문 아이콘" className="h-[30px] w-[30px]" />
        </div>

        <p className="mt-[10.28px] text-center font-pretendard text-[19px] font-bold text-black">
          {title}
        </p>

        <p className="mt-[10.28px] text-center font-pretendard text-[13px] font-normal text-greyColor-grey500">
          {description}
        </p>

        <div className="mt-[34.45px] flex gap-[17px]">
          <button
            onClick={onClose}
            className="flex h-[34px] w-[70px] items-center justify-center rounded-[5px] border border-greyColor-grey300 bg-greyColor-grey50 font-pretendard text-[17px] font-bold text-greyColor-grey500 hover:bg-greyColor-grey100"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex h-[34px] w-[70px] items-center justify-center rounded-[5px] bg-mainColor-blue600 font-pretendard text-[15px] font-bold text-white hover:bg-mainColor-blue700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
