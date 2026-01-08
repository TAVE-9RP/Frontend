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
import SuccessModal from '@/components/modals/SuccessModal';
import InboundItemTable, { InboundItem } from './inventoryInboundItemTable';
import InboundConfirmModal from '@/components/modals/InboundConfirmModal';
import { getInventoryDetail } from '../../../apis/inventory';

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
];

const MOCK_ITEMS: InboundItem[] = [];

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

// null 값을 "-"로 변환하는 헬퍼 함수
const formatNullValue = (value: string | null | undefined): string => {
  return value ?? '-';
};

// API 응답의 inventoryAssignees 배열을 문자열로 변환
const formatAssignees = (assignees: string[] | null | undefined): string => {
  if (!assignees || assignees.length === 0) return '-';
  if (assignees.length === 1) return assignees[0];
  return `${assignees[0]} 외 ${assignees.length - 1}명`;
};

// API 응답의 inventoryStatus를 StatusStepBar가 기대하는 형식으로 매핑
const mapStatusForStepBar = (status: string): string => {
  switch (status) {
    case 'ASSIGNED':
      return 'TASK_ASSIGNMENT';
    case 'PENDING':
      return 'APPROVAL_PENDING';
    case 'REJECT':
      return 'APPROVAL_PENDING'; // REJECT는 StatusStepBar에 없으므로 APPROVAL_PENDING으로 매핑
    case 'IN_PROGRESS':
      return 'IN_PROGRESS';
    case 'COMPLETED':
      return 'COMPLETED';
    default:
      return 'TASK_ASSIGNMENT';
  }
};

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
  const [items, setItems] = useState<InboundItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isInboundConfirmModalOpen, setIsInboundConfirmModalOpen] = useState(false);
  const [isCompleteSuccessModalOpen, setIsCompleteSuccessModalOpen] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isFinalInbound, setIsFinalInbound] = useState(false);

  useEffect(() => {
    const fetchInventoryDetail = async () => {
      if (!projectNumber) return;

      setIsLoading(true);
      try {
        console.log('=== 입고 업무 상세 API 호출 ===');
        console.log('projectNumber:', projectNumber);
        const response = await getInventoryDetail(projectNumber);
        console.log('=== 입고 업무 상세 API 응답 ===');
        console.log('응답:', response);
        
        if (response.isSuccess && response.result) {
          const result = response.result;
          console.log('=== 응답 result ===');
          console.log('result:', result);
          setTaskDetail({
            projectNumber: formatNullValue(result.projectNumber),
            taskName: formatNullValue(result.inventoryTitle),
            manager: formatAssignees(result.inventoryAssignees),
            requestDate: formatNullValue(result.inventoryRequestedAt),
            description: formatNullValue(result.inventoryDescription),
            status: mapStatusForStepBar(result.inventoryStatus),
          });
        }
      } catch (error: any) {
        console.error('입고 업무 상세 정보 가져오기 실패:', error);
        console.error('에러 응답:', error?.response?.data);
        console.error('에러 상태 코드:', error?.response?.status);
        console.error('에러 메시지:', error?.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryDetail();
  }, [projectNumber]);

  const handleAddNewInventory = (newItem: InboundItem) => {
    setItems((prev) => [...prev, newItem]);
    setIsNewModalOpen(false);
  };

  const handleFinalConfirm = () => {
    setIsApprovalModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleInboundProcess = () => {
    if (selectedItemIds.length === 0) {
      alert('입고 처리할 물품을 선택해주세요.');
      return;
    }

    const remainingUnprocessed = items.filter(
      (item) => item.status !== '완료' && !selectedItemIds.includes(item.id),
    );

    const isAllDone = remainingUnprocessed.length === 0;
    setIsFinalInbound(isAllDone);
    setIsInboundConfirmModalOpen(true);
  };

  const handleInboundConfirm = () => {
    const nextItems = items.map((item) =>
      selectedItemIds.includes(item.id) ? { ...item, status: '완료' } : item,
    );

    setItems(nextItems);
    setSelectedItemIds([]);
    setIsInboundConfirmModalOpen(false);

    const isTaskFullyCompleted = nextItems.every((item) => item.status === '완료');

    if (isTaskFullyCompleted) {
      setTaskDetail((prev) => ({ ...prev, status: 'COMPLETED' }));
    }

    setIsCompleteSuccessModalOpen(true);
  };

  const isFullyDone = taskDetail.status === 'COMPLETED';

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
    setTaskDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemSelect = (id: string) => {
    const targetItem = items.find((item) => item.id === id);
    if (targetItem?.status === '완료') return;

    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isPending = taskDetail.status === 'APPROVAL_PENDING';
  const isInProgress = taskDetail.status === 'IN_PROGRESS';
  const isDisabled = isPending || isInProgress;

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />
      <main className="flex flex-1 justify-center pb-20 pt-[70px]">
        <div className="relative flex min-h-[1200px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-xl">
          <h1 className="font-pretendard text-[24px] font-bold text-black">입고 업무 상세</h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
            요청일: {taskDetail.requestDate !== '-' ? taskDetail.requestDate.replace(/-/g, '.') : '-'}
          </p>

          <div className="mt-[70px]">
            <div className="mb-[70px] flex justify-between">
              <FormGroup label="진행 상태" className="w-fit">
                <StatusStepBar currentStatus={taskDetail.status} type="inbound" />
              </FormGroup>
              <FormGroup label="프로젝트 넘버" className="w-[390px]">
                <BasicInput
                  value={taskDetail.projectNumber || '-'}
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
                  value={taskDetail.taskName || '-'}
                  onChange={handleInputChange}
                  placeholder="업무명을 입력해주세요"
                  readOnly={isDisabled}
                  disabled={isDisabled}
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
                value={taskDetail.description || '-'}
                onChange={handleInputChange}
                className="h-[160px]"
                placeholder="상세 설명을 입력해주세요"
                readOnly={isDisabled}
                disabled={isDisabled}
              />
            </FormGroup>

            <div className="mt-[80px]">
              <div className="mb-[36px] flex items-center justify-between">
                <h2 className="font-pretendard text-[19px] font-bold text-black">입고 물품 목록</h2>
                <div className="flex gap-[8px]">
                  <button
                    disabled={isPending}
                    onClick={() => setIsInventoryModalOpen(true)}
                    className={`flex h-[37px] w-[117px] items-center justify-center rounded-[5px] border border-greyColor-grey200 font-pretendard text-[15px] font-bold transition-all ${isPending ? 'cursor-not-allowed bg-greyColor-grey100 text-greyColor-grey600' : 'cursor-pointer bg-greyColor-grey100 text-greyColor-grey600 hover:bg-greyColor-grey200'}`}
                  >
                    기존 재고 추가
                  </button>
                  <ExistingInventoryModal
                    isOpen={isInventoryModalOpen}
                    onClose={() => setIsInventoryModalOpen(false)}
                    onAdd={handleAddInventoryItems}
                  />
                  <button
                    disabled={isPending}
                    onClick={() => setIsNewModalOpen(true)}
                    className={`flex h-[37px] w-[117px] items-center justify-center rounded-[5px] border border-greyColor-grey200 font-pretendard text-[15px] font-bold transition-all ${isPending ? 'cursor-not-allowed bg-greyColor-grey100 text-greyColor-grey600' : 'cursor-pointer bg-greyColor-grey100 text-greyColor-grey600 hover:bg-greyColor-grey200'}`}
                  >
                    신규 재고 추가
                  </button>
                </div>
              </div>
              {items.length === 0 ? (
                <div className="w-full overflow-hidden rounded-[10px] border-[2px] border-greyColor-grey200">
                  <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
                    <div className="w-[112px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      재고 번호
                    </div>
                    <div className="w-[130px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      물품명
                    </div>
                    <div className="w-[140px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      입고 요청 수량
                    </div>
                    <div className="w-[140px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      현재 입고 수량
                    </div>
                    <div className="w-[140px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      목표 입고 수량
                    </div>
                    <div className="w-[150px] flex h-full items-center justify-center font-pretendard text-[14px] font-bold text-black">
                      처리 상태
                    </div>
                  </div>
                  <div className="flex h-[40px] items-center justify-center bg-white">
                    <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
                  </div>
                </div>
              ) : (
                <InboundItemTable
                  items={items}
                  isLoading={isLoading}
                  isProgress={isInProgress}
                  selectedItemIds={selectedItemIds}
                  onSelect={handleItemSelect}
                />
              )}
            </div>
          </div>

          <NewInventoryModal
            isOpen={isNewModalOpen}
            onClose={() => setIsNewModalOpen(false)}
            onAdd={handleAddNewInventory}
          />

          <div className="mt-auto flex justify-end pt-10">
            {!isFullyDone &&
              (isInProgress ? (
                <button
                  className="h-[54px] w-[140px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white transition-colors hover:bg-mainColor-blue700"
                  onClick={handleInboundProcess}
                >
                  입고처리
                </button>
              ) : (
                <button
                  disabled={isPending}
                  className={`h-[54px] w-[140px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors ${
                    isPending
                      ? 'cursor-not-allowed bg-greyColor-grey300'
                      : 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                  }`}
                  onClick={() => setIsApprovalModalOpen(true)}
                >
                  승인요청
                </button>
              ))}
          </div>

          <ManagerApprovalModal
            isOpen={isApprovalModalOpen}
            onClose={() => setIsApprovalModalOpen(false)}
            onConfirm={handleFinalConfirm}
            variant="request"
            managerName={taskDetail.manager}
          />

          <SuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            title="승인 요청 완료"
            description="관리자에게 승인 요청이 전달되었어요"
          />

          <InboundConfirmModal
            isOpen={isInboundConfirmModalOpen}
            onClose={() => setIsInboundConfirmModalOpen(false)}
            onConfirm={handleInboundConfirm}
            title={isFinalInbound ? '완료 처리하시겠습니까?' : '입고 처리하시겠습니까?'}
            subTitle={
              isFinalInbound
                ? '확인을 누르면 입고 완료 처리가 진행돼요'
                : '확인을 누르면 입고 처리가 진행돼요'
            }
          />

          <SuccessModal
            isOpen={isCompleteSuccessModalOpen}
            onClose={() => setIsCompleteSuccessModalOpen(false)}
            title="처리 완료"
            description={isFinalInbound ? '입고 완료 처리되었어요' : '입고 처리되었어요'}
          />
        </div>
      </main>
    </div>
  );
}
