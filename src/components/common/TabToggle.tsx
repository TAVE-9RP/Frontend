import React from 'react';

interface TabToggleProps {
  activeTab: string;
  onTabChange: (tab: '직원 목록' | '가입 관리') => void;
}

const TabToggle: React.FC<TabToggleProps> = ({ activeTab, onTabChange }) => {
  const backgroundClasses =
    'inline-flex p-[7px] items-center gap-2 rounded-[50px] bg-greyColor-grey200';

  const baseButtonClasses =
    'flex items-center gap-2 font-pretendard text-[17px] font-bold leading-normal transition-colors duration-150';

  const activeClasses = 'py-2 px-[18px] rounded-[50px] bg-white text-mainColor-blue600';

  const inactiveClasses = 'py-2 px-[18px] text-greyColor-grey400';

  const activeShadowStyle = {
    boxShadow: '0 0 5px 0 rgba(0, 0, 0, 0.15)',
  };

  const getTabClasses = (tabName: string) => {
    const isActive = activeTab === tabName;
    const finalClasses = isActive ? activeClasses : inactiveClasses;
    return `${baseButtonClasses} ${finalClasses}`;
  };

  const getIconFilter = (tabName: '직원 목록' | '가입 관리') => {
    const isActive = activeTab === tabName;
    if (isActive) {
      return 'brightness(0) saturate(100%) invert(29%) sepia(87%) saturate(5838%) hue-rotate(202deg) brightness(101%) contrast(103%)';
    } else {
      return 'grayscale(100%) opacity(0.6)';
    }
  };

  return (
    <div className={backgroundClasses}>
      <button
        onClick={() => onTabChange('직원 목록')}
        className={getTabClasses('직원 목록')}
        style={activeTab === '직원 목록' ? activeShadowStyle : {}}
      >
        <img
          src="/images/person-fill.png"
          alt="직원 목록 아이콘"
          className="h-5 w-5"
          style={{
            filter: getIconFilter('직원 목록'),
          }}
        />
        직원 목록
      </button>

      <button
        onClick={() => onTabChange('가입 관리')}
        className={getTabClasses('가입 관리')}
        style={activeTab === '가입 관리' ? activeShadowStyle : {}}
      >
        <img
          src="/images/journal-check.png"
          alt="가입 관리 아이콘"
          className="h-5 w-5"
          style={{
            filter: getIconFilter('가입 관리'),
          }}
        />
        가입 관리
      </button>
    </div>
  );
};

export default TabToggle;
