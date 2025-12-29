import React from 'react';
import nextIcon from '../../assets/next.png';

interface StatusChipProps {
  label: string;
  isActive: boolean;
}

const StatusChip: React.FC<StatusChipProps> = ({ label, isActive }) => {
  return (
    <div
      className={`flex h-[36px] min-w-[68px] items-center justify-center whitespace-nowrap rounded-full px-[10px] text-[12px] transition-all ${
        isActive
          ? 'bg-subColor-orange500 font-bold text-white'
          : 'border border-greyColor-grey300 bg-white font-normal text-greyColor-grey300'
      } `}
    >
      {label}
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
            <img src={nextIcon} alt="next" className="h-[24px] w-[32px] object-contain" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
