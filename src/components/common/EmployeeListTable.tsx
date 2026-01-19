import React, { useState, useEffect, useMemo } from 'react';
import Dropdown from '../common/Dropdown';
import { getMemberPermissions, updateMemberPermissions } from '../../apis/admin';
import ConfirmModal from '../modals/ConfirmModal';
import SuccessModal from '../modals/SuccessModal';
import AlertModal from '../modals/AlertModal';

interface EmployeeListTableProps {
  searchTerm: string;
  isLoading: boolean;
}

const ROLE_MAP: Record<string, string> = {
  ALL: '편집',
  WRITE: '편집',
  READ: '조회',
};

const REVERSE_ROLE_MAP: Record<string, string> = {
  조회: 'READ',
  편집: 'WRITE',
};

const PERMISSION_OPTIONS = ['조회', '편집'];

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
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

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
    return employeeList.filter((emp) => emp.name.toLowerCase().includes(lowerCaseSearch));
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
      setAlertModal({ isOpen: true, message: `저장 실패: ${err.response?.data?.message}` });
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

  return (
    <div className="flex w-[1200px] flex-col items-start">
      <div className="w-full">
        <div className="flex w-full">
          <div className={`${headerBase} w-[20%] rounded-tl-[10px]`}>이름</div>
          <div className={`${headerBase} w-[30%] border-l-0`}>부서</div>
          <div className={`${headerBase} w-[25%] border-l-0`}>직급</div>
          <div className={`${headerBase} w-[25%] rounded-tr-[10px] border-l-0`}>권한 설정</div>
        </div>

        <div className="w-full bg-white">
          {isLoading ? (
            <div className={`${cellBase} h-[100px] w-full border-l border-r`}>
              직원 목록을 불러오는 중...
            </div>
          ) : filteredList.length === 0 ? (
            <div className={`${cellBase} h-[100px] w-full border-l border-r`}>
              등록된 직원 목록이 없습니다.
            </div>
          ) : (
            filteredList.map((emp) => (
              <div key={emp.memberId} className="flex w-full">
                <div className={`${cellBase} w-[20%]`}>{emp.name}</div>
                <div className={`${cellBase} w-[30%] border-l-0`}>
                  {mapDepartment(emp.department)}
                </div>
                <div className={`${cellBase} w-[25%] border-l-0`}>{mapPosition(emp.position)}</div>
                <div className={`${cellBase} w-[25%] border-l-0`}>
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

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmSave}
        title="직원 권한을 저장하시겠습니까?"
        description="확인을 누르면 변경된 권한 설정이 적용돼요"
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        description="직원 권한 설정이 저장되었어요"
      />
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
}
