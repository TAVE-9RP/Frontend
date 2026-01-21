import React from 'react';
import { createPortal } from 'react-dom';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, message, title = '알림' }) => {
  if (!isOpen) return null;

  let displayMessage = message;
  if (message.includes('데이터 중복')) {
    displayMessage = '이미 존재하는 아이디 또는 이메일입니다.';
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="flex min-h-[180px] w-[90vw] max-w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="mt-[32px] text-center font-pretendard text-[19px] font-bold text-black">
          {title}
        </p>

        <p className="mt-[10.28px] whitespace-pre-line px-8 text-center font-pretendard text-[13px] font-normal text-greyColor-grey500">
          {displayMessage}
        </p>

        <div className="mb-[32px] mt-[34.45px]">
          <button
            onClick={onClose}
            className="flex h-[34px] w-[70px] items-center justify-center rounded-[5px] bg-mainColor-blue600 font-pretendard text-[17px] font-bold text-white hover:bg-mainColor-blue700"
          >
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AlertModal;
