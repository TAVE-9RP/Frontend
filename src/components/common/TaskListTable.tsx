import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TaskData {
  id: number;
  projectNumber: string;
  taskName: string;
  items: string;
  location: string;
  requestDate: string;
  manager: string;
  status: 'ALL' | 'TASK_ASSIGNMENT' | 'APPROVAL_PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

interface TaskListTableProps {
  data: TaskData[];
  isLoading: boolean;
  type: 'inbound' | 'outbound';
  basePath?: string;
}

export default function TaskListTable({
  data,
  isLoading,
  type,
  basePath: externalPath,
}: TaskListTableProps) {
  const navigate = useNavigate();

  const isOutbound = type === 'outbound';
  const taskLabel = isOutbound ? '출하' : '입고';
  const finalPath = externalPath || (isOutbound ? '/outbound-task' : '/inbound-task');

  const handleRowClick = (id: number) => {
    navigate(`${finalPath}/${id}`);
  };

  const commonCellClasses =
    'h-[40px] px-4 border-r-2 last:border-r-0 border-greyColor-grey200 text-center align-middle text-sm';

  const tableHeaderClasses = `${commonCellClasses} border-b-2 font-bold text-greyColor-grey700 bg-subColor-orange050`;

  const tableCellClasses = `${commonCellClasses}`;

  const statusChipClasses = (status: TaskData['status']) => {
    const baseChipStyle = 'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap';

    switch (status) {
      case 'TASK_ASSIGNMENT':
        return `${baseChipStyle} bg-greyColor-grey200 text-greyColor-grey600`;
      case 'APPROVAL_PENDING':
      case 'IN_PROGRESS':
        return `${baseChipStyle} bg-subColor-orange100 text-subColor-orange800`;
      case 'COMPLETED':
        return `${baseChipStyle} bg-mainColor-blue050 text-mainColor-blue600`;
      default:
        return `${baseChipStyle} bg-greyColor-grey200 text-greyColor-grey600`;
    }
  };

  const getStatusText = (status: TaskData['status']) => {
    switch (status) {
      case 'TASK_ASSIGNMENT':
        return '업무 할당';
      case 'APPROVAL_PENDING':
        return '승인 대기';
      case 'IN_PROGRESS':
        return '진행 중';
      case 'COMPLETED':
        return `${taskLabel} 완료`;
      default:
        return '알 수 없음';
    }
  };

  if (isLoading) {
    return <p className="py-10 text-center text-greyColor-grey500">목록을 불러오는 중...</p>;
  }

  return (
    <div className="h-auto w-fit overflow-hidden rounded-[10px] border-2 border-greyColor-grey200">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed border-collapse bg-white">
          <thead className="bg-subColor-orange050">
            <tr>
              <th className={`${tableHeaderClasses} w-[180px]`}>프로젝트 넘버</th>
              <th className={`${tableHeaderClasses} w-[170px]`}>{taskLabel} 업무명</th>
              <th className={`${tableHeaderClasses} w-[200px]`}>{taskLabel} 품목</th>
              <th className={`${tableHeaderClasses} w-[180px]`}>요청일</th>
              <th className={`${tableHeaderClasses} w-[170px]`}>담당자</th>
              <th className={`${tableHeaderClasses} w-[140px]`}>진행 상태</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="h-[40px] text-center text-sm text-greyColor-grey500">
                  해당 업무 목록이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((task, index) => {
                const isLastRow = index === data.length - 1;
                const bottomBorderClass = isLastRow ? 'border-b-0' : 'border-b-2';

                return (
                  <tr
                    key={task.id}
                    onClick={() => handleRowClick(task.id)}
                    className="cursor-pointer transition duration-150 hover:bg-mainColor-blue050"
                  >
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate font-mono`}>
                      {task.projectNumber}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {task.taskName}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {task.items}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {task.requestDate}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {task.manager}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass}`}>
                      <span className={statusChipClasses(task.status)}>
                        {getStatusText(task.status)}
                      </span>
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
