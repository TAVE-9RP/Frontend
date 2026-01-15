import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import ProjectListTable from '../../../components/common/ProjectListTable';
import { useNavigate } from 'react-router-dom';
import { getProjects } from '@/apis/admin';

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

export default function ProjectManagementListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('IN_PROGRESS'); // 기본값을 IN_PROGRESS로 변경 (진행중)
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]); // 전체 프로젝트 목록 저장
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // 상태별 카운트를 allProjects 기반으로 계산
  const getStatusCounts = (projects: Project[]) => ({
    IN_PROGRESS: projects.filter((p) => p.status === 'IN_PROGRESS').length,
    PENDING: projects.filter((p) => p.status === 'PENDING').length,
    COMPLETED: projects.filter((p) => p.status === 'COMPLETED').length,
  });

  const statusCounts = getStatusCounts(allProjects);

  const statusData = [
    { status: 'IN_PROGRESS', label: '진행중', count: statusCounts.IN_PROGRESS },
    { status: 'PENDING', label: '미진행', count: statusCounts.PENDING },
    { status: 'COMPLETED', label: '완료', count: statusCounts.COMPLETED },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchProjectsByStatus = async (status: string, keyword: string = '') => {
    setIsLoading(true);

    try {
      // API 호출: keyword는 사용자가 입력한 검색어 (없으면 공백)
      const response = await getProjects(keyword);
      console.log('=== 프로젝트 목록 API 응답 ===');
      console.log('응답:', response);

      // API 응답에서 프로젝트 목록 추출
      const apiProjects = response.result || response.data || [];
      console.log('=== API 프로젝트 원본 데이터 ===');
      console.log('apiProjects:', apiProjects);

      // localStorage에서 저장된 프로젝트 가져오기
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

      // API 프로젝트를 Project 인터페이스에 맞게 변환
      const formattedApiProjects: Project[] = apiProjects.map((p: any) => {
        // projectMembers를 manager로 매핑
        let managerDisplay = '미정';
        if (p.projectMembers) {
          managerDisplay = String(p.projectMembers);
        }

        // 날짜 형식 변환 (ISO 형식에서 YYYY-MM-DD로)
        let creationDate = '';
        if (p.projectCreateDate) {
          const date = new Date(p.projectCreateDate);
          creationDate = date.toISOString().split('T')[0];
        } else {
          creationDate = new Date().toISOString().split('T')[0];
        }

        // status 매핑 (NOT_STARTED -> PENDING, IN_PROGRESS -> IN_PROGRESS, COMPLETED -> COMPLETED)
        let mappedStatus: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED' = 'IN_PROGRESS';
        if (p.status === 'NOT_STARTED' || p.status === 'PENDING' || p.status === '미진행') {
          mappedStatus = 'PENDING';
        } else if (p.status === 'IN_PROGRESS' || p.status === '진행중') {
          mappedStatus = 'IN_PROGRESS';
        } else if (p.status === 'COMPLETED' || p.status === '완료') {
          mappedStatus = 'COMPLETED';
        }

        return {
          id: p.projectId || p.id || Date.now(),
          projectNumber: p.projectNumber || 'NEW-PROJ',
          projectTitle: p.projectTitle || '제목 없음',
          projectDescription: p.projectDescription || '',
          client: p.projectCustomer || p.client || '',
          creationDate: creationDate,
          manager: managerDisplay,
          status: mappedStatus,
        };
      });

      // localStorage에 저장된 프로젝트도 변환
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

      // API 프로젝트와 localStorage 프로젝트 합치기
      const allProjectsList = [...formattedApiProjects, ...formattedSavedProjects.reverse()];
      console.log('=== 변환된 전체 프로젝트 ===');
      console.log('allProjects:', allProjectsList);
      console.log('현재 필터링할 status:', status);

      // 전체 프로젝트 목록 저장 (카운트 계산용)
      setAllProjects(allProjectsList);

      const filteredList = allProjectsList.filter((project) => project.status === status);
      console.log('=== 필터링된 프로젝트 ===');
      console.log('filteredList:', filteredList);

      setProjectList(filteredList);
    } catch (error: any) {
      console.error('프로젝트 목록 조회 실패:', error);
      // 에러 발생 시 빈 배열 설정
      setProjectList([]);
      setAllProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusClick = (status: string) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
  };

  const handleCreateProjectClick = () => {
    navigate('/project-create');
  };

  // 상태 변경 시 프로젝트 조회
  useEffect(() => {
    fetchProjectsByStatus(activeStatus, searchTerm);
  }, [activeStatus]);

  // 검색어 변경 시 프로젝트 조회 (debounce 적용)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjectsByStatus(activeStatus, searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex-1">
        <div className="pl-[70px] pr-10 pt-[60px]">
          <div className="mb-[67px] flex items-center">
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
              {statusData.map((item) => (
                <ProjectStatusButton
                  key={item.status}
                  label={item.label}
                  count={item.count}
                  isActive={activeStatus === item.status}
                  onClick={() => handleStatusClick(item.status)}
                />
              ))}
            </div>

            <div className="ml-[382px]">
              <SearchBar
                placeholder="프로젝트 넘버 또는 프로젝트 제목을 입력하세요."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="pl-[70px] pr-10">
          <ProjectListTable data={projectList} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
