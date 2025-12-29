import React from 'react';

interface ManagerChipProps {
  name: string;
}

const ManagerChip: React.FC<ManagerChipProps> = ({ name }) => {
  return (
    <div className="flex h-[30px] items-center justify-center gap-[10px] rounded-[30px] bg-white px-[10px] py-[5px]">
      <span className="font-pretendard text-[17px] font-bold leading-normal text-greyColor-grey600">
        {name}
      </span>
    </div>
  );
};

export default ManagerChip;
