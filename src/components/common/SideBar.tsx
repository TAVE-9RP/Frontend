import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decodeAccessToken } from '@/utils/jwt';
import { getMemberMe, postLogout } from '@/apis/member';

const mapPositionToKorean = (position?: string): string => {
  const positionMap: Record<string, string> = {
    INTERN: '인턴',
    ASSISTANT_MANAGER: '주임',
    MANAGER: '대리',
    SENIOR_MANAGER: '과장',
    DEPARTMENT_HEAD: '부장',
    OWNER: '오너',
  };

  return position ? positionMap[position] || position : '';
};

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [departmentFromToken, setDepartmentFromToken] = useState<string | null>(null);
  const [memberName, setMemberName] = useState<string>('');
  const [memberPosition, setMemberPosition] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const payload = decodeAccessToken(token);
    if (payload?.department) {
      setDepartmentFromToken(payload.department);
    }
  }, []);

  // 회원 정보 조회
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await getMemberMe();
        if (response.isSuccess && response.result) {
          setMemberName(response.result.name);
          setMemberPosition(response.result.position);
        }
      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
      }
    };

    fetchMemberInfo();
  }, []);

  const menuSections = [
    {
      title: '관리 서비스',
      icon: '/src/assets/management_service.png',
      marginTop: 'mt-[69.77px]',
      homePath: '/management-home',
      subMenus: [
        { text: '전체 프로젝트 관리', path: '/project-management' },
        { text: '입고 업무 관리', path: '/inbound-task' },
        { text: '출하 업무 관리', path: '/outbound-task' },
        { text: '인사 관리', path: '/hrmanagement' },
      ],
    },
    {
      title: '재고 서비스',
      icon: '/src/assets/box.png',
      marginTop: 'mt-[32px]',
      homePath: '/inventory-home',
      subMenus: [
        { text: '입고 업무 관리', path: '/inventory-inbound-task' },
        { text: '재고 관리', path: '/inventory-stock' },
      ],
    },
    {
      title: '물류 서비스',
      icon: '/src/assets/delivery.png',
      marginTop: 'mt-[32px]',
      homePath: '/logistics-home',
      subMenus: [{ text: '출하 업무 관리', path: '/logistics-outbound-task' }],
    },
  ];

  const isManagementUser = departmentFromToken === 'MANAGEMENT';
  const managementPaths = [
    '/project-management',
    '/project-create',
    '/project/',
    '/inbound-task',
    '/outbound-task',
    '/hrmanagement',
    '/management-home',
  ];

  const renderSubMenus = (subMenus: { text: string; path: string }[], isManagementSection: boolean) => {
    return (
      <div className="mt-[16px] flex flex-col gap-[8px]">
        {subMenus.map((menu) => {
          const isProjectManagementActive =
            menu.path === '/project-management' &&
            (currentPath === '/project-create' || currentPath.startsWith('/project/'));

          const isActive = currentPath.startsWith(menu.path) || isProjectManagementActive;
          const isDisabled = isManagementSection && !isManagementUser;

          return (
            <button
              key={menu.text + menu.path}
              onClick={() => {
                if (!isDisabled) {
                  navigate(menu.path);
                }
              }}
              disabled={isDisabled}
              className={`ml-[61.5px] flex w-[144.5px] items-center gap-[10px] rounded-[5px] py-[7px] pl-[8px] pr-[10px] text-left transition-colors duration-200 ${
                isDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : isActive
                    ? 'bg-mainColor-blue050'
                    : 'bg-transparent hover:bg-greyColor-grey100'
              }`}
            >
              <span
                className={`whitespace-nowrap font-pretendard text-[15px] font-bold leading-normal ${
                  isDisabled
                    ? 'text-greyColor-grey400'
                    : isActive
                      ? 'text-mainColor-blue600'
                      : 'text-greyColor-grey600'
                }`}
              >
                {menu.text}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[220px] flex-col overflow-x-hidden border-r border-greyColor-grey200 bg-white">
      <button
        onClick={() => {
          if (isManagementUser) {
            navigate('/management-home');
          } else if (departmentFromToken === 'LOGISTICS') {
            navigate('/logistics-home');
          } else if (departmentFromToken === 'INVENTORY') {
            navigate('/inventory-home');
          } else {
            navigate('/');
          }
        }}
        className="ml-[27px] mt-[33px] flex items-center"
      >
        <img src="/src/assets/logo.png" alt="logo" width={129} height={36.47} />
      </button>

      <div className="ml-[27px] mt-[32px] flex items-center gap-[10px]">
        <img src="/src/assets/logistics.png" alt="logistics" width={24} height={24} />
        <span className="font-pretendard text-[17px] font-normal leading-none text-greyColor-grey600">
          {departmentFromToken ? ` ${departmentFromToken}` : ''}
        </span>
      </div>

      <div className="ml-[27px] mt-[13px] flex items-center gap-[10px]">
        <img src="/src/assets/owner.png" alt="owner" width={24} height={24} />
        {(memberPosition || memberName) && (
          <span className="font-pretendard text-[17px] font-normal leading-none text-greyColor-grey600">
            {memberPosition ? mapPositionToKorean(memberPosition) : ''}
            {memberPosition && memberName ? ' | ' : ''}
            {memberName || ''}
          </span>
        )}
      </div>

      {menuSections.map((section) => {
        const isManagementSection = section.title === '관리 서비스';
        const isDisabled = isManagementSection && !isManagementUser;
        
        // 섹션 헤더 버튼 active 상태 확인 (서브 메뉴가 active가 아닐 때만)
        const hasActiveSubMenu = section.subMenus.some((menu) => {
          if (menu.path === '/project-management') {
            return currentPath === '/project-create' || currentPath.startsWith('/project/');
          }
          return currentPath.startsWith(menu.path);
        });
        
        const isSectionActive = currentPath === section.homePath && !hasActiveSubMenu;

        return (
          <div key={section.title}>
            <button
              onClick={() => {
                if (section.homePath && !isDisabled) {
                  navigate(section.homePath);
                }
              }}
              disabled={isDisabled}
              className={`ml-[27px] flex w-[179px] items-center gap-[10px] rounded-[5px] py-[7px] pl-[8px] pr-[10px] text-left transition-colors duration-200 ${section.marginTop} ${
                isDisabled
                  ? 'cursor-not-allowed opacity-50'
                  : isSectionActive
                    ? 'bg-mainColor-blue050'
                    : 'bg-transparent hover:bg-greyColor-grey100'
              }`}
            >
              <img src={section.icon} alt={section.title} width={20} height={20} />
              <span
                className={`font-pretendard text-[17px] font-bold leading-normal ${
                  isDisabled
                    ? 'text-greyColor-grey400'
                    : isSectionActive
                      ? 'text-mainColor-blue600'
                      : 'text-greyColor-grey900'
                }`}
              >
                {section.title}
              </span>
            </button>

            {renderSubMenus(section.subMenus, isManagementSection)}
          </div>
        );
      })}

      <div className="mt-[54px] flex flex-col items-center">
        <button
          onClick={async () => {
            try {
              const response = await postLogout();
              if (response.isSuccess) {
                localStorage.removeItem('accessToken');
                alert('로그아웃 되었습니다');
                navigate('/');
              } else {
                alert('로그아웃에 실패했습니다.');
              }
            } catch (error) {
              console.error('로그아웃 실패:', error);
              alert('로그아웃에 실패했습니다.');
            }
          }}
          className="flex items-center gap-[10px] text-left"
        >
          <span className="font-pretendard text-[17px] font-normal leading-normal text-greyColor-grey600">
            로그아웃
          </span>
          <img src="/src/assets/logout.png" alt="arrow" width={16} height={16} />
        </button>
      </div>
    </aside>
  );
}
