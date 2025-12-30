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

  const fetchProjectsByStatus = (status: string) => {
    setIsLoading(true);

    setTimeout(() => {
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

      const formattedSavedProjects: Project[] = savedProjects.map((p: any) => {
        let managerDisplay = '미정';

        if (Array.isArray(p.manager) && p.manager.length > 0) {
          const firstManager = p.manager[0];
          const firstName = firstManager.label || firstManager.name || String(firstManager);

          if (p.manager.length > 1) {
            managerDisplay = `${firstName} 외 ${p.manager.length - 1}명`;
          } else {
            managerDisplay = firstName;
          }
        } else if (typeof p.manager === 'object' && p.manager !== null) {
          managerDisplay = p.manager.label || p.manager.name || '확인 필요';
        } else if (p.manager) {
          managerDisplay = String(p.manager);
        }

        return {
          id: p.id || Date.now(),
          projectNumber: p.projectNumber || 'NEW-PROJ',
          projectTitle: p.title || p.projectTitle || '제목 없음',
          projectDescription: p.description || p.projectDescription || '',
          client: p.client || '',
          creationDate: p.creationDate || new Date().toISOString().split('T')[0],
          manager: managerDisplay,
          status:
            p.status === '진행중'
              ? 'IN_PROGRESS'
              : p.status === '미진행'
                ? 'PENDING'
                : p.status === '완료'
                  ? 'COMPLETED'
                  : 'IN_PROGRESS',
        };
      });

      const allProjects = [...formattedSavedProjects.reverse(), ...MOCK_PROJECT_LIST];
      const filteredList = allProjects.filter((project) => project.status === status);

      setProjectList(filteredList);
      setIsLoading(false);
    }, 300);
  };

  const handleStatusClick = (status: string) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
  };

  const handleCreateProjectClick = () => {
    navigate('/project-create');
  };

  useEffect(() => {
    fetchProjectsByStatus(activeStatus);
  }, [activeStatus]);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex-1">
        <div className="pl-[70px] pr-10 pt-[60px]">
          <div className="mb-[67px] flex items-baseline">
            <h1 className="whitespace-nowrap font-pretendard text-2xl font-bold text-black">
              전체 프로젝트 관리
            </h1>

            <button
              onClick={handleCreateProjectClick}
              className="ml-[725px] flex h-[40px] w-[151px] cursor-pointer items-center justify-center rounded-[10px] border-none bg-mainColor-blue600 transition-colors hover:bg-blue-600"
            >
              <img src="src/assets/add.png" alt="Add Icon" className="mr-[5px] h-[26px] w-[26px]" />
              <span className="font-pretendard text-[17px] font-bold text-white">
                프로젝트 생성
              </span>
            </button>
          </div>

          <div className="mb-[27px] flex items-center">
            <div className="flex gap-[10px]">
              {INITIAL_STATUS_DATA.map((item) => (
                <ProjectStatusButton
                  key={item.status}
                  label={item.label}
                  count={item.count}
                  isActive={activeStatus === item.status}
                  onClick={() => handleStatusClick(item.status)}
                />
              ))}
            </div>

            <div className="ml-[362px]">
              <SearchBar
                placeholder="프로젝트 넘버 또는 프로젝트 제목을 입력하세요."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="pl-[70px] pr-10">
          <ProjectListTable data={filteredProjectList} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
