import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import ProjectListTable from '../../../components/common/ProjectListTable';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  projectNumber: string;
  projectTitle: string;
  projectDescription: string;
  client: string;
  creationDate: string;
  manager: string;
  status: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';
}

const MOCK_PROJECT_LIST: Project[] = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    projectTitle: '업무명입니다.',
    projectDescription: '거래처입니다.',
    client: '위치입니다.',
    creationDate: '2025-10-25',
    manager: '박하은',
    status: 'IN_PROGRESS',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    projectTitle: '업무명입니다.',
    projectDescription: '거래처입니다.',
    client: '위치입니다.',
    creationDate: '2025-10-25',
    manager: '카피바라',
    status: 'IN_PROGRESS',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    projectTitle: '업무명입니다.',
    projectDescription: '거래처입니다.',
    client: '위치입니다.',
    creationDate: '2025-10-25',
    manager: '타코',
    status: 'PENDING',
  },
  {
    id: 4,
    projectNumber: 'SYS-01-004',
    projectTitle: '업무명입니다.',
    projectDescription: '거래처입니다.',
    client: '위치입니다.',
    creationDate: '2025-10-25',
    manager: '백구',
    status: 'COMPLETED',
  },
  {
    id: 5,
    projectNumber: 'SYS-01-005',
    projectTitle: '업무명입니다.',
    projectDescription: '거래처입니다.',
    client: '위치입니다.',
    creationDate: '2025-10-25',
    manager: '짱구',
    status: 'IN_PROGRESS',
  },
  {
    id: 6,
    projectNumber: 'SYS-01-006',
    projectTitle: '업무명입니다.',
    projectDescription: '거래처입니다.',
    client: '위치입니다.',
    creationDate: '2025-10-25',
    manager: '홍길동',
    status: 'PENDING',
  },
];

// 정적 카운트 대신 상태에 따라 변할 수 있도록 컴포넌트 내부에서 계산하거나
// 여기서는 간단히 초기 Mock 데이터 기준만 유지합니다. (실제 구현 시엔 동적으로 바꿔야 함)
const getStatusCounts = () => ({
  IN_PROGRESS: MOCK_PROJECT_LIST.filter((p) => p.status === 'IN_PROGRESS').length,
  PENDING: MOCK_PROJECT_LIST.filter((p) => p.status === 'PENDING').length,
  COMPLETED: MOCK_PROJECT_LIST.filter((p) => p.status === 'COMPLETED').length,
});

const statusCounts = getStatusCounts();

const INITIAL_STATUS_DATA = [
  { status: 'IN_PROGRESS', label: '진행중', count: statusCounts.IN_PROGRESS },
  { status: 'PENDING', label: '미진행', count: statusCounts.PENDING },
  { status: 'COMPLETED', label: '완료', count: statusCounts.COMPLETED },
];

const pageTitleStyle: React.CSSProperties = {
  color: '#000',
  fontFamily: 'Pretendard',
  fontSize: '24px',
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: 'normal',
};

export default function ProjectManagementListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('IN_PROGRESS');
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredProjectList = projectList.filter(
    (project) =>
      project.projectNumber.includes(searchTerm) || project.projectTitle.includes(searchTerm),
  );

  // [수정됨] LocalStorage 데이터 + Mock 데이터를 합쳐서 상태별로 필터링하는 함수
  // [수정됨] LocalStorage 데이터 + Mock 데이터를 합쳐서 상태별로 필터링하는 함수
  const fetchProjectsByStatus = (status: string) => {
    setIsLoading(true);

    setTimeout(() => {
      // 1. 로컬 스토리지에서 데이터 가져오기
      const savedProjectsString = localStorage.getItem('projects');
      let savedProjects: any[] = [];

      if (savedProjectsString) {
        try {
          const parsed = JSON.parse(savedProjectsString);
          savedProjects = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error('Failed to parse projects from localStorage', e);
        }
      }

      // 2. 데이터 형식 변환 (담당자 이름 추출 로직 강화)
      const formattedSavedProjects: Project[] = savedProjects.map((p: any) => ({
        id: p.id || Date.now(),
        projectNumber: p.projectNumber || 'NEW-PROJ',
        projectTitle: p.title || p.projectTitle || '제목 없음',
        projectDescription: p.description || p.projectDescription || '',
        client: p.client || '',
        creationDate: p.creationDate || new Date().toISOString().split('T')[0],

        // [수정 포인트] 담당자가 객체 배열로 저장되어 있으므로, label(이름)을 추출합니다.
        manager: Array.isArray(p.manager)
          ? p.manager.map((m: any) => m.label || m.name || String(m)).join(', ')
          : typeof p.manager === 'object' && p.manager !== null
            ? p.manager.label || p.manager.name || '확인 필요'
            : p.manager || '미정',

        status:
          p.status === '진행중'
            ? 'IN_PROGRESS'
            : p.status === '미진행'
              ? 'PENDING'
              : p.status === '완료'
                ? 'COMPLETED'
                : 'IN_PROGRESS',
      }));

      // 3. 최신순 정렬 및 Mock 데이터 병합
      const allProjects = [...formattedSavedProjects.reverse(), ...MOCK_PROJECT_LIST];

      // 4. 상태별 필터링
      const filteredList = allProjects.filter((project) => project.status === status);

      setProjectList(filteredList);
      setIsLoading(false);
    }, 300);
  };

  const handleStatusClick = (status: string) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
    // 상태가 변경되면 다시 fetch 실행
    // useEffect에서 activeStatus 변경을 감지하므로 여기서는 상태만 변경해도 됨
  };

  const handleCreateProjectClick = () => {
    navigate('/project-create');
  };

  // activeStatus가 변경될 때마다 데이터를 다시 불러옴
  useEffect(() => {
    fetchProjectsByStatus(activeStatus);
  }, [activeStatus]);

  return (
    <div className="flex min-h-screen w-full">
      <SideBar />

      <main className="flex-1 bg-white">
        <div className="mt-5 pl-[70px] pr-10 pt-10">
          <h1 style={pageTitleStyle}>전체 프로젝트 관리</h1>

          <div className="mt-12 w-[1040px]">
            <SearchBar
              placeholder="프로젝트 넘버 또는 프로젝트 제목을 입력하세요."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="mb-6 mt-5 flex w-[1040px] items-center justify-between">
            <div className="flex gap-4">
              {INITIAL_STATUS_DATA.map((item) => (
                <ProjectStatusButton
                  key={item.status}
                  label={item.label}
                  count={item.count} // 주의: 이 count는 Mock 데이터 기준 고정값입니다. 동적으로 하려면 별도 로직 필요
                  isActive={activeStatus === item.status}
                  onClick={() => handleStatusClick(item.status)}
                />
              ))}
            </div>

            <button
              onClick={handleCreateProjectClick}
              className="flex items-center gap-[5px] bg-mainColor-blue600 transition-colors hover:bg-blue-600"
              style={{
                height: '40px',
                width: '151px',
                borderRadius: '10px',
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {/* 이미지 경로 확인 필요 */}
              <img
                src="src/assets/add.png"
                alt="Add Icon"
                style={{ width: '26px', height: '26px', marginRight: '5px' }}
              />

              <span
                style={{
                  color: '#fff',
                  fontFamily: 'Pretendard',
                  fontSize: '17px',
                  fontWeight: 700,
                  fontStyle: 'normal',
                }}
              >
                프로젝트 생성
              </span>
            </button>
          </div>
        </div>

        <div className="pl-[70px] pr-10">
          <ProjectListTable data={filteredProjectList} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
