import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import AssignmentChip from '../../../components/common/AssignmentChip';
import DropdownInput, { DropdownOption } from '../../../components/common/DropdownInput';
import DateInput from '../../../components/common/DateInput';
import ProjectCreateModal from '../../../components/modals/ProjectCreateModal';
import ProjectSuccessModal from '@/components/modals/ProjectSuccessModal';
import { getProjectDetail } from '@/apis/admin';

const MOCK_PROJECT_LIST = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    projectTitle: '업무명입니다.',
    projectDescription: '거래처입니다.',
    client: '위치입니다.',
    creationDate: '2025-10-25',
    manager: '박하은',
    status: 'IN_PROGRESS',
    type: 'inbound',
    targetDate: '2025-10-30',
    jobDescription: '기존에 입력된 업무 설명입니다.',
  },
];

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

export default function ProjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [projectNumber, setProjectNumber] = useState('');
  const [formData, setFormData] = useState({
    projectTitle: '',
    projectDescription: '',
    client: '',
    jobDescription: '',
    targetYear: '',
    targetMonth: '',
    targetDay: '',
  });

  const [activeAssignment, setActiveAssignment] = useState<{
    inbound: boolean;
    logistics: boolean;
  }>({ inbound: false, logistics: false });
  const [inventoryManager, setInventoryManager] = useState<DropdownOption[]>([]);
  const [logisticsManager, setLogisticsManager] = useState<DropdownOption[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const projectId = Number(id);
        const response = await getProjectDetail(projectId);
        console.log('=== 프로젝트 상세 API 응답 ===');
        console.log('응답:', response);

        const project = response.result;
        if (project) {
          // 프로젝트 넘버 설정
          setProjectNumber(project.projectNumber || '');

          // 날짜 분리 (expectedEndDate: "2025-11-02")
          const dateParts = (project.expectedEndDate || '').split('-');

          // 폼 데이터 설정
          setFormData({
            projectTitle: project.projectTitle || '',
            projectDescription: project.description || '',
            client: project.customer || '',
            jobDescription: project.taskDescription || '',
            targetYear: dateParts[0] || '',
            targetMonth: dateParts[1] || '',
            targetDay: dateParts[2] || '',
          });

          // projectMembers를 기반으로 업무 할당 및 담당자 설정
          const projectMembers = project.projectMembers || [];

          const inventoryMembers: DropdownOption[] = [];
          const logisticsMembers: DropdownOption[] = [];

          projectMembers.forEach((member: any) => {
            const formattedMember: DropdownOption = {
              id: member.memberId,
              label: member.name,
              subLabel: member.department || '',
              team: member.department || '부서 미정',
            };

            if (member.department === 'LOGISTICS' || member.department === 'logistics') {
              logisticsMembers.push(formattedMember);
            } else if (
              member.department === 'INVENTORY' ||
              member.department === 'inventory' ||
              member.department === 'MANAGEMENT' ||
              member.department === 'management'
            ) {
              // INVENTORY 또는 MANAGEMENT는 inbound로 처리
              inventoryMembers.push(formattedMember);
            }
          });

          // 담당자가 있으면 해당 업무 활성화
          console.log('입고 담당자:', inventoryMembers);
          console.log('물류 담당자:', logisticsMembers);
          setActiveAssignment({
            inbound: inventoryMembers.length > 0,
            logistics: logisticsMembers.length > 0,
          });
          setInventoryManager(inventoryMembers);
          setLogisticsManager(logisticsMembers);
        }
      } catch (error: any) {
        console.error('프로젝트 상세 조회 실패:', error);
        // 에러 발생 시 localStorage에서 찾기 (fallback)
        const projectId = Number(id);
        const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        const foundProject =
          savedProjects.find((p: any) => p.id === projectId) ||
          MOCK_PROJECT_LIST.find((p) => p.id === projectId);

        if (foundProject) {
          setProjectNumber(foundProject.projectNumber || '');
          const dateParts = (foundProject.targetDate || '').split('-');
          setFormData({
            projectTitle: foundProject.title || foundProject.projectTitle || '',
            projectDescription: foundProject.description || foundProject.projectDescription || '',
            client: foundProject.client || '',
            jobDescription: foundProject.jobDescription || '',
            targetYear: dateParts[0] || '',
            targetMonth: dateParts[1] || '',
            targetDay: dateParts[2] || '',
          });
          const type = foundProject.type || 'inbound';
          const rawManager = foundProject.manager;
          let formattedManager: DropdownOption[] = [];
          if (Array.isArray(rawManager)) {
            formattedManager = rawManager;
          } else if (typeof rawManager === 'object' && rawManager !== null) {
            formattedManager = [rawManager];
          } else if (typeof rawManager === 'string') {
            formattedManager = [
              {
                id: Date.now(),
                label: rawManager,
                subLabel: '기존 담당자',
                team: '부서 미정',
              },
            ];
          }
          if (type === 'inbound') {
            setInventoryManager(formattedManager);
            setActiveAssignment({
              inbound: formattedManager.length > 0,
              logistics: false,
            });
          } else {
            setLogisticsManager(formattedManager);
            setActiveAssignment({
              inbound: false,
              logistics: formattedManager.length > 0,
            });
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetail();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipClick = (type: 'inbound' | 'logistics') => {
    // 읽기 전용이므로 클릭해도 변경되지 않음
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

    const managerValid = inventoryManager.length > 0 || logisticsManager.length > 0;

    return baseValid && managerValid;
  }, [formData, activeAssignment, inventoryManager, logisticsManager]);

  const handleCreateProject = () => {
    if (isFormValid) {
      setIsModalOpen(true);
    }
  };

  const handleModalConfirm = () => {
    const projectId = Number(id);
    const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');

    const updatedProjectData = {
      id: projectId,
      projectNumber: projectNumber,
      title: formData.projectTitle,
      projectTitle: formData.projectTitle,
      description: formData.projectDescription,
      projectDescription: formData.projectDescription,
      client: formData.client,
      jobDescription: formData.jobDescription,
      targetDate: `${formData.targetYear}-${formData.targetMonth}-${formData.targetDay}`,
      type: activeAssignment.inbound ? 'inbound' : 'logistics',
      manager: activeAssignment.inbound ? inventoryManager : logisticsManager,
      status: 'IN_PROGRESS',
      creationDate: new Date().toISOString().split('T')[0],
    };

    const index = existingProjects.findIndex((p: any) => p.id === projectId);

    let newProjectsList;
    if (index !== -1) {
      newProjectsList = [...existingProjects];
      newProjectsList[index] = { ...newProjectsList[index], ...updatedProjectData };
    } else {
      newProjectsList = [...existingProjects, updatedProjectData];
    }

    localStorage.setItem('projects', JSON.stringify(newProjectsList));

    setIsModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleSuccessClose = () => {
    setIsSuccessModalOpen(false);
    navigate('/project-management');
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div className="flex min-h-[1300px] w-[967px] flex-col rounded-[30px] bg-white p-[78px] shadow-[0_0_10px_rgba(0,0,0,0.10)]">
          <h1 className="font-pretendard text-2xl font-bold text-black">
            프로젝트 상세 {/* 및 수정하기 */}
          </h1>

          <div className="mt-[80px] flex-1">
            <div className="mb-[80px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="프로젝트 넘버">
                  <BasicInput
                    placeholder="SYS-01-001"
                    value={projectNumber}
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
                    disabled={true}
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
                  disabled={true}
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
                    disabled={true}
                  />
                </FormGroup>
              </div>

              <div className="flex flex-col">
                <span className="mb-4 font-pretendard text-[19px] font-bold">업무 할당</span>

                <div className="flex gap-[20px]">
                  <AssignmentChip
                    label="입고 업무"
                    isActive={activeAssignment.inbound}
                    onClick={() => handleChipClick('inbound')}
                    disabled={true}
                  />
                  <AssignmentChip
                    label="물류 업무"
                    isActive={activeAssignment.logistics}
                    onClick={() => handleChipClick('logistics')}
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            <div className="mb-[80px] mt-[80px] flex justify-between">
              <div className="w-[390px]">
                <FormGroup label="입고 업무 담당자">
                  {inventoryManager.length > 0 ? (
                    <DropdownInput
                      initialSelected={inventoryManager}
                      onChange={setInventoryManager}
                      disabled={true}
                    />
                  ) : (
                    <div className="flex h-[50px] w-[390px] items-center rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-4">
                      <span className="font-pretendard text-[17px] text-greyColor-grey400">
                        없음
                      </span>
                    </div>
                  )}
                </FormGroup>
              </div>

              <div className="w-[390px]">
                <FormGroup label="출하 업무 담당자">
                  {logisticsManager.length > 0 ? (
                    <DropdownInput
                      initialSelected={logisticsManager}
                      onChange={setLogisticsManager}
                      disabled={true}
                    />
                  ) : (
                    <div className="flex h-[50px] w-[390px] items-center rounded-[10px] border border-greyColor-grey400 bg-greyColor-grey100 px-4">
                      <span className="font-pretendard text-[17px] text-greyColor-grey400">
                        없음
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
                  disabled={true}
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
                  disabled={true}
                />
                <DateInput
                  placeholder="08"
                  unit="월"
                  width="68px"
                  name="targetMonth"
                  value={formData.targetMonth}
                  onChange={handleInputChange}
                  disabled={true}
                />
                <DateInput
                  placeholder="10"
                  unit="일"
                  width="68px"
                  name="targetDay"
                  value={formData.targetDay}
                  onChange={handleInputChange}
                  disabled={true}
                />
              </div>
            </div>
          </div>

          {/* <div className="mt-auto flex justify-end">
            <button
              onClick={handleCreateProject}
              disabled={!isFormValid}
              className={`flex h-[50px] w-[113px] items-center justify-center rounded-[10px] px-[15px] py-[5px] font-pretendard text-[19px] font-bold text-white transition-colors duration-300 ${
                isFormValid
                  ? 'cursor-pointer bg-mainColor-blue600 hover:bg-mainColor-blue700'
                  : 'cursor-not-allowed bg-greyColor-grey300'
              }`}
            >
              수정하기
            </button>
          </div> */}
        </div>
      </main>

      <ProjectCreateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        type="edit"
      />
      <ProjectSuccessModal isOpen={isSuccessModalOpen} onClose={handleSuccessClose} type="edit" />
    </div>
  );
}
