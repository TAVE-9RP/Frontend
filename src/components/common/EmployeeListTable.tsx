import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from '../common/Dropdown';
import { getMemberPermissions, updateMemberPermissions } from '../../apis/admin';

interface EmployeeListTableProps {
  searchTerm: string;
  isLoading: boolean;
}

const ROLE_MAP: Record<string, string> = {
  ALL: '전체',
  WRITE: '재고',
  READ: '물류',
};

const REVERSE_ROLE_MAP: Record<string, string> = {
  전체: 'ALL',
  재고: 'WRITE',
  물류: 'READ',
  관리자: 'ALL',
};

const PERMISSION_OPTIONS = ['전체', '재고', '물류'];

export default function EmployeeListTable({
  searchTerm,
  isLoading: parentLoading,
}: EmployeeListTableProps) {
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [permissionChanges, setPermissionChanges] = useState<Record<number, string>>({});
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);

    const updatesArray = Object.entries(permissionChanges).map(([id, role]) => ({
      memberId: Number(id),
      newRole: REVERSE_ROLE_MAP[role],
    }));

    try {
      await updateMemberPermissions(updatesArray);
      setPermissionChanges({});
      await loadData();
      alert('권한이 성공적으로 변경되었습니다!');
    } catch (err: any) {
      console.error('❌ 상세 에러:', err.response?.data);
      alert(`저장 실패: ${err.response?.data?.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const isDirty = Object.keys(permissionChanges).length > 0;
  const isLoading = parentLoading || localLoading;

  const tableHeaderClasses =
    'py-3 px-4 font-bold text-sm text-greyColor-grey700 bg-subColor-orange050 border-b border-subColor-orange100 border-r border-greyColor-grey200';
  const tableCellClasses =
    'py-2 px-4 text-sm text-greyColor-grey800 border-b border-greyColor-grey200 border-r border-greyColor-grey200';

  if (isLoading)
    return <p className="py-10 text-center text-greyColor-grey500">직원 목록을 불러오는 중...</p>;

  return (
    <div className="flex w-[1040px] flex-col items-start">
      <div className="mb-8 w-full overflow-x-auto border border-greyColor-grey200">
        <table className="min-w-full divide-y divide-greyColor-grey200">
          <thead className="bg-subColor-orange050">
            <tr>
              <th className={`${tableHeaderClasses} w-[150px] text-left`}>이름</th>
              <th className={`${tableHeaderClasses} w-[200px] text-left`}>부서</th>
              <th className={`${tableHeaderClasses} w-[150px] text-left`}>직급</th>
              <th className={`${tableHeaderClasses} border-r-0 text-center`}>권한 설정</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-greyColor-grey200 bg-white">
            {filteredList.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className={`${tableCellClasses} border-r-0 text-center text-greyColor-grey500`}
                >
                  등록된 직원 목록이 없습니다.
                </td>
              </tr>
            ) : (
              filteredList.map((emp) => (
                <tr key={emp.memberId}>
                  <td className={tableCellClasses}>{emp.name}</td>
                  <td className={tableCellClasses}>{emp.department}</td>
                  <td className={tableCellClasses}>{emp.position}</td>
                  <td className={`${tableCellClasses} w-[300px] border-r-0 text-center`}>
                    <div className="flex justify-center">
                      <Dropdown
                        options={PERMISSION_OPTIONS}
                        selectedValue={permissionChanges[emp.memberId] || ROLE_MAP[emp.currentRole]}
                        onSelect={(value) => handlePermissionChange(emp.memberId, value)}
                        className="w-full max-w-[150px]"
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
