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
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />
      <main className="flex flex-1 flex-col items-center">
        <div className="pt-10 w-full flex flex-col items-center">
          <div className={activeTab === '직원 목록' ? 'w-[900px]' : 'w-[1040px]'}>
            <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
              {PAGE_TITLE}
            </h1>

            <div className="mt-[46.5px] flex items-center justify-between">
              <TabToggle activeTab={activeTab} onTabChange={handleTabChange} />

              <div className="h-[45px] w-[356px]">
                <SearchBar
                  placeholder="검색"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-[32.5px]">
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