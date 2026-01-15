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

type FilterStatus = '업무 할당' | '승인 대기' | '진행중' | '입고 완료';

interface DashboardData {
  projectCompletionRate: number;
  longTermTaskRate: number;
  safetyStockRate: number;
  turnOverRate: number;
  shipmentCompletionRate: number;
}

export default function ManagementHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterStatus>('업무 할당');
  const [safetyInventoryTab, setSafetyInventoryTab] = useState<FilterStatus>('업무 할당');
  const [logisticsTab, setLogisticsTab] = useState<FilterStatus>('업무 할당');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const mockTasks = {
    '업무 할당': [
      { id: 'P-1', date: '2025.11.10', title: '목욕하는 카피바라' },
      { id: 'P-1-2', date: '2025.11.10', title: '목욕 후 털 말리는 카피바라' },
      { id: 'P-1-3', date: '2025.11.10', title: '물 온도 체크하는 카피바라' },
      { id: 'P-1-4', date: '2025.11.10', title: '비누칠 하는 카피바라' },
      { id: 'P-1-5', date: '2025.11.10', title: '수건 준비하는 카피바라' },
      { id: 'P-1-6', date: '2025.11.10', title: '드라이기 빌리는 카피바라' },
    ],
    '승인 대기': [{ id: 'P-2', date: '2025.11.12', title: '카피바라 전용 양배추' }],
    진행중: [{ id: 'P-3', date: '2025.11.15', title: '카피바라 입수 준비' }],
    '입고 완료': [{ id: 'P-4', date: '2025.11.08', title: '특급 당근' }],
  };

  const SafetyTasks = {
    '업무 할당': [
      { id: 'S-1', date: '2025.11.20', title: '카피바라 전용 당근' },
      { id: 'S-1-2', date: '2025.11.20', title: '당근 씻는 카피바라' },
      { id: 'S-1-3', date: '2025.11.20', title: '당근 쟁여두는 카피바라' },
      { id: 'S-1-4', date: '2025.11.20', title: '당근 나르는 카피바라' },
      { id: 'S-1-5', date: '2025.11.20', title: '당근 품질 검사' },
      { id: 'S-1-6', date: '2025.11.20', title: '당근 박스 포장' },
    ],
    '승인 대기': [{ id: 'S-2', date: '2025.11.22', title: '카피바라 낮잠용 볏집' }],
    진행중: [{ id: 'S-3', date: '2025.11.25', title: '카피바라 밥먹을시간' }],
    '입고 완료': [{ id: 'S-4', date: '2025.11.18', title: '특급 당근' }],
  };

  const logisticsTasks = {
    '업무 할당': [
      { id: 'L-1', date: '2025.11.26', title: '카피바라 간식 긴급 배송 중' },
      { id: 'L-1-2', date: '2025.11.26', title: '트럭 시동 거는 카피바라' },
      { id: 'L-1-3', date: '2025.11.26', title: '지도 확인하는 카피바라' },
      { id: 'L-1-4', date: '2025.11.26', title: '휴게소 들린 카피바라' },
      { id: 'L-1-5', date: '2025.11.26', title: '과속 방지턱 넘는 카피바라' },
      { id: 'L-1-6', date: '2025.11.26', title: '목적지 도착한 카피바라' },
    ],
    '승인 대기': [{ id: 'L-2', date: '2025.11.27', title: '카피바라표 김밥' }],
    진행중: [{ id: 'L-3', date: '2025.11.28', title: '두쫀쿠' }],
    '입고 완료': [{ id: 'L-4', date: '2025.11.25', title: '트럭 기사 카피바라' }],
  };

  const waitingProjects = {
    incoming: [
      { id: 'IN-1', date: '2025.10.10', title: '카피바라 전용 고당도 당근 1톤 입고' },
      { id: 'IN-2', date: '2025.10.12', title: '온천욕용 히노끼 목재 욕조 자재' },
      { id: 'IN-3', date: '2025.10.15', title: '동절기 대비 극세사 담요 500장' },
      { id: 'IN-4', date: '2025.10.18', title: '카피바라 건강검진용 의료 소모품' },
    ],
    outgoing: [
      { id: 'OUT-1', date: '2025.10.11', title: '카피바라 굿즈 세트(인형/스티커) 출하' },
      { id: 'OUT-2', date: '2025.10.14', title: '주말 체험장용 카피바라 간식 키트' },
      { id: 'OUT-3', date: '2025.10.16', title: '카피바라 생태 교육용 도서/교구' },
      { id: 'OUT-4', date: '2025.10.19', title: '전국 카피바라 쉼터 배송용 사료' },
    ],
  };

  const tabs: FilterStatus[] = ['업무 할당', '승인 대기', '진행중', '입고 완료'];

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
                    {tabs.map((tab) => (
                      <DashboardTab
                        key={tab}
                        label={tab}
                        isActive={activeTab === tab}
                        onClick={() => setActiveTab(tab)}
                      />
                    ))}
                  </div>
                  <div className={scrollContainerStyle}>
                    {mockTasks[activeTab].map((task, i) => (
                      <div
                        key={i}
                        className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                        onClick={() => handleDetailClick('project', task.id)}
                      >
                        <div className="flex h-[26px] items-center justify-center rounded-[30px] bg-subColor-orange050 px-[10px]">
                          <span className="whitespace-nowrap font-pretendard text-[13px] font-bold leading-none text-subColor-orange900">
                            {task.date}
                          </span>
                        </div>
                        <div className="ml-[13px] flex-1">
                          <span className="block truncate font-pretendard text-[13px] font-normal text-greyColor-grey700">
                            {task.title}
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
                  {waitingProjects.incoming.map((project, i) => (
                    <li
                      key={`in-${i}`}
                      onClick={() => handleDetailClick('incoming', project.id)}
                      className="flex w-[476px] cursor-pointer items-center border-b border-greyColor-grey200 py-[12px] last:border-0"
                    >
                      <div className="flex h-[24px] w-[46px] items-center justify-center rounded-[30px] bg-mainColor-blue050 px-[10px] py-[5px]">
                        <span className="font-pretendard text-[15px] font-bold text-mainColor-blue600">
                          입고
                        </span>
                      </div>
                      <span className="ml-[24px] font-pretendard text-[15px] font-bold text-greyColor-grey500">
                        {project.date}
                      </span>
                      <span className="ml-[24px] flex-1 truncate font-pretendard text-[15px] font-normal text-greyColor-grey700">
                        {project.title}
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
                  {waitingProjects.outgoing.map((project, i) => (
                    <li
                      key={`out-${i}`}
                      onClick={() => handleDetailClick('outgoing', project.id)}
                      className="flex w-[476px] cursor-pointer items-center border-b border-greyColor-grey200 py-[12px] last:border-0"
                    >
                      <div className="flex h-[24px] w-[46px] items-center justify-center rounded-[30px] bg-subColor-orange100 px-[10px] py-[5px]">
                        <span className="font-pretendard text-[15px] font-bold text-subColor-orange900">
                          출하
                        </span>
                      </div>
                      <span className="ml-[24px] font-pretendard text-[15px] font-bold text-greyColor-grey500">
                        {project.date}
                      </span>
                      <span className="ml-[24px] flex-1 truncate font-pretendard text-[15px] font-normal text-greyColor-grey700">
                        {project.title}
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
                    {SafetyTasks[safetyInventoryTab].map((task, i) => (
                      <div
                        key={i}
                        className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                        onClick={() => handleDetailClick('safety', task.id)}
                      >
                        <div className="flex h-[26px] items-center justify-center rounded-[30px] bg-subColor-orange050 px-[10px]">
                          <span className="whitespace-nowrap font-pretendard text-[13px] font-bold leading-none text-subColor-orange900">
                            {task.date}
                          </span>
                        </div>
                        <div className="ml-[13px] flex-1">
                          <span className="block truncate font-pretendard text-[13px] font-normal text-greyColor-grey700">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
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
                    {logisticsTasks[logisticsTab].map((task, i) => (
                      <div
                        key={i}
                        className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                        onClick={() => handleDetailClick('logistics', task.id)}
                      >
                        <div className="flex h-[26px] items-center justify-center rounded-[30px] bg-subColor-orange050 px-[10px]">
                          <span className="whitespace-nowrap font-pretendard text-[13px] font-bold leading-none text-subColor-orange900">
                            {task.date}
                          </span>
                        </div>
                        <div className="ml-[13px] flex-1">
                          <span className="block truncate font-pretendard text-[13px] font-normal text-greyColor-grey700">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
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
