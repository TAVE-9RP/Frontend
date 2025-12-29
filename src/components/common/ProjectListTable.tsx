import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  projectNumber: string;
  projectTitle: string;
  projectDescription: string;
  client: string;
  creationDate: string;
  manager: string;
  status: 'IN_PROGRESS' | 'PENDING' | 'COMPLETED';
}

interface ProjectListTableProps {
  data: Project[];
  isLoading: boolean;
}

export default function ProjectListTable({ data, isLoading }: ProjectListTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
    console.log(`프로젝트 ${projectId} 상세 페이지로 이동`);
  };

  const tableHeaderClasses =
    'py-3 px-4 font-bold text-sm text-greyColor-grey700 bg-subColor-orange050 border-b border-subColor-orange100 border-r border-greyColor-grey200';

  const tableCellClasses =
    'py-3 px-4 text-sm text-greyColor-grey800 border-b border-greyColor-grey200 border-r border-greyColor-grey200';

  const statusChipClasses = (status: Project['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 'bg-mainColor-blue050 text-mainColor-blue600 px-2 py-1 rounded-full text-xs font-medium';
      case 'PENDING':
        return 'bg-greyColor-grey200 text-greyColor-grey600 px-2 py-1 rounded-full text-xs font-medium';
      case 'COMPLETED':
        return 'bg-subColor-orange050 text-subColor-orange600 px-2 py-1 rounded-full text-xs font-medium';
      default:
        return 'bg-greyColor-grey200 text-greyColor-grey600 px-2 py-1 rounded-full text-xs font-medium';
    }
  };

  if (isLoading) {
    return <p className="py-10 text-center text-greyColor-grey500">목록을 불러오는 중...</p>;
  }

  return (
    <div
      className="overflow-x-auto border border-greyColor-grey200"
      style={{ width: '1040px', height: 'auto' }}
    >
      <table className="min-w-full divide-y divide-greyColor-grey200">
        <thead className="bg-subColor-orange050">
          <tr>
            <th className={`${tableHeaderClasses} text-left`}>프로젝트 넘버</th>
            <th className={`${tableHeaderClasses} text-left`}>프로젝트 제목</th>
            <th className={`${tableHeaderClasses} text-left`}>프로젝트 설명</th>
            <th className={`${tableHeaderClasses} text-left`}>거래처</th>
            <th className={`${tableHeaderClasses} text-left`}>생성 일자</th>
            <th className={`${tableHeaderClasses} text-left`}>담당자</th>
            <th className={`${tableHeaderClasses} border-r-0 text-center`}>진행 상태</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-greyColor-grey200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className={`${tableCellClasses} border-r-0 text-center text-greyColor-grey500`}
              >
                해당 프로젝트 목록이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((project) => (
              <tr
                key={project.id}
                className="cursor-pointer transition duration-150 hover:bg-mainColor-blue050"
                onClick={() => handleRowClick(project.id)}
              >
                <td className={`${tableCellClasses} font-mono`}>{project.projectNumber}</td>
                <td className={tableCellClasses}>{project.projectTitle}</td>
                <td className={tableCellClasses}>{project.projectDescription}</td>
                <td className={tableCellClasses}>{project.client}</td>
                <td className={tableCellClasses}>{project.creationDate}</td>
                <td className={tableCellClasses}>{project.manager}</td>
                <td className={`${tableCellClasses} border-r-0 text-center`}>
                  <span className={statusChipClasses(project.status)}>
                    {project.status === 'IN_PROGRESS'
                      ? '진행중'
                      : project.status === 'PENDING'
                        ? '미진행'
                        : '완료'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
