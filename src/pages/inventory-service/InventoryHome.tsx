import React, { useState } from 'react';
import SideBar from '@/components/common/SideBar';
import DashboardChart from '@/components/common/DashboardChart';
import ProjectListTable from '@/components/common/dashboard/ProjectListTable';
import DashboardTab from '@/components/common/dashboard/DashboardTab';

type FilterStatus = '업무 할당' | '승인 대기' | '진행중' | '입고 완료';

export default function InventoryHome() {
  const [activeTab, setActiveTab] = useState<FilterStatus>('업무 할당');

  const mockTasks = {
    '업무 할당': [{ date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' }],
    '승인 대기': [{ date: '2025.11.12', title: '카피바라 랜드' }],
    진행중: [{ date: '2025.11.15', title: '카피바라 쿠키' }],
    '입고 완료': [{ date: '2025.11.08', title: '카피바라 자켓' }],
  };

  const tabs: FilterStatus[] = ['업무 할당', '승인 대기', '진행중', '입고 완료'];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8F9FA]">
      <SideBar />

      <main className="flex-1 overflow-y-auto">
        <div className="pl-[70px] pt-[60px]">
          <h1 className="font-pretendard text-[24px] font-bold text-black">재고 서비스 홈</h1>

          <section className="ml-[10px] mt-[64px]">
            <h2 className="font-pretendard text-[19px] font-bold text-black">재고 대시보드</h2>
            <p className="mt-[8px] font-pretendard text-[15px] text-greyColor-grey500">
              2025.11.01 ~ 2025.11.30
            </p>

            <div className="mt-[32px] flex gap-[20px] pr-10">
              <div className="relative h-[306px] w-[558px] rounded-[20px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div className="absolute left-[40px] top-[47px]">
                  <DashboardChart percent={80} label="안전 재고 확보율(%)" colorType="blue" />
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

                  <div className="flex flex-col gap-3">
                    {mockTasks[activeTab].map((task, i) => (
                      <div key={i} className="flex items-center">
                        <div className="flex items-center justify-center rounded-[30px] bg-[#FFF9E5] px-[10px] py-[5px]">
                          <span className="whitespace-nowrap font-pretendard text-[13px] font-bold text-[#FF803B]">
                            {task.date}
                          </span>
                        </div>
                        <div className="ml-[13px] flex-1">
                          <span className="block truncate font-pretendard text-[13px] font-normal text-[#44454D]">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex h-[306px] w-[240px] flex-col items-center justify-center rounded-[20px] bg-white pt-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <DashboardChart percent={80} label="재고 회전율(%)" colorType="blue" />
              </div>

              <div className="flex h-[306px] w-[240px] flex-col items-center justify-center rounded-[20px] bg-white pt-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <DashboardChart percent={80} label="익월 재고 회전율(%)" colorType="orange" />
              </div>
            </div>
          </section>

          <section className="mb-10 ml-[10px] mt-[60px] pr-10">
            <h2 className="mb-[20px] font-pretendard text-[19px] font-bold text-black">
              프로젝트 리스트
            </h2>
            <div className="min-h-[400px] w-full max-w-[1070px] rounded-[20px] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <p className="mb-[24px] font-pretendard text-[15px] font-normal text-[#777981]">
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
