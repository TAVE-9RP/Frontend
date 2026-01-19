import React from 'react';

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

  const isCenterMode =
    message.includes('아이디와 비밀번호를 확인해주세요') ||
    message.includes('요청 데이터 검증 실패') ||
    message.includes('회원가입이 완료되었습니다.') ||
    message.includes('서버 내부 오류') ||
    message.includes('데이터 중복');

  return (
    <div
      className={`fixed bottom-0 right-0 top-0 z-[9999] flex items-center justify-center bg-black/50 ${
        isCenterMode ? 'left-0' : 'left-[220px]'
      }`}
      onClick={onClose}
    >
      <div
        className="flex min-h-[180px] w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
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
    </div>
  );
};

export default AlertModal;
