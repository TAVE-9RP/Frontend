import React from 'react';

interface ProjectSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: 'create' | 'edit';
}

const ProjectSuccessModal: React.FC<ProjectSuccessModalProps> = ({
  isOpen,
  onClose,
  type = 'create',
}) => {
  if (!isOpen) return null;

  const isEdit = type === 'edit';
  const titleText = isEdit ? '변경 완료' : '프로젝트 생성 완료';
  const subText = isEdit
    ? '프로젝트의 수정사항이 저장되었어요'
    : '담당자에게 업무가 자동으로 할당되었어요';

  return (
    <div className="fixed bottom-0 left-[220px] right-0 top-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="flex h-[230px] w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[32px]">
          <img src="/images/projectcheckmark.png" alt="완료 아이콘" className="h-[30px] w-[30px]" />
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
            className="flex h-[34px] w-[162px] cursor-pointer items-center justify-center rounded-[5px] bg-mainColor-blue600 px-[20px] py-[7px] font-pretendard text-[17px] font-bold leading-normal text-white transition-colors hover:bg-mainColor-blue700"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSuccessModal;
