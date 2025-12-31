import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from '../common/Dropdown';
import { getMemberPermissions, updateMemberPermissions } from '../../apis/admin';
import PermissionConfirmModal from '../modals/PermissionConfirmModal';
import PermissionSuccessModal from '../modals/PermissionSuccessModal';

interface EmployeeListTableProps {
  searchTerm: string;
  isLoading: boolean;
}

const ROLE_MAP: Record<string, string> = {
  ALL: '전체 관리',
  WRITE: '수정 가능',
  READ: '조회 전용',
};

const REVERSE_ROLE_MAP: Record<string, string> = {
  '전체 관리': 'ALL',
  '수정 가능': 'WRITE',
  '조회 전용': 'READ',
};

const PERMISSION_OPTIONS = ['전체 관리', '수정 가능', '조회 전용']; //워딩 확인

export default function EmployeeListTable({
  searchTerm,
  isLoading: parentLoading,
}: EmployeeListTableProps) {
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [permissionChanges, setPermissionChanges] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLocalLoading(true);
      const res = await getMemberPermissions();
      setEmployeeList(res.data.result);
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
    if (!employeeList) return [];
    const lowerCaseSearch = searchTerm.toLowerCase();
    return employeeList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(lowerCaseSearch) ||
        emp.department.toLowerCase().includes(lowerCaseSearch) ||
        emp.position.toLowerCase().includes(lowerCaseSearch),
    );
  }, [employeeList, searchTerm]);

  const handlePermissionChange = (memberId: number, newPermission: string) => {
    setPermissionChanges((prev) => ({ ...prev, [memberId]: newPermission }));
  };

  const handleSaveClick = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsConfirmModalOpen(false);
    setIsSaving(true);

    const updatesArray = Object.entries(permissionChanges).map(([id, role]) => ({
      memberId: Number(id),
      newRole: REVERSE_ROLE_MAP[role],
    }));

    try {
      await updateMemberPermissions(updatesArray);
      setPermissionChanges({});
      await loadData();
      setIsSuccessModalOpen(true);
    } catch (err: any) {
      alert(`저장 실패: ${err.response?.data?.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  const isDirty = Object.keys(permissionChanges).length > 0;
  const isLoading = parentLoading || localLoading;

  const headerBase =
    'h-10 flex items-center justify-center bg-subColor-orange050 border border-greyColor-grey200 text-greyColor-grey800 font-pretendard text-[15px] font-bold';
  const cellBase =
    'h-10 flex items-center justify-center border-b border-l border-r border-greyColor-grey200 text-greyColor-grey700 font-pretendard text-[15px] font-normal';

  if (isLoading)
    return <p className="py-10 text-center text-greyColor-grey500">직원 목록을 불러오는 중...</p>;

  return (
    <div className="flex w-[1040px] flex-col items-start">
      <div className="w-full">
        <div className="flex w-full">
          <div className={`${headerBase} w-[210px] rounded-tl-[10px]`}>이름</div>
          <div className={`${headerBase} w-[290px] border-l-0`}>부서</div>
          <div className={`${headerBase} w-[200px] border-l-0`}>직급</div>
          <div className={`${headerBase} w-[340px] rounded-tr-[10px] border-l-0`}>가입 상태</div>
        </div>

        <div className="w-full bg-white">
          {filteredList.length === 0 ? (
            <div className={`${cellBase} w-full border-l border-r`}>
              등록된 직원 목록이 없습니다.
            </div>
          ) : (
            filteredList.map((emp) => (
              <div key={emp.memberId} className="flex w-full">
                <div className={`${cellBase} w-[210px]`}>{emp.name}</div>
                <div className={`${cellBase} w-[290px] border-l-0`}>{emp.department}</div>
                <div className={`${cellBase} w-[200px] border-l-0`}>{emp.position}</div>
                <div className={`${cellBase} w-[340px] border-l-0`}>
                  <Dropdown
                    options={PERMISSION_OPTIONS}
                    selectedValue={permissionChanges[emp.memberId] || ROLE_MAP[emp.currentRole]}
                    onSelect={(value) => handlePermissionChange(emp.memberId, value)}
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

      <PermissionConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
      />

      <PermissionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
