import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';
import ManagerChip from '@/components/common/ManagerChip';
import SuccessModal from '@/components/modals/SuccessModal';
import OutboundItemTable from '@/components/common/OutboundItemTable';
import InventorySearchModal, { InventoryItem } from '@/components/modals/InventorySearchModal';
import ManagerApprovalModal from '@/components/modals/ManagerApproveModal';
import StockEditConfirmModal from '@/components/modals/StockEditConfirmModal';
import InboundConfirmModal from '@/components/modals/InboundConfirmModal';
import AlertModal from '@/components/modals/AlertModal';

import {
  getLogisticsDetail,
  getLogisticsItems,
  postLogisticsItems,
  patchLogisticsItems,
  patchRequestApproval,
  patchCompleteLogistics,
  patchUpdateLogisticsCommon,
  patchTargetQuantity,
} from '@/apis/logistics';
import {
  LogisticsDetail,
  OutboundItem,
  LogisticsStatus,
  UpdateLogisticsCommonRequest,
} from '@/types/logistics';

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
  const { id: logisticsId } = useParams<{ id: string }>();

  const [taskDetail, setTaskDetail] = useState<LogisticsDetail>({
    projectNumber: '',
    logisticsAssignees: [],
    logisticsTitle: '',
    logisticsDescription: '',
    logisticsCarrier: '',
    logisticsCarrierCompany: '',
    logisticsRequestedAt: '',
    logisticsStatus: 'ASSIGNED' as LogisticsStatus,
  });

  const [items, setItems] = useState<OutboundItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOutboundConfirmModalOpen, setIsOutboundConfirmModalOpen] = useState(false);
  const [isFinalCompleteModalOpen, setIsFinalCompleteModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successText, setSuccessText] = useState({ title: '', description: '' });
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

  const isApprovalPending = taskDetail.logisticsStatus === 'PENDING';
  const isInProgress = taskDetail.logisticsStatus === 'IN_PROGRESS';
  const isCompleted = taskDetail.logisticsStatus === 'COMPLETED';
  const isAnythingSelected = selectedItemIds.length > 0;

  const isReadOnlyStatus = isApprovalPending || isInProgress || isCompleted;

  // 승인 요청 버튼 활성화 조건: 모든 필수 필드 입력 및 물품 목록 존재
  const canRequestApproval =
    taskDetail.logisticsTitle?.trim() !== '' &&
    taskDetail.logisticsDescription?.trim() !== '' &&
    taskDetail.logisticsCarrier?.trim() !== '' &&
    taskDetail.logisticsCarrierCompany?.trim() !== '' &&
    items.length > 0;

  const isAllItemsCompleted =
    items.length > 0 && items.every((item) => item.logisticsProcessingStatus === 'COMPLETED');

  const fetchData = async () => {
    if (!logisticsId) return;

    const numericId = Number(logisticsId);
    if (isNaN(numericId)) {
      console.error('유효하지 않은 ID 형식입니다:', logisticsId);
      return;
    }

    try {
      const detailRes = await getLogisticsDetail(numericId);

      if (detailRes.isSuccess && detailRes.result) {
        console.log('상세 정보 수신 성공:', detailRes.result);

        const resultData = Array.isArray(detailRes.result) ? detailRes.result[0] : detailRes.result;

        const resolvedAssignees = resultData.logisticsAssignees
          ? resultData.logisticsAssignees
          : resultData.assigneeSummary
            ? [resultData.assigneeSummary]
            : [];

        setTaskDetail({
          projectNumber: resultData.projectNumber ?? '',
          logisticsAssignees: resolvedAssignees,
          logisticsTitle: resultData.logisticsTitle ?? '',
          logisticsDescription: resultData.logisticsDescription ?? '',
          logisticsCarrier: resultData.logisticsCarrier ?? '',
          logisticsCarrierCompany: resultData.logisticsCarrierCompany ?? '',
          logisticsRequestedAt: resultData.logisticsRequestedAt ?? '',
          logisticsStatus: (resultData.logisticsStatus as LogisticsStatus) || 'ASSIGNED',
        });
      }
    } catch (error) {
      console.error('상세 정보 로딩 실패:', error);
    }

    try {
      const itemsRes = await getLogisticsItems(numericId);

      if (itemsRes.isSuccess && itemsRes.result) {
        console.log('품목 리스트 수신 성공:', itemsRes.result);
        setItems(itemsRes.result);
      } else {
        setItems([]);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn('등록된 품목이 없습니다. 빈 목록으로 표시합니다.');
        setItems([]);
      } else {
        console.error('품목 리스트 로딩 중 실제 오류 발생:', error);
        setItems([]);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [logisticsId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemSelect = (id: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleTargetQuantityChange = (id: number, quantity: number) => {
    if (quantity < 0) {
      setAlertModal({
        isOpen: true,
        message: '목표 출하 수량은 1 이상이어야 합니다.',
      });
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.logisticsItemId === id ? { ...item, targetedQuantity: quantity } : item,
      ),
    );
  };

  const handleProcessedQuantityChange = (id: number, quantity: number) => {
    if (quantity < 1) {
      setAlertModal({
        isOpen: true,
        message: '출하 수량은 1 이상이어야 합니다.',
      });
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.logisticsItemId === id ? { ...item, tempProcessedQuantity: quantity } : item,
      ),
    );
  };

  const handleOutboundConfirm = async () => {
    if (!logisticsId || selectedItemIds.length === 0) return;

    try {
      const payload = {
        items: items
          .filter((item) => selectedItemIds.includes(item.logisticsItemId))
          .map((item) => ({
            logisticsItemId: item.logisticsItemId,
            processedQuantity: item.tempProcessedQuantity || 0,
          })),
      };

      const res = await patchLogisticsItems(Number(logisticsId), payload);

      if (res.isSuccess) {
        setIsOutboundConfirmModalOpen(false);
        setSelectedItemIds([]);

        setSuccessText({
          title: '처리 완료',
          description: '실제 출하 수량이 재고에 반영되었습니다.',
        });
        setIsSuccessModalOpen(true);

        fetchData();
      }
    } catch (error: any) {
      console.error('출하 에러:', error);
      const errorStatus = error.response?.status;
      const errorMessage = error.response?.data?.message || '';

      if (errorStatus === 403 || errorMessage.includes('권한') || errorMessage.includes('접근')) {
        setIsOutboundConfirmModalOpen(false);
        setAlertModal({ isOpen: true, message: '해당 업무에 대한 접근 권한이 없습니다.' });
      } else if (errorStatus === 409) {
        setIsOutboundConfirmModalOpen(false);
        setAlertModal({
          isOpen: true,
          message: '재고 수량이 부족합니다.',
        });
      } else {
        setAlertModal({
          isOpen: true,
          message: '출하 수량 반영에 실패했습니다. 입력값을 다시 확인해주세요.',
        });
      }
    }
  };

  const handleFinalCompleteConfirm = async () => {
    if (!logisticsId) return;
    try {
      const res = await patchCompleteLogistics(Number(logisticsId));
      if (res.isSuccess) {
        setIsFinalCompleteModalOpen(false);
        setSuccessText({ title: '처리 완료', description: '출하 처리가 완료되었습니다' });
        setIsSuccessModalOpen(true);
        fetchData();
      }
    } catch (error) {
      setAlertModal({ isOpen: true, message: '완료 처리 중 오류가 발생했습니다.' });
    }
  };

  const handleApprovalConfirm = async () => {
    if (!logisticsId) return;

    if (!taskDetail.logisticsTitle?.trim() || !taskDetail.logisticsDescription?.trim()) {
      setAlertModal({ isOpen: true, message: '출하 업무명과 업무 설명은 필수입니다.' });
      setIsApprovalModalOpen(false);
      return;
    }

    if (items.length === 0) {
      setAlertModal({ isOpen: true, message: '출하 물품 목록을 추가해야 승인 요청이 가능합니다.' });
      setIsApprovalModalOpen(false);
      return;
    }

    try {
      const updatePayload: UpdateLogisticsCommonRequest = {
        logisticsTitle: taskDetail.logisticsTitle,
        logisticsDescription: taskDetail.logisticsDescription ?? '',
        logisticsCarrier: taskDetail.logisticsCarrier ?? '',
        logisticsCarrierCompany: taskDetail.logisticsCarrierCompany ?? '',
      };
      await patchUpdateLogisticsCommon(Number(logisticsId), updatePayload);

      const targetQuantityPayload = items.map((item) => ({
        logisticsItemId: item.logisticsItemId,
        targetQuantity: item.targetedQuantity,
      }));

      const quantityRes = await patchTargetQuantity(Number(logisticsId), targetQuantityPayload);

      if (!quantityRes.isSuccess) {
        throw new Error('목표 수량 저장에 실패했습니다.');
      }

      const approvalRes = await patchRequestApproval(Number(logisticsId));

      if (approvalRes.isSuccess) {
        setIsApprovalModalOpen(false);
        setSuccessText({
          title: '승인 요청 완료',
          description: '입력된 정보와 목표 수량이 저장되고 관리자에게 승인 요청되었습니다.',
        });
        setIsSuccessModalOpen(true);
        fetchData();
      }
    } catch (error: any) {
      console.error('승인 요청 프로세스 오류:', error);
      const errorStatus = error?.response?.status;
      const errorMessage = error?.response?.data?.message || '';

      if (
        errorStatus === 403 ||
        errorStatus === 401 ||
        errorMessage.includes('접근 권한') ||
        errorMessage.includes('권한이 없음') ||
        errorMessage.includes('해당 업무에 접근')
      ) {
        setIsApprovalModalOpen(false);
        setAlertModal({ isOpen: true, message: '해당 업무에 대한 접근 권한이 없습니다.' });
      } else {
        setAlertModal({ isOpen: true, message: error?.message || '처리 중 오류가 발생했습니다.' });
      }
    }
  };

  const handleEditConfirm = async () => {
    if (!logisticsId) return;

    if (!taskDetail.logisticsTitle?.trim() || !taskDetail.logisticsDescription?.trim()) {
      setAlertModal({ isOpen: true, message: '출하 업무명과 업무 설명은 필수 입력 사항입니다.' });
      return;
    }

    try {
      const payload: UpdateLogisticsCommonRequest = {
        logisticsTitle: taskDetail.logisticsTitle ?? '',
        logisticsDescription: taskDetail.logisticsDescription ?? '',
        logisticsCarrier: taskDetail.logisticsCarrier ?? '',
        logisticsCarrierCompany: taskDetail.logisticsCarrierCompany ?? '',
      };

      const res = await patchUpdateLogisticsCommon(Number(logisticsId), payload);

      if (res.isSuccess) {
        setIsEditModalOpen(false);
        setSuccessText({
          title: '저장 완료',
          description: '출하 공통 정보가 성공적으로 저장되었습니다.',
        });
        setIsSuccessModalOpen(true);
        fetchData();
      } else {
        setAlertModal({ isOpen: true, message: res.message || '정보 저장에 실패했습니다.' });
      }
    } catch (error: any) {
      console.error('수정 중 오류 발생:', error);
      const errorMsg = error.response?.data?.message || '수정 중 오류가 발생했습니다.';
      setAlertModal({ isOpen: true, message: errorMsg });
    }
  };

  const handleAddInventory = async (selectedItems: InventoryItem[]) => {
    if (!logisticsId) return;

    if (!taskDetail.logisticsTitle?.trim() || !taskDetail.logisticsDescription?.trim()) {
      setAlertModal({ isOpen: true, message: '출하 업무명과 업무 설명을 먼저 입력해 주세요.' });
      return;
    }

    try {
      const updatePayload: UpdateLogisticsCommonRequest = {
        logisticsTitle: taskDetail.logisticsTitle ?? '',
        logisticsDescription: taskDetail.logisticsDescription ?? '',
        logisticsCarrier: taskDetail.logisticsCarrier || '',
        logisticsCarrierCompany: taskDetail.logisticsCarrierCompany || '',
      };

      await patchUpdateLogisticsCommon(Number(logisticsId), updatePayload);

      const payload = {
        itemIds: selectedItems.map((item) => Number(item.itemId)),
      };

      const res = await postLogisticsItems(Number(logisticsId), payload);

      if (res.isSuccess) {
        setIsInventoryModalOpen(false);
        fetchData();
      } else {
        setAlertModal({ isOpen: true, message: res.message || '품목 추가에 실패했습니다.' });
      }
    } catch (error: any) {
      console.error('품목 추가 중 오류:', error);
      const errorMessage = error?.response?.data?.message || '';
      const errorStatus = error?.response?.status;

      if (errorStatus === 403 || errorMessage.includes('권한') || errorMessage.includes('접근')) {
        setAlertModal({ isOpen: true, message: '해당 업무에 대한 접근 권한이 없습니다.' });
      } else {
        setAlertModal({ isOpen: true, message: '처리 중 오류가 발생했습니다.' });
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <main className="flex flex-1 justify-center pb-20 pt-[70px]">
        <div className="relative flex min-h-[1200px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-xl">
          <h1 className="font-pretendard text-[24px] font-bold text-black">출하 업무 상세</h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
            요청일:{' '}
            {taskDetail.logisticsRequestedAt
              ? taskDetail.logisticsRequestedAt.split('T')[0].replace(/-/g, '.')
              : '-'}
          </p>

          <div className="mt-[70px]">
            <div className="mb-[70px] flex justify-between">
              <FormGroup label="진행 상태" className="w-fit">
                <StatusStepBar
                  currentStatus={taskDetail.logisticsStatus as LogisticsStatus}
                  type="outbound"
                />
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
                  name="logisticsTitle"
                  value={taskDetail.logisticsTitle ?? ''}
                  onChange={handleInputChange}
                  disabled={isReadOnlyStatus}
                  className={isInProgress || isCompleted ? 'bg-greyColor-grey100' : ''}
                />
              </FormGroup>
              <FormGroup label="출하 업무 담당자" className="w-[390px]">
                <div className="flex h-[50px] items-center gap-[10px] rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-[16px]">
                  {taskDetail.logisticsAssignees && taskDetail.logisticsAssignees.length > 0 ? (
                    taskDetail.logisticsAssignees.map((name, idx) => (
                      <ManagerChip key={idx} name={name} />
                    ))
                  ) : (
                    <span>-</span>
                  )}
                </div>
              </FormGroup>
            </div>

            <FormGroup label="업무 설명" className="mb-[64px]">
              <LargeInput
                name="logisticsDescription"
                value={taskDetail.logisticsDescription ?? ''}
                onChange={handleInputChange}
                disabled={isReadOnlyStatus}
                placeholder={
                  taskDetail.logisticsStatus === 'ASSIGNED' ? '내용을 입력해주세요' : undefined
                }
                className={`h-[160px] ${isInProgress || isCompleted ? 'bg-greyColor-grey100' : ''}`}
              />
            </FormGroup>

            <div className="mb-[80px] flex items-center">
              <FormGroup label="운송수단" className="w-[390px]">
                <BasicInput
                  name="logisticsCarrier"
                  value={taskDetail.logisticsCarrier ?? ''}
                  onChange={handleInputChange}
                  disabled={isReadOnlyStatus}
                  className={isInProgress || isCompleted ? 'bg-greyColor-grey100' : ''}
                />
              </FormGroup>
              <FormGroup label="운송업체" className="ml-[32px] w-[390px]">
                <BasicInput
                  name="logisticsCarrierCompany"
                  value={taskDetail.logisticsCarrierCompany ?? ''}
                  onChange={handleInputChange}
                  disabled={isReadOnlyStatus}
                  className={isInProgress || isCompleted ? 'bg-greyColor-grey100' : ''}
                />
              </FormGroup>
            </div>

            <div className="mt-[80px]">
              <div className="mb-[36px] flex items-center justify-between">
                <h2 className="font-pretendard text-[19px] font-bold text-black">출하 물품 목록</h2>
                {!isReadOnlyStatus && (
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
                onTargetQuantityChange={handleTargetQuantityChange}
                onProcessedQuantityChange={handleProcessedQuantityChange}
                status={taskDetail.logisticsStatus as LogisticsStatus}
              />
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-10">
            {isInProgress ? (
              <div className="flex gap-3">
                {!isAllItemsCompleted ? (
                  <button
                    disabled={!isAnythingSelected}
                    onClick={() => setIsOutboundConfirmModalOpen(true)}
                    className={`h-[50px] w-[113px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors ${
                      isAnythingSelected
                        ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                        : 'cursor-not-allowed bg-greyColor-grey300'
                    }`}
                  >
                    출하 처리
                  </button>
                ) : (
                  <button
                    onClick={() => setIsFinalCompleteModalOpen(true)}
                    className="h-[50px] w-[113px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white transition-colors hover:bg-mainColor-blue700"
                  >
                    출하 완료
                  </button>
                )}
              </div>
            ) : isApprovalPending ? (
              <button
                disabled
                className="h-[50px] w-[113px] cursor-not-allowed rounded-[10px] bg-greyColor-grey300 font-pretendard text-[19px] font-bold text-white"
              >
                승인 요청
              </button>
            ) : !isCompleted &&
              (taskDetail.logisticsStatus === 'ASSIGNED' ||
                taskDetail.logisticsStatus === 'REJECT') ? (
              <button
                onClick={() => {
                  const isAnyQuantityMissing = items.some(
                    (item) => !item.targetedQuantity || item.targetedQuantity <= 0,
                  );

                  if (isAnyQuantityMissing) {
                    setAlertModal({
                      isOpen: true,
                      message: '모든 품목의 목표 출하 수량을 입력해주세요.',
                    });
                    return;
                  }

                  setIsApprovalModalOpen(true);
                }}
                disabled={!canRequestApproval}
                className={`h-[50px] w-[113px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors ${
                  canRequestApproval
                    ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                    : 'cursor-not-allowed bg-greyColor-grey300'
                }`}
              >
                승인 요청
              </button>
            ) : (
              isCompleted && (
                <button
                  disabled
                  className="h-[50px] w-[113px] cursor-not-allowed rounded-[10px] bg-greyColor-grey300 font-pretendard text-[19px] font-bold text-white"
                >
                  출하 완료
                </button>
              )
            )}
          </div>

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
            managerName={taskDetail.logisticsAssignees[0] || ''}
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
