import React from 'react';
import { useNavigate } from 'react-router-dom';
import 진행중Img from '@/assets/management/진행중.png';
import 미진행Img from '@/assets/management/미진행.png';
import 완료Img from '@/assets/management/완료.png';

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

  const commonCellClasses =
    'h-[40px] px-4 border-r-2 last:border-r-0 border-greyColor-grey200 text-center align-middle text-sm';

  const tableHeaderClasses = `${commonCellClasses} border-b-2 font-bold text-greyColor-grey700 bg-subColor-orange050`;

  const tableCellClasses = `${commonCellClasses} text-greyColor-grey800`;

  const getStatusImage = (status: Project['status']) => {
    switch (status) {
      case 'IN_PROGRESS':
        return 진행중Img;
      case 'PENDING':
        return 미진행Img;
      case 'COMPLETED':
        return 완료Img;
      default:
        return 미진행Img;
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
              <th className={`${tableHeaderClasses} w-[150px]`}>프로젝트 넘버</th>
              <th className={`${tableHeaderClasses} w-[170px]`}>프로젝트 제목</th>
              <th className={`${tableHeaderClasses} w-[180px]`}>프로젝트 설명</th>
              <th className={`${tableHeaderClasses} w-[120px]`}>거래처</th>
              <th className={`${tableHeaderClasses} w-[140px]`}>생성 일자</th>
              <th className={`${tableHeaderClasses} w-[150px]`}>담당자</th>
              <th className={`${tableHeaderClasses} w-[140px]`}>진행 상태</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className={`h-[40px] border-b-0 border-greyColor-grey200 text-center text-sm text-greyColor-grey500`}
                >
                  해당 프로젝트 목록이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((project, index) => {
                const isLastRow = index === data.length - 1;
                const bottomBorderClass = isLastRow ? 'border-b-0' : 'border-b-2';

                return (
                  <tr
                    key={project.id}
                    onClick={() => handleRowClick(project.id)}
                    className="cursor-pointer transition duration-150 hover:bg-mainColor-blue050"
                  >
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate font-mono`}>
                      {project.projectNumber}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass}`} title={project.projectTitle}>
                      <div className="mx-auto max-w-[170px] truncate text-left">
                        {project.projectTitle}
                      </div>
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass}`} title={project.projectDescription}>
                      <div className="mx-auto max-w-[180px] truncate text-left">
                        {project.projectDescription}
                      </div>
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass}`} title={project.client}>
                      <div className="mx-auto max-w-[120px] truncate text-left">
                        {project.client}
                      </div>
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {project.creationDate}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {project.manager}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass}`}>
                      <div className="flex justify-center">
                        <img
                          src={getStatusImage(project.status)}
                          alt={
                            project.status === 'IN_PROGRESS'
                              ? '진행 중'
                              : project.status === 'PENDING'
                                ? '미진행'
                                : '완료'
                          }
                          className="h-auto w-[71px] object-contain"
                        />
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
