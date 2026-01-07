import React from 'react';

interface AssignmentChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const AssignmentChip: React.FC<AssignmentChipProps> = ({ label, isActive, onClick, disabled = false }) => {
  const activeStyle = {
    border: '1px solid var(--mainColor-blue700, #106CE1)',
    background: 'var(--mainColor-blue050, #E2F1FF)',
    color: 'var(--mainColor-blue700, #106CE1)',
  };

  const inactiveStyle = {
    border: '1px solid var(--greyColor-grey400, #A0A2AA)',
    background: 'var(--white, #FFF)',
    color: 'var(--greyColor-grey700, #44454D)',
  };

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    width: '167px',
    height: '40px',
    padding: '8px 16px',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '50px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'Pretendard',
    fontSize: '15px',
    fontWeight: 500,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...baseStyle, ...(isActive ? activeStyle : inactiveStyle) }}
      className="transition-colors duration-150"
    >
      <div className="flex items-center justify-center gap-[16px]">
        <span>{label}</span>
        <img
          src={
            isActive
              ? '/src/assets/checkmark-circle-checked.png'
              : '/src/assets/checkmark-circle-unchecked.png'
          }
          alt="Check icon"
          style={{ width: '16px', height: '16px' }}
        />
      </div>
    </button>
  );
};

export default AssignmentChip;
