import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from '../common/Dropdown';
import { getMemberStatuses, updateMemberStatuses } from '../../apis/admin';

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

  const handleSave = async () => {
    setIsSaving(true);

    const updates = Object.entries(statusChanges).map(([id, status]) => ({
      memberId: Number(id),
      newStatus: REVERSE_STATUS_MAP[status],
    }));

    try {
      await updateMemberStatuses(updates);

      setStatusChanges({});
      await loadData();

      alert('성공적으로 변경되었습니다.');
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

  const tableHeaderClasses =
    'py-3 px-4 font-bold text-sm text-greyColor-grey700 bg-subColor-orange050 border-b border-subColor-orange100 border-r border-greyColor-grey200';
  const tableCellClasses =
    'py-2 px-4 text-sm text-greyColor-grey800 border-b border-greyColor-grey200 border-r border-greyColor-grey200';

  if (isLoading)
    return <p className="py-10 text-center text-greyColor-grey500">가입 목록을 불러오는 중...</p>;

  return (
    <div className="flex w-[1040px] flex-col items-start">
      <div className="mb-8 w-full overflow-x-auto border border-greyColor-grey200">
        <table className="min-w-full divide-y divide-greyColor-grey200">
          <thead className="bg-subColor-orange050">
            <tr>
              <th className={`${tableHeaderClasses} w-[100px] text-left`}>이름</th>
              <th className={`${tableHeaderClasses} w-[150px] text-left`}>부서</th>
              <th className={`${tableHeaderClasses} w-[150px] text-left`}>직급</th>
              <th className={`${tableHeaderClasses} text-left`}>이메일</th>
              <th className={`${tableHeaderClasses} border-r-0 text-center`}>가입 상태</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-greyColor-grey200 bg-white">
            {filteredList.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className={`${tableCellClasses} border-r-0 text-center text-greyColor-grey500`}
                >
                  가입 요청 목록이 없습니다.
                </td>
              </tr>
            ) : (
              filteredList.map((emp) => (
                <tr key={emp.memberId}>
                  <td className={tableCellClasses}>{emp.name}</td>
                  <td className={tableCellClasses}>{emp.department}</td>
                  <td className={tableCellClasses}>{emp.position}</td>
                  <td className={tableCellClasses}>{emp.email}</td>
                  <td className={`${tableCellClasses} w-[200px] border-r-0 text-center`}>
                    <div className="flex justify-center">
                      <Dropdown
                        options={STATUS_OPTIONS}
                        selectedValue={statusChanges[emp.memberId] || STATUS_MAP[emp.requestStatus]}
                        onSelect={(value) => handleStatusChange(emp.memberId, value)}
                        statusType="approval"
                        className="w-full max-w-[120px]"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleSave}
        disabled={!isDirty || isSaving}
        className={`flex h-10 w-[113px] items-center justify-center self-end rounded-[10px] px-[15px] py-[5px] font-semibold text-white transition duration-200 ${
          isDirty && !isSaving
            ? 'bg-mainColor-blue600 hover:bg-mainColor-blue700'
            : 'cursor-not-allowed bg-greyColor-grey300'
        }`}
      >
        {isSaving ? '저장 중...' : '저장하기'}
      </button>
    </div>
  );
}
