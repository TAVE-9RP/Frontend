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

export default function ProjectManagementListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<string>('IN_PROGRESS');
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const navigate = useNavigate();

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
      const response = await getProjects(keyword);
      const apiProjects = response.result || response.data || [];
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

      const formattedApiProjects: Project[] = apiProjects.map((p: any) => {
        let managerDisplay = p.projectMembers ? String(p.projectMembers) : '미정';
        let creationDate = p.projectCreateDate
          ? new Date(p.projectCreateDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        let mappedStatus: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED' = 'IN_PROGRESS';
        if (['NOT_STARTED', 'PENDING', '미진행'].includes(p.status)) mappedStatus = 'PENDING';
        else if (['IN_PROGRESS', '진행중'].includes(p.status)) mappedStatus = 'IN_PROGRESS';
        else if (['COMPLETED', '완료'].includes(p.status)) mappedStatus = 'COMPLETED';

        return {
          id: p.projectId || p.id || Date.now(),
          projectNumber: p.projectNumber || 'NEW-PROJ',
          projectTitle: p.projectTitle || '제목 없음',
          projectDescription: p.projectDescription || '',
          client: p.projectCustomer || p.client || '',
          creationDate,
          manager: managerDisplay,
          status: mappedStatus,
        };
      });

      const formattedSavedProjects: Project[] = savedProjects.map((p: any) => {
        let managerDisplay = '미정';
        if (Array.isArray(p.manager) && p.manager.length > 0) {
          const firstName = p.manager[0].label || p.manager[0].name || String(p.manager[0]);
          managerDisplay =
            p.manager.length > 1 ? `${firstName} 외 ${p.manager.length - 1}명` : firstName;
        } else if (p.manager) {
          managerDisplay = p.manager.label || p.manager.name || String(p.manager);
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

      const allProjectsList = [...formattedApiProjects, ...formattedSavedProjects.reverse()];
      setAllProjects(allProjectsList);
      setProjectList(allProjectsList.filter((project) => project.status === status));
    } catch (error) {
      console.error('조회 실패:', error);
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

  const handleCreateProjectClick = () => navigate('/project-create');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjectsByStatus(activeStatus, searchTerm);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [activeStatus, searchTerm]);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />
      <main className="flex flex-1 flex-col items-center">
        <div className="pt-[60px] w-full flex flex-col items-center">
          <div className="w-[1200px]">
            <div className="mb-[67px] flex w-full items-center justify-between">
              <h1 className="whitespace-nowrap font-pretendard text-2xl font-bold text-black">
                전체 프로젝트 관리
              </h1>
              <button
                onClick={handleCreateProjectClick}
                className="flex h-[40px] w-[151px] cursor-pointer items-center justify-center rounded-[10px] border-none bg-mainColor-blue600 transition-colors hover:bg-blue-600"
              >
                <img src="/images/add.png" alt="Add" className="mr-[5px] h-[26px] w-[26px]" />
                <span className="font-pretendard text-[17px] font-bold text-white">
                  프로젝트 생성
                </span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-[27px] w-max pb-20">
          <div className="mb-[27px] flex w-full items-center justify-between">
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
            <div className="w-[450px]">
              <SearchBar
                placeholder="프로젝트 넘버 또는 프로젝트 제목을 입력하세요."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </div>
          <ProjectListTable width="1200px" data={projectList} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}