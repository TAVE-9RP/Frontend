import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';

import InboundItemTable, { InboundItem } from './inventoryInboundItemTable';

const MOCK_INBOUND_TASK_LIST = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    taskName: '재고서비스업무명',
    manager: '박하은',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'TASK_ASSIGNMENT',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    taskName: '엄뮤명',
    manager: '박카스',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'APPROVAL_PENDING',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    taskName: '에이씨밀란',
    manager: '박하사탕',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    projectNumber: 'SYS-01-004',
    taskName: '업무명입니다.',
    manager: '카피바라',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'COMPLETED',
  },
  {
    id: 5,
    projectNumber: 'SYS-01-005',
    taskName: '업무명입니다.',
    manager: '신지혜',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'TASK_ASSIGNMENT',
  },
  {
    id: 6,
    projectNumber: 'SYS-01-006',
    taskName: '업무명입니다.',
    manager: '이희원',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    id: 7,
    projectNumber: 'SYS-01-007',
    taskName: '업무명입니다.',
    manager: '짱구',
    requestDate: '2025-10-25',
    description: '카피바라랜드 프로젝트 관련 애플망고 입고 건입니다.',
    status: 'IN_PROGRESS',
  },
];

const MOCK_ITEMS: InboundItem[] = [
  {
    id: 'INV-2025-001',
    name: '카피바라',
    price: 15000,
    inboundQty: '-',
    currentQty: '-',
    targetQty: 100,
    status: '완료',
  },
  {
    id: 'INV-2025-002',
    name: '꿀수박',
    price: 20000,
    inboundQty: '-',
    currentQty: '-',
    targetQty: 50,
    status: '미진행',
  },
];

const labelStyle: React.CSSProperties = {
  fontFamily: 'Pretendard',
  fontSize: '19px',
  fontWeight: 700,
  color: '#000',
};

const FormGroup: React.FC<{ label: string; children: React.ReactNode; marginBottom?: string }> = ({
  label,
  children,
  marginBottom = '0px',
}) => (
  <div style={{ marginBottom }}>
    <label style={{ ...labelStyle, display: 'block', marginBottom: '16px' }}>{label}</label>
    {children}
  </div>
);

export default function InventoryInboundTaskDetailPage() {
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

  const [items, setItems] = useState<InboundItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const foundData = MOCK_INBOUND_TASK_LIST.find((item) => item.projectNumber === projectNumber);
    if (foundData) setTaskDetail(foundData);

    setIsLoading(true);
    setTimeout(() => {
      setItems(MOCK_ITEMS);
      setIsLoading(false);
    }, 500);
  }, [projectNumber]);

  const handleClose = () => navigate(-1);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-20 pt-[70px]">
        <div
          className="relative flex flex-col shadow-xl"
          style={{
            width: '967px',
            minHeight: '1200px',
            borderRadius: '30px',
            background: '#FFF',
            padding: '78px',
          }}
        >
          <button
            onClick={handleClose}
            className="absolute right-[50px] top-[50px] text-[30px] text-greyColor-grey600"
          >
            ✕
          </button>

          <h1 className="font-pretendard text-[24px] font-bold text-black">입고 업무 상세</h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
            내용 변경 시 자동으로 승인요청 버튼이 활성화됩니다.
          </p>

          <div className="mt-[60px]">
            <div className="flex justify-between" style={{ marginBottom: '60px' }}>
              <div className="w-[390px]">
                <FormGroup label="프로젝트 넘버">
                  <BasicInput
                    value={taskDetail.projectNumber}
                    readOnly
                    disabled
                    className="bg-greyColor-grey100 text-greyColor-grey400"
                  />
                </FormGroup>
              </div>
              <div className="w-[390px]">
                <FormGroup label="입고 업무명">
                  <BasicInput value={taskDetail.taskName} readOnly />
                </FormGroup>
              </div>
            </div>

            <FormGroup label="업무 설명" marginBottom="60px">
              <LargeInput value={taskDetail.description} readOnly style={{ height: '160px' }} />
            </FormGroup>

            <div className="flex justify-between" style={{ marginBottom: '60px' }}>
              <div className="w-[390px]">
                <FormGroup label="요청일">
                  <BasicInput value={taskDetail.requestDate} readOnly />
                </FormGroup>
              </div>
              <div className="w-[390px]">
                <FormGroup label="진행 상태">
                  <StatusStepBar currentStatus={taskDetail.status} type="inbound" />
                </FormGroup>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-[36px] flex items-center justify-between">
                <h2 style={labelStyle}>입고 물품 목록</h2>
                <div className="flex gap-[8px]">
                  <button className="flex h-[37px] w-[117px] items-center justify-center whitespace-nowrap rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 px-[8px] py-[5px] font-pretendard text-[15px] font-bold text-greyColor-grey600 transition-all hover:bg-greyColor-grey200">
                    기존 재고 추가
                  </button>

                  <button className="flex h-[37px] w-[117px] items-center justify-center whitespace-nowrap rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 px-[8px] py-[5px] font-pretendard text-[15px] font-bold text-greyColor-grey600 transition-all hover:bg-greyColor-grey200">
                    신규 재고 추가
                  </button>
                </div>
              </div>

              <InboundItemTable items={items} isLoading={isLoading} />
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-10">
            <button
              className="h-[54px] w-[140px] rounded-[10px] bg-greyColor-grey300 font-pretendard text-[19px] font-bold text-white transition-colors hover:bg-mainColor-blue600"
              onClick={() => alert('승인 요청되었습니다.')}
            >
              승인요청
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
