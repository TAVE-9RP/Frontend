import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ellipseIcon from '@/assets/ellipse.png';
import { getAssignedProjects } from '@/apis/admin';

type MappedStatus = '미진행' | '진행중' | '완료';

interface ProjectData {
  id: number;
  number: string;
  title: string;
  dueDate: string;
  status: MappedStatus;
}

const ProjectListTable = () => {
  const navigate = useNavigate();
  const borderColor = 'border-greyColor-grey200';
  const headerBg = 'bg-mainColor-blue050';
  const [projectList, setProjectList] = useState<ProjectData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getAssignedProjects();
        if (response.isSuccess && response.result) {
          const mappedProjects: ProjectData[] = response.result.map((item: any) => {
            // 날짜 포맷팅 (ISO 형식에서 YYYY-MM-DD로)
            let dueDate = '';
            if (item.projectExpectedEndDate) {
              const date = new Date(item.projectExpectedEndDate);
              dueDate = date.toISOString().split('T')[0];
            }

            // 상태 매핑: '미진행', '진행중', '완료' 세 개로만
            let mappedStatus: MappedStatus = '미진행';
            if (item.status === 'COMPLETED') {
              mappedStatus = '완료';
            } else if (item.status === 'IN_PROGRESS') {
              mappedStatus = '진행중';
            } else {
              // NOT_STARTED, ASSIGNED, PENDING, REJECT 등 모두 '미진행'
              mappedStatus = '미진행';
            }

            return {
              id: item.projectId,
              number: item.projectNumber || '',
              title: item.projectTitle || '',
              dueDate: dueDate,
              status: mappedStatus,
            };
          });

          setProjectList(mappedProjects);
        }
      } catch (error) {
        console.error('할당된 프로젝트 목록 가져오기 실패:', error);
        setProjectList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleNavigation = (id: number) => {
    navigate(`/project/${id}`);
  };

  const getStatusChipClasses = (status: MappedStatus) => {
    const baseClasses =
      'flex w-[68px] h-[24px] items-center justify-center rounded-full text-[11px] font-bold font-pretendard whitespace-nowrap gap-[8px]';

    switch (status) {
      case '미진행':
        return `${baseClasses} bg-greyColor-grey200 text-greyColor-grey600`;
      case '진행중':
        return `${baseClasses} bg-subColor-orange100 text-subColor-orange800`;
      case '완료':
        return `${baseClasses} bg-mainColor-blue050 text-mainColor-blue600`;
      default:
        return `${baseClasses} bg-greyColor-grey200 text-greyColor-grey600`;
    }
  };

  return (
    <div className="flex w-[980px] max-h-[240px] flex-col items-start overflow-y-auto overflow-x-hidden">
      <div className={`flex w-[980px] border ${borderColor} ${headerBg}`}>
        <div
          className={`flex h-[40px] w-[200px] items-center justify-center border-r font-pretendard text-[13px] font-bold text-black ${borderColor}`}
        >
          프로젝트 넘버
        </div>
        <div
          className={`flex h-[40px] w-[380px] items-center justify-center border-r font-pretendard text-[13px] font-bold text-black ${borderColor}`}
        >
          프로젝트 제목
        </div>
        <div
          className={`flex h-[40px] w-[200px] items-center justify-center border-r font-pretendard text-[13px] font-bold text-black ${borderColor}`}
        >
          목표 완료일
        </div>
        <div
          className={`flex h-[40px] w-[200px] items-center justify-center font-pretendard text-[13px] font-bold text-black ${borderColor}`}
        >
          진행 상태
        </div>
      </div>

      <div className="flex w-[980px] flex-col">
        {isLoading ? (
          <div className="flex h-[48px] items-center justify-center">
            <span className="font-pretendard text-[13px] text-greyColor-grey500">로딩 중...</span>
          </div>
        ) : projectList.length === 0 ? (
          <div className="flex h-[48px] items-center justify-center">
            <span className="font-pretendard text-[13px] text-greyColor-grey500">데이터가 없습니다</span>
          </div>
        ) : (
          projectList.map((item) => (
            <div key={item.id} className={`flex border-x border-b ${borderColor}`}>
              <div
                className={`flex h-[48px] w-[200px] items-center justify-center border-r font-pretendard text-[13px] text-black ${borderColor}`}
              >
                {item.number}
              </div>
              <div
                className={`flex h-[48px] w-[380px] items-center justify-center border-r font-pretendard text-[13px] text-black ${borderColor}`}
              >
                {item.title}
              </div>
              <div
                className={`flex h-[48px] w-[200px] items-center justify-center border-r font-pretendard text-[13px] text-black ${borderColor}`}
              >
                {item.dueDate}
              </div>
              <div
                className={`flex h-[48px] w-[200px] items-center justify-center ${borderColor}`}
              >
                <div className={getStatusChipClasses(item.status)}>
                  <span
                    className="inline-block h-[6px] w-[6px] bg-current"
                    style={{
                      maskImage: `url(${ellipseIcon})`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      WebkitMaskImage: `url(${ellipseIcon})`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                    }}
                  />
                  {item.status}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectListTable;
