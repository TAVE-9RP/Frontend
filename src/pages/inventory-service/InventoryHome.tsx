import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from '@/components/common/SideBar';
import DashboardChart from '@/components/dashboard/DashboardChart';
import ProjectListTable from '@/components/dashboard/ProjectListTable';
import DashboardTab from '@/components/dashboard/DashboardTab';

type FilterStatus = '업무 할당' | '승인 대기' | '진행중' | '입고 완료';

export default function InventoryHome() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterStatus>('업무 할당');

  const mockTasks = {
    '업무 할당': [
      { id: 'INV-A1', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
      { id: 'INV-A2', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
      { id: 'INV-A3', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
      { id: 'INV-A4', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
      { id: 'INV-A5', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
      { id: 'INV-A6', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
      { id: 'INV-A7', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
      { id: 'INV-A8', date: '2025.11.10', title: '카피바라가 먹고 남긴 당근' },
    ],
    '승인 대기': [{ id: 'INV-A2', date: '2025.11.12', title: '카피바라 랜드' }],
    진행중: [{ id: 'INV-A3', date: '2025.11.15', title: '카피바라 쿠키' }],
    '입고 완료': [{ id: 'INV-A4', date: '2025.11.08', title: '카피바라 자켓' }],
  };

  const tabs: FilterStatus[] = ['업무 할당', '승인 대기', '진행중', '입고 완료'];

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
              2025.11.01 ~ 2025.11.30
            </p>

            <div className="mt-[16px] flex gap-[20px] pr-10">
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

                  <div className="flex max-h-[170px] flex-col gap-[8px] overflow-y-auto pr-1">
                    {mockTasks[activeTab].map((task) => (
                      <div
                        key={task.id}
                        className="flex cursor-pointer items-center transition-colors hover:opacity-70"
                        onClick={() => handleItemClick(task.id)}
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

              <div className="flex h-[306px] w-[240px] flex-col items-center justify-center rounded-[20px] bg-white pt-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <DashboardChart percent={80} label="재고 회전율(%)" colorType="blue" />
              </div>

              <div className="flex h-[306px] w-[240px] flex-col items-center justify-center rounded-[20px] bg-white pt-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <DashboardChart percent={80} label="익월 재고 회전율(%)" colorType="orange" />
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
