import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import TaskListTable from '../../../components/common/TaskListTable';
import TaskToggleButton from '@/components/common/TaskToggleButton';
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
    taskName: '재고서비스업무명',
    items: '카피바라 200마리',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '박하은',
    status: 'TASK_ASSIGNMENT',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    taskName: '엄뮤명',
    items: '카피바라 300마리',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '박카스',
    status: 'APPROVAL_PENDING',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    taskName: '에이씨밀란',
    items: 'ac milan',
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

// 상태별 카운트 계산 함수
const calculateStatusCounts = (tasks: InboundTask[], viewMode: 'ALL' | 'MY', myName?: string) => {
  let filteredTasks = tasks;
  
  if (viewMode === 'MY' && myName) {
    filteredTasks = tasks.filter((task) => task.manager.includes(myName));
  }
  
  return [
    { status: 'ALL' as const, label: '전체', count: filteredTasks.length },
    {
      status: 'ASSIGNED' as const,
      label: '업무 할당',
      count: filteredTasks.filter((t) => t.status === 'ASSIGNED').length,
    },
    {
      status: 'PENDING' as const,
      label: '승인 대기',
      count: filteredTasks.filter((t) => t.status === 'PENDING').length,
    },
    {
      status: 'IN_PROGRESS' as const,
      label: '진행중',
      count: filteredTasks.filter((t) => t.status === 'IN_PROGRESS').length,
    },
    {
      status: 'COMPLETED' as const,
      label: '완료',
      count: filteredTasks.filter((t) => t.status === 'COMPLETED').length,
    },
  ];
};

export default function InventoryInboundTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<InboundTask['status']>('ALL');
  const [taskList, setTaskList] = useState<InboundTask[]>([]);
  const [allTasks, setAllTasks] = useState<InboundTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'ALL' | 'MY'>('ALL');
  const [myName, setMyName] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // null 값을 "-"로 변환하는 헬퍼 함수
  const formatNullValue = (value: string | null | undefined): string => {
    return value ?? '-';
  };

  // 날짜를 ISO 형식에서 'YYYY-MM-DD' 형식으로 변환
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString || dateString === '-') return '-';
    
    // ISO 형식의 날짜 문자열에서 날짜 부분만 추출 (YYYY-MM-DD)
    const datePart = dateString.split('T')[0];
    if (!datePart) return '-';
    
    return datePart;
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
            requestDate: formatDate(item.requestedAt),
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

  // 상태 및 검색어, viewMode에 따라 필터링
  useEffect(() => {
    let filteredList: InboundTask[];

    if (activeStatus === 'ALL') {
      filteredList = allTasks;
    } else {
      filteredList = allTasks.filter((task) => task.status === activeStatus);
    }

    // viewMode 필터링
    if (viewMode === 'MY' && myName) {
      filteredList = filteredList.filter((task) => task.manager.includes(myName));
    }

    // 검색어 필터링
    const finalFilteredList = filteredList.filter(
      (task) =>
        task.projectNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setTaskList(finalFilteredList);
  }, [activeStatus, searchTerm, allTasks, viewMode, myName]);

  const handleStatusClick = (status: InboundTask['status']) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
  };

  const statusData = calculateStatusCounts(allTasks, viewMode, myName);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex-1">
        <div className="mt-5 pl-[70px] pr-10 pt-10">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            입고 업무 리스트
          </h1>

          <div className="mt-8">
            <TaskToggleButton viewMode={viewMode} onChange={setViewMode} />
          </div>

          <div className="mt-[43px] flex items-center">
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

            <div className="ml-[160px] w-[500px]">
              <SearchBar
                placeholder="프로젝트 넘버 또는 입고 업무명을 입력하세요."
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
            type="inbound"
            basePath="/inventory-inbound-task"
          />
        </div>
      </main>
    </div>
  );
}
