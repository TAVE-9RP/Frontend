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
import {
  getInventoryDetail,
  getInventoryItems,
  requestApproval,
  updateInventory,
  updateInventoryItemTargetQuantity,
  processInventoryItems,
  completeInventory,
} from '../../../apis/inventory';

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

// 날짜를 '2025-12-21T14:22:00' 형식에서 '2025.12.21' 형식으로 변환
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString || dateString === '-') return '-';

  // ISO 형식의 날짜 문자열에서 날짜 부분만 추출 (YYYY-MM-DD)
  const datePart = dateString.split('T')[0];
  if (!datePart) return '-';

  // '-'를 '.'로 변환
  return datePart.replace(/-/g, '.');
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

// API 응답의 inventoryProcessingStatus를 한글로 매핑
const mapProcessingStatus = (status: string): string => {
  switch (status) {
    case 'NOT_STARTED':
      return '미진행';
    case 'IN_PROGRESS':
      return '진행중';
    case 'COMPLETED':
      return '완료';
    default:
      return '미진행';
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
  const [refreshItems, setRefreshItems] = useState(0);
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
            taskName: result.inventoryTitle || '',
            manager: formatAssignees(result.inventoryAssignees),
            requestDate: formatDate(result.inventoryRequestedAt),
            description: result.inventoryDescription || '',
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

    const fetchInventoryItems = async () => {
      if (!projectNumber) return;

      try {
        console.log('=== 입고 물품 목록 API 호출 ===');
        console.log('projectNumber:', projectNumber);
        const response = await getInventoryItems(projectNumber);
        console.log('=== 입고 물품 목록 API 응답 ===');
        console.log('응답:', response);

        if (response.isSuccess && response.result) {
          const mappedItems: InboundItem[] = response.result.map((item: any) => ({
            id: item.itemCode, // 재고 번호
            inventoryItemId: item.inventoryItemId, // inventoryItemId 저장
            name: item.itemName, // 물품명
            price: item.itemPrice, // 물품 가격
            inboundQty: '-', // 입고 수량
            currentQty: item.processedQuantity || '-', // 현재 입고 수량
            targetQty: item.targetQuantity || '-', // 목표 입고 수량
            status: mapProcessingStatus(item.inventoryProcessingStatus), // 처리 상태
          }));
          console.log('=== 매핑된 입고 물품 목록 ===');
          console.log('mappedItems:', mappedItems);
          setItems(mappedItems);
        } else {
          setItems([]);
        }
      } catch (error: any) {
        console.error('입고 물품 목록 가져오기 실패:', error);
        console.error('에러 응답:', error?.response?.data);
        console.error('에러 상태 코드:', error?.response?.status);
        console.error('에러 메시지:', error?.message);
        setItems([]);
      }
    };

    fetchInventoryDetail();
    fetchInventoryItems();
  }, [projectNumber, refreshItems]);

  const handleAddNewInventory = (newItem: InboundItem) => {
    // NewInventoryModal에서 API 호출 완료 후 모달이 닫히면 목록 새로고침
    setRefreshItems((prev) => prev + 1);
  };

  const handleFinalConfirm = async () => {
    if (!projectNumber) return;

    try {
      // 1. 입고 업무명과 업무 설명 업데이트
      console.log('=== 입고 정보 업데이트 API 호출 ===');
      console.log('inventoryId:', projectNumber);
      console.log('요청 데이터:', {
        inventoryTitle: taskDetail.taskName,
        inventoryDescription: taskDetail.description,
      });

      const updateResponse = await updateInventory(projectNumber, {
        inventoryTitle: taskDetail.taskName,
        inventoryDescription: taskDetail.description,
      });

      console.log('=== 입고 정보 업데이트 API 응답 ===');
      console.log('응답:', updateResponse);

      if (!updateResponse.isSuccess) {
        alert('입고 정보 업데이트에 실패했습니다.');
        return;
      }

      // 2. 목표 입고 수량 업데이트 API 호출
      console.log('=== 목표 입고 수량 업데이트 API 호출 ===');
      console.log('inventoryId:', projectNumber);

      const targetQuantityUpdates = items
        .filter(
          (item) =>
            item.inventoryItemId &&
            item.targetQty &&
            item.targetQty !== '-' &&
            item.targetQty !== '',
        )
        .map((item) => ({
          inventoryItemId: item.inventoryItemId!,
          targetQuantity: Number(item.targetQty),
        }));

      console.log('목표 입고 수량 업데이트 데이터:', targetQuantityUpdates);

      if (targetQuantityUpdates.length > 0) {
        const targetQtyResponse = await updateInventoryItemTargetQuantity(
          projectNumber,
          targetQuantityUpdates,
        );
        console.log('=== 목표 입고 수량 업데이트 API 응답 ===');
        console.log('응답:', targetQtyResponse);

        if (!targetQtyResponse.isSuccess) {
          alert('목표 입고 수량 업데이트에 실패했습니다.');
          return;
        }
      }

      // 3. 승인 요청 API 호출
      console.log('=== 승인 요청 API 호출 ===');
      console.log('inventoryId:', projectNumber);
      const approvalResponse = await requestApproval(projectNumber);
      console.log('=== 승인 요청 API 응답 ===');
      console.log('응답:', approvalResponse);

      if (approvalResponse.isSuccess) {
        setIsApprovalModalOpen(false);
        setIsSuccessModalOpen(true);
        // 페이지 새로고침하여 진행 상태 업데이트
        setRefreshItems((prev) => prev + 1);
      } else {
        alert('승인 요청에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('처리 실패:', error);
      console.error('에러 응답:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 메시지:', error?.message);
      alert(
        `처리 실패: ${error?.response?.data?.message || error?.message || '알 수 없는 오류가 발생했습니다.'}`,
      );
    }
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

  const handleInboundConfirm = async () => {
    if (!projectNumber) return;

    try {
      // 선택된 항목들 필터링
      const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));

      // API 요청 형식으로 매핑
      const processItems = selectedItems
        .filter(
          (item) =>
            item.inventoryItemId &&
            item.inboundQty &&
            item.inboundQty !== '-' &&
            item.inboundQty !== '',
        )
        .map((item) => ({
          inventoryItemId: item.inventoryItemId!,
          receiveQuantity: Number(item.inboundQty),
        }));

      if (processItems.length === 0) {
        alert('입고 수량이 입력된 항목이 없습니다.');
        return;
      }

      console.log('=== 입고 처리 API 호출 ===');
      console.log('inventoryId:', projectNumber);
      console.log('요청 데이터:', { items: processItems });

      const response = await processInventoryItems(projectNumber, processItems);
      console.log('=== 입고 처리 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        setSelectedItemIds([]);
        setIsInboundConfirmModalOpen(false);

        // 입고 물품 목록 GET API 재호출
        setRefreshItems((prev) => prev + 1);

        setIsCompleteSuccessModalOpen(true);
      } else {
        alert('입고 처리에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('입고 처리 실패:', error);
      console.error('에러 응답:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 메시지:', error?.message);
      alert(
        `입고 처리 실패: ${error?.response?.data?.message || error?.message || '알 수 없는 오류가 발생했습니다.'}`,
      );
    }
  };

  const isFullyDone = taskDetail.status === 'COMPLETED';

  const handleCompleteInventory = async () => {
    if (!projectNumber) return;

    try {
      console.log('=== 입고 완료 API 호출 ===');
      console.log('inventoryId:', projectNumber);

      const response = await completeInventory(projectNumber);
      console.log('=== 입고 완료 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        // 페이지 GET API 재호출하여 진행 상태 업데이트
        setRefreshItems((prev) => prev + 1);
        // taskDetail도 새로고침
        const detailResponse = await getInventoryDetail(projectNumber);
        if (detailResponse.isSuccess && detailResponse.result) {
          const result = detailResponse.result;
          setTaskDetail({
            projectNumber: formatNullValue(result.projectNumber),
            taskName: result.inventoryTitle || '',
            manager: formatAssignees(result.inventoryAssignees),
            requestDate: formatDate(result.inventoryRequestedAt),
            description: result.inventoryDescription || '',
            status: mapStatusForStepBar(result.inventoryStatus),
          });
        }
      } else {
        alert('입고 완료 처리에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('입고 완료 처리 실패:', error);
      console.error('에러 응답:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 메시지:', error?.message);
      alert(
        `입고 완료 처리 실패: ${error?.response?.data?.message || error?.message || '알 수 없는 오류가 발생했습니다.'}`,
      );
    }
  };

  // 입고 처리 버튼 활성화 조건 체크
  const hasSelectedItems = selectedItemIds.length > 0;
  const hasInboundQtyForSelected = selectedItemIds.some((id) => {
    const item = items.find((item) => item.id === id);
    return item && item.inboundQty && item.inboundQty !== '-' && item.inboundQty !== '';
  });
  const canProcessInbound = hasSelectedItems && hasInboundQtyForSelected;

  // 모든 물품의 처리 상태가 '완료'인지 확인
  const allItemsCompleted = items.length > 0 && items.every((item) => item.status === '완료');

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

  const handleTargetQtyChange = (id: string, value: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, targetQty: value } : item)),
    );
  };

  const handleInboundQtyChange = (id: string, value: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, inboundQty: value } : item)),
    );
  };

  const isPending = taskDetail.status === 'APPROVAL_PENDING';
  const isInProgress = taskDetail.status === 'IN_PROGRESS';
  const isDisabled = isPending || isInProgress || isFullyDone;

  // 승인 요청 버튼 활성화 조건 체크
  const isTaskNameEmpty = !taskDetail.taskName || taskDetail.taskName.trim() === '';
  const isDescriptionEmpty = !taskDetail.description || taskDetail.description.trim() === '';
  const hasEmptyTargetQty = items.some(
    (item) => !item.targetQty || item.targetQty === '' || item.targetQty === '-',
  );
  const canRequestApproval =
    !isPending && items.length > 0 && !isTaskNameEmpty && !isDescriptionEmpty && !hasEmptyTargetQty;

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />
      <main className="flex flex-1 justify-center pb-20 pt-[70px]">
        <div className="relative flex min-h-[1200px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-xl">
          <h1 className="font-pretendard text-[24px] font-bold text-black">입고 업무 상세</h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
            요청일: {taskDetail.requestDate}
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
                  value={taskDetail.taskName || ''}
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
                value={taskDetail.description || ''}
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
                    onClose={() => {
                      setIsInventoryModalOpen(false);
                      // 모달이 닫힌 후 목록 새로고침
                      setRefreshItems((prev) => prev + 1);
                    }}
                    onAdd={() => {}}
                    inventoryId={projectNumber}
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
                    <div className="flex h-full w-[112px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      재고 번호
                    </div>
                    <div className="flex h-full w-[130px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      물품명
                    </div>
                    <div className="flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      입고 요청 수량
                    </div>
                    <div className="flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      현재 입고 수량
                    </div>
                    <div className="flex h-full w-[140px] items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                      목표 입고 수량
                    </div>
                    <div className="flex h-full w-[150px] items-center justify-center font-pretendard text-[14px] font-bold text-black">
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
                  onTargetQtyChange={handleTargetQtyChange}
                  onInboundQtyChange={handleInboundQtyChange}
                  isDisabled={isDisabled}
                />
              )}
            </div>
          </div>

          <NewInventoryModal
            isOpen={isNewModalOpen}
            onClose={() => {
              setIsNewModalOpen(false);
              // 모달이 닫힌 후 목록 새로고침
              setRefreshItems((prev) => prev + 1);
            }}
            onAdd={handleAddNewInventory}
          />

          <div className="mt-auto flex justify-end pt-10">
            {!isFullyDone &&
              (isInProgress ? (
                allItemsCompleted ? (
                  <button
                    className="h-[54px] w-[140px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white transition-colors hover:bg-mainColor-blue700"
                    onClick={handleCompleteInventory}
                  >
                    입고 완료
                  </button>
                ) : (
                  <button
                    disabled={!canProcessInbound}
                    className={`h-[54px] w-[140px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors ${
                      !canProcessInbound
                        ? 'cursor-not-allowed bg-greyColor-grey300'
                        : 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                    }`}
                    onClick={handleInboundProcess}
                  >
                    입고처리
                  </button>
                )
              ) : (
                <button
                  disabled={!canRequestApproval}
                  className={`h-[54px] w-[140px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors ${
                    !canRequestApproval
                      ? 'cursor-not-allowed bg-greyColor-grey300'
                      : 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                  }`}
                  onClick={() => setIsApprovalModalOpen(true)}
                >
                  승인 요청
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
