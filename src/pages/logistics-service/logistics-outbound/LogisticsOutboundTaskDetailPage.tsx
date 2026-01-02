import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';
import ManagerChip from '@/components/common/ManagerChip';
import SuccessModal from '@/components/modals/SuccessModal';
import OutboundItemTable, { OutboundItem } from '@/components/common/OutboundItemTable';
import InventorySearchModal, { InventoryItem } from '@/components/modals/InventorySearchModal';
import ManagerApprovalModal from '@/components/modals/ManagerApproveModal';
import StockEditConfirmModal from '@/components/modals/StockEditConfirmModal';
import InboundConfirmModal from '@/components/modals/InboundConfirmModal';

const MOCK_ITEMS: OutboundItem[] = [
  {
    id: 'STK-001',
    name: '애플망고',
    outboundQty: '-',
    currentQty: '-',
    targetQty: 100,
    price: 15000,
    status: '미진행',
  },
  {
    id: 'STK-002',
    name: '카피바라 인형',
    outboundQty: '-',
    currentQty: '-',
    targetQty: 50,
    price: 25000,
    status: '미진행',
  },
];

const MOCK_OUTBOUND_TASK_LIST = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    taskName: '타코',
    items: '애플망고 외 3...',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박하은',
    status: 'TASK_ASSIGNMENT',
    description: '카피바라랜드 프로젝트 관련 물품 출하 건입니다.',
    transportType: '',
    transportCompany: '',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    taskName: '엄뮤명',
    items: '카피바라 300마리',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박카스',
    status: 'APPROVAL_PENDING',
    description: '카피바라랜드 프로젝트 관련 물품 출하 건입니다.',
    transportType: '',
    transportCompany: '',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    taskName: '에이씨밀란',
    items: 'ac milan',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박하사탕',
    status: 'IN_PROGRESS',
    description: '카피바라랜드 프로젝트 관련 물품 출하 건입니다.',
    transportType: '',
    transportCompany: '',
  },
];

const FormGroup: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = '',
}) => (
  <div className={className}>
    <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">{label}</label>
    <div className="mt-4">{children}</div>
  </div>
);

export default function LogisticsOutboundTaskDetailPage() {
  const { projectNumber } = useParams<{ projectNumber: string }>();
  const [taskDetail, setTaskDetail] = useState({
    projectNumber: '',
    taskName: '',
    manager: '',
    requestDate: '',
    description: '',
    status: '',
    transportType: '',
    transportCompany: '',
  });
  const [items, setItems] = useState<OutboundItem[]>(MOCK_ITEMS);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOutboundConfirmModalOpen, setIsOutboundConfirmModalOpen] = useState(false);
  const [isFinalCompleteModalOpen, setIsFinalCompleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successText, setSuccessText] = useState({ title: '', description: '' });

  const isApprovalPending = taskDetail.status === 'APPROVAL_PENDING';
  const isInProgress = taskDetail.status === 'IN_PROGRESS';
  const isCompleted = taskDetail.status === 'COMPLETED';
  const isAnythingSelected = selectedItemIds.length > 0;

  const isAllItemsCompleted = items.length > 0 && items.every((item) => item.status === '완료');

  useEffect(() => {
    const foundData = MOCK_OUTBOUND_TASK_LIST.find((item) => item.projectNumber === projectNumber);
    if (foundData) setTaskDetail(foundData);
  }, [projectNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTaskDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleOutboundConfirm = () => {
    setIsOutboundConfirmModalOpen(false);

    const processingIds = [...selectedItemIds];
    setItems((prev) =>
      prev.map((item) => (processingIds.includes(item.id) ? { ...item, status: '진행 중' } : item)),
    );
    setSelectedItemIds([]);

    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => (processingIds.includes(item.id) ? { ...item, status: '완료' } : item)),
      );
    }, 2000);

    setSuccessText({ title: '처리 완료', description: '출하 처리되었어요' });
    setTimeout(() => setIsSuccessModalOpen(true), 100);
  };

  const handleFinalCompleteConfirm = () => {
    setIsFinalCompleteModalOpen(false);
    setTaskDetail((prev) => ({ ...prev, status: 'COMPLETED' }));
    setSuccessText({ title: '처리 완료', description: '출하 처리가 완료되었습니다' });
    setTimeout(() => setIsSuccessModalOpen(true), 100);
  };

  const handleApprovalConfirm = () => {
    setIsApprovalModalOpen(false);
    setSuccessText({ title: '승인 요청 완료', description: '관리자에게 승인 요청이 전달되었어요' });
    setTimeout(() => setIsSuccessModalOpen(true), 100);
  };

  const handleEditConfirm = () => {
    setIsEditModalOpen(false);
    setSuccessText({ title: '수정 완료', description: '수정사항이 저장되었어요' });
    setTimeout(() => setIsSuccessModalOpen(true), 100);
  };

  const handleAddInventory = (selectedItems: InventoryItem[]) => {
    const newItems: OutboundItem[] = selectedItems.map((item) => ({
      id: item.id,
      name: item.name,
      outboundQty: '-',
      currentQty: '-',
      targetQty: item.qty,
      price: item.price,
      status: '미진행',
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />
      <main className="flex flex-1 justify-center pb-20 pt-[70px]">
        <div className="relative flex min-h-[1200px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-xl">
          <h1 className="font-pretendard text-[24px] font-bold text-black">출하 업무 상세</h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
            요청일: {taskDetail.requestDate.replace(/-/g, '.')}
          </p>

          <div className="mt-[70px]">
            <div className="mb-[70px] flex justify-between">
              <FormGroup label="진행 상태" className="w-fit">
                <StatusStepBar currentStatus={taskDetail.status} type="outbound" />
              </FormGroup>
              <FormGroup label="프로젝트 넘버" className="w-[390px]">
                <BasicInput
                  value={taskDetail.projectNumber}
                  readOnly
                  disabled
                  className="bg-greyColor-grey100"
                />
              </FormGroup>
            </div>

            <div className="mb-[64px] flex justify-between">
              <FormGroup label="출하 업무명" className="w-[390px]">
                <BasicInput
                  value={taskDetail.taskName}
                  readOnly
                  disabled
                  className="bg-greyColor-grey100"
                />
              </FormGroup>
              <FormGroup label="출하 업무 담당자" className="w-[390px]">
                <div className="flex h-[50px] items-center gap-[10px] rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-[16px]">
                  {taskDetail.manager ? <ManagerChip name={taskDetail.manager} /> : <span>-</span>}
                </div>
              </FormGroup>
            </div>

            <FormGroup label="업무 설명" className="mb-[64px]">
              <LargeInput
                value={taskDetail.description}
                readOnly
                disabled
                className="h-[160px] bg-greyColor-grey100"
              />
            </FormGroup>

            <div className="mb-[80px] flex items-center">
              <FormGroup label="운송수단" className="w-[390px]">
                <BasicInput
                  name="transportType"
                  value={taskDetail.transportType}
                  onChange={handleInputChange}
                  disabled={isInProgress || isCompleted}
                  className={isInProgress || isCompleted ? 'bg-greyColor-grey100' : ''}
                />
              </FormGroup>
              <FormGroup label="운송업체" className="ml-[32px] w-[390px]">
                <BasicInput
                  name="transportCompany"
                  value={taskDetail.transportCompany}
                  onChange={handleInputChange}
                  disabled={isInProgress || isCompleted}
                  className={isInProgress || isCompleted ? 'bg-greyColor-grey100' : ''}
                />
              </FormGroup>
            </div>

            <div className="mt-[80px]">
              <div className="mb-[36px] flex items-center justify-between">
                <h2 className="font-pretendard text-[19px] font-bold text-black">출하 물품 목록</h2>
                {!isInProgress && !isCompleted && (
                  <button
                    onClick={() => setIsInventoryModalOpen(true)}
                    className="flex h-[37px] w-[88px] items-center justify-center rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 font-pretendard text-[15px] font-bold text-greyColor-grey600 hover:bg-greyColor-grey200"
                  >
                    재고 추가
                  </button>
                )}
              </div>
              <OutboundItemTable
                items={items}
                selectedItemIds={selectedItemIds}
                onSelect={handleItemSelect}
                status={taskDetail.status}
              />
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-10">
            {isInProgress ? (
              isAllItemsCompleted ? (
                <button
                  onClick={() => setIsFinalCompleteModalOpen(true)}
                  className="h-[54px] w-[140px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white hover:bg-mainColor-blue700"
                >
                  출하 완료
                </button>
              ) : (
                <button
                  disabled={!isAnythingSelected}
                  onClick={() => setIsOutboundConfirmModalOpen(true)}
                  className={`h-[54px] w-[140px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors ${isAnythingSelected ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700' : 'cursor-not-allowed bg-greyColor-grey300'}`}
                >
                  출하 처리
                </button>
              )
            ) : isApprovalPending ? (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="h-[54px] w-[140px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white hover:bg-mainColor-blue700"
              >
                수정하기
              </button>
            ) : (
              !isCompleted && (
                <button
                  onClick={() => setIsApprovalModalOpen(true)}
                  className="h-[54px] w-[140px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white hover:bg-mainColor-blue700"
                >
                  승인요청
                </button>
              )
            )}
          </div>

          {/* 모달 */}
          <InventorySearchModal
            isOpen={isInventoryModalOpen}
            onClose={() => setIsInventoryModalOpen(false)}
            onAdd={handleAddInventory}
          />
          <StockEditConfirmModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onConfirm={handleEditConfirm}
          />
          <ManagerApprovalModal
            isOpen={isApprovalModalOpen}
            variant="request"
            managerName={taskDetail.manager}
            onClose={() => setIsApprovalModalOpen(false)}
            onConfirm={handleApprovalConfirm}
          />
          <InboundConfirmModal
            isOpen={isOutboundConfirmModalOpen}
            onClose={() => setIsOutboundConfirmModalOpen(false)}
            onConfirm={handleOutboundConfirm}
            title="출하 처리하시겠습니까?"
            subTitle="확인을 누르면 출하 처리가 진행돼요"
          />
          <InboundConfirmModal
            isOpen={isFinalCompleteModalOpen}
            onClose={() => setIsFinalCompleteModalOpen(false)}
            onConfirm={handleFinalCompleteConfirm}
            title="완료 처리하시겠습니까?"
            subTitle="확인을 누르면 출하 완료 처리가 진행돼요"
          />
          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            title={successText.title}
            description={successText.description}
          />
        </div>
      </main>
    </div>
  );
}
