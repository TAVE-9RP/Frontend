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
  width?: string; 
}

export default function ProjectListTable({ 
  data, 
  isLoading, 
  width = "1200px" 
}: ProjectListTableProps) {
  const navigate = useNavigate();

  const handleRowClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  const commonCellClasses =
    'h-[40px] px-4 border-r-2 last:border-r-0 border-greyColor-grey200 text-center align-middle text-sm';

  const tableHeaderClasses = `${commonCellClasses} border-b-2 font-bold text-greyColor-grey700 bg-subColor-orange050`;
  const tableCellClasses = `${commonCellClasses} text-greyColor-grey800`;

  const getStatusImage = (status: Project['status']) => {
    switch (status) {
      case 'IN_PROGRESS': return '/images/management/진행중.png';
      case 'PENDING': return '/images/management/미진행.png';
      case 'COMPLETED': return '/images/management/완료.png';
      default: return '/images/management/미진행.png';
    }
  };

  return (
    <div className="h-auto w-fit overflow-hidden rounded-[10px] border-2 border-greyColor-grey200 font-pretendard">
      <div className="overflow-x-auto">
        <table 
          className="table-fixed border-collapse bg-white"
          style={{ width: width }}
        >
          <thead className="bg-subColor-orange050">
            <tr>
              <th className={`${tableHeaderClasses}`} style={{ width: '14%' }}>프로젝트 넘버</th>
              <th className={`${tableHeaderClasses}`} style={{ width: '22%' }}>프로젝트 제목</th>
              <th className={`${tableHeaderClasses}`} style={{ width: '12%' }}>프로젝트 설명</th>
              <th className={`${tableHeaderClasses}`} style={{ width: '12%' }}>거래처</th>
              <th className={`${tableHeaderClasses}`} style={{ width: '12%' }}>생성 일자</th>
              <th className={`${tableHeaderClasses}`} style={{ width: '14%' }}>담당자</th>
              <th className={`${tableHeaderClasses}`} style={{ width: '14%' }}>진행 상태</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="h-[100px] bg-white align-middle">
                  <div className="flex w-full justify-center items-center">
                    <p className="text-greyColor-grey500 text-lg">목록을 불러오는 중...</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="h-[100px] bg-white align-middle">
                  <div className="flex w-full justify-center items-center">
                    <p className="text-sm text-greyColor-grey500">해당 프로젝트 목록이 없습니다.</p>
                  </div>
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
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {project.projectTitle}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {project.projectDescription}
                    </td>
                    <td className={`${tableCellClasses} ${bottomBorderClass} truncate`}>
                      {project.client}
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
                          alt={project.status}
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