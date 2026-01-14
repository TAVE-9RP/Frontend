import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { decodeAccessToken } from '@/utils/jwt';
import { getMemberMe } from '@/apis/member';

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

  const renderSubMenus = (subMenus: { text: string; path: string }[]) => {
    return (
      <div className="mt-[16px] flex flex-col gap-[8px]">
        {subMenus.map((menu) => {
          const isProjectManagementActive =
            menu.path === '/project-management' &&
            (currentPath === '/project-create' || currentPath.startsWith('/project/'));

          const isActive = currentPath.startsWith(menu.path) || isProjectManagementActive;

          return (
            <button
              key={menu.text + menu.path}
              onClick={() => navigate(menu.path)}
              className={`ml-[61.5px] flex w-[144.5px] items-center gap-[10px] rounded-[5px] py-[7px] pl-[8px] pr-[10px] text-left transition-colors duration-200 ${
                isActive ? 'bg-mainColor-blue050' : 'bg-transparent hover:bg-greyColor-grey100'
              }`}
            >
              <span
                className={`whitespace-nowrap font-pretendard text-[15px] font-bold leading-normal ${
                  isActive ? 'text-mainColor-blue600' : 'text-greyColor-grey600'
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
        onClick={() => navigate('/management-home')}
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
        return (
          <div key={section.title}>
            <button
              onClick={() => {
                if (section.homePath) {
                  navigate(section.homePath);
                }
              }}
              className={`ml-[27px] flex w-full items-center gap-[10px] text-left ${section.marginTop}`}
            >
              <img src={section.icon} alt={section.title} width={20} height={20} />
              <span className="font-pretendard text-[17px] font-bold leading-normal text-greyColor-grey900">
                {section.title}
              </span>
            </button>

            {renderSubMenus(section.subMenus)}
          </div>
        );
      })}
    </aside>
  );
}
