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

  // ✅ 공통 스타일 수정
  // last:border-r-0 -> 이 클래스가 적용된 요소가 마지막 자식일 경우 오른쪽 테두리를 0으로 만듭니다.
  // 이렇게 하면 map을 돌릴 때 일일이 border-r-0을 넣지 않아도 자동으로 마지막 칸의 선이 사라집니다.
  const commonCellClasses =
    'h-[40px] px-4 border-r-2 last:border-r-0 border-greyColor-grey200 text-center align-middle text-sm';

  // 헤더 스타일
  const tableHeaderClasses = `${commonCellClasses} border-b-2 font-bold text-greyColor-grey700 bg-subColor-orange050`;

  // 셀 스타일
  const tableCellClasses = `${commonCellClasses} text-greyColor-grey800`;

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
    // ✅ w-[1050px] -> w-fit 으로 변경
    // 내부 테이블이 1050px이고 테두리가 4px이므로 전체는 1054px이 되어야 합니다.
    // w-fit을 쓰면 이를 자동으로 계산해줍니다.
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
              {/* last:border-r-0 덕분에 여기서는 별도의 border 클래스를 신경 쓰지 않아도 됩니다. */}
              <th className={`${tableHeaderClasses} w-[140px]`}>진행 상태</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  // 데이터 없음 행은 마지막 행이므로 border-b-0
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
                    {/* last:border-r-0 덕분에 자동으로 오른쪽 선이 제거됩니다. */}
                    <td className={`${tableCellClasses} ${bottomBorderClass}`}>
                      <span className={statusChipClasses(project.status)}>
                        {project.status === 'IN_PROGRESS'
                          ? '진행중'
                          : project.status === 'PENDING'
                            ? '미진행'
                            : '완료'}
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
