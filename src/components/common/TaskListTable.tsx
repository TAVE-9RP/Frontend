import React from 'react';
import { useNavigate } from 'react-router-dom';

type InventoryStatus = 'ASSIGNED' | 'PENDING' | 'REJECT' | 'IN_PROGRESS' | 'COMPLETED';

interface TaskData {
  id: number;
  projectNumber: string;
  taskName: string;
  items: string;
  location: string;
  requestDate: string;
  manager: string;
  status: 'ALL' | InventoryStatus;
}

interface TaskListTableProps {
  data: TaskData[];
  isLoading: boolean;
  type: 'inbound' | 'outbound';
  basePath?: string;
  width?: string;
}

export default function TaskListTable({
  data,
  isLoading,
  type,
  basePath: externalPath,
  width = "1040px",
}: TaskListTableProps) {
  const navigate = useNavigate();
  const isOutbound = type === 'outbound';
  const taskLabel = isOutbound ? '출하' : '입고';
  const finalPath = externalPath || (isOutbound ? '/outbound-task' : '/inbound-task');

  const handleRowClick = (id: number) => {
    navigate(`${finalPath}/${id}`);
  };

  const getStatusStyle = (status: TaskData['status']) => {
    switch (status) {
      case 'ASSIGNED':
        return {
          bg: 'bg-greyColor-grey200',
          text: 'text-greyColor-grey600',
          dot: 'bg-greyColor-grey600',
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-semanticColor-green100',
          text: 'text-semanticColor-green500',
          dot: 'bg-semanticColor-green500',
        };
      case 'COMPLETED':
        return {
          bg: 'bg-mainColor-blue050',
          text: 'text-mainColor-blue600',
          dot: 'bg-mainColor-blue600',
        };
      case 'PENDING':
        return {
          bg: 'bg-subColor-orange100',
          text: 'text-subColor-orange800',
          dot: 'bg-subColor-orange800',
        };
      case 'REJECT':
        return {
          bg: 'bg-errorColor-red010/10',
          text: 'text-errorColor-red010',
          dot: 'bg-errorColor-red010',
        };
      default:
        return {
          bg: 'bg-greyColor-grey200',
          text: 'text-greyColor-grey600',
          dot: 'bg-greyColor-grey600',
        };
    }
  };

  const getStatusText = (status: TaskData['status']) => {
    switch (status) {
      case 'ASSIGNED':
        return '업무 할당';
      case 'PENDING':
        return '승인 대기';
      case 'REJECT':
        return '반려';
      case 'IN_PROGRESS':
        return '진행 중';
      case 'COMPLETED':
        return `${taskLabel} 완료`;
      default:
        return '알 수 없음';
    }
  };

  const commonCellClasses =
    'h-[40px] px-4 border-r-2 last:border-r-0 border-greyColor-grey200 text-center align-middle text-sm';
  const tableHeaderClasses = `${commonCellClasses} border-b-2 font-bold text-greyColor-grey700 bg-subColor-orange050 font-pretendard`;

return (
    <div className="h-auto w-fit overflow-hidden rounded-[10px] border-2 border-greyColor-grey200 font-pretendard">
      <div className="overflow-x-auto">
        <table className="table-fixed border-collapse bg-white">
        <thead>
          <tr>
            <th className={`${tableHeaderClasses} w-[180px]`}>프로젝트 넘버</th>
            <th className={`${tableHeaderClasses} w-[170px]`}>{taskLabel} 업무명</th>
            <th className={`${tableHeaderClasses} w-[200px]`}>
              {isOutbound ? '거래처' : `${taskLabel} 품목`}
            </th>
            <th className={`${tableHeaderClasses} w-[180px]`}>요청일</th>
            <th className={`${tableHeaderClasses} w-[170px]`}>담당자</th>
            <th className={`${tableHeaderClasses} w-[140px]`}>진행 상태</th>
          </tr>
        </thead>
<tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="h-[100px] bg-white align-middle">
                  <div style={{ width: width }} className="flex justify-center items-center">
                    <p className="font-pretendard text-greyColor-grey500 text-lg">
                      목록을 불러오는 중...
                    </p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
      <td colSpan={6} className="h-[200px] bg-white align-middle">
                  <div style={{ width: width }} className="flex justify-center items-center">
                    <p className="text-sm text-greyColor-grey500">해당 업무 목록이 없습니다.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((task, index) => {
                const isLastRow = index === data.length - 1;
                const bottomBorderClass = isLastRow ? 'border-b-0' : 'border-b-2';
                const style = getStatusStyle(task.status);

                return (
                  <tr
                    key={task.id}
                    onClick={() => handleRowClick(task.id)}
                    className="cursor-pointer transition duration-150 hover:bg-mainColor-blue050"
                  >
                    <td className={`${commonCellClasses} ${bottomBorderClass} truncate font-mono`}>
                      {task.projectNumber}
                    </td>
                    <td className={`${commonCellClasses} ${bottomBorderClass} truncate`}>
                      {task.taskName}
                    </td>
                    <td className={`${commonCellClasses} ${bottomBorderClass} truncate`}>
                      {task.items}
                    </td>
                    <td className={`${commonCellClasses} ${bottomBorderClass} truncate`}>
                      {task.requestDate}
                    </td>
                    <td className={`${commonCellClasses} ${bottomBorderClass} truncate`}>
                      {task.manager}
                    </td>
                    <td className={`${commonCellClasses} ${bottomBorderClass}`}>
                      <div className="flex justify-center">
                        <div
                          className={`inline-flex h-[24px] items-center justify-center gap-[8px] rounded-[50px] px-[10px] ${style.bg} ${style.text} font-pretendard text-[13px] font-bold leading-normal`}
                        >
                          <div
                            className={`aspect-square h-[6px] w-[6px] rounded-full ${style.dot}`}
                          />
                          {getStatusText(task.status)}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
