import React from 'react';
import nextIcon from '../../assets/next.png';

interface StatusChipProps {
  label: string;
  isActive: boolean;
}

const StatusChip: React.FC<StatusChipProps> = ({ label, isActive }) => {
  return (
    <div
      className={`flex items-center justify-center gap-[10px] whitespace-nowrap rounded-[100px] px-[10px] py-[10px] transition-all ${
        isActive
          ? 'bg-subColor-orange800 text-white'
          : 'border border-greyColor-grey300 bg-white text-greyColor-grey300'
      }`}
    >
      <span
        className={`font-pretendard text-[13px] leading-normal ${isActive ? 'font-bold' : 'font-bold'}`}
      >
        {label}
      </span>
    </div>
  );
};

interface StatusStepBarProps {
  currentStatus: string;
  type?: 'inbound' | 'outbound';
}

export default function StatusStepBar({ currentStatus, type = 'inbound' }: StatusStepBarProps) {
  const finalLabel = type === 'outbound' ? '출하 완료' : '입고 완료';

  const STATUS_STEPS = [
    { id: 'TASK_ASSIGNMENT', label: '업무 할당' },
    { id: 'APPROVAL_PENDING', label: '승인 대기' },
    { id: 'IN_PROGRESS', label: '진행 중' },
    { id: 'COMPLETED', label: finalLabel },
  ];

  return (
    <div className="flex items-center gap-[4px]">
      {STATUS_STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <StatusChip label={step.label} isActive={currentStatus === step.id} />
          {index < STATUS_STEPS.length - 1 && (
            <img src={nextIcon} alt="next" className="h-[23px] w-[15px] object-contain" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
