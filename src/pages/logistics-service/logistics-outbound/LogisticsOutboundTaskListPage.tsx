import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import TaskListTable from '../../../components/common/TaskListTable';
import TaskToggleButton from '@/components/common/TaskToggleButton';

interface OutboundTask {
  id: number;
  projectNumber: string;
  taskName: string;
  items: string;
  location: string;
  requestDate: string;
  manager: string;
  status: 'ALL' | 'TASK_ASSIGNMENT' | 'APPROVAL_PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

const MOCK_OUTBOUND_TASK_LIST: OutboundTask[] = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    taskName: '타코',
    items: '애플망고 외 3...',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박하은',
    status: 'TASK_ASSIGNMENT',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    taskName: '엄뮤명',
    items: '카피바라 300마리',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박카스',
    status: 'APPROVAL_PENDING',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    taskName: '에이씨밀란',
    items: 'ac milan',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박하사탕',
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    projectNumber: 'SYS-01-004',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '카피바라',
    status: 'COMPLETED',
  },
  {
    id: 5,
    projectNumber: 'SYS-01-005',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박하은',
    status: 'TASK_ASSIGNMENT',
  },
  {
    id: 6,
    projectNumber: 'SYS-01-006',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '이희원',
    status: 'IN_PROGRESS',
  },
  {
    id: 7,
    projectNumber: 'SYS-01-007',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치',
    requestDate: '2025-10-25',
    manager: '박하은',
    status: 'IN_PROGRESS',
  },
];

const MY_NAME = '박하은'; // api 연동 필요

export default function LogisticsOutboundTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<OutboundTask['status']>('ALL');
  const [taskList, setTaskList] = useState<OutboundTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'ALL' | 'MY'>('ALL');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchTasks = (status: OutboundTask['status'], currentViewMode: 'ALL' | 'MY') => {
    setIsLoading(true);

    setTimeout(() => {
      let filteredList = MOCK_OUTBOUND_TASK_LIST;

      if (status !== 'ALL') {
        filteredList = filteredList.filter((task) => task.status === status);
      }

      if (currentViewMode === 'MY') {
        filteredList = filteredList.filter((task) => task.manager === MY_NAME);
      }

      const finalFilteredList = filteredList.filter(
        (task) =>
          task.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.taskName.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      setTaskList(finalFilteredList);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchTasks(activeStatus, viewMode);
  }, [activeStatus, searchTerm, viewMode]);

  const statusButtonData = [
    { status: 'ALL', label: '전체' },
    { status: 'TASK_ASSIGNMENT', label: '업무 할당' },
    { status: 'APPROVAL_PENDING', label: '승인 대기' },
    { status: 'IN_PROGRESS', label: '진행중' },
    { status: 'COMPLETED', label: '완료' },
  ].map((item) => ({
    ...item,
    count: MOCK_OUTBOUND_TASK_LIST.filter(
      (t) =>
        (item.status === 'ALL' || t.status === item.status) &&
        (viewMode === 'ALL' || t.manager === MY_NAME),
    ).length,
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
                  onClick={() => setActiveStatus(item.status as OutboundTask['status'])}
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

        <div className="mt-[27px] pl-[70px] pr-10">
          <TaskListTable
            data={taskList}
            isLoading={isLoading}
            type="outbound"
            basePath="/logistics-outbound-task"
          />
        </div>
      </main>
    </div>
  );
}
