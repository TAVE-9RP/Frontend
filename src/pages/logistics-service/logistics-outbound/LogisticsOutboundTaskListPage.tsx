import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import TaskListTable from '../../../components/common/TaskListTable';

interface InboundTask {
  id: number;
  projectNumber: string;
  taskName: string;
  items: string;
  location: string;
  requestDate: string;
  manager: string;
  status: 'ALL' | 'TASK_ASSIGNMENT' | 'APPROVAL_PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

const MOCK_INBOUND_TASK_LIST: InboundTask[] = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    taskName: '타코',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '박하은',
    status: 'TASK_ASSIGNMENT',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    taskName: '엄뮤명',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '박카스',
    status: 'APPROVAL_PENDING',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    taskName: '에이씨밀란',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '박하사탕',
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    projectNumber: 'SYS-01-004',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '카피바라',
    status: 'COMPLETED',
  },
  {
    id: 5,
    projectNumber: 'SYS-01-005',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '신지혜',
    status: 'TASK_ASSIGNMENT',
  },
  {
    id: 6,
    projectNumber: 'SYS-01-006',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '이희원',
    status: 'IN_PROGRESS',
  },
  {
    id: 7,
    projectNumber: 'SYS-01-007',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '짱구',
    status: 'IN_PROGRESS',
  },
];

const INITIAL_STATUS_DATA = [
  { status: 'ALL', label: '전체', count: MOCK_INBOUND_TASK_LIST.length },
  {
    status: 'TASK_ASSIGNMENT',
    label: '업무 할당',
    count: MOCK_INBOUND_TASK_LIST.filter((t) => t.status === 'TASK_ASSIGNMENT').length,
  },
  {
    status: 'APPROVAL_PENDING',
    label: '승인 대기',
    count: MOCK_INBOUND_TASK_LIST.filter((t) => t.status === 'APPROVAL_PENDING').length,
  },
  {
    status: 'IN_PROGRESS',
    label: '진행중',
    count: MOCK_INBOUND_TASK_LIST.filter((t) => t.status === 'IN_PROGRESS').length,
  },
  {
    status: 'COMPLETED',
    label: '완료',
    count: MOCK_INBOUND_TASK_LIST.filter((t) => t.status === 'COMPLETED').length,
  },
];

export default function LogisticsOutboundTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<InboundTask['status']>('ALL');
  const [taskList, setTaskList] = useState<InboundTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const fetchTasksByStatus = (status: InboundTask['status']) => {
    setIsLoading(true);

    setTimeout(() => {
      let filteredList: InboundTask[];
      if (status === 'ALL') {
        filteredList = MOCK_INBOUND_TASK_LIST;
      } else {
        filteredList = MOCK_INBOUND_TASK_LIST.filter((task) => task.status === status);
      }

      const finalFilteredList = filteredList.filter(
        (task) => task.projectNumber.includes(searchTerm) || task.taskName.includes(searchTerm),
      );

      setTaskList(finalFilteredList);
      setIsLoading(false);
    }, 300);
  };

  const handleStatusClick = (status: InboundTask['status']) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
  };

  useEffect(() => {
    fetchTasksByStatus(activeStatus);
  }, [activeStatus, searchTerm]);

  return (
    <div className="flex min-h-screen w-full">
      <SideBar />

      <main className="flex-1 bg-white">
        <div className="mt-5 pl-[70px] pr-10 pt-10">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            출하 업무 리스트
          </h1>
          <div className="mt-12 w-[1040px]">
            <SearchBar
              placeholder="프로젝트 넘버 또는 입고 업무명을 입력하세요."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="mb-6 mt-5 flex w-[1040px] items-center justify-start">
            <div className="flex gap-[8px]">
              {INITIAL_STATUS_DATA.map((item) => (
                <ProjectStatusButton
                  key={item.status}
                  label={item.label}
                  count={item.count}
                  isActive={activeStatus === item.status}
                  onClick={() => handleStatusClick(item.status as InboundTask['status'])}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pl-[70px] pr-10">
          <TaskListTable data={taskList} isLoading={isLoading} type="outbound" />
        </div>
      </main>
    </div>
  );
}
