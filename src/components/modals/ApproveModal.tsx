import React from 'react';

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'approve' | 'cancel';
}

const ApproveModal: React.FC<ApproveModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const isApprove = type === 'approve';

  const iconSrc = isApprove ? '/images/projectcheckmark.png' : '/images/approval_cancellation.png';
  const titleText = isApprove ? '승인 완료' : '승인 취소';
  const subText = isApprove
    ? "프로젝트의 진행 상태가 '진행 중'으로 변경되었어요"
    : "프로젝트의 진행 상태가 '업무 할당'으로 변경되었어요";

  return (
    <div className="fixed bottom-0 left-[220px] right-0 top-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="flex h-[230px] w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[32px]">
          <img src={iconSrc} alt="상태 아이콘" className="h-[30px] w-[30px]" />
        </div>

        <p className="mt-[10.28px] text-center font-pretendard text-[19px] font-bold leading-normal text-black">
          {titleText}
        </p>

        <p className="mt-[10.28px] text-center font-pretendard text-[13px] font-normal leading-normal text-greyColor-grey500">
          {subText}
        </p>

        <div className="mt-[34.45px]">
          <button
            onClick={onClose}
            className="flex h-[34px] w-[70px] cursor-pointer items-center justify-center rounded-[5px] bg-mainColor-blue600 font-pretendard text-[17px] font-bold leading-normal text-white transition-colors hover:bg-mainColor-blue700"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveModal;
