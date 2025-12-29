import React, { useState, useMemo } from 'react';
import SideBar from '../../../components/common/SideBar';
import BasicInput from '../../../components/common/BasicInput';
import LargeInput from '../../../components/common/LargeInput';
import AssignmentChip from '../../../components/common/AssignmentChip';
import DropdownInput, { DropdownOption } from '../../../components/common/DropdownInput';
import DateInput from '../../../components/common/DateInput';
import ProjectCreateModal from '../../../components/modals/ProjectCreateModal';

const labelStyle: React.CSSProperties = {
  fontFamily: 'Pretendard',
  fontSize: '19px',
  fontWeight: 700,
  color: '#000',
};

const pageTitleStyle: React.CSSProperties = {
  fontFamily: 'Pretendard',
  fontSize: '24px',
  fontWeight: 700,
  color: '#000',
};

const subTextStyle: React.CSSProperties = {
  fontFamily: 'Pretendard',
  fontSize: '17px',
  fontWeight: 400,
  color: '#000',
};

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
  marginBottom?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, children, marginBottom = '0px' }) => (
  <div style={{ marginBottom }}>
    <label style={{ ...labelStyle, display: 'block', marginBottom: '16px' }}>{label}</label>
    {children}
  </div>
);

export default function ProjectCreatePage() {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChipClick = (type: 'inbound' | 'logistics') => {
    setActiveAssignment(type);

    // 선택되지 않은 쪽의 데이터를 초기화합니다.
    if (type === 'inbound') {
      // 입고 업무를 선택하면, 물류 업무 담당자 데이터를 비웁니다.
      setLogisticsManager([]);
    } else {
      // 물류 업무를 선택하면, 입고 업무 담당자 데이터를 비웁니다.
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

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    alert('프로젝트가 성공적으로 생성되었습니다!');
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleCreateProject = () => {
    if (isFormValid) {
      setIsModalOpen(true);
    }
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    width: '113px',
    height: '50px',
    padding: '5px 15px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    fontFamily: 'Pretendard',
    fontSize: '19px',
    fontWeight: 700,
    color: '#FFF',
    cursor: isFormValid ? 'pointer' : 'not-allowed',
    background: isFormValid
      ? 'var(--mainColor-blue600, #3B82F6)'
      : 'var(--greyColor-grey300, #C5C8CE)',
    transition: 'background 0.3s',
  };

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 justify-center pb-10 pt-[70px]">
        <div
          className="flex flex-col shadow-xl"
          style={{
            width: '967px',
            minHeight: '1300px',
            borderRadius: '30px',
            background: '#FFF',
            padding: '78px',
            boxShadow: '0 0 10px rgba(0,0,0,0.10)',
          }}
        >
          <h1 style={pageTitleStyle}>프로젝트 생성하기</h1>
          <p className="mt-2 text-greyColor-grey600" style={subTextStyle}>
            프로젝트를 생성하여 사원들에게 업무를 할당해주세요.
          </p>

          <div className="mt-[80px] flex-1">
            <div className="flex justify-between" style={{ marginBottom: '80px' }}>
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

            <div style={{ marginBottom: '80px' }}>
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
                <span
                  style={{
                    fontFamily: 'Pretendard',
                    fontSize: '19px',
                    fontWeight: 700,
                    marginBottom: '16px',
                  }}
                >
                  업무 할당
                </span>

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

            <div className="mt-[80px] flex justify-between" style={{ marginBottom: '80px' }}>
              <div className="w-[390px]">
                <FormGroup label="입고 업무 담당자">
                  <DropdownInput
                    initialSelected={inventoryManager}
                    onChange={setInventoryManager}
                    disabled={activeAssignment !== 'inbound'} // 물류 업무 선택 시 비활성화
                  />
                </FormGroup>
              </div>

              <div className="w-[390px]">
                <FormGroup label="물류 업무 담당자">
                  <DropdownInput
                    initialSelected={logisticsManager}
                    onChange={setLogisticsManager}
                    disabled={activeAssignment !== 'logistics'} // 입고 업무 선택 시 비활성화
                  />
                </FormGroup>
              </div>
            </div>

            <div style={{ marginBottom: '80px' }}>
              <FormGroup label="업무 설명">
                <LargeInput
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </div>

            <div style={{ marginBottom: '80px' }}>
              <label style={{ ...labelStyle, display: 'block', marginBottom: '16px' }}>
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
            <button style={buttonStyle} onClick={handleCreateProject} disabled={!isFormValid}>
              생성하기
            </button>
          </div>
        </div>
      </main>

      <ProjectCreateModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        message="프로젝트를 생성하시겠습니까?"
      />
    </div>
  );
}
