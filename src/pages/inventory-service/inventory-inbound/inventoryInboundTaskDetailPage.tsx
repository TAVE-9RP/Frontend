import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';
import ManagerChip from '@/components/common/ManagerChip';
import ExistingInventoryModal from '@/components/modals/ExistingInventoryModal';
import NewInventoryModal from '@/components/modals/NewInventoryModal';
import ManagerApprovalModal from '@/components/modals/ManagerApproveModal';

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

const FormGroup: React.FC<{
  label: string;
  children: React.ReactNode;
  className?: string;
}> = ({ label, children, className = '' }) => (
  <div className={className}>
    <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">{label}</label>
    <div className="mt-4">{children}</div>
  </div>
);

export default function InventoryInboundTaskDetailPage() {
  const { projectNumber } = useParams<{ projectNumber: string }>();
  const navigate = useNavigate();

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);

  const [taskDetail, setTaskDetail] = useState({
    projectNumber: '',
    taskName: '',
    manager: '',
    requestDate: '',
    description: '',
    status: '',
  });

  const [items, setItems] = useState<InboundItem[]>(MOCK_ITEMS);
  const [isLoading, setIsLoading] = useState(false);

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const handleAddNewInventory = (newItem: InboundItem) => {
    setItems((prev) => [...prev, newItem]);
    setIsNewModalOpen(false);
  };

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const handleFinalConfirm = () => {
    console.log('관리자에게 승인 요청 전송됨', taskDetail);
    alert('승인 요청이 전달되었습니다.');
    setIsApprovalModalOpen(false);
  };

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

  const handleAddInventoryItems = (selectedItems: any[]) => {
    const newItems: InboundItem[] = selectedItems.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      inboundQty: 0,
      currentQty: item.quantity,
      targetQty: 0,
      status: '미진행',
    }));

    setItems((prev) => {
      const existingIds = new Set(prev.map((i) => i.id));
      const filteredNewItems = newItems.filter((i) => !existingIds.has(i.id));
      return [...prev, ...filteredNewItems];
    });

    setIsInventoryModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-20 pt-[70px]">
        <div className="relative flex min-h-[1200px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-xl">
          <h1 className="font-pretendard text-[24px] font-bold text-black">입고 업무 상세</h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
            요청일: {taskDetail.requestDate.replace(/-/g, '.')}
          </p>

          <div className="mt-[70px]">
            <div className="mb-[70px] flex justify-between">
              <FormGroup label="진행 상태" className="w-fit">
                <StatusStepBar currentStatus={taskDetail.status} type="inbound" />
              </FormGroup>

              <FormGroup label="프로젝트 넘버" className="w-[390px]">
                <BasicInput
                  value={taskDetail.projectNumber}
                  readOnly
                  disabled
                  className="bg-greyColor-grey100 text-greyColor-grey400"
                />
              </FormGroup>
            </div>

            <div className="mb-[64px] flex justify-between">
              <FormGroup label="입고 업무명" className="w-[390px]">
                <BasicInput
                  name="taskName"
                  value={taskDetail.taskName}
                  onChange={handleInputChange}
                  placeholder="업무명을 입력해주세요"
                />
              </FormGroup>

              <FormGroup label="입고 업무 담당자" className="w-[390px]">
                <div className="flex h-[50px] w-[390px] items-center gap-[10px] rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-[16px] py-[15px]">
                  {taskDetail.manager && taskDetail.manager !== '-' ? (
                    <ManagerChip name={taskDetail.manager} />
                  ) : (
                    <span className="font-pretendard text-[17px] text-greyColor-grey500">-</span>
                  )}
                </div>
              </FormGroup>
            </div>

            <FormGroup label="업무 설명" className="mb-[40px]">
              <LargeInput
                name="description"
                value={taskDetail.description}
                onChange={handleInputChange}
                className="h-[160px]"
                placeholder="상세 설명을 입력해주세요"
              />
            </FormGroup>

            <div className="mt-[80px]">
              <div className="mb-[36px] flex items-center justify-between">
                <h2 className="font-pretendard text-[19px] font-bold text-black">입고 물품 목록</h2>
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => setIsInventoryModalOpen(true)}
                    className="flex h-[37px] w-[117px] items-center justify-center rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 font-pretendard text-[15px] font-bold text-greyColor-grey600 transition-all hover:bg-greyColor-grey200"
                  >
                    기존 재고 추가
                  </button>
                  <ExistingInventoryModal
                    isOpen={isInventoryModalOpen}
                    onClose={() => setIsInventoryModalOpen(false)}
                    onAdd={handleAddInventoryItems}
                  />
                  <button
                    onClick={() => setIsNewModalOpen(true)}
                    className="flex h-[37px] w-[117px] items-center justify-center rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 font-pretendard text-[15px] font-bold text-greyColor-grey600 transition-all hover:bg-greyColor-grey200"
                  >
                    신규 재고 추가
                  </button>
                </div>
              </div>

              <InboundItemTable items={items} isLoading={isLoading} />
            </div>
          </div>

          <NewInventoryModal
            isOpen={isNewModalOpen}
            onClose={() => setIsNewModalOpen(false)}
            onAdd={handleAddNewInventory}
          />

          <div className="mt-auto flex justify-end pt-10">
            <button
              className="h-[54px] w-[140px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white"
              onClick={() => setIsApprovalModalOpen(true)}
            >
              승인요청
            </button>
          </div>
          <ManagerApprovalModal
            isOpen={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            onConfirm={handleFinalConfirm}
            variant="request"
            managerName={taskDetail.manager}
          />
        </div>
      </main>
    </div>
  );
}
