import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import TaskListTable from '../../../components/common/TaskListTable';
import { getInventoryList } from '../../../apis/inventory';

type InventoryStatus = 'ASSIGNED' | 'PENDING' | 'REJECT' | 'IN_PROGRESS' | 'COMPLETED';

interface InboundTask {
  id: number;
  projectNumber: string;
  taskName: string;
  items: string;
  location: string;
  requestDate: string;
  manager: string;
  status: 'ALL' | InventoryStatus;
}

const MOCK_INBOUND_TASK_LIST: InboundTask[] = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    taskName: '카피바라랜드',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '박하은동생',
    status: 'ASSIGNED',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    taskName: '강아지아메리카노',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-26',
    manager: '박카스',
    status: 'PENDING',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-27',
    manager: '이영희',
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    projectNumber: 'SYS-01-004',
    taskName: '-',
    items: '-',
    location: '-',
    requestDate: '-',
    manager: '-',
    status: 'ASSIGNED',
  },
  {
    id: 5,
    projectNumber: 'SYS-01-005',
    taskName: '타코퀘사디아',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-27',
    manager: '박카피바라',
    status: 'COMPLETED',
  },
  {
    id: 6,
    projectNumber: 'SYS-01-006',
    taskName: '고구마이쮸',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-27',
    manager: '탔구마',
    status: 'ASSIGNED',
  },
];

// 상태별 카운트 계산 함수
const calculateStatusCounts = (tasks: InboundTask[]) => {
  return [
    { status: 'ALL' as const, label: '전체', count: tasks.length },
    {
      status: 'ASSIGNED' as const,
      label: '업무 할당',
      count: tasks.filter((t) => t.status === 'ASSIGNED').length,
    },
    {
      status: 'PENDING' as const,
      label: '승인 대기',
      count: tasks.filter((t) => t.status === 'PENDING').length,
    },
    {
      status: 'IN_PROGRESS' as const,
      label: '진행중',
      count: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    },
    {
      status: 'COMPLETED' as const,
      label: '완료',
      count: tasks.filter((t) => t.status === 'COMPLETED').length,
    },
  ];
};

export default function InboundTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<InboundTask['status']>('ALL');
  const [taskList, setTaskList] = useState<InboundTask[]>([]);
  const [allTasks, setAllTasks] = useState<InboundTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // null 값을 "-"로 변환하는 헬퍼 함수
  const formatNullValue = (value: string | null | undefined): string => {
    return value ?? '-';
  };

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchInventoryList = async () => {
      setIsLoading(true);
      try {
        const response = await getInventoryList();
        if (response.isSuccess && response.result) {
          // API 응답을 InboundTask 형식으로 변환
          const mappedTasks: InboundTask[] = response.result.map((item: any) => ({
            id: item.inventoryId,
            projectNumber: formatNullValue(item.projectNumber),
            taskName: formatNullValue(item.inventoryTitle),
            items: formatNullValue(item.itemSummary),
            location: '-', // API 응답에 없으므로 "-"
            requestDate: formatNullValue(item.requestedAt),
            manager: formatNullValue(item.assigneeSummary),
            status: item.inventoryStatus as InventoryStatus, // API 응답의 status를 그대로 사용
          }));

          setAllTasks(mappedTasks);
        }
      } catch (error) {
        console.error('입고 업무 목록 가져오기 실패:', error);
        // 에러 발생 시 빈 배열 설정
        setAllTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryList();
  }, []);

  // 상태 및 검색어에 따라 필터링
  useEffect(() => {
    let filteredList: InboundTask[];

    if (activeStatus === 'ALL') {
      filteredList = allTasks;
    } else {
      filteredList = allTasks.filter((task) => task.status === activeStatus);
    }

    // 검색어 필터링
    const finalFilteredList = filteredList.filter(
      (task) =>
        task.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setTaskList(finalFilteredList);
  }, [activeStatus, searchTerm, allTasks]);

  const handleStatusClick = (status: InboundTask['status']) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
  };

  const statusData = calculateStatusCounts(allTasks);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex-1">
        <div className="pl-[70px] pr-10 pt-[60px]">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            입고 업무 리스트
          </h1>

          <div className="mt-[67px] flex w-fit items-center">
            <div className="flex gap-[8px]">
              {statusData.map((item) => (
                <ProjectStatusButton
                  key={item.status}
                  label={item.label}
                  count={item.count}
                  isActive={activeStatus === item.status}
                  onClick={() => handleStatusClick(item.status)}
                />
              ))}
            </div>

            <div className="ml-[159px] w-[300px]">
              <SearchBar placeholder="프로젝트 넘버 또는 입고 업무명을 입력하세요" value={searchTerm} onChange={handleSearchChange} />
            </div>
          </div>

          <div className="mb-10 mt-[30px]">
            <TaskListTable data={taskList} isLoading={isLoading} type="inbound" />
          </div>
        </div>
      </main>
    </div>
  );
}
