import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import TaskListTable from '../../../components/common/TaskListTable';
import TaskToggleButton from '@/components/common/TaskToggleButton';

import { getLogisticsList, getMyAssignedLogistics } from '@/apis/logistics';
import { LogisticsSummary, LogisticsStatus } from '@/types/logistics';

export default function LogisticsOutboundTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<LogisticsStatus | 'ALL'>('ALL');
  const [allTasks, setAllTasks] = useState<LogisticsSummary[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'ALL' | 'MY'>('ALL');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let res;
      if (viewMode === 'ALL') {
        res = await getLogisticsList(searchTerm);
      } else {
        res = await getMyAssignedLogistics(searchTerm);
      }

      if (res.isSuccess) {
        setAllTasks(res.result);
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error);
      setAllTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewMode, searchTerm]);

  useEffect(() => {
    let result = [...allTasks];

    if (activeStatus !== 'ALL') {
      result = result.filter((task) => task.logisticsStatus === activeStatus);
    }

    const mappedData = result.map((task: any) => ({
      id: task.logisticsId,
      projectNumber: task.projectNumber,
      taskName: task.logisticsTitle || '-',
      items: task.customer || '상세 참조',
      location: '물류센터',
      requestDate: task.requestedAt ? task.requestedAt.split('T')[0] : '-',
      manager: task.assigneeSummary || '미지정',
      status: task.logisticsStatus,
    }));

    setFilteredTasks(mappedData);
  }, [allTasks, activeStatus]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const statusButtonData = [
    { status: 'ALL', label: '전체' },
    { status: 'ASSIGNED', label: '업무 할당' },
    { status: 'PENDING', label: '승인 대기' },
    { status: 'IN_PROGRESS', label: '진행중' },
    { status: 'COMPLETED', label: '완료' },
  ].map((item) => ({
    ...item,
    count: allTasks.filter((t) => item.status === 'ALL' || t.logisticsStatus === item.status)
      .length,
  }));

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex-1">
        <div className="mt-5 pl-[70px] pr-10 pt-10">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            출하 업무 리스트
          </h1>

          <div className="mt-8">
            <TaskToggleButton viewMode={viewMode} onChange={setViewMode} />
          </div>

          <div className="mt-[43px] flex items-center">
            <div className="flex gap-[8px]">
              {statusButtonData.map((item) => (
                <ProjectStatusButton
                  key={item.status}
                  label={item.label}
                  count={item.count}
                  isActive={activeStatus === item.status}
                  onClick={() => setActiveStatus(item.status as LogisticsStatus | 'ALL')}
                />
              ))}
            </div>

            <div className="ml-[160px] w-[500px]">
              <SearchBar
                placeholder="프로젝트 넘버 또는 출하 업무명을 입력하세요."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="mt-[27px] pb-20 pl-[70px] pr-10">
          <TaskListTable
            data={filteredTasks}
            isLoading={isLoading}
            type="outbound"
            basePath="/logistics-outbound-task"
          />
        </div>
      </main>
    </div>
  );
}
