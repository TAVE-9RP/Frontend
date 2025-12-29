import { useNavigate, useLocation } from 'react-router-dom';

export default function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuSections = [
    {
      title: '관리 서비스',
      icon: '/src/assets/management_service.png',
      marginTop: 'mt-[44px]',
      marginBottom: 'mb-[20px]',
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
      marginBottom: 'mb-[16px]',
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
      marginBottom: 'mb-[16px]',
      homePath: '/logistics-home',
      subMenus: [{ text: '출하 업무 관리', path: '/logistics-outbound-task' }],
    },
  ];

  const renderSubMenus = (subMenus: { text: string; path: string }[]) => {
    return subMenus.map((menu, index) => {
      const isProjectManagementActive =
        menu.path === '/project-management' &&
        (currentPath === '/project-create' || currentPath.startsWith('/project/'));

      const isActive = currentPath.startsWith(menu.path) || isProjectManagementActive;

      const marginTopClass = index === 0 ? 'mt-0' : 'mt-[10px]';

      return (
        <button
          key={menu.text + menu.path}
          onClick={() => navigate(menu.path)}
          className={`ml-[61.5px] flex w-[144.5px] items-center gap-[10px] rounded-[5px] px-[8px] py-[7px] pr-[10px] ${marginTopClass} ${
            isActive ? 'bg-[rgba(0,122,255,0.1)]' : 'bg-transparent'
          }`}
        >
          <span
            className={`font-pretendard text-[15px] font-bold leading-normal ${
              isActive ? 'text-mainColor-blue600' : 'text-greyColor-grey600'
            }`}
          >
            {menu.text}
          </span>
        </button>
      );
    });
  };

  return (
    <aside className="sticky top-0 flex h-screen w-[220px] flex-col border-r border-greyColor-grey200 bg-white">
      <button
        onClick={() => navigate('/management-home')}
        className="ml-[27px] mt-[38px] flex items-center"
      >
        <img src="/src/assets/logo.png" alt="logo" width={129} height={36.47} />
      </button>

      <button
        onClick={() => navigate('/logistics')}
        className="ml-[27px] mt-[32px] flex items-center gap-[10px]"
      >
        <img src="/src/assets/logistics.png" alt="logistics" width={24} height={24} />
        <span className="font-pretendard text-[17px] font-normal leading-none text-greyColor-grey600">
          Logistics
        </span>
      </button>

      <button
        onClick={() => navigate('/owner')}
        className="ml-[27px] mt-[11px] flex items-center gap-[10px]"
      >
        <img src="/src/assets/owner.png" alt="owner" width={24} height={24} />
        <span className="font-pretendard text-[17px] font-normal leading-none text-greyColor-grey600">
          Owner | 홍길동
        </span>
      </button>

      <button
        onClick={() => navigate('/home')}
        className="ml-[27px] mt-[57.77px] flex items-center gap-[10px]"
      >
        <img src="/src/assets/home.png" alt="home" width={20} height={20} />
        <span className="font-pretendard text-[17px] font-bold leading-normal text-greyColor-grey900">
          홈
        </span>
      </button>

      {menuSections.map((section) => (
        <div key={section.title}>
          <button
            onClick={() => {
              if (section.homePath) {
                navigate(section.homePath);
              }
            }}
            className={`ml-[27px] flex w-full items-center gap-[10px] text-left ${section.marginTop} ${section.marginBottom}`}
          >
            <img src={section.icon} alt={section.title} width={20} height={20} />
            <span className="font-pretendard text-[17px] font-bold leading-normal text-greyColor-grey900">
              {section.title}
            </span>
          </button>

          {renderSubMenus(section.subMenus)}
        </div>
      ))}
    </aside>
  );
}
