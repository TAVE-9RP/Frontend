import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '@/components/common/SideBar';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ProjectListTable from '@/components/dashboard/ProjectListTable';
import DashboardTab from '@/components/dashboard/DashboardTab';
import LeadTimeChart from '@/components/dashboard/LeadTimeChart';

import { getMyAssignedLogistics } from '@/apis/logistics';
import { getDashboard, getShipmentLeadTimeChart } from '@/apis/dashboard';
import { LogisticsSummary } from '@/types/logistics';

type FilterStatus = '업무 할당' | '승인 대기' | '진행중' | '출하 완료';

interface LeadTimeChartData {
  month: string;
  value: number;
  type: 'actual' | 'predict';
}

export default function LogisticsHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterStatus>('승인 대기');
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
  const [leadTimeChartData, setLeadTimeChartData] = useState<LeadTimeChartData[]>([]);

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
          '업무 할당': [],
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

  // 출하 리드타임 차트 데이터 가져오기
  useEffect(() => {
    const fetchLeadTimeChart = async () => {
      try {
        const [chartResponse, dashboardResponse] = await Promise.all([
          getShipmentLeadTimeChart(),
          getDashboard(),
        ]);

        if (chartResponse.isSuccess && chartResponse.result?.history) {
          const year = chartResponse.result.year || 2025;
          
          // "1월", "2월" 형식을 "2025-01", "2025-02" 형식으로 변환
          const convertMonthFormat = (monthStr: string, year: number): string => {
            // "1월", "2월" 등에서 숫자 추출
            const monthNum = parseInt(monthStr.replace('월', '').trim());
            if (!isNaN(monthNum)) {
              return `${year}-${String(monthNum).padStart(2, '0')}`;
            }
            return monthStr; // 변환 실패 시 원본 반환
          };

          let chartData: LeadTimeChartData[] = chartResponse.result.history
            .filter((item: { month: string; value: number }) => item.value != null && !isNaN(item.value))
            .map((item: { month: string; value: number }) => ({
              month: convertMonthFormat(item.month, year),
              value: Number(item.value),
              type: 'actual' as const,
            }));

          // 마지막 항목(12월)을 predict 타입으로 한 번 더 추가
          if (chartData.length > 0) {
            const lastItem = chartData[chartData.length - 1];
            chartData.push({
              month: lastItem.month, // "2025-12"
              value: lastItem.value,
              type: 'predict' as const,
            });
          }

          // dashboard 응답에서 timestamp와 predShipmentLeadTime 가져오기
          if (
            dashboardResponse.isSuccess &&
            dashboardResponse.result?.predShipmentLeadTime != null &&
            !isNaN(dashboardResponse.result.predShipmentLeadTime) &&
            dashboardResponse.timestamp
          ) {
            const timestamp = dashboardResponse.timestamp;
            // timestamp에서 년도와 월 추출 (예: "2026-01-16T06:42:20.113894867Z" -> "2026-01")
            const date = new Date(timestamp);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const monthLabel = `${year}-${month}`;

            chartData.push({
              month: monthLabel, // "2026-01"
              value: Number(dashboardResponse.result.predShipmentLeadTime),
              type: 'predict' as const,
            });
          }

          if (chartData.length > 0) {
            setLeadTimeChartData(chartData);
          } else {
            console.warn('출하 리드타임 차트 데이터가 없습니다.');
          }
        } else {
          console.warn('출하 리드타임 차트 API 응답이 올바르지 않습니다:', chartResponse);
        }
      } catch (error) {
        console.error('출하 리드타임 차트 데이터 가져오기 실패:', error);
      }
    };

    fetchLeadTimeChart();
  }, []);

  const tabs: FilterStatus[] = ['승인 대기', '진행중', '출하 완료'];

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
                <div className="h-full w-full" style={{ minWidth: 0, minHeight: 0 }}>
                  <LeadTimeChart data={leadTimeChartData} />
                </div>
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
