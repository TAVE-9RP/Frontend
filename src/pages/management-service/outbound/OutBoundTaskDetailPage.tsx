import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';
import ManagerChip from '@/components/common/ManagerChip';
import ManagerApprovalModal from '@/components/modals/ManagerApproveModal';
import ApproveModal from '@/components/modals/ApproveModal';

const MOCK_DATA_OUTBOUND = [
  {
    projectNumber: 'SYS-01-001',
    taskName: '강아지 껌 대량 출고',
    manager: '강아껌',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'APPROVAL_PENDING',
  },
  {
    projectNumber: 'SYS-01-002',
    taskName: '밥주세요',
    manager: '홍길동',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'APPROVAL_PENDING',
  },
  {
    projectNumber: 'SYS-01-003',
    taskName: '쫀득쿠키',
    manager: '김쫀득',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    projectNumber: 'SYS-01-004',
    taskName: '두쫀쿠',
    manager: '두바이',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'COMPLETED',
  },
  {
    projectNumber: 'SYS-01-005',
    taskName: '얼망고',
    manager: '망고짱',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'TASK_ASSIGNMENT',
  },
  {
    projectNumber: 'SYS-01-006',
    taskName: '업무명입니다.',
    manager: '홍길동',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    projectNumber: 'SYS-01-007',
    taskName: '포테이토피자',
    manager: '박하은',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    projectNumber: 'SYS-01-008',
    taskName: '페퍼로니피자',
    manager: '피자최고',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'TASK_ASSIGNMENT',
  },
];

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">{label}</label>
    <div className="mt-[16px]">{children}</div>
  </div>
);

export default function OutboundTaskDetailPage() {
  const { projectNumber } = useParams<{ projectNumber: string }>();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusType, setStatusType] = useState<'approve' | 'cancel'>('approve');

  const [taskDetail, setTaskDetail] = useState({
    projectNumber: '',
    taskName: '',
    manager: '',
    requestDate: '',
    vehicle: '',
    carrier: '',
    description: '',
    status: '',
  });

  useEffect(() => {
    const found = MOCK_DATA_OUTBOUND.find((item) => item.projectNumber === projectNumber);
    if (found) {
      setTaskDetail(found);
    }
  }, [projectNumber]);

  const handleConfirmApproval = () => {
    setIsModalOpen(false);
    setStatusType('approve');
    setIsStatusModalOpen(true);

    setTaskDetail((prev) => ({
      ...prev,
      status: 'IN_PROGRESS',
    }));
  };

  const handleRejectApproval = () => {
    setIsModalOpen(false);
    setStatusType('cancel');
    setIsStatusModalOpen(true);

    setTaskDetail((prev) => ({
      ...prev,
      status: 'TASK_ASSIGNMENT',
    }));
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div className="relative flex min-h-[1100px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-[0_0_10px_rgba(0,0,0,0.10)]">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            출하 업무 상세
          </h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal leading-normal text-greyColor-grey600">
            요청일: {taskDetail.requestDate.replace(/-/g, '.')}
          </p>

          <div className="mt-[70px] flex-1">
            <div className="mb-[64px] flex justify-between">
              <FormGroup label="진행 상태" className="w-fit">
                <StatusStepBar currentStatus={taskDetail.status} type="outbound" />
              </FormGroup>

              <FormGroup label="프로젝트 넘버" className="w-[390px]">
                <BasicInput
                  value={taskDetail.projectNumber}
                  disabled={true}
                  readOnly
                  className="text-greyColor-grey400"
                />
              </FormGroup>
            </div>

            <div className="mb-[64px] flex justify-between">
              <FormGroup label="출하 업무명" className="w-[390px]">
                <BasicInput value={taskDetail.taskName} disabled={true} readOnly />
              </FormGroup>

              <FormGroup label="출하 업무 담당자" className="w-[390px]">
                <div className="flex h-[50px] w-[390px] items-center gap-[10px] rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-[16px] py-[15px]">
                  {taskDetail.manager && taskDetail.manager !== '-' ? (
                    <ManagerChip name={taskDetail.manager} />
                  ) : (
                    <span className="font-pretendard text-[17px] text-greyColor-grey500">-</span>
                  )}
                </div>
              </FormGroup>
            </div>

            <div className="mb-[64px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="운송수단">
                  <BasicInput value={taskDetail.vehicle} disabled={true} readOnly />
                </FormGroup>
              </div>
              <div className="w-[390px]">
                <FormGroup label="운송업체">
                  <BasicInput value={taskDetail.carrier} disabled={true} readOnly />
                </FormGroup>
              </div>
            </div>

            <div className="mb-[40px]">
              <FormGroup label="업무 설명">
                <LargeInput
                  value={taskDetail.description}
                  disabled={true}
                  readOnly
                  className="h-[240px]"
                />
              </FormGroup>
            </div>
          </div>

          <div className="mt-auto flex justify-end">
            <button
              disabled={taskDetail.status !== 'APPROVAL_PENDING'}
              onClick={() => setIsModalOpen(true)}
              className={`flex h-[50px] w-[113px] items-center justify-center gap-[10px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors duration-300 ${
                taskDetail.status === 'APPROVAL_PENDING'
                  ? 'cursor-pointer bg-mainColor-blue600'
                  : 'cursor-default bg-greyColor-grey300'
              }`}
            >
              승인 처리
            </button>
          </div>
        </div>
      </main>

      <ManagerApprovalModal
        isOpen={isModalOpen}
        onClose={handleRejectApproval}
        onConfirm={handleConfirmApproval}
      />
      <ApproveModal
        isOpen={isStatusModalOpen}
        type={statusType}
        onClose={() => setIsStatusModalOpen(false)}
      />
    </div>
  );
}
