import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
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

import {
  getLogisticsDetail,
  getLogisticsItems,
  postLogisticsItems,
  patchLogisticsItems,
  patchRequestApproval,
  patchCompleteLogistics,
  patchUpdateLogisticsCommon,
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

  // null 에러 해결을 위해 초기값과 타입을 string으로 강제하거나 기본값 처리
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

  const isApprovalPending = taskDetail.logisticsStatus === 'PENDING';
  const isInProgress = taskDetail.logisticsStatus === 'IN_PROGRESS';
  const isCompleted = taskDetail.logisticsStatus === 'COMPLETED';
  const isAnythingSelected = selectedItemIds.length > 0;

  const isReadOnlyStatus = isApprovalPending || isInProgress || isCompleted;

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
        console.log('상세 정보 수신 성공:', detailRes.result); // ✅ 콘솔 확인용

        // 배열인지 객체인지 확인 후 처리
        const resultData = Array.isArray(detailRes.result) ? detailRes.result[0] : detailRes.result;

        // null 값에 대한 방어 로직 (데이터가 null이면 빈 문자열이나 빈 배열로 변환)
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

    // 2️⃣ 품목 목록 가져오기 (독립 실행 - 여기가 에러나도 위에는 표시됨)
    try {
      const itemsRes = await getLogisticsItems(numericId);

      if (itemsRes.isSuccess && itemsRes.result) {
        console.log('품목 리스트 수신 성공:', itemsRes.result); // ✅ 콘솔 확인용
        setItems(itemsRes.result);
      }
    } catch (error) {
      console.warn('품목 리스트 로딩 실패 (데이터가 없거나 API 오류):', error);
      // 품목 로딩 실패시 빈 배열 유지 (화면은 안 꺼짐)
      setItems([]);
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

  const handleOutboundConfirm = async () => {
    if (!logisticsId) return;
    try {
      const payload = {
        items: selectedItemIds.map((id) => ({
          logisticsItemId: id,
          processedQuantity: 1,
        })),
      };
      const res = await patchLogisticsItems(Number(logisticsId), payload);
      if (res.isSuccess) {
        setIsOutboundConfirmModalOpen(false);
        setSelectedItemIds([]);
        setSuccessText({ title: '처리 완료', description: '출하 처리되었어요' });
        setIsSuccessModalOpen(true);
        fetchData();
      }
    } catch (error) {
      alert('출하 처리 중 오류가 발생했습니다.');
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
      alert('완료 처리 중 오류가 발생했습니다.');
    }
  };

  // LogisticsOutboundTaskDetailPage.tsx 내의 handleApprovalConfirm 수정

  const handleApprovalConfirm = async () => {
    if (!logisticsId) return;

    // 1. 필수값 유효성 검사 (입력창이 비어있으면 중단)
    if (!taskDetail.logisticsTitle?.trim() || !taskDetail.logisticsDescription?.trim()) {
      alert('출하 업무명과 업무 설명은 필수입니다. 내용을 입력해주세요.');
      setIsApprovalModalOpen(false);
      return;
    }

    // 2. 물품 추가 여부 확인
    if (items.length === 0) {
      alert('출하 물품 목록을 추가해야 승인 요청이 가능합니다.');
      setIsApprovalModalOpen(false);
      return;
    }

    try {
      // Step 1: 현재 입력된 정보들(제목, 설명, 운송수단 등)을 먼저 저장(PATCH)
      const updatePayload: UpdateLogisticsCommonRequest = {
        logisticsTitle: taskDetail.logisticsTitle,
        logisticsDescription: taskDetail.logisticsDescription,
        logisticsCarrier: taskDetail.logisticsCarrier || '',
        logisticsCarrierCompany: taskDetail.logisticsCarrierCompany || '',
      };

      const updateRes = await patchUpdateLogisticsCommon(Number(logisticsId), updatePayload);

      if (!updateRes.isSuccess) {
        throw new Error('정보 저장 중 오류가 발생했습니다.');
      }

      // Step 2: 정보 저장에 성공하면 바로 승인 요청(PATCH)을 날림
      const approvalRes = await patchRequestApproval(Number(logisticsId));

      if (approvalRes.isSuccess) {
        setIsApprovalModalOpen(false); // 모달 닫기
        setSuccessText({
          title: '승인 요청 완료',
          description: '입력된 정보가 저장되고 관리자에게 승인 요청되었습니다.',
        });
        setIsSuccessModalOpen(true);
        fetchData(); // 상태 변경(ASSIGNED -> PENDING) 반영을 위해 데이터 다시 읽기
      }
    } catch (error: any) {
      console.error('승인 요청 프로세스 오류:', error);
      const errorMsg = error.response?.data?.message || '처리 중 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

  const handleEditConfirm = async () => {
    if (!logisticsId) return;

    // 1. 필수값 유효성 검사 (API 명세서 조건: Title, Description 필수)
    if (!taskDetail.logisticsTitle?.trim() || !taskDetail.logisticsDescription?.trim()) {
      alert('출하 업무명과 업무 설명은 필수 입력 사항입니다.');
      return;
    }

    try {
      const payload: UpdateLogisticsCommonRequest = {
        logisticsTitle: taskDetail.logisticsTitle,
        logisticsDescription: taskDetail.logisticsDescription,
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
        fetchData(); // 수정 후 최신 데이터 다시 불러오기
      } else {
        // 서버에서 실패 응답을 보낸 경우 (예: 권한 없음, 상태 부적절 등)
        alert(res.message || '정보 저장에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('수정 중 오류 발생:', error);
      // 백엔드 에러 메시지가 있다면 표시
      const errorMsg = error.response?.data?.message || '수정 중 오류가 발생했습니다.';
      alert(errorMsg);
    }
  };

  const handleAddInventory = async (selectedItems: InventoryItem[]) => {
    if (!logisticsId) return;

    try {
      // 1. [추가] 현재 입력창에 있는 텍스트 정보들을 먼저 서버에 저장 (Common Update)
      const updatePayload: UpdateLogisticsCommonRequest = {
        logisticsTitle: taskDetail.logisticsTitle,
        logisticsDescription: taskDetail.logisticsDescription,
        logisticsCarrier: taskDetail.logisticsCarrier || '',
        logisticsCarrierCompany: taskDetail.logisticsCarrierCompany || '',
      };

      // 재고 추가 전에 정보를 먼저 백엔드에 보냅니다.
      await patchUpdateLogisticsCommon(Number(logisticsId), updatePayload);

      // 2. 기존 재고 추가 로직 실행
      const payload = {
        itemIds: selectedItems.map((item) => Number(item.itemId)),
      };

      const res = await postLogisticsItems(Number(logisticsId), payload);

      if (res.isSuccess) {
        setIsInventoryModalOpen(false);
        // 이제 fetchData를 해도 서버에 방금 저장한 텍스트가 있으므로 사라지지 않습니다!
        fetchData();
      } else {
        alert(res.message || '품목 추가에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('품목 추가 중 오류:', error);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />
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
                {!isInProgress && !isCompleted && (
                  <button
                    onClick={() => setIsInventoryModalOpen(true)}
                    className="disabled={isReadOnlyStatus} flex h-[37px] w-[88px] items-center justify-center rounded-[5px] border border-greyColor-grey200 bg-greyColor-grey100 font-pretendard text-[15px] font-bold text-greyColor-grey600 hover:bg-greyColor-grey200"
                  >
                    재고 추가
                  </button>
                )}
              </div>
              <OutboundItemTable
                items={items}
                selectedItemIds={selectedItemIds}
                onSelect={handleItemSelect}
                status={taskDetail.logisticsStatus as LogisticsStatus}
              />
            </div>
          </div>

          <div className="mt-auto flex justify-end pt-10">
            {/* 1. 승인 완료 후: 진행 중(IN_PROGRESS) 상태 */}
            {isInProgress ? (
              <div className="flex gap-3">
                {/* 출하 처리 버튼: 모든 품목이 완료되지 않았을 때만 노출 */}
                {!isAllItemsCompleted && (
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
                )}

                {/* 출하 완료 버튼: 항상 띄워두되, 모든 품목 완료시에만 활성화 */}
                <button
                  disabled={!isAllItemsCompleted}
                  onClick={() => setIsFinalCompleteModalOpen(true)}
                  className={`h-[50px] w-[113px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors ${
                    isAllItemsCompleted
                      ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
                      : 'cursor-not-allowed bg-greyColor-grey300'
                  }`}
                >
                  출하 완료
                </button>
              </div>
            ) : /* 2. 승인 요청 후: 승인 대기(PENDING) 상태 */
            isApprovalPending ? (
              <button
                disabled
                className="h-[50px] w-[113px] cursor-not-allowed rounded-[10px] bg-greyColor-grey300 font-pretendard text-[19px] font-bold text-white"
              >
                승인요청
              </button>
            ) : /* 3. 업무 시작 전: 할당됨(ASSIGNED) 또는 반려(REJECT) 상태 */
            !isCompleted &&
              (taskDetail.logisticsStatus === 'ASSIGNED' ||
                taskDetail.logisticsStatus === 'REJECT') ? (
              <button
                onClick={() => setIsApprovalModalOpen(true)}
                className="h-[50px] w-[113px] rounded-[10px] bg-mainColor-blue600 font-pretendard text-[19px] font-bold text-white hover:bg-mainColor-blue700"
              >
                승인요청
              </button>
            ) : (
              /* 4. 최종 완료(COMPLETED) 상태 */
              isCompleted && (
                <button
                  disabled
                  className="h-[50px] w-[113px] cursor-not-allowed rounded-[10px] bg-greyColor-grey300 font-pretendard text-[19px] font-bold text-greyColor-grey500"
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
        </div>
      </main>
    </div>
  );
}
