import React from 'react';
import CHECKMARK_ICON_SRC from '../../assets/projectcheckmark.png';

interface PermissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PermissionSuccessModal: React.FC<PermissionSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex h-[230px] w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
        <div className="mt-[32px]">
          <img src={CHECKMARK_ICON_SRC} alt="완료 아이콘" className="h-[30px] w-[30px]" />
        </div>
        <p className="mt-[10.28px] text-center font-pretendard text-[19px] font-bold text-black">
          저장 완료
        </p>
        <p className="mt-[10.28px] text-center font-pretendard text-[13px] font-normal text-greyColor-grey500">
          직원 권한 설정이 저장되었어요
        </p>
        <div className="mt-[34.45px]">
          <button
            onClick={onClose}
            className="flex h-[34px] w-[70px] items-center justify-center rounded-[5px] bg-mainColor-blue600 font-pretendard text-[17px] font-bold text-white hover:bg-mainColor-blue700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionSuccessModal;
