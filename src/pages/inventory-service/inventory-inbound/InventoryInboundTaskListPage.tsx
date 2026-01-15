import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import TaskListTable from '../../../components/common/TaskListTable';
import TaskToggleButton from '@/components/common/TaskToggleButton';
import { getInventoryList, getInventoryAssignedList } from '../../../apis/inventory';

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
      status: 'REJECT' as const,
      label: '승인 반려',
      count: tasks.filter((t) => t.status === 'REJECT').length,
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

export default function InventoryInboundTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<InboundTask['status']>('ALL');
  const [taskList, setTaskList] = useState<InboundTask[]>([]);
  const [allTasks, setAllTasks] = useState<InboundTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'ALL' | 'MY'>('ALL');

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

  // API에서 데이터 가져오기 (검색어 및 viewMode 포함)
  useEffect(() => {
    const fetchInventoryList = async () => {
      setIsLoading(true);
      try {
        // viewMode에 따라 다른 API 호출
        const response =
          viewMode === 'MY'
            ? await getInventoryAssignedList(searchTerm)
            : await getInventoryList(searchTerm);
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
  }, [searchTerm, viewMode]);

  // 상태에 따라 필터링 (검색어와 viewMode는 API에서 처리)
  useEffect(() => {
    let filteredList: InboundTask[];

    if (activeStatus === 'ALL') {
      filteredList = allTasks;
    } else {
      filteredList = allTasks.filter((task) => task.status === activeStatus);
    }

    setTaskList(filteredList);
  }, [activeStatus, allTasks]);

  const handleStatusClick = (status: InboundTask['status']) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
  };

  const statusData = calculateStatusCounts(allTasks);

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
