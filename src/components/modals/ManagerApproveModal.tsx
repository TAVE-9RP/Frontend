import React, { useState, useEffect } from 'react';
import { getAdminInfo } from '@/apis/admin';

interface ManagerApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variant?: 'default' | 'request';
  managerName?: string;
  closeOnBackdropClick?: boolean;
  onReject?: () => void;
}

const ManagerApprovalModal: React.FC<ManagerApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  variant = 'default',
  managerName: initialManagerName,
  closeOnBackdropClick = true,
  onReject,
}) => {
  const [fetchedAdminName, setFetchedAdminName] = useState<string>('');

  useEffect(() => {
    const fetchAdmin = async () => {
      if (isOpen && variant === 'request') {
        try {
          const response = await getAdminInfo();
          if (response.isSuccess && response.result && response.result.length > 0) {
            setFetchedAdminName(response.result[0].adminName);
          }
        } catch (error) {
          console.error('관리자 정보 조회 실패:', error);
          setFetchedAdminName('정보 없음');
        }
      }
    };

    fetchAdmin();
  }, [isOpen, variant]);

  if (!isOpen) return null;

  const isRequestMode = variant === 'request';

  const displayManagerName = isRequestMode
    ? fetchedAdminName || '...'
    : initialManagerName || '관리자';

  const content = {
    title: isRequestMode ? `승인 관리자: ${displayManagerName}` : '관리자 결재를 진행하시겠습니까?',
    description: isRequestMode
      ? '확인을 누르면 관리자에게 승인 요청이 전달돼요'
      : '승인 시 업무 상태가 진행 중으로 변경돼요',
    cancelLabel: isRequestMode ? '취소' : '거절',
    confirmLabel: isRequestMode ? '확인' : '승인',
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        className="flex h-[230px] w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[32px]">
          <img
            src="/images/manager_approval.png"
            alt="승인 아이콘"
            className="h-[33.25px] w-[33.25px]"
          />
        </div>

        <p className="mt-[10.28px] text-center font-pretendard text-[19px] font-bold leading-normal text-black">
          {content.title}
        </p>

        <p className="mt-[10.28px] text-center font-pretendard text-[13px] font-normal leading-normal text-greyColor-grey500">
          {content.description}
        </p>

        <div className="mt-[34.45px] flex gap-[17px]">
          <button
            type="button"
            onClick={onReject || onClose}
            className="flex h-[34px] w-[70px] cursor-pointer items-center justify-center rounded-[5px] border border-greyColor-grey300 bg-greyColor-grey50 font-pretendard text-[17px] font-bold leading-normal text-greyColor-grey500 transition-colors hover:bg-greyColor-grey100"
          >
            {content.cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[34px] w-[70px] cursor-pointer items-center justify-center rounded-[5px] bg-mainColor-blue600 font-pretendard text-[15px] font-bold leading-normal text-white transition-colors hover:bg-mainColor-blue700"
          >
            {content.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerApprovalModal;
