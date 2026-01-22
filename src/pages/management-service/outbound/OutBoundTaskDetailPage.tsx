import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import StatusStepBar from '../../../components/common/StatusStepBar';
import ManagerChip from '@/components/common/ManagerChip';
import ManagerApprovalModal from '@/components/modals/ManagerApproveModal';
import ApproveModal from '@/components/modals/ApproveModal';
import AlertModal from '@/components/modals/AlertModal';
import OutboundItemList, { OutboundItem } from '@/components/common/OutboundItemList';
import { getLogisticsDetail, getLogisticsItems } from '../../../apis/ownerLogistics';
import { approveLogistics, rejectLogistics } from '../../../apis/admin';

const MOCK_DATA_OUTBOUND = [
  {
    projectNumber: 'SYS-01-001',
    taskName: '강아지 껌 대량 출고',
    manager: '강아껌',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'APPROVAL_PENDING',
  },
  {
    projectNumber: 'SYS-01-002',
    taskName: '밥주세요',
    manager: '홍길동',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'APPROVAL_PENDING',
  },
  {
    projectNumber: 'SYS-01-003',
    taskName: '쫀득쿠키',
    manager: '김쫀득',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    projectNumber: 'SYS-01-004',
    taskName: '두쫀쿠',
    manager: '두바이',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'COMPLETED',
  },
  {
    projectNumber: 'SYS-01-005',
    taskName: '얼망고',
    manager: '망고짱',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'TASK_ASSIGNMENT',
  },
  {
    projectNumber: 'SYS-01-006',
    taskName: '업무명입니다.',
    manager: '홍길동',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    projectNumber: 'SYS-01-007',
    taskName: '포테이토피자',
    manager: '박하은',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
    status: 'IN_PROGRESS',
  },
  {
    projectNumber: 'SYS-01-008',
    taskName: '페퍼로니피자',
    manager: '피자최고',
    requestDate: '2025-10-25',
    vehicle: '5톤 트럭',
    carrier: '대한통운',
    description: '전국 대리점 배송을 위한 대량 출고 건입니다.',
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
    <div className="mt-[16px]">{children}</div>
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

// API 응답의 logisticsStatus를 StatusStepBar가 기대하는 형식으로 매핑
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

// API 응답의 logisticsProcessingStatus를 한글로 매핑
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

export default function OutboundTaskDetailPage() {
  const { logisticsId } = useParams<{ logisticsId: string }>();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusType, setStatusType] = useState<'approve' | 'cancel'>('approve');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [items, setItems] = useState<OutboundItem[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

  const [taskDetail, setTaskDetail] = useState({
    projectNumber: '',
    taskName: '',
    assignees: [] as string[],
    requestDate: '',
    vehicle: '',
    carrier: '',
    description: '',
    status: '',
    logisticsStatus: '', // 원본 logisticsStatus 저장
  });

  useEffect(() => {
    const fetchLogisticsDetail = async () => {
      if (!logisticsId) return;

      setIsLoading(true);
      try {
        console.log('=== 출하 업무 상세 API 호출 ===');
        console.log('logisticsId:', logisticsId);
        const response = await getLogisticsDetail(logisticsId);
        console.log('=== 출하 업무 상세 API 응답 ===');
        console.log('응답:', response);

        console.log('=== 응답 확인 ===');
        console.log('isSuccess:', response.isSuccess);
        console.log('result:', response.result);
        console.log('result type:', typeof response.result);
        console.log('result is array:', Array.isArray(response.result));

        if (response.isSuccess && response.result) {
          const result = response.result;
          console.log('=== 응답 result ===');
          console.log('result:', result);
          const newTaskDetail = {
            projectNumber: formatNullValue(result.projectNumber),
            taskName: result.logisticsTitle || '',
            assignees: result.logisticsAssignees || [],
            requestDate: formatDate(result.logisticsRequestedAt),
            vehicle: result.logisticsCarrier || '',
            carrier: result.logisticsCarrierCompany || '',
            description: result.logisticsDescription || '',
            status: mapStatusForStepBar(result.logisticsStatus),
            logisticsStatus: result.logisticsStatus || '', // 원본 상태 저장
          };
          console.log('=== 설정할 taskDetail ===');
          console.log('newTaskDetail:', newTaskDetail);
          console.log('status mapped:', mapStatusForStepBar(result.logisticsStatus));
          setTaskDetail(newTaskDetail);
          console.log('=== setTaskDetail 호출 완료 ===');
        } else {
          console.warn('=== 응답 조건 불일치 ===');
          console.warn('isSuccess:', response.isSuccess);
          console.warn('result:', response.result);
          console.warn('result truthy:', !!response.result);
        }
      } catch (error: any) {
        console.error('출하 업무 상세 정보 가져오기 실패:', error);
        console.error('에러 응답:', error?.response?.data);
        console.error('에러 상태 코드:', error?.response?.status);
        console.error('에러 메시지:', error?.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLogisticsItems = async () => {
      if (!logisticsId) return;

      try {
        console.log('=== 출하 물품 목록 API 호출 ===');
        console.log('logisticsId:', logisticsId);
        const response = await getLogisticsItems(logisticsId);
        console.log('=== 출하 물품 목록 API 응답 ===');
        console.log('응답:', response);

        if (response.isSuccess && response.result) {
          const mappedItems: OutboundItem[] = response.result.map((item: any) => ({
            id: item.logisticsItemId || item.itemId || Math.random(),
            itemName: item.itemName || '-',
            currQty: item.processedQuantity || 0,
            targetQty: item.targetedQuantity || 0,
            unitPrice: item.itemPrice || 0,
            status: mapProcessingStatus(item.logisticsProcessingStatus),
            totalPrice: item.itemTotalPrice,
          }));
          console.log('=== 매핑된 출하 물품 목록 ===');
          console.log('mappedItems:', mappedItems);
          setItems(mappedItems);
        } else {
          setItems([]);
        }
      } catch (error: any) {
        console.error('출하 물품 목록 가져오기 실패:', error);
        console.error('에러 응답:', error?.response?.data);
        console.error('에러 상태 코드:', error?.response?.status);
        console.error('에러 메시지:', error?.message);
        setItems([]);
      }
    };

    fetchLogisticsDetail();
    fetchLogisticsItems();
  }, [logisticsId, refreshKey]);

  const handleConfirmApproval = async () => {
    if (!logisticsId) return;

    try {
      console.log('=== 출하 승인 API 호출 ===');
      console.log('logisticsId:', logisticsId);
      const response = await approveLogistics(logisticsId);
      console.log('=== 출하 승인 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        setIsModalOpen(false);
        setStatusType('approve');
        setIsStatusModalOpen(true);
        // 페이지 새로고침하여 진행 상태 업데이트
        setRefreshKey((prev) => prev + 1);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleRejectApproval = async () => {
    if (!logisticsId) return;

    try {
      console.log('=== 출하 거절 API 호출 ===');
      console.log('logisticsId:', logisticsId);
      const response = await rejectLogistics(logisticsId);
      console.log('=== 출하 거절 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        setIsModalOpen(false);
        setStatusType('cancel');
        setIsStatusModalOpen(true);
        // 페이지 새로고침하여 진행 상태 업데이트
        setRefreshKey((prev) => prev + 1);
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

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div className="relative flex min-h-[1000px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-[0_0_10px_rgba(0,0,0,0.10)]">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            출하 업무 상세
          </h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal leading-normal text-greyColor-grey600">
            요청일: {taskDetail.requestDate || '-'}
          </p>

          <div className="mt-[70px] flex-1">
            <div className="mb-[64px] flex justify-between">
              <FormGroup label="진행 상태" className="w-fit">
                <StatusStepBar currentStatus={taskDetail.status} type="outbound" />
              </FormGroup>

              <FormGroup label="프로젝트 넘버" className="w-[390px]">
                <BasicInput
                  value={taskDetail.projectNumber || '-'}
                  disabled={true}
                  readOnly
                  placeholder=""
                  className="text-black"
                />
              </FormGroup>
            </div>

            <div className="mb-[64px] flex justify-between">
              <FormGroup label="출하 업무명" className="w-[390px]">
                <BasicInput
                  value={taskDetail.taskName || ''}
                  disabled={true}
                  readOnly
                  placeholder=""
                  className="text-black"
                />
              </FormGroup>

              <FormGroup label="출하 업무 담당자" className="w-[390px]">
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

            <div className="mb-[64px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="운송수단">
                  <BasicInput
                    value={taskDetail.vehicle || ''}
                    disabled={true}
                    readOnly
                    placeholder=""
                    className="text-black"
                  />
                </FormGroup>
              </div>
              <div className="w-[390px]">
                <FormGroup label="운송업체">
                  <BasicInput
                    value={taskDetail.carrier || ''}
                    disabled={true}
                    readOnly
                    placeholder=""
                    className="text-black"
                  />
                </FormGroup>
              </div>
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

            <div className="mt-[80px]">
              <FormGroup label="출하 물품 목록">
                <OutboundItemList status={taskDetail.logisticsStatus || taskDetail.status} items={items} />
              </FormGroup>
            </div>
          </div>

          {taskDetail.logisticsStatus !== 'IN_PROGRESS' && (
            <div className="mt-[50px] flex justify-end">
              <button
                disabled={
                  taskDetail.status !== 'APPROVAL_PENDING' ||
                  taskDetail.logisticsStatus === 'REJECT'
                }
                onClick={() => setIsModalOpen(true)}
                className={`flex h-[50px] w-[113px] items-center justify-center gap-[10px] rounded-[10px] font-pretendard text-[19px] font-bold text-white transition-colors duration-300 ${
                  taskDetail.status === 'APPROVAL_PENDING' &&
                  taskDetail.logisticsStatus !== 'REJECT'
                    ? 'cursor-pointer bg-mainColor-blue600'
                    : 'cursor-default bg-greyColor-grey300'
                }`}
              >
                결재 처리
              </button>
            </div>
          )}
        </div>
      </main>

      <ManagerApprovalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmApproval}
        onReject={handleRejectApproval}
      />
      <ApproveModal
        isOpen={isStatusModalOpen}
        type={statusType}
        onClose={() => setIsStatusModalOpen(false)}
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
}
