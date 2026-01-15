import React from 'react';
import { useNavigate } from 'react-router-dom';
import ellipseIcon from '@/assets/ellipse.png';

interface ProjectData {
  id: string;
  number: string;
  title: string;
  dueDate: string;
  status: 'ASSIGNED' | 'PENDING' | 'REJECT' | 'IN_PROGRESS' | 'COMPLETED' | '미진행';
}

const MOCK_DATA: ProjectData[] = [
  {
    id: 'SYS-01-001',
    number: 'SYS-01-001',
    title: '제목입니다.',
    dueDate: '2025-10-25',
    status: '미진행',
  },
  {
    id: 'SYS-01-002',
    number: 'SYS-01-001',
    title: '제목입니다.',
    dueDate: '2025-10-25',
    status: 'IN_PROGRESS',
  },
  {
    id: 'SYS-01-003',
    number: 'SYS-01-001',
    title: '제목입니다.',
    dueDate: '2025-10-25',
    status: 'COMPLETED',
  },
  {
    id: 'SYS-01-004',
    number: 'SYS-01-001',
    title: '제목입니다.',
    dueDate: '2025-10-25',
    status: 'PENDING',
  },
  {
    id: 'SYS-01-005',
    number: 'SYS-01-001',
    title: '제목입니다.',
    dueDate: '2025-10-25',
    status: 'REJECT',
  },
  {
    id: 'SYS-01-006',
    number: 'SYS-01-006',
    title: '여섯 번째 데이터',
    dueDate: '2025-10-26',
    status: 'IN_PROGRESS',
  },
];

const ProjectListTable = () => {
  const navigate = useNavigate();
  const borderColor = 'border-greyColor-grey200';
  const headerBg = 'bg-mainColor-blue050';

  const handleNavigation = (id: string) => {
    navigate(`/inventory/project/${id}`);
  };

  const getStatusChipClasses = (status: ProjectData['status']) => {
    const baseClasses =
      'flex w-[68px] h-[24px] items-center justify-center rounded-full text-[11px] font-bold font-pretendard whitespace-nowrap gap-[8px]';

    switch (status) {
      case '미진행':
      case 'ASSIGNED':
        return `${baseClasses} bg-greyColor-grey200 text-greyColor-grey600`;
      case 'PENDING':
      case 'IN_PROGRESS':
        return `${baseClasses} bg-subColor-orange100 text-subColor-orange800`;
      case 'REJECT':
        return `${baseClasses} bg-red-100 text-red-600`;
      case 'COMPLETED':
        return `${baseClasses} bg-mainColor-blue050 text-mainColor-blue600`;
      default:
        return `${baseClasses} bg-greyColor-grey200 text-greyColor-grey600`;
    }
  };

  const getStatusText = (status: ProjectData['status']) => {
    switch (status) {
      case '미진행':
        return '미진행';
      case 'ASSIGNED':
        return '업무 할당';
      case 'PENDING':
        return '승인 대기';
      case 'IN_PROGRESS':
        return '진행 중';
      case 'REJECT':
        return '승인 반려';
      case 'COMPLETED':
        return '완료';
      default:
        return status;
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
        {MOCK_DATA.map((item) => (
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
                {getStatusText(item.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectListTable;
