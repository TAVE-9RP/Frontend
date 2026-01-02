import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import AssignmentChip from '../../../components/common/AssignmentChip';
import DropdownInput, { DropdownOption } from '../../../components/common/DropdownInput';
import DateInput from '../../../components/common/DateInput';
import ProjectCreateModal from '../../../components/modals/ProjectCreateModal';
import ProjectSuccessModal from '../../../components/modals/ProjectSuccessModal';

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

  const [activeAssignment, setActiveAssignment] = useState<'inbound' | 'logistics'>('inbound');
  const [inventoryManager, setInventoryManager] = useState<DropdownOption[]>([]);
  const [logisticsManager, setLogisticsManager] = useState<DropdownOption[]>([]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipClick = (type: 'inbound' | 'logistics') => {
    setActiveAssignment(type);

    if (type === 'inbound') {
      setLogisticsManager([]);
    } else {
      setInventoryManager([]);
    }
  };

  const isFormValid = useMemo(() => {
    const baseValid =
      formData.projectTitle.trim() !== '' &&
      formData.projectDescription.trim() !== '' &&
      formData.client.trim() !== '' &&
      formData.jobDescription.trim() !== '' &&
      formData.targetYear.trim() !== '' &&
      formData.targetMonth.trim() !== '' &&
      formData.targetDay.trim() !== '';

    const managerValid =
      activeAssignment === 'inbound' ? inventoryManager.length > 0 : logisticsManager.length > 0;

    return baseValid && managerValid;
  }, [formData, activeAssignment, inventoryManager, logisticsManager]);

  const handleCreateProject = () => {
    if (isFormValid) {
      setIsConfirmModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    setIsConfirmModalOpen(false);

    const newProject = {
      id: Date.now(),
      projectNumber: 'SYS-01-001',
      title: formData.projectTitle,
      projectTitle: formData.projectTitle,
      description: formData.projectDescription,
      projectDescription: formData.projectDescription,
      client: formData.client,
      jobDescription: formData.jobDescription,
      targetDate: `${formData.targetYear}-${formData.targetMonth}-${formData.targetDay}`,
      type: activeAssignment,
      manager: activeAssignment === 'inbound' ? inventoryManager : logisticsManager,
      status: '진행중',
      creationDate: new Date().toISOString().split('T')[0],
    };

    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    localStorage.setItem('projects', JSON.stringify([...existingProjects, newProject]));

    setIsSuccessModalOpen(true);
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
                    placeholder="SYS-01-001"
                    value="SYS-01-001"
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
                    onClick={() => handleChipClick('inbound')}
                  />

                  <AssignmentChip
                    label="물류 업무"
                    isActive={activeAssignment === 'logistics'}
                    onClick={() => handleChipClick('logistics')}
                  />
                </div>
              </div>
            </div>

            <div className="mb-[80px] mt-[80px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="입고 업무 담당자">
                  <DropdownInput
                    initialSelected={inventoryManager}
                    onChange={setInventoryManager}
                    disabled={activeAssignment !== 'inbound'}
                  />
                </FormGroup>
              </div>

              <div className="w-[390px]">
                <FormGroup label="물류 업무 담당자">
                  <DropdownInput
                    initialSelected={logisticsManager}
                    onChange={setLogisticsManager}
                    disabled={activeAssignment !== 'logistics'}
                  />
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
