import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';
import ManagerChip from '@/components/common/ManagerChip';
import InboundItemList from '@/components/common/InboundItemList';
import ManagerApprovalModal from '@/components/modals/ManagerApproveModal';
import ApproveModal from '@/components/modals/ApproveModal';
import AlertModal from '@/components/modals/AlertModal';
import { getInventoryDetail, getInventoryItems, rejectInventory } from '../../../apis/inventory';
import { approveInventory } from '../../../apis/admin';
import { InboundItem } from '@/components/common/InboundItemList';

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

const FormGroup: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({
  label,
  children,
  className = '',
}) => (
  <div className={className}>
    <label className="italic_none mb-4 block font-pretendard text-[19px] font-bold text-black">
      {label}
    </label>
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

export default function InboundTaskDetailPage() {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const navigate = useNavigate(); //승인 처리 후 자동으로 목록 페이지로 이동?

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusType, setStatusType] = useState<'approve' | 'cancel'>('approve');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshItems, setRefreshItems] = useState(0);
  const [items, setItems] = useState<InboundItem[]>([]);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

  const [taskDetail, setTaskDetail] = useState({
    projectNumber: '',
    taskName: '',
    manager: '',
    assignees: [] as string[],
    requestDate: '',
    description: '',
    status: '',
    inventoryStatus: '', // 원본 inventoryStatus 저장
  });

  useEffect(() => {
    const fetchInventoryDetail = async () => {
      if (!inventoryId) return;

      setIsLoading(true);
      try {
        console.log('=== 입고 업무 상세 API 호출 ===');
        console.log('inventoryId:', inventoryId);
        const response = await getInventoryDetail(inventoryId);
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
            inventoryStatus: result.inventoryStatus || '', // 원본 상태 저장
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
      if (!inventoryId) return;

      try {
        console.log('=== 입고 물품 목록 API 호출 ===');
        console.log('inventoryId:', inventoryId);
        const response = await getInventoryItems(inventoryId);
        console.log('=== 입고 물품 목록 API 응답 ===');
        console.log('응답:', response);

        if (response.isSuccess && response.result) {
          const mappedItems: InboundItem[] = response.result.map((item: any) => ({
            id: item.itemCode || String(item.itemId || Math.random()), // 재고 번호
            stockNumber: item.itemCode || '-', // 재고 번호
            itemName: item.itemName || '-', // 물품명
            reqQty: item.requestedQuantity || item.processedQuantity || '-', // 입고 요청 수량 (없으면 처리된 수량 사용)
            currQty: item.processedQuantity || '-', // 현재 입고 수량
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
  }, [inventoryId, refreshItems]);

  const handleConfirmApproval = async () => {
    if (!inventoryId) return;

    try {
      console.log('=== 입고 승인 API 호출 ===');
      console.log('inventoryId:', inventoryId);
      const response = await approveInventory(inventoryId);
      console.log('=== 입고 승인 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        setIsModalOpen(false);
        setStatusType('approve');
        setIsStatusModalOpen(true);
        // 페이지 새로고침하여 진행 상태 업데이트
        setRefreshItems((prev) => prev + 1);
      } else {
        setAlertModal({ isOpen: true, message: '승인 처리에 실패했습니다.' });
      }
    } catch (error: any) {
      console.error('승인 처리 실패:', error);
      console.error('에러 응답:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 메시지:', error?.message);
      setAlertModal({
        isOpen: true,
        message: `승인 처리 실패: ${error?.response?.data?.message || error?.message || '알 수 없는 오류가 발생했습니다.'}`,
      });
    }
  };

  const handleRejectApproval = async () => {
    if (!inventoryId) return;

    try {
      console.log('=== 입고 거절 API 호출 ===');
      console.log('inventoryId:', inventoryId);
      const response = await rejectInventory(inventoryId);
      console.log('=== 입고 거절 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        setIsModalOpen(false);
        setStatusType('cancel');
        setIsStatusModalOpen(true);
        // 페이지 새로고침하여 진행 상태 업데이트
        setRefreshItems((prev) => prev + 1);
      } else {
        setAlertModal({ isOpen: true, message: '거절 처리에 실패했습니다.' });
      }
    } catch (error: any) {
      console.error('거절 처리 실패:', error);
      console.error('에러 응답:', error?.response?.data);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 메시지:', error?.message);
      setAlertModal({
        isOpen: true,
        message: `거절 처리 실패: ${error?.response?.data?.message || error?.message || '알 수 없는 오류가 발생했습니다.'}`,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div className="relative flex min-h-[1000px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-[0_0_10px_rgba(0,0,0,0.10)]">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            입고 업무 상세
          </h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal leading-normal text-greyColor-grey600">
            요청일: {taskDetail.requestDate}
          </p>

          <div className="mt-[70px] flex-1">
            <div className="mb-[70px] flex justify-between">
              <FormGroup label="진행 상태" className="w-fit">
                <StatusStepBar currentStatus={taskDetail.status} type="inbound" />
              </FormGroup>

              <FormGroup label="프로젝트 넘버" className="w-[390px]">
                <BasicInput
                  value={taskDetail.projectNumber || '-'}
                  disabled={true}
                  readOnly
                  placeholder=""
                  className="text-greyColor-grey400"
                />
              </FormGroup>
            </div>
            <div className="mb-[64px] flex justify-between">
              <FormGroup label="입고 업무명" className="w-[390px]">
                <BasicInput 
                  value={taskDetail.taskName || ''} 
                  disabled={true} 
                  readOnly 
                  placeholder=""
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
            <div className="mb-[40px]">
              <FormGroup label="업무 설명">
                <LargeInput
                  value={taskDetail.description || ''}
                  disabled={true}
                  readOnly
                  placeholder=""
                  className="h-[240px]"
                />
              </FormGroup>
            </div>
            <div className="mb-[40px] mt-[80px]">
              <FormGroup label="입고 물품 목록">
                {taskDetail.status === 'TASK_ASSIGNMENT' ? (
                  <div className="w-full overflow-hidden rounded-t-[10px] border-[2px] border-greyColor-grey200">
                    <div className="flex h-[40px] items-center border-b-[2px] border-greyColor-grey200 bg-greyColor-grey100">
                      <div className="w-[150px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                        재고 번호
                      </div>
                      <div className="w-[180px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                        물품명
                      </div>
                      <div className="w-[180px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                        현재 입고 수량
                      </div>
                      <div className="w-[180px] flex h-full items-center justify-center border-r-[2px] border-greyColor-grey200 font-pretendard text-[14px] font-bold text-black">
                        목표 입고 수량
                      </div>
                      <div className="w-[180px] flex h-full items-center justify-center font-pretendard text-[14px] font-bold text-black">
                        처리 상태
                      </div>
                    </div>
                    <div className="flex h-[40px] items-center justify-center bg-white">
                      <span className="font-pretendard text-[14px] text-greyColor-grey400">없음</span>
                    </div>
                  </div>
                ) : (
                  <InboundItemList status={taskDetail.status} items={items} />
                )}
              </FormGroup>
            </div>
          </div>
          <div className="mt-[50px] flex justify-end">
            {taskDetail.status !== 'IN_PROGRESS' && taskDetail.status !== 'COMPLETED' && (
              <button
                disabled={taskDetail.status !== 'APPROVAL_PENDING' || taskDetail.inventoryStatus === 'REJECT'}
                onClick={() => setIsModalOpen(true)}
                className={`flex h-[50px] w-[113px] items-center justify-center gap-[10px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors duration-300 ${
                  taskDetail.status === 'APPROVAL_PENDING' && taskDetail.inventoryStatus !== 'REJECT'
                    ? 'cursor-pointer bg-mainColor-blue600'
                    : 'cursor-default bg-greyColor-grey300'
                } `}
              >
                결재 처리
              </button>
            )}
          </div>
        </div>
      </main>
      <ManagerApprovalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmApproval}
        onReject={handleRejectApproval}
        closeOnBackdropClick={true}
      />
      <ApproveModal
        isOpen={isStatusModalOpen}
        type={statusType}
        onClose={() => {
          setIsStatusModalOpen(false);
        }}
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
}
