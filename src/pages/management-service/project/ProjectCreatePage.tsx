import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import AssignmentChip from '../../../components/common/AssignmentChip';
import DropdownInput, { DropdownOption } from '../../../components/common/DropdownInput';
import DateInput from '../../../components/common/DateInput';
import ProjectCreateModal from '../../../components/modals/ProjectCreateModal';
import ProjectSuccessModal from '../../../components/modals/ProjectSuccessModal';
import { getProjectSerialNumber, getAssignMembers, createProject } from '../../../apis/admin';

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  marginBottom?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children, marginBottom = '0px' }) => (
  <div style={{ marginBottom }}>
    <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">{label}</label>
    {children}
  </div>
);

export default function ProjectCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    client: '',
    jobDescription: '',
    targetYear: '',
    targetMonth: '',
    targetDay: '',
  });

  const [projectNumber, setProjectNumber] = useState<string>('');
  const [isLoadingProjectNumber, setIsLoadingProjectNumber] = useState(true);

  const [activeAssignment, setActiveAssignment] = useState<'inbound' | 'logistics' | null>(null);
  const [inventoryManager, setInventoryManager] = useState<DropdownOption[]>([]);
  const [logisticsManager, setLogisticsManager] = useState<DropdownOption[]>([]);
  const [inventoryOptions, setInventoryOptions] = useState<DropdownOption[]>([]);
  const [logisticsOptions, setLogisticsOptions] = useState<DropdownOption[]>([]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchProjectSerialNumber = async () => {
      try {
        setIsLoadingProjectNumber(true);
        const response = await getProjectSerialNumber();
        if (response.isSuccess && response.result) {
          setProjectNumber(response.result);
        }
      } catch (error) {
        console.error('프로젝트 넘버 가져오기 실패:', error);
      } finally {
        setIsLoadingProjectNumber(false);
      }
    };

    fetchProjectSerialNumber();
  }, []);

  useEffect(() => {
    const fetchAssignMembers = async () => {
      try {
        const response = await getAssignMembers();
        if (response.isSuccess && response.result) {
          // API 응답을 DropdownOption 형식으로 변환
          const allMembers: DropdownOption[] = response.result.map((member: any) => ({
            id: member.memberId,
            label: member.name,
            subLabel: member.department === 'LOGISTICS' ? '물류' : member.department === 'INVENTORY' ? '입고' : '',
            team: member.department === 'LOGISTICS' ? '물류' : member.department === 'INVENTORY' ? '입고' : '',
          }));

          // department에 따라 필터링
          const inventoryMembers = allMembers.filter((member) => member.team === '입고');
          const logisticsMembers = allMembers.filter((member) => member.team === '물류');

          setInventoryOptions(inventoryMembers);
          setLogisticsOptions(logisticsMembers);
        }
      } catch (error) {
        console.error('담당자 목록 가져오기 실패:', error);
      }
    };

    fetchAssignMembers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInventoryManagerOpen = () => {
    // 입고 업무 담당자 드롭다운이 열릴 때 입고 업무로 설정
    setActiveAssignment('inbound');
    setLogisticsManager([]);
  };

  const handleInventoryManagerChange = (selected: DropdownOption[]) => {
    setInventoryManager(selected);
    if (selected.length === 0 && logisticsManager.length === 0) {
      setActiveAssignment(null);
    }
  };

  const handleLogisticsManagerOpen = () => {
    // 물류 업무 담당자 드롭다운이 열릴 때 물류 업무로 설정
    setActiveAssignment('logistics');
    setInventoryManager([]);
  };

  const handleLogisticsManagerChange = (selected: DropdownOption[]) => {
    setLogisticsManager(selected);
    if (selected.length === 0 && inventoryManager.length === 0) {
      setActiveAssignment(null);
    }
  };

  const isFormValid = useMemo(() => {
    const baseValid =
      formData.projectTitle.trim() !== '' &&
      formData.projectDescription.trim() !== '' &&
      formData.client.trim() !== '' &&
      formData.targetYear.trim() !== '' &&
      formData.targetMonth.trim() !== '' &&
      formData.targetDay.trim() !== '';

    // 담당자는 무조건 1명 이상이어야 함
    const managerValid =
      (activeAssignment === 'inbound' && inventoryManager.length > 0) ||
      (activeAssignment === 'logistics' && logisticsManager.length > 0);

    return baseValid && managerValid;
  }, [formData, activeAssignment, inventoryManager, logisticsManager]);

  const handleCreateProject = () => {
    if (isFormValid) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleModalConfirm = async () => {
    setIsConfirmModalOpen(false);
    setIsCreating(true);

    try {
      // 담당자 ID 리스트 추출
      const assigneeIds =
        activeAssignment === 'inbound'
          ? inventoryManager.map((manager) => manager.id)
          : logisticsManager.map((manager) => manager.id);

      // 날짜 형식 변환 (YYYY-MM-DD)
      const formattedDate = `${formData.targetYear}-${String(formData.targetMonth).padStart(2, '0')}-${String(formData.targetDay).padStart(2, '0')}`;

      // API 요청 데이터 구성
      const requestData = {
        projectNumber: projectNumber,
        projectName: formData.projectTitle,
        projectDescription: formData.projectDescription,
        projectCustomer: formData.client,
        projectExpectedEndDate: formattedDate,
        assigneeIds: assigneeIds,
      };

      // API 호출
      const response = await createProject(requestData);

      if (response.isSuccess) {
        setIsSuccessModalOpen(true);
      } else {
        alert(response.message || '프로젝트 생성에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('프로젝트 생성 실패:', error);
      const errorMessage = error?.response?.data?.message || '프로젝트 생성에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleConfirmModalClose = () => setIsConfirmModalOpen(false);

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/project-management');
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div className="flex min-h-[1300px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-[0_0_10px_rgba(0,0,0,0.10)]">
          <h1 className="font-pretendard text-2xl font-bold text-black">프로젝트 생성하기</h1>
          <p className="mt-2 font-pretendard text-[17px] font-normal text-greyColor-grey600">
            프로젝트를 생성하여 사원들에게 업무를 할당해주세요.
          </p>

          <div className="mt-[80px] flex-1">
            <div className="mb-[80px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="프로젝트 넘버">
                  <BasicInput
                    placeholder={isLoadingProjectNumber ? '로딩 중...' : 'SYS-01-001'}
                    value={projectNumber || ''}
                    disabled={true}
                    readOnly
                    className="text-greyColor-grey400"
                  />
                </FormGroup>
              </div>

              <div className="w-[390px]">
                <FormGroup label="프로젝트 제목">
                  <BasicInput
                    placeholder="내용을 입력해주세요"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="mb-[80px]">
              <FormGroup label="프로젝트 설명">
                <LargeInput
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>

            <div className="flex gap-[31px]">
              <div className="w-[390px]">
                <FormGroup label="거래처">
                  <BasicInput
                    placeholder="내용을 입력해주세요"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </div>

              <div className="flex flex-col">
                <span className="mb-4 font-pretendard text-[19px] font-bold">업무 할당</span>

                <div className="flex gap-[20px]">
                  <AssignmentChip
                    label="입고 업무"
                    isActive={activeAssignment === 'inbound'}
                    onClick={() => {}}
                    disabled={true}
                  />

                  <AssignmentChip
                    label="물류 업무"
                    isActive={activeAssignment === 'logistics'}
                    onClick={() => {}}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="mb-[80px] mt-[80px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="입고 업무 담당자">
                  {inventoryOptions.length > 0 ? (
                    <DropdownInput
                      initialSelected={inventoryManager}
                      onChange={handleInventoryManagerChange}
                      onOpen={handleInventoryManagerOpen}
                      disabled={activeAssignment === 'logistics'}
                      options={inventoryOptions}
                    />
                  ) : (
                    <div className="flex h-[50px] w-[390px] items-center rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-4">
                      <span className="font-pretendard text-[17px] text-greyColor-grey400">
                        입고 부서 직원 없음
                      </span>
                    </div>
                  )}
                </FormGroup>
              </div>

              <div className="w-[390px]">
                <FormGroup label="물류 업무 담당자">
                  {logisticsOptions.length > 0 ? (
                    <DropdownInput
                      initialSelected={logisticsManager}
                      onChange={handleLogisticsManagerChange}
                      onOpen={handleLogisticsManagerOpen}
                      disabled={activeAssignment === 'inbound'}
                      options={logisticsOptions}
                    />
                  ) : (
                    <div className="flex h-[50px] w-[390px] items-center rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-4">
                      <span className="font-pretendard text-[17px] text-greyColor-grey400">
                        물류 부서 직원 없음
                      </span>
                    </div>
                  )}
                </FormGroup>
              </div>
            </div>

            <div className="mb-[80px]">
              <FormGroup label="업무 설명">
                <LargeInput
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>

            <div className="mb-[80px]">
              <label className="mb-4 block font-pretendard text-[19px] font-bold text-black">
                목표 완료일
              </label>

              <div className="flex items-center gap-[10px]">
                <DateInput
                  placeholder="2025"
                  unit="년도"
                  width="105px"
                  name="targetYear"
                  value={formData.targetYear}
                  onChange={handleInputChange}
                />

                <DateInput
                  placeholder="08"
                  unit="월"
                  width="68px"
                  name="targetMonth"
                  value={formData.targetMonth}
                  onChange={handleInputChange}
                />

                <DateInput
                  placeholder="10"
                  unit="일"
                  width="68px"
                  name="targetDay"
                  value={formData.targetDay}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-auto flex justify-end">
            <button
              onClick={handleCreateProject}
              disabled={!isFormValid}
              className={`flex h-[50px] w-[113px] items-center justify-center rounded-[10px] px-[15px] py-[5px] font-pretendard text-[19px] font-bold text-white transition-colors duration-300 ${
                isFormValid
                  ? 'cursor-pointer bg-mainColor-blue600 hover:bg-mainColor-blue700'
                  : 'cursor-not-allowed bg-greyColor-grey300'
              }`}
            >
              생성하기
            </button>
          </div>
        </div>
      </main>

      <ProjectCreateModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        onConfirm={handleModalConfirm}
      />

      <ProjectSuccessModal isOpen={isSuccessModalOpen} onClose={handleSuccessModalClose} />
    </div>
  );
}
