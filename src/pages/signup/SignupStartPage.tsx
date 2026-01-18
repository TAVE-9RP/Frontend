import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/signup/Header';
import { OptionCard } from '@/components/signup/OptionCard';
import Button from '@/components/common/Button';
import '@/styles/index.css';

type CardType = 'COMPANY' | 'EMPLOYEE' | null;

export default function SignupStartPage() {
  const [selectedCard, setSelectedCard] = useState<CardType>(null);
  const navigate = useNavigate();

  const isButtonEnabled = selectedCard !== null;

  const handleCardClick = (type: CardType) => {
    setSelectedCard(type);
  };

  const handleNextClick = () => {
    if (selectedCard === 'COMPANY') navigate('/companysignup');
    else if (selectedCard === 'EMPLOYEE') navigate('/employeesignup');
  };

  return (
    <div className="page flex min-h-screen flex-col bg-white">
      <div className="flex w-full flex-1 flex-col">
        <Header title="NexERP와 함께 편리한 기업 프로세스를 관리해보세요" />

        <div className="mt-[98px] mb-[60px] flex flex-col items-center gap-[29px]">
          <OptionCard
            icon={
              <img src="/images/signupicon01.png" alt="회사 등록" className="h-[140px] w-[140px]" />
            }
            title="회사 신규 등록"
            description="우리 회사를 NexERP에 등록하고 팀을 관리하세요."
            onClick={() => handleCardClick('COMPANY')}
            isSelected={selectedCard === 'COMPANY'}
          />

          <OptionCard
            icon={
              <img src="/images/signupicon02.png" alt="사원 등록" className="h-[140px] w-[140px]" />
            }
            title="사원 신규 등록"
            description="오너가 등록한 회사에 참여하는 사원 계정을 생성합니다."
            onClick={() => handleCardClick('EMPLOYEE')}
            isSelected={selectedCard === 'EMPLOYEE'}
          />
        </div>

        <div className="mb-[114px] flex justify-center">
          <Button
            variant={isButtonEnabled ? 'active' : 'secondary'}
            onClick={handleNextClick}
            disabled={!isButtonEnabled}
            className={`h-[50px] w-[180px] rounded-[10px] font-pretendard text-[24px] font-bold leading-none ${
              !isButtonEnabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  );
}
