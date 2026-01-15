import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '@/components/common/SideBar';
import DashboardChart from '@/components/dashboard/DashboardChart';
import DashboardTab from '@/components/dashboard/DashboardTab';
import LeadTimeChart from '@/components/dashboard/LeadTimeChart';
import circleMark from '@/assets/circlemark.png';
import circleMarkDark from '@/assets/circlemark_dark.png';
import ellipse from '@/assets/ellipse.png';
import nextIcon from '@/assets/next_1.png';
import { getDashboard } from '@/apis/dashboard';
import { getProjects } from '@/apis/admin';
import { getInventoryList } from '@/apis/inventory';
import { getLogisticsList } from '@/apis/ownerLogistics';

type FilterStatus = '업무 할당' | '승인 대기' | '진행중' | '입고 완료';
type ProjectFilterStatus = '진행중' | '미진행' | '완료';
type InventoryStatus = 'ASSIGNED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
type LogisticsStatus = 'ASSIGNED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

interface DashboardData {
  projectCompletionRate: number;
  longTermTaskRate: number;
  safetyStockRate: number;
  turnOverRate: number;
  shipmentCompletionRate: number;
}

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

interface InboundTask {
  id: number;
  projectNumber: string;
  taskName: string;
  requestDate: string;
}

interface OutboundTask {
  id: number;
  projectNumber: string;
  taskName: string;
  requestDate: string;
}

interface InventoryTask {
  id: number;
  projectNumber: string;
  taskName: string;
  requestDate: string;
  status: InventoryStatus;
}

interface LogisticsTask {
  id: number;
  projectNumber: string;
  taskName: string;
  requestDate: string;
  status: LogisticsStatus;
}

export default function ManagementHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProjectFilterStatus>('진행중');
  const [safetyInventoryTab, setSafetyInventoryTab] = useState<FilterStatus>('업무 할당');
  const [logisticsTab, setLogisticsTab] = useState<FilterStatus>('업무 할당');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [pendingInboundTasks, setPendingInboundTasks] = useState<InboundTask[]>([]);
  const [pendingOutboundTasks, setPendingOutboundTasks] = useState<OutboundTask[]>([]);
  const [inventoryTasks, setInventoryTasks] = useState<InventoryTask[]>([]);
  const [allInventoryTasks, setAllInventoryTasks] = useState<InventoryTask[]>([]);
  const [logisticsTasks, setLogisticsTasks] = useState<LogisticsTask[]>([]);
  const [allLogisticsTasks, setAllLogisticsTasks] = useState<LogisticsTask[]>([]);

  const totalTasks = 10;
  const inventoryCount = 4;
  const shippingCount = 6;
  const delayedTasks = 8;
  const delayedInventory = 2;
  const delayedShipping = 7;

  const dateTextStyle = 'mt-[8px] font-pretendard text-[15px] font-normal text-greyColor-grey500';
  const sectionTitleStyle = 'font-pretendard text-[19px] font-bold text-black';

  const scrollContainerStyle = 'flex max-h-[170px] flex-col gap-[8px] overflow-y-auto pr-1';

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await getDashboard();
        if (response.isSuccess && response.result) {
          setDashboardData({
            projectCompletionRate: response.result.projectCompletionRate || 0,
            longTermTaskRate: response.result.longTermTaskRate || 0,
            safetyStockRate: response.result.safetyStockRate || 0,
            turnOverRate: response.result.turnOverRate || 0,
            shipmentCompletionRate: response.result.shipmentCompletionRate || 0,
          });
        }
      } catch (error) {
        console.error('대시보드 데이터 가져오기 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const fetchProjects = async (keyword: string = '') => {
    try {
      const response = await getProjects(keyword);
      const apiProjects = response.result || response.data || [];

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
        let managerDisplay = '미정';
        if (p.projectMembers) {
          managerDisplay = String(p.projectMembers);
        }

        let creationDate = '';
        if (p.projectCreateDate) {
          const date = new Date(p.projectCreateDate);
          creationDate = date.toISOString().split('T')[0];
        } else {
          creationDate = new Date().toISOString().split('T')[0];
        }

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
      setAllProjects(allProjectsList);
    } catch (error) {
      console.error('프로젝트 목록 조회 실패:', error);
      setAllProjects([]);
    }
  };

  // 프로젝트 필터링 함수
  const getFilteredProjects = (status: ProjectFilterStatus): Project[] => {
    const statusMap: Record<ProjectFilterStatus, 'IN_PROGRESS' | 'PENDING' | 'COMPLETED'> = {
      진행중: 'IN_PROGRESS',
      미진행: 'PENDING',
      완료: 'COMPLETED',
    };

    return allProjects.filter((project) => project.status === statusMap[status]);
  };

  // 초기 로드 및 activeTab 변경 시 프로젝트 조회 및 필터링
  useEffect(() => {
    fetchProjects('');
  }, []);

  useEffect(() => {
    const filtered = getFilteredProjects(activeTab);
    setProjectList(filtered);
  }, [activeTab, allProjects]);


  // 재고 대시보드 필터링 함수
  const getFilteredInventoryTasks = (status: FilterStatus): InventoryTask[] => {
    const statusMap: Record<FilterStatus, InventoryStatus> = {
      '업무 할당': 'ASSIGNED',
      '승인 대기': 'PENDING',
      진행중: 'IN_PROGRESS',
      '입고 완료': 'COMPLETED',
    };

    return allInventoryTasks.filter((task) => task.status === statusMap[status]);
  };

  // 재고 대시보드 데이터 가져오기
  useEffect(() => {
    const fetchInventoryTasks = async () => {
      try {
        const response = await getInventoryList('');
        if (response.isSuccess && response.result) {
          const mappedTasks: InventoryTask[] = response.result.map((item: any) => ({
            id: item.inventoryId,
            projectNumber: formatNullValue(item.projectNumber),
            taskName: formatNullValue(item.inventoryTitle),
            requestDate: formatDate(item.requestedAt),
            status: item.inventoryStatus as InventoryStatus,
          }));

          setAllInventoryTasks(mappedTasks);
        }
      } catch (error) {
        console.error('재고 업무 목록 가져오기 실패:', error);
        setAllInventoryTasks([]);
      }
    };

    fetchInventoryTasks();
  }, []);

  // 재고 대시보드 필터링
  useEffect(() => {
    const filtered = getFilteredInventoryTasks(safetyInventoryTab);
    setInventoryTasks(filtered);
  }, [safetyInventoryTab, allInventoryTasks]);

  // 물류 대시보드 필터링 함수
  const getFilteredLogisticsTasks = (status: FilterStatus): LogisticsTask[] => {
    const statusMap: Record<FilterStatus, LogisticsStatus> = {
      '업무 할당': 'ASSIGNED',
      '승인 대기': 'PENDING',
      진행중: 'IN_PROGRESS',
      '입고 완료': 'COMPLETED',
    };

    return allLogisticsTasks.filter((task) => task.status === statusMap[status]);
  };

  // 물류 대시보드 데이터 가져오기
  useEffect(() => {
    const fetchLogisticsTasks = async () => {
      try {
        const response = await getLogisticsList('');
        if (response.isSuccess && response.result) {
          const mappedTasks: LogisticsTask[] = response.result.map((item: any) => ({
            id: item.logisticsId,
            projectNumber: formatNullValue(item.projectNumber),
            taskName: formatNullValue(item.logisticsTitle),
            requestDate: formatDate(item.requestedAt),
            status: item.logisticsStatus as LogisticsStatus,
          }));

          setAllLogisticsTasks(mappedTasks);
        }
      } catch (error) {
        console.error('물류 업무 목록 가져오기 실패:', error);
        setAllLogisticsTasks([]);
      }
    };

    fetchLogisticsTasks();
  }, []);

  // 물류 대시보드 필터링
  useEffect(() => {
    const filtered = getFilteredLogisticsTasks(logisticsTab);
    setLogisticsTasks(filtered);
  }, [logisticsTab, allLogisticsTasks]);


  // null 값을 "-"로 변환하는 헬퍼 함수
  const formatNullValue = (value: string | null | undefined): string => {
    return value ?? '-';
  };

  // 날짜를 ISO 형식에서 'YYYY-MM-DD' 형식으로 변환
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString || dateString === '-') return '-';
    const datePart = dateString.split('T')[0];
    if (!datePart) return '-';
    return datePart;
  };

  // 승인 대기 입고 업무 가져오기
  useEffect(() => {
    const fetchPendingInboundTasks = async () => {
      try {
        const response = await getInventoryList('');
        if (response.isSuccess && response.result) {
          // API 응답을 InboundTask 형식으로 변환하고 PENDING 상태만 필터링
          const mappedTasks: InboundTask[] = response.result
            .filter((item: any) => item.inventoryStatus === 'PENDING')
            .map((item: any) => ({
              id: item.inventoryId,
              projectNumber: formatNullValue(item.projectNumber),
              taskName: formatNullValue(item.inventoryTitle),
              requestDate: formatDate(item.requestedAt),
            }));

          setPendingInboundTasks(mappedTasks);
        }
      } catch (error) {
        console.error('승인 대기 입고 업무 목록 가져오기 실패:', error);
        setPendingInboundTasks([]);
      }
    };

    fetchPendingInboundTasks();
  }, []);

  // 승인 대기 출하 업무 가져오기
  useEffect(() => {
    const fetchPendingOutboundTasks = async () => {
      try {
        const response = await getLogisticsList('');
        if (response.isSuccess && response.result) {
          // API 응답을 OutboundTask 형식으로 변환하고 PENDING 상태만 필터링
          const mappedTasks: OutboundTask[] = response.result
            .filter((item: any) => item.logisticsStatus === 'PENDING')
            .map((item: any) => ({
              id: item.logisticsId,
              projectNumber: formatNullValue(item.projectNumber),
              taskName: formatNullValue(item.logisticsTitle),
              requestDate: formatDate(item.requestedAt),
            }));

          setPendingOutboundTasks(mappedTasks);
        }
      } catch (error) {
        console.error('승인 대기 출하 업무 목록 가져오기 실패:', error);
        setPendingOutboundTasks([]);
      }
    };

    fetchPendingOutboundTasks();
  }, []);

  const tabs: FilterStatus[] = ['업무 할당', '승인 대기', '진행중', '입고 완료'];
  const projectTabs: ProjectFilterStatus[] = ['진행중', '미진행', '완료'];

  const handleDetailClick = (type: string, id: string) => {
    navigate(`/management/${type}/${id}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <div className="pb-[60px] pl-[70px] pt-[60px]">
          <h1 className="font-pretendard text-[24px] font-bold text-black">관리 서비스 홈</h1>

          <section className="ml-[10px] mt-[64px]">
            <h2 className={sectionTitleStyle}>프로젝트 대시보드</h2>
            <p className={dateTextStyle}>2025.12.01 ~ 2025.12.31</p>

            <div className="mt-[15px] flex gap-[16px]">
              <div className="relative h-[306px] w-[558px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[40px] top-[47px]">
                  <DashboardChart
                    percent={
                      dashboardData
                        ? Math.floor(dashboardData.projectCompletionRate * 100) / 100
                        : 80
                    }
                    label="프로젝트 처리 완료율(%)"
                    colorType="blue"
                  />
                </div>
                <div className="absolute left-[245px] right-[30px] top-[40px]">
                  <div className="mb-[25px] flex gap-2">
                    {projectTabs.map((tab) => (
                      <DashboardTab
                        key={tab}
                        label={tab}
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                      />
                    ))}
                  </div>
                  <div className={scrollContainerStyle}>
                    {projectList.map((project) => (
                      <div
                        key={project.id}
                        className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                        onClick={() => handleDetailClick('project', project.projectNumber)}
                      >
                        <div className="flex h-[26px] items-center justify-center rounded-[30px] bg-subColor-orange050 px-[10px]">
                          <span className="whitespace-nowrap font-pretendard text-[13px] font-bold leading-none text-subColor-orange900">
                            {project.creationDate}
                          </span>
                        </div>
                        <div className="ml-[13px] flex-1">
                          <span className="block truncate font-pretendard text-[13px] font-normal text-greyColor-grey700">
                            {project.projectTitle}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative h-[306px] w-[494px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[69px] top-[51.5px]">
                  <DashboardChart
                    percent={
                      dashboardData
                        ? Math.floor(dashboardData.longTermTaskRate * 100) / 100
                        : 75
                    }
                    label="업무 장기 처리율(%)"
                    colorType="black"
                  />
                </div>
                <div className="absolute left-[315.5px] top-[75.25px] flex items-center">
                  <img
                    src={circleMark}
                    alt="mark"
                    className="mr-[8px] h-[14px] w-[14px] object-contain"
                  />
                  <span className="font-pretendard text-[15px] font-bold text-greyColor-grey700">
                    전체 업무 : {totalTasks}
                  </span>
                </div>
                <div className="absolute left-[311px] top-[111.25px] flex gap-[8px]">
                  <div className="flex h-[20px] w-[57px] items-center justify-center gap-[5px] rounded-[5px] bg-greyColor-grey200 px-[5px] py-[2px]">
                    <div
                      className="h-[8px] w-[8px] bg-mainColor-blue600"
                      style={{ maskImage: `url(${ellipse})`, maskSize: 'contain' }}
                    />
                    <span className="font-pretendard text-[13px] font-normal text-mainColor-blue600">
                      재고 {inventoryCount}
                    </span>
                  </div>
                  <div className="flex h-[20px] w-[57px] items-center justify-center gap-[5px] rounded-[5px] bg-greyColor-grey200 px-[5px] py-[2px]">
                    <div
                      className="h-[8px] w-[8px] bg-subColor-orange900"
                      style={{ maskImage: `url(${ellipse})`, maskSize: 'contain' }}
                    />
                    <span className="font-pretendard text-[13px] font-normal text-subColor-orange900">
                      출하 {shippingCount}
                    </span>
                  </div>
                </div>
                <div className="absolute left-[315.5px] top-[177.75px] flex items-center">
                  <img
                    src={circleMarkDark}
                    alt="dark mark"
                    className="mr-[8px] h-[12px] w-[12px] object-contain"
                  />
                  <span className="font-pretendard text-[15px] font-bold text-greyColor-grey700">
                    지연 업무 : {delayedTasks}
                  </span>
                </div>
                <div className="absolute left-[311px] top-[209.75px] flex gap-[8px]">
                  <div className="flex h-[20px] w-[57px] items-center justify-center gap-[5px] rounded-[5px] bg-greyColor-grey700 px-[5px] py-[2px]">
                    <div
                      className="h-[8px] w-[8px] bg-mainColor-blue600"
                      style={{ maskImage: `url(${ellipse})`, maskSize: 'contain' }}
                    />
                    <span className="font-pretendard text-[13px] font-normal text-greyColor-grey200">
                      재고 {delayedInventory}
                    </span>
                  </div>
                  <div className="flex h-[20px] w-[57px] items-center justify-center gap-[5px] rounded-[5px] bg-greyColor-grey700 px-[5px] py-[2px]">
                    <div
                      className="h-[8px] w-[8px] bg-subColor-orange900"
                      style={{ maskImage: `url(${ellipse})`, maskSize: 'contain' }}
                    />
                    <span className="font-pretendard text-[13px] font-normal text-greyColor-grey200">
                      출하 {delayedShipping}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative mt-[16px] h-[326px] w-[1070px] rounded-[20px] bg-white px-[32px] pt-[25px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <h2 className="font-pretendard text-[19px] font-bold text-black">
                승인 대기 프로젝트
              </h2>
              <p className="mt-[9.72px] font-pretendard text-[15px] font-normal text-greyColor-grey500">
                현재 승인 요청이 들어온 입고/출하 업무를 확인할 수 있어요
              </p>
              <div className="mt-[28px] flex gap-[46px]">
                <ul className="flex flex-col">
                  {pendingInboundTasks.map((task) => (
                    <li
                      key={task.id}
                      onClick={() => handleDetailClick('inbound-task', String(task.id))}
                      className="flex w-[476px] cursor-pointer items-center border-b border-greyColor-grey200 py-[12px]"
                    >
                      <div className="flex h-[24px] w-[46px] items-center justify-center rounded-[30px] bg-mainColor-blue050 px-[10px] py-[5px]">
                        <span className="font-pretendard text-[15px] font-bold text-mainColor-blue600">
                          입고
                        </span>
                      </div>
                      <span className="ml-[24px] font-pretendard text-[15px] font-bold text-greyColor-grey500">
                        {task.requestDate}
                      </span>
                      <span className="ml-[24px] flex-1 truncate font-pretendard text-[15px] font-normal text-greyColor-grey700">
                        {task.taskName}
                      </span>
                      <img
                        src={nextIcon}
                        alt="next"
                        className="ml-[32px] h-[16px] w-[16px] object-contain"
                      />
                    </li>
                  ))}
                </ul>
                <ul className="flex flex-col">
                  {pendingOutboundTasks.map((task) => (
                    <li
                      key={task.id}
                      onClick={() => handleDetailClick('outbound-task', String(task.id))}
                      className="flex w-[476px] cursor-pointer items-center border-b border-greyColor-grey200 py-[12px]"
                    >
                      <div className="flex h-[24px] w-[46px] items-center justify-center rounded-[30px] bg-subColor-orange100 px-[10px] py-[5px]">
                        <span className="font-pretendard text-[15px] font-bold text-subColor-orange900">
                          출하
                        </span>
                      </div>
                      <span className="ml-[24px] font-pretendard text-[15px] font-bold text-greyColor-grey500">
                        {task.requestDate}
                      </span>
                      <span className="ml-[24px] flex-1 truncate font-pretendard text-[15px] font-normal text-greyColor-grey700">
                        {task.taskName}
                      </span>
                      <img
                        src={nextIcon}
                        alt="next"
                        className="ml-[32px] h-[16px] w-[16px] object-contain"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="ml-[10px] mt-[40px]">
            <h2 className={sectionTitleStyle}>재고 대시보드</h2>
            <p className={dateTextStyle}>2025.12.01 ~ 2025.12.31</p>
            <div className="mt-[16px] flex gap-[16px]">
              <div className="relative h-[306px] w-[558px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[40px] top-[47px]">
                  <DashboardChart
                    percent={
                      dashboardData
                        ? Math.floor(dashboardData.safetyStockRate * 100) / 100
                        : 92
                    }
                    label="안전 재고 확보율(%)"
                    colorType="blue"
                  />
                </div>
                <div className="absolute left-[245px] right-[30px] top-[40px]">
                  <div className="mb-[25px] flex gap-2">
                    {tabs.map((tab) => (
                      <DashboardTab
                        key={tab}
                        label={tab}
                        isActive={safetyInventoryTab === tab}
                        onClick={() => setSafetyInventoryTab(tab)}
                      />
                    ))}
                  </div>
                  <div className={scrollContainerStyle}>
                    {inventoryTasks.length === 0 ? (
                      <div className="flex items-center justify-center py-[20px]">
                        <span className="font-pretendard text-[13px] font-normal text-greyColor-grey500">
                          없음
                        </span>
                      </div>
                    ) : (
                      inventoryTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                          onClick={() => handleDetailClick('inbound-task', String(task.id))}
                        >
                          <div className="flex h-[26px] items-center justify-center rounded-[30px] bg-subColor-orange050 px-[10px]">
                            <span className="whitespace-nowrap font-pretendard text-[13px] font-bold leading-none text-subColor-orange900">
                              {task.requestDate}
                            </span>
                          </div>
                          <div className="ml-[13px] flex-1">
                            <span className="block truncate font-pretendard text-[13px] font-normal text-greyColor-grey700">
                              {task.taskName}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="relative h-[306px] w-[240px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[45px] top-[47.5px]">
                  <DashboardChart
                    percent={
                      dashboardData
                        ? Math.floor(dashboardData.turnOverRate * 100) / 100
                        : 65
                    }
                    label="재고 회전율(%)"
                    colorType="blue"
                  />
                </div>
              </div>
              <div className="relative h-[306px] w-[240px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[45px] top-[47.5px]">
                  <DashboardChart percent={72} label="재고 회전율 익월(%)" colorType="orange" />
                </div>
              </div>
            </div>
          </section>

          <section className="ml-[10px] mt-[40px]">
            <h2 className={sectionTitleStyle}>물류 대시보드</h2>
            <div className="mt-[16px]">
              <div className="relative h-[306px] w-[558px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[40px] top-[47px]">
                  <DashboardChart
                    percent={
                      dashboardData
                        ? Math.floor(dashboardData.shipmentCompletionRate * 100) / 100
                        : 85
                    }
                    label="출하 완료율(%)"
                    colorType="blue"
                  />
                </div>
                <div className="absolute left-[245px] right-[30px] top-[40px]">
                  <div className="mb-[25px] flex gap-2">
                    {tabs.map((tab) => (
                      <DashboardTab
                        key={tab}
                        label={tab}
                        isActive={logisticsTab === tab}
                        onClick={() => setLogisticsTab(tab)}
                      />
                    ))}
                  </div>
                  <div className={scrollContainerStyle}>
                    {logisticsTasks.length === 0 ? (
                      <div className="flex items-center justify-center py-[20px]">
                        <span className="font-pretendard text-[13px] font-normal text-greyColor-grey500">
                          없음
                        </span>
                      </div>
                    ) : (
                      logisticsTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                          onClick={() => handleDetailClick('outbound-task', String(task.id))}
                        >
                          <div className="flex h-[26px] items-center justify-center rounded-[30px] bg-subColor-orange050 px-[10px]">
                            <span className="whitespace-nowrap font-pretendard text-[13px] font-bold leading-none text-subColor-orange900">
                              {task.requestDate}
                            </span>
                          </div>
                          <div className="ml-[13px] flex-1">
                            <span className="block truncate font-pretendard text-[13px] font-normal text-greyColor-grey700">
                              {task.taskName}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-[16px] h-[363px] w-[1070px] overflow-hidden rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <LeadTimeChart />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
