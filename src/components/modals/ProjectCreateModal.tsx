import React from 'react';

const QUESTION_ICON_SRC = 'src/assets/questionmark.png';

interface ProjectCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ProjectCreateModal: React.FC<ProjectCreateModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="flex h-[230px] w-[450px] flex-col items-center rounded-[20px] bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mt-[32px]">
          <img src={QUESTION_ICON_SRC} alt="질문 아이콘" className="h-[30px] w-[30px]" />
        </div>

        <p className="mt-[10.28px] text-center font-pretendard text-[19px] font-bold leading-normal text-black">
          새 프로젝트를 생성하시겠습니까?
        </p>

        <p className="mt-[10.28px] text-center font-pretendard text-[13px] font-normal leading-normal text-greyColor-grey500">
          입력한 내용으로 새로운 프로젝트를 저장할게요
        </p>

        <div className="mt-[34.45px] flex gap-[17px]">
          <button
            onClick={onClose}
            className="flex h-[34px] w-[70px] cursor-pointer items-center justify-center rounded-[5px] border border-greyColor-grey300 bg-greyColor-grey50 font-pretendard text-[17px] font-bold leading-normal text-greyColor-grey500 transition-colors hover:bg-greyColor-grey100"
          >
            취소
          </button>

          <button
            onClick={onConfirm}
            className="flex h-[32px] w-[72px] cursor-pointer items-center justify-center rounded-[5px] bg-mainColor-blue600 font-pretendard text-[15px] font-bold leading-normal text-white transition-colors hover:bg-mainColor-blue700"
          >
            생성하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCreateModal;
