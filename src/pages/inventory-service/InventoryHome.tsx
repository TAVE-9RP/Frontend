import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '@/components/common/SideBar';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ProjectListTable from '@/components/dashboard/ProjectListTable';
import DashboardTab from '@/components/dashboard/DashboardTab';
import { getDashboard } from '@/apis/dashboard';
import { getInventoryAssignedList } from '@/apis/inventory';

type FilterStatus = '업무 할당' | '승인 대기' | '진행중' | '입고 완료';
type InventoryStatus = 'ASSIGNED' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

interface DashboardData {
  safetyStockRate: number;
  turnOverRate: number;
  predTurnOverRate: number;
}

interface InventoryTask {
  id: number;
  projectNumber: string;
  taskName: string;
  requestDate: string;
  status: InventoryStatus;
}

export default function InventoryHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterStatus>('승인 대기');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [inventoryTasks, setInventoryTasks] = useState<InventoryTask[]>([]);
  const [allInventoryTasks, setAllInventoryTasks] = useState<InventoryTask[]>([]);

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
        const response = await getInventoryAssignedList('');
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
    const filtered = getFilteredInventoryTasks(activeTab);
    setInventoryTasks(filtered);
  }, [activeTab, allInventoryTasks]);

  const tabs: FilterStatus[] = ['승인 대기', '진행중', '입고 완료'];

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const response = await getDashboard();
        if (response.isSuccess && response.result) {
          setDashboardData({
            safetyStockRate: response.result.safetyStockRate || 0,
            turnOverRate: response.result.turnOverRate || 0,
            predTurnOverRate: response.result.predTurnOverRate || 0,
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

  const handleItemClick = (id: string) => {
    navigate(`/inventory/${id}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-greyColor-grey100">
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <div className="pl-[70px] pt-[60px]">
          <h1 className="font-pretendard text-[24px] font-bold text-greyColor-grey900">
            재고 서비스 홈
          </h1>

          <section className="ml-[10px] mt-[64px]">
            <h2 className="font-pretendard text-[19px] font-bold text-greyColor-grey900">
              재고 대시보드
            </h2>
            <p className="mt-[8px] font-pretendard text-[15px] text-greyColor-grey500">
              2025.12.01 ~ 2025.12.31
            </p>

            <div className="mt-[16px] flex gap-[20px] pr-10">
              <div className="relative h-[306px] w-[558px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[40px] top-[47px]">
                  <DashboardChart
                    percent={
                      dashboardData
                        ? Math.floor(dashboardData.safetyStockRate * 100) / 100
                        : 0
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
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                      />
                    ))}
                  </div>

                  <div className="flex max-h-[170px] flex-col gap-[8px] overflow-y-auto pr-1">
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
                          onClick={() => handleItemClick(String(task.id))}
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

              <div className="flex h-[306px] w-[240px] flex-col items-center justify-center rounded-[20px] bg-white pt-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <DashboardChart
                  percent={
                    dashboardData
                      ? Math.floor(dashboardData.turnOverRate * 100) / 100
                      : 0
                  }
                  label="재고 회전율(%)"
                  colorType="blue"
                />
              </div>

              <div className="flex h-[306px] w-[240px] flex-col items-center justify-center rounded-[20px] bg-white pt-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <DashboardChart
                  percent={
                    dashboardData
                      ? Math.floor(dashboardData.predTurnOverRate * 100) / 100
                      : 0
                  }
                  label="익월 재고 회전율(%)"
                  colorType="orange"
                />
              </div>
            </div>
          </section>

          <section className="mb-10 ml-[10px] mt-[40px] pr-10">
            <h2 className="mb-[16px] font-pretendard text-[19px] font-bold text-greyColor-grey900">
              프로젝트 리스트
            </h2>
            <div className="min-h-[400px] w-full max-w-[1070px] rounded-[20px] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <p className="mb-[24px] font-pretendard text-[15px] font-normal text-greyColor-grey500">
                할당된 프로젝트입니다
              </p>
              <ProjectListTable />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
