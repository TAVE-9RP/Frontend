import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';

const MOCK_DATA = [
  {
    projectNumber: 'SYS-01-001',
    taskName: '카피바라랜드',
    manager: '박하은동생',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'TASK_ASSIGNMENT',
  },
  {
    projectNumber: 'SYS-01-002',
    taskName: '강아지아메리카노',
    manager: '박카스',
    requestDate: '2025-10-26',
    description: '강아지 전용 무카페인 원두 수입 물량 상세 설명입니다.',
    status: 'APPROVAL_PENDING',
  },
  {
    projectNumber: 'SYS-01-003',
    taskName: '업무명입니다.',
    manager: '이영희',
    requestDate: '2025-10-27',
    description: '정기 샘플 입고 확인 및 창고 적재 업무입니다.',
    status: 'IN_PROGRESS',
  },
  {
    projectNumber: 'SYS-01-004',
    taskName: '-',
    manager: '-',
    requestDate: '-',
    description: '업무할당',
    status: 'TASK_ASSIGNMENT',
  },
  {
    projectNumber: 'SYS-01-005',
    taskName: '타코퀘사디아',
    manager: '박카피바라',
    requestDate: '2025-10-27',
    description: '정기 샘플 입고 확인 및 창고 적재 업무입니다.',
    status: 'COMPLETED',
  },
  {
    projectNumber: 'SYS-01-006',
    taskName: '고구마이쮸',
    manager: '탔구마',
    requestDate: '2025-10-27',
    description: '정기 샘플 입고 확인 및 창고 적재 업무입니다.',
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

export default function InboundTaskDetailPage() {
  const { projectNumber } = useParams<{ projectNumber: string }>();
  const navigate = useNavigate();

  const [taskDetail, setTaskDetail] = useState({
    projectNumber: '',
    taskName: '',
    manager: '',
    requestDate: '',
    description: '',
    status: '',
  });

  useEffect(() => {
    const found = MOCK_DATA.find((item) => item.projectNumber === projectNumber);

    if (found) {
      setTaskDetail(found);
    } else {
      setTaskDetail({
        projectNumber: projectNumber || '',
        taskName: '데이터 없음',
        manager: '-',
        requestDate: '-',
        description: '해당 프로젝트를 찾을 수 없습니다.',
        status: '',
      });
    }
  }, [projectNumber]);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div className="relative flex min-h-[1000px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-[0_0_10px_rgba(0,0,0,0.10)]">
          <button
            onClick={handleClose}
            className="absolute right-[50px] top-[50px] text-[30px] text-greyColor-grey600"
          >
            ✕
          </button>
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            입고 업무 상세
          </h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal leading-normal text-greyColor-grey600">
            선택한 입고 업무의 상세 정보를 볼 수 있어요.
          </p>

          <div className="mt-[3px] flex-1"></div>
          <div className="mt-[60px] flex-1">
            <div className="mb-[60px]">
              <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">
                진행 상태
              </label>
              <StatusStepBar currentStatus={taskDetail.status} type="inbound" />
            </div>

            <div className="mb-[60px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="프로젝트 넘버">
                  <BasicInput
                    value={taskDetail.projectNumber}
                    disabled={true}
                    readOnly
                    className="text-greyColor-grey400"
                  />
                </FormGroup>
              </div>

              <div className="w-[390px]">
                <FormGroup label="입고 업무명">
                  <BasicInput value={taskDetail.taskName} disabled={false} readOnly />
                </FormGroup>
              </div>
            </div>

            <div className="mb-[60px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="입고 업무 담당자">
                  <BasicInput value={taskDetail.manager} readOnly />
                </FormGroup>
              </div>

              <div className="w-[390px]">
                <FormGroup label="요청일">
                  <BasicInput value={taskDetail.requestDate} readOnly />
                </FormGroup>
              </div>
            </div>

            <div className="mb-[80px]">
              <FormGroup label="업무 설명">
                <LargeInput value={taskDetail.description} readOnly className="h-[240px]" />
              </FormGroup>
            </div>
          </div>

          <div className="mt-auto flex justify-end">
            <button
              disabled={taskDetail.status !== 'APPROVAL_PENDING'}
              onClick={() => {
                if (taskDetail.status === 'APPROVAL_PENDING') alert('승인 처리되었습니다.');
              }}
              className={`flex h-[50px] w-[113px] items-center justify-center gap-[10px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors duration-300 ${
                taskDetail.status === 'APPROVAL_PENDING'
                  ? 'cursor-pointer bg-mainColor-blue600'
                  : 'cursor-default bg-greyColor-grey300'
              } `}
            >
              승인 처리
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
