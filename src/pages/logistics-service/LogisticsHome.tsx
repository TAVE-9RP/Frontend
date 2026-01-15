import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '@/components/common/SideBar';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ProjectListTable from '@/components/dashboard/ProjectListTable';
import DashboardTab from '@/components/dashboard/DashboardTab';
import LeadTimeChart from '@/components/dashboard/LeadTimeChart';

import { getMyAssignedLogistics } from '@/apis/logistics';
import { getDashboard } from '@/apis/dashboard';
import { LogisticsSummary } from '@/types/logistics';

type FilterStatus = '업무 할당' | '승인 대기' | '진행중' | '출하 완료';

export default function LogisticsHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterStatus>('업무 할당');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [tasksByStatus, setTasksByStatus] = useState<Record<FilterStatus, any[]>>({
    '업무 할당': [],
    '승인 대기': [],
    진행중: [],
    '출하 완료': [],
  });

  const [dashboardData, setDashboardData] = useState<{ shipmentCompletionRate: number } | null>(
    null,
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [logisticsRes, kpiRes] = await Promise.all([
        getMyAssignedLogistics(''),
        getDashboard(),
      ]);

      if (logisticsRes.isSuccess && logisticsRes.result) {
        const rawData: LogisticsSummary[] = logisticsRes.result;
        setTasksByStatus({
          '업무 할당': rawData.filter((t) => t.logisticsStatus === 'ASSIGNED').map(formatTask),
          '승인 대기': rawData.filter((t) => t.logisticsStatus === 'PENDING').map(formatTask),
          진행중: rawData.filter((t) => t.logisticsStatus === 'IN_PROGRESS').map(formatTask),
          '출하 완료': rawData.filter((t) => t.logisticsStatus === 'COMPLETED').map(formatTask),
        });
      }
      const rawKpiData = kpiRes.result || kpiRes;

      if (Array.isArray(rawKpiData) && rawKpiData.length > 0) {
        const data = rawKpiData[0];
        setDashboardData({
          shipmentCompletionRate: data.shipmentCompletionRate || 0,
        });
      } else if (rawKpiData && typeof rawKpiData === 'object') {
        setDashboardData({
          shipmentCompletionRate: rawKpiData.shipmentCompletionRate || 0,
        });
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  function formatTask(task: LogisticsSummary) {
    return {
      id: task.logisticsId.toString(),
      date: task.requestedAt ? task.requestedAt.split('T')[0].replace(/-/g, '.') : '-',
      title: task.logisticsTitle || '-',
    };
  }

  useEffect(() => {
    fetchData();
  }, []);

  const tabs: FilterStatus[] = ['업무 할당', '승인 대기', '진행중', '출하 완료'];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-greyColor-grey100">
      <SideBar />
      <main className="flex-1 overflow-y-auto">
        <div className="pl-[70px] pt-[60px]">
          <h1 className="font-pretendard text-[24px] font-bold text-greyColor-grey900">
            물류 서비스 홈
          </h1>

          <section className="ml-[10px] mt-[64px]">
            <h2 className="font-pretendard text-[19px] font-bold text-greyColor-grey900">
              물류 대시보드
            </h2>
            <p className="mt-[8px] font-pretendard text-[15px] text-greyColor-grey500">
              2025.12.01 ~ 2025.12.31
            </p>

            <div className="mt-[16px] flex flex-col pr-10">
              <div className="relative h-[306px] w-[558px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[40px] top-[47px]">
                  <DashboardChart
                    percent={
                      dashboardData
                        ? Math.floor(dashboardData.shipmentCompletionRate * 100) / 100
                        : 0
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
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                      />
                    ))}
                  </div>

                  <div className="flex max-h-[170px] flex-col gap-[8px] overflow-y-auto pr-1">
                    {isLoading ? (
                      <div className="py-4 text-center font-pretendard text-[13px] text-greyColor-grey400">
                        데이터 로딩 중...
                      </div>
                    ) : tasksByStatus[activeTab].length > 0 ? (
                      tasksByStatus[activeTab].map((task) => (
                        <div
                          key={task.id}
                          className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                          onClick={() => navigate(`/logistics-outbound-task/${task.id}`)}
                        >
                          <div className="flex h-[26px] items-center justify-center rounded-[30px] bg-subColor-orange050 px-[10px]">
                            <span className="whitespace-nowrap font-pretendard text-[13px] font-bold text-subColor-orange900">
                              {task.date}
                            </span>
                          </div>
                          <div className="ml-[13px] flex-1">
                            <span className="block truncate font-pretendard text-[13px] text-greyColor-grey700">
                              {task.title}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center font-pretendard text-[13px] text-greyColor-grey400">
                        해당 업무가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-[16px] h-[363px] w-[1070px] overflow-hidden rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <LeadTimeChart />
              </div>
            </div>
          </section>

          <section className="mb-10 ml-[10px] mt-[40px] pr-10">
            <h2 className="mb-[16px] font-pretendard text-[19px] font-bold text-greyColor-grey900">
              프로젝트 리스트
            </h2>
            <div className="min-h-[400px] w-full max-w-[1070px] rounded-[20px] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <ProjectListTable />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
