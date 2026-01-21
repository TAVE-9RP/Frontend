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
import AlertModal from '@/components/modals/AlertModal';
import {
  getInventoryDetail,
  getInventoryItems,
  requestApproval,
  updateInventory,
  updateInventoryItemTargetQuantity,
  processInventoryItems,
  completeInventory,
} from '../../../apis/inventory';

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
    assignees: [] as string[],
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
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

  // 입고 업무 상세 정보 가져오기 (초기 로드 시에만)
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
            assignees: result.inventoryAssignees || [],
            requestDate: formatDate(result.inventoryRequestedAt),
            description: result.inventoryDescription || '',
            status: mapStatusForStepBar(result.inventoryStatus),
          });
        }
      } catch (error: any) {
        console.error('입고 업무 상세 정보 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryDetail();
  }, [projectNumber]);

  // 입고 물품 목록 가져오기 (refreshItems 변경 시에도 호출)
  useEffect(() => {
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
        setItems([]);
      }
    };

    fetchInventoryItems();
  }, [projectNumber, refreshItems]);

  const handleAddNewInventory = (newItem: InboundItem) => {
    setRefreshItems((prev) => prev + 1);
  };

  const handleFinalConfirm = async () => {
    if (!projectNumber) return;

    try {
      console.log('=== 입고 정보 업데이트 API 호출 ===');
      const updateResponse = await updateInventory(projectNumber, {
        inventoryTitle: taskDetail.taskName,
        inventoryDescription: taskDetail.description,
      });

      if (!updateResponse.isSuccess) {
        setAlertModal({ isOpen: true, message: '입고 정보 업데이트에 실패했습니다.' });
        return;
      }

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

      if (targetQuantityUpdates.length > 0) {
        const targetQtyResponse = await updateInventoryItemTargetQuantity(
          projectNumber,
          targetQuantityUpdates,
        );
        if (!targetQtyResponse.isSuccess) {
          setAlertModal({ isOpen: true, message: '목표 입고 수량 업데이트에 실패했습니다.' });
          return;
        }
      }

      const approvalResponse = await requestApproval(projectNumber);
      if (approvalResponse.isSuccess) {
        setIsApprovalModalOpen(false);
        setIsSuccessModalOpen(true);
        setIsLoading(true);
        try {
          const detailResponse = await getInventoryDetail(projectNumber);
          if (detailResponse.isSuccess && detailResponse.result) {
            const result = detailResponse.result;
            setTaskDetail({
              projectNumber: formatNullValue(result.projectNumber),
              taskName: result.inventoryTitle || '',
              manager: formatAssignees(result.inventoryAssignees),
              assignees: result.inventoryAssignees || [],
              requestDate: formatDate(result.inventoryRequestedAt),
              description: result.inventoryDescription || '',
              status: mapStatusForStepBar(result.inventoryStatus),
            });
          }
        } catch (error: any) {
          console.error('입고 업무 상세 정보 가져오기 실패:', error);
        } finally {
          setIsLoading(false);
        }
        setRefreshItems((prev) => prev + 1);
      } else {
        setAlertModal({ isOpen: true, message: '승인 요청에 실패했습니다.' });
      }
    } catch (error: any) {
      console.error('처리 실패:', error);
      setAlertModal({ isOpen: true, message: '처리 중 오류가 발생했습니다.' });
    }
  };

  const handleInboundProcess = () => {
    if (selectedItemIds.length === 0) {
      setAlertModal({ isOpen: true, message: '입고 처리할 물품을 선택해주세요.' });
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
      const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
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
        setAlertModal({ isOpen: true, message: '입고 수량이 입력된 항목이 없습니다.' });
        return;
      }

      const response = await processInventoryItems(projectNumber, processItems);
      if (response.isSuccess) {
        setSelectedItemIds([]);
        setIsInboundConfirmModalOpen(false);
        setRefreshItems((prev) => prev + 1);
        setIsCompleteSuccessModalOpen(true);
      } else {
        setAlertModal({ isOpen: true, message: '입고 처리에 실패했습니다.' });
      }
    } catch (error: any) {
      console.error('입고 처리 실패:', error);

      const errorMessage = error?.response?.data?.message || '';
      const status = error?.response?.status;

      if (status === 403 || errorMessage.includes('권한')) {
        setIsInboundConfirmModalOpen(false);
        setAlertModal({ isOpen: true, message: '해당 업무에 대한 접근 권한이 없습니다.' });
      } else {
        setAlertModal({ isOpen: true, message: '입고 처리 중 오류가 발생했습니다.' });
      }
    }
  };

  const isFullyDone = taskDetail.status === 'COMPLETED';

  const handleCompleteInventory = async () => {
    if (!projectNumber) return;

    try {
      const response = await completeInventory(projectNumber);
      if (response.isSuccess) {
        setRefreshItems((prev) => prev + 1);
        const detailResponse = await getInventoryDetail(projectNumber);
        if (detailResponse.isSuccess && detailResponse.result) {
          const result = detailResponse.result;
          setTaskDetail({
            projectNumber: formatNullValue(result.projectNumber),
            taskName: result.inventoryTitle || '',
            manager: formatAssignees(result.inventoryAssignees),
            assignees: result.inventoryAssignees || [],
            requestDate: formatDate(result.inventoryRequestedAt),
            description: result.inventoryDescription || '',
            status: mapStatusForStepBar(result.inventoryStatus),
          });
        }
      } else {
        setAlertModal({ isOpen: true, message: '입고 완료 처리에 실패했습니다.' });
      }
    } catch (error: any) {
      console.error('입고 완료 처리 실패:', error);
      const errorMessage = error?.response?.data?.message || '';
      const status = error?.response?.status;

      if (status === 403 || errorMessage.includes('권한')) {
        setAlertModal({ isOpen: true, message: '해당 업무에 대한 접근 권한이 없습니다.' });
      } else {
        setAlertModal({ isOpen: true, message: '입고 완료 처리 중 오류가 발생했습니다.' });
      }
    }
  };

  const hasSelectedItems = selectedItemIds.length > 0;
  const hasInboundQtyForSelected = selectedItemIds.some((id) => {
    const item = items.find((item) => item.id === id);
    return item && item.inboundQty && item.inboundQty !== '-' && item.inboundQty !== '';
  });
  const canProcessInbound = hasSelectedItems && hasInboundQtyForSelected;

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
    const targetItem = items.find((item) => item.id === id);

    if (targetItem) {
      const numValue = value === '' ? 0 : Number(value);
      const currentProcessed = targetItem.currentQty === '-' ? 0 : Number(targetItem.currentQty);
      const targetLimit = targetItem.targetQty === '-' ? 0 : Number(targetItem.targetQty);
      const remainingQty = targetLimit - currentProcessed;

      if (numValue > remainingQty) {
        setAlertModal({
          isOpen: true,
          message: `처리 가능한 수량을 초과했습니다.\n남은 수량: ${remainingQty}개`,
        });

        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? { ...item, inboundQty: '' } : item)),
        );
        return;
      }
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, inboundQty: value } : item)),
    );
  };

  const isPending = taskDetail.status === 'APPROVAL_PENDING';
  const isInProgress = taskDetail.status === 'IN_PROGRESS';
  const isDisabled = isPending || isInProgress || isFullyDone;

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
                  {taskDetail.assignees && taskDetail.assignees.length > 0 ? (
                    taskDetail.assignees.map((assignee, index) => (
                      <ManagerChip key={index} name={assignee} />
                    ))
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
                {!isDisabled && (
                  <div className="flex gap-[8px]">
                    <button
                      type="button"
                      onClick={() => setIsInventoryModalOpen(true)}
                      className="flex h-[37px] w-[117px] cursor-pointer items-center justify-center rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 font-pretendard text-[15px] font-bold text-greyColor-grey600 hover:bg-greyColor-grey200"
                    >
                      기존 재고 추가
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsNewModalOpen(true)}
                      className="flex h-[37px] w-[117px] cursor-pointer items-center justify-center rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 font-pretendard text-[15px] font-bold text-greyColor-grey600 hover:bg-greyColor-grey200"
                    >
                      신규 재고 추가
                    </button>
                  </div>
                )}
              </div>
              {items.length === 0 ? (
                <div className="w-full overflow-hidden rounded-t-[10px] border-[2px] border-greyColor-grey200">
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
          <ExistingInventoryModal
            isOpen={isInventoryModalOpen}
            onClose={() => {
              setIsInventoryModalOpen(false);
              setRefreshItems((prev) => prev + 1);
            }}
            onAdd={() => {}}
            inventoryId={projectNumber || ''}
          />
          <NewInventoryModal
            isOpen={isNewModalOpen}
            onClose={() => {
              setIsNewModalOpen(false);
              setRefreshItems((prev) => prev + 1);
            }}
            onAdd={handleAddNewInventory}
            inventoryId={projectNumber || ''}
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

          <AlertModal
            isOpen={alertModal.isOpen}
            onClose={() => setAlertModal({ isOpen: false, message: '' })}
            message={alertModal.message}
          />
        </div>
      </main>
    </div>
  );
}
