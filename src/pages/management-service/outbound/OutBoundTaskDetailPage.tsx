import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';

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
    {children}
  </div>
);

export default function OutboundTaskDetailPage() {
  const { projectNumber } = useParams<{ projectNumber: string }>();
  const navigate = useNavigate();

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
    } else {
      setTaskDetail({
        projectNumber: projectNumber || '',
        taskName: '데이터 없음',
        manager: '-',
        requestDate: '-',
        vehicle: '-',
        carrier: '-',
        description: '해당 출하 프로젝트를 찾을 수 없습니다.',
        status: '',
      });
    }
  }, [projectNumber]);

  const handleClose = () => navigate(-1);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div className="relative flex min-h-[1100px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-[0_0_10px_rgba(0,0,0,0.10)]">
          <button
            onClick={handleClose}
            className="absolute right-[50px] top-[50px] text-[30px] text-greyColor-grey600"
          >
            ✕
          </button>

          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            출하 업무 상세
          </h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal leading-normal text-greyColor-grey600">
            선택한 출하 업무의 상세 정보를 볼 수 있어요.
          </p>

          <div className="mt-[60px] flex-1">
            <div className="mb-[60px]">
              <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">
                진행 상태
              </label>
              <StatusStepBar currentStatus={taskDetail.status} type="outbound" />
            </div>

            <div className="mb-[60px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="프로젝트 넘버">
                  <BasicInput
                    value={taskDetail.projectNumber}
                    readOnly
                    disabled={true}
                    className="text-greyColor-grey400"
                  />
                </FormGroup>
              </div>
              <div className="w-[390px]">
                <FormGroup label="출하 업무명">
                  <BasicInput value={taskDetail.taskName} readOnly />
                </FormGroup>
              </div>
            </div>

            <div className="mb-[60px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="출하 업무 담당자">
                  <BasicInput value={taskDetail.manager} readOnly />
                </FormGroup>
              </div>
              <div className="w-[390px]">
                <FormGroup label="요청일">
                  <BasicInput value={taskDetail.requestDate} readOnly />
                </FormGroup>
              </div>
            </div>

            <div className="mb-[60px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="운송수단">
                  <BasicInput value={taskDetail.vehicle} readOnly />
                </FormGroup>
              </div>
              <div className="w-[390px]">
                <FormGroup label="운송업체">
                  <BasicInput value={taskDetail.carrier} readOnly />
                </FormGroup>
              </div>
            </div>

            <div className="mb-[40px]">
              <FormGroup label="업무 설명">
                <LargeInput value={taskDetail.description} readOnly className="h-[240px]" />
              </FormGroup>
            </div>
          </div>

          <div className="mt-auto flex justify-end">
            <button
              disabled={taskDetail.status !== 'APPROVAL_PENDING'}
              onClick={() => {
                if (taskDetail.status === 'APPROVAL_PENDING') alert('출하 승인 처리되었습니다.');
              }}
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
    </div>
  );
}
