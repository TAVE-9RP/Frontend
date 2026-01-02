import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from '../common/Dropdown';
import { getMemberStatuses, updateMemberStatuses } from '../../apis/admin';
import ConfirmModal from '../modals/ConfirmModal';
import SuccessModal from '../modals/SuccessModal';

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
    return membershipList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lowerCaseSearch) ||
        emp.department.toLowerCase().includes(lowerCaseSearch) ||
        emp.position.toLowerCase().includes(lowerCaseSearch) ||
        emp.email.toLowerCase().includes(lowerCaseSearch),
    );
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
      alert(`변경 실패: ${serverMessage}`);
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

  if (isLoading)
    return <p className="py-10 text-center text-greyColor-grey500">가입 목록을 불러오는 중...</p>;

  return (
    <div className="flex w-[1040px] flex-col items-start">
      <div className="w-full">
        <div className="flex w-full">
          <div className={`${headerBase} w-[170px] rounded-tl-[10px]`}>이름</div>
          <div className={`${headerBase} w-[220px] border-l-0`}>부서</div>
          <div className={`${headerBase} w-[160px] border-l-0`}>직급</div>
          <div className={`${headerBase} w-[230px] border-l-0`}>이메일</div>
          <div className={`${headerBase} w-[260px] rounded-tr-[10px] border-l-0`}>가입 상태</div>
        </div>
        <div className="w-full bg-white">
          {filteredList.length === 0 ? (
            <div className={`${cellBase} border-1 w-full border-r`}>가입 요청 목록이 없습니다.</div>
          ) : (
            filteredList.map((emp) => (
              <div key={emp.memberId} className="flex w-full">
                <div className={`${cellBase} w-[170px]`}>{emp.name}</div>
                <div className={`${cellBase} w-[220px] border-l-0`}>{emp.department}</div>
                <div className={`${cellBase} w-[160px] border-l-0`}>{emp.position}</div>
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
    </div>
  );
}
