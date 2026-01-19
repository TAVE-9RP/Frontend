import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from '../common/Dropdown';
import { getMemberStatuses, updateMemberStatuses } from '../../apis/admin';
import ConfirmModal from '../modals/ConfirmModal';
import SuccessModal from '../modals/SuccessModal';
import AlertModal from '../modals/AlertModal';

interface MembershipManagementTableProps {
  searchTerm: string;
  isLoading: boolean;
}

const STATUS_OPTIONS = ['요청 대기', '승인', '거절'];
const STATUS_MAP: Record<string, string> = {
  PENDING: '요청 대기',
  APPROVED: '승인',
  REJECTED: '거절',
};
const REVERSE_STATUS_MAP: Record<string, string> = {
  '요청 대기': 'PENDING',
  승인: 'APPROVED',
  거절: 'REJECTED',
};

// 부서 매핑 함수
const mapDepartment = (department: string): string => {
  switch (department) {
    case 'LOGISTICS':
      return '출하 부서';
    case 'INVENTORY':
      return '입고 부서';
    case 'MANAGEMENT':
      return '관리 부서';
    default:
      return department;
  }
};

// 직급 매핑 함수
const mapPosition = (position: string): string => {
  switch (position) {
    case 'INTERN':
      return '인턴';
    case 'ASSISTANT_MANAGER':
      return '주임';
    case 'MANAGER':
      return '대리';
    case 'SENIOR_MANAGER':
      return '과장';
    case 'DEPARTMENT_HEAD':
      return '부장';
    case 'OWNER':
      return '오너';
    default:
      return position;
  }
};

export default function MembershipManagementTable({
  searchTerm,
  isLoading: parentLoading,
}: MembershipManagementTableProps) {
  const [membershipList, setMembershipList] = useState<any[]>([]);
  const [statusChanges, setStatusChanges] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

  const loadData = async () => {
    try {
      setLocalLoading(true);
      const res = await getMemberStatuses();
      setMembershipList(res.data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredList = useMemo(() => {
    if (!membershipList) return [];
    const lowerCaseSearch = searchTerm.toLowerCase();
    return membershipList.filter((emp) => emp.name.toLowerCase().includes(lowerCaseSearch));
  }, [membershipList, searchTerm]);

  const handleStatusChange = (memberId: number, newStatus: string) => {
    setStatusChanges((prev) => ({ ...prev, [memberId]: newStatus }));
  };

  const handleSaveClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsModalOpen(false);
    setIsSaving(true);

    const updates = Object.entries(statusChanges).map(([id, status]) => ({
      memberId: Number(id),
      newStatus: REVERSE_STATUS_MAP[status],
    }));

    try {
      await updateMemberStatuses(updates);

      setStatusChanges({});
      await loadData();

      setIsSuccessModalOpen(true);
    } catch (err: any) {
      console.error('가입 상태 변경 실패:', err);
      const serverMessage = err.response?.data?.message || '다시 시도해주세요.';
      setAlertModal({ isOpen: true, message: `변경 실패: ${serverMessage}` });
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = Object.keys(statusChanges).length > 0;
  const isLoading = parentLoading || localLoading;

  const headerBase =
    'h-10 flex items-center justify-center bg-subColor-orange050 border border-greyColor-grey200 text-greyColor-grey800 font-pretendard text-[15px] font-bold';
  const cellBase =
    'h-10 flex items-center justify-center border-b border-l border-r border-greyColor-grey200 text-greyColor-grey700 font-pretendard text-[15px] font-normal';

  return (
    <div className="flex w-[1200px] flex-col items-start">
      <div className="w-full">
        <div className="flex w-full">
          <div className={`${headerBase} w-[170px] rounded-tl-[10px]`}>이름</div>
          <div className={`${headerBase} w-[220px] border-l-0`}>부서</div>
          <div className={`${headerBase} w-[160px] border-l-0`}>직급</div>
          <div className={`${headerBase} w-[230px] border-l-0`}>이메일</div>
          <div className={`${headerBase} w-[260px] rounded-tr-[10px] border-l-0`}>가입 상태</div>
        </div>
        <div className="w-full bg-white">
          {isLoading ? (
            <div className={`${cellBase} h-[100px] w-full border-l border-r`}>
              가입 목록을 불러오는 중...
            </div>
          ) : filteredList.length === 0 ? (
            <div className={`${cellBase} h-[100px] w-full border-l border-r`}>
              가입 요청 목록이 없습니다.
            </div>
          ) : (
            filteredList.map((emp) => (
              <div key={emp.memberId} className="flex w-full">
                <div className={`${cellBase} w-[170px]`}>{emp.name}</div>
                <div className={`${cellBase} w-[220px] border-l-0`}>{mapDepartment(emp.department)}</div>
                <div className={`${cellBase} w-[160px] border-l-0`}>{mapPosition(emp.position)}</div>
                <div className={`${cellBase} w-[230px] border-l-0`}>{emp.email}</div>
                <div className={`${cellBase} w-[260px] border-l-0`}>
                  <Dropdown
                    options={STATUS_OPTIONS}
                    selectedValue={statusChanges[emp.memberId] || STATUS_MAP[emp.requestStatus]}
                    onSelect={(value) => handleStatusChange(emp.memberId, value)}
                    statusType="approval"
                    className="w-[110px]"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleSaveClick}
        disabled={!isDirty || isSaving}
        className={`mt-8 flex h-10 w-[113px] items-center justify-center self-end rounded-[10px] font-semibold text-white transition duration-200 ${
          isDirty && !isSaving
            ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
            : 'bg-greyColor-grey300'
        }`}
      >
        {isSaving ? '저장 중...' : '저장하기'}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="가입 상태를 저장하시겠습니까?"
        description="확인을 누르면 변경된 가입 상태가 적용돼요"
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        description="가입 상태 설정이 저장되었어요"
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
}