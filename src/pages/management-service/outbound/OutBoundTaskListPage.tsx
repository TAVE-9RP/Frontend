import React, { useState, useEffect } from 'react';
import SearchBar from '../../../components/common/SearchBar';
import SideBar from '../../../components/common/SideBar';
import ProjectStatusButton from '../../../components/common/ProjectStatusButton';
import TaskListTable from '../../../components/common/TaskListTable';
import { getLogisticsList } from '../../../apis/ownerLogistics';

type LogisticsStatus = 'ASSIGNED' | 'PENDING' | 'REJECT' | 'IN_PROGRESS' | 'COMPLETED';

interface OutboundTask {
  id: number;
  projectNumber: string;
  taskName: string;
  items: string;
  location: string;
  requestDate: string;
  manager: string;
  status: 'ALL' | LogisticsStatus;
}

const MOCK_INBOUND_TASK_LIST: OutboundTask[] = [
  {
    id: 1,
    projectNumber: 'SYS-01-001',
    taskName: '강아지 껌 대량 출고',
    items: '강아지 껌',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '강아껌',
    status: 'PENDING',
  },
  {
    id: 2,
    projectNumber: 'SYS-01-002',
    taskName: '밥주세요',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '홍길동',
    status: 'PENDING',
  },
  {
    id: 3,
    projectNumber: 'SYS-01-003',
    taskName: '쫀득쿠키',
    items: '쫀득쿠키',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '김쫀득',
    status: 'IN_PROGRESS',
  },
  {
    id: 4,
    projectNumber: 'SYS-01-004',
    taskName: '두쫀쿠',
    items: '두바이쫀득쿠키',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '두바이',
    status: 'COMPLETED',
  },
  {
    id: 5,
    projectNumber: 'SYS-01-005',
    taskName: '얼망고',
    items: '망고',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '망고짱',
    status: 'ASSIGNED',
  },
  {
    id: 6,
    projectNumber: 'SYS-01-006',
    taskName: '업무명입니다.',
    items: '애플망고 외 3...',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '홍길동',
    status: 'IN_PROGRESS',
  },
  {
    id: 7,
    projectNumber: 'SYS-01-007',
    taskName: '포테이토피자',
    items: '피자300판',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '박하은',
    status: 'IN_PROGRESS',
  },
  {
    id: 6,
    projectNumber: 'SYS-01-008',
    taskName: '페퍼로니피자',
    items: '피자500판',
    location: '위치입니다.',
    requestDate: '2025-10-25',
    manager: '피자최고',
    status: 'ASSIGNED',
  },
];

// 상태별 카운트 계산 함수
const calculateStatusCounts = (tasks: OutboundTask[]) => {
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

export default function OutboundTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<OutboundTask['status']>('ALL');
  const [taskList, setTaskList] = useState<OutboundTask[]>([]);
  const [allTasks, setAllTasks] = useState<OutboundTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // null 값을 "-"로 변환하는 헬퍼 함수
  const formatNullValue = (value: string | null | undefined): string => {
    return value ?? '-';
  };

  // 날짜를 '2025-12-21T14:22:00' 형식에서 '2025-12-21' 형식으로 변환
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString || dateString === '-') return '-';

    // ISO 형식의 날짜 문자열에서 날짜 부분만 추출 (YYYY-MM-DD)
    const datePart = dateString.split('T')[0];
    if (!datePart) return '-';

    return datePart;
  };

  // API에서 데이터 가져오기 (검색어 포함)
  useEffect(() => {
    const fetchLogisticsList = async () => {
      setIsLoading(true);
      try {
        const response = await getLogisticsList(searchTerm);
        if (response.isSuccess && response.result) {
          // API 응답을 OutboundTask 형식으로 변환
          const mappedTasks: OutboundTask[] = response.result.map((item: any) => ({
            id: item.logisticsId,
            projectNumber: formatNullValue(item.projectNumber),
            taskName: formatNullValue(item.logisticsTitle),
            items: formatNullValue(item.customer), // 거래처
            location: '-', // API 응답에 없으므로 "-"
            requestDate: formatDate(item.requestedAt),
            manager: formatNullValue(item.assigneeSummary),
            status: item.logisticsStatus as LogisticsStatus, // API 응답의 status를 그대로 사용
          }));

          setAllTasks(mappedTasks);
        }
      } catch (error) {
        console.error('출하 업무 목록 가져오기 실패:', error);
        // 에러 발생 시 빈 배열 설정
        setAllTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogisticsList();
  }, [searchTerm]);

  // 상태에 따라 필터링 (검색어는 API에서 처리)
  useEffect(() => {
    let filteredList: OutboundTask[];

    if (activeStatus === 'ALL') {
      filteredList = allTasks;
    } else {
      filteredList = allTasks.filter((task) => task.status === activeStatus);
    }

    setTaskList(filteredList);
  }, [activeStatus, allTasks]);

  const handleStatusClick = (status: OutboundTask['status']) => {
    if (activeStatus === status) return;
    setActiveStatus(status);
  };

  const statusData = calculateStatusCounts(allTasks);

  return (
    <div className="flex min-h-screen w-full bg-greyColor-grey100">
      <SideBar />

      <main className="flex flex-1 flex-col items-center">
        <div className="pt-[60px]">
          <h1 className="font-pretendard text-[24px] font-bold leading-normal text-black">
            출하 업무 리스트
          </h1>
        </div>
        <div className="mt-[67px] w-max pb-20">
          <div className="mb-[27px] flex w-full items-center justify-between">
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
            <div className="w-[450px]">
              <SearchBar
                placeholder="프로젝트 넘버 또는 출하 업무명을 입력하세요."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
          </div>
          <TaskListTable width="1200px" data={taskList} isLoading={isLoading} type="outbound" />
        </div>
      </main>
    </div>
  );
}
