import React, { useState } from 'react';
import SideBar from '../../../components/common/SideBar';
import SearchBar from '../../../components/common/SearchBar';
import TabToggle from '../../../components/common/TabToggle';
import EmployeeListTable from '../../../components/common/EmployeeListTable';
import MembershipManagementTable from '../../../components/common/MembershipManagementTable';

interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  email?: string;
  permission?: string;
  status?: '요청 대기' | '승인' | '거절';
}

const PAGE_TITLE = '직원 목록';

type ActiveTab = '직원 목록' | '가입 관리';

export default function HRManagementPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('직원 목록');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTabChange = (tab: ActiveTab) => {
    if (activeTab === tab) return;
    setActiveTab(tab);
    setSearchTerm('');
  };

  return (
    <div className="flex min-h-screen w-full">
      <SideBar />
      <main className="flex-1 bg-white">
        <div className="mt-5 pl-[70px] pr-10 pt-10">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            {PAGE_TITLE}
          </h1>

          <div className="mt-6 flex w-[1040px] justify-between">
            <TabToggle activeTab={activeTab} onTabChange={handleTabChange} />

            <SearchBar
              placeholder="이름, 부서, 직급 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-[300px]"
            />
          </div>
        </div>

        <div className="mt-6 pl-[70px] pr-10">
          {activeTab === '직원 목록' ? (
            <EmployeeListTable searchTerm={searchTerm} isLoading={isLoading} />
          ) : (
            <MembershipManagementTable searchTerm={searchTerm} isLoading={isLoading} />
          )}
        </div>
      </main>
    </div>
  );
}
