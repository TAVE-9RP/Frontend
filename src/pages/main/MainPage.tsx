import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '@/assets/logo.png';
import loginBtnImg from '@/assets/mainpage/login.png';
import signupBtnImg from '@/assets/mainpage/signup.png';
import backgroundImg from '@/assets/mainpage/background.png';
import personnelServiceIcon from '@/assets/mainpage/인사서비스.png';
import inventoryServiceIcon from '@/assets/mainpage/재고서비스.png';
import logisticsServiceIcon from '@/assets/mainpage/물류서비스.png';
import registerBtnImg from '@/assets/mainpage/register.png';
import personnelServiceBadge from '@/assets/mainpage/인사서비스icon.png';
import inventoryServiceBadge from '@/assets/mainpage/재고서비스icon.png';
import logisticsServiceBadge from '@/assets/mainpage/물류서비스icon.png';

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white">
      {/* 헤더 */}
      <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-white px-[120px] py-[24px]">
        <div className="flex items-center gap-[12px]">
          <img src={logoImg} alt="NexERP 로고" className="h-[54px] w-[191px] object-contain" />
        </div>
        <div className="flex items-center gap-[16px]">
          <button onClick={() => navigate('/login')} className="focus:outline-none">
            <img src={loginBtnImg} alt="로그인" className="h-[48px] w-auto object-contain" />
          </button>
          <button onClick={() => navigate('/signup')} className="focus:outline-none">
            <img src={signupBtnImg} alt="회원가입" className="h-[48px] w-auto object-contain" />
          </button>
        </div>
      </header>

      {/* 메인 배너 */}
      <section
        className="relative flex min-h-[700px] items-center justify-start overflow-hidden bg-cover bg-center bg-no-repeat px-[120px] pt-[120px]"
        style={{
          backgroundImage: `url(${backgroundImg})`,
        }}
      ></section>

      {/* What we do 섹션 */}
      <section className="bg-white px-[120px] py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-[16px] text-center">
            <span className="font-pretendard text-[16px] font-semibold uppercase tracking-wider text-subColor-orange800">
              What we do
            </span>
          </div>
          <h2 className="mb-[16px] text-center font-pretendard text-[48px] font-bold text-black">
            Next Generation ERP
          </h2>
          <p className="mb-[64px] text-center font-pretendard text-[18px] font-normal leading-relaxed text-greyColor-grey600">
            기업의 모든 프로세스를 하나의 흐름으로 만드는 NexERP는
            <br />
            기업 운영에 새로운 혁신을 제공합니다.
          </p>

          <div className="mb-[64px] flex items-stretch">
            {/* 인사 서비스 카드 */}
            <div className="flex flex-1 flex-col items-center bg-white p-[40px]">
              <img
                src={personnelServiceIcon}
                alt="인사 서비스"
                className="h-auto w-full object-contain"
              />
            </div>

            {/* 구분선 */}
            <div className="w-[1px] bg-greyColor-grey200"></div>

            {/* 재고 서비스 카드 */}
            <div className="flex flex-1 flex-col items-center bg-white p-[40px]">
              <img
                src={inventoryServiceIcon}
                alt="재고 서비스"
                className="h-auto w-full object-contain"
              />
            </div>

            {/* 구분선 */}
            <div className="w-[1px] bg-greyColor-grey200"></div>

            {/* 물류 서비스 카드 */}
            <div className="flex flex-1 flex-col items-center bg-white p-[40px]">
              <img
                src={logisticsServiceIcon}
                alt="물류 서비스"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button onClick={() => navigate('/signup')} className="focus:outline-none">
              <img
                src={registerBtnImg}
                alt="지금 바로 등록하기"
                className="h-[56px] w-auto object-contain"
              />
            </button>
          </div>
        </div>
      </section>

      {/* What we offer 섹션 */}
      <section className="bg-white px-[120px] py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-[16px] text-center">
            <span className="font-pretendard text-[16px] font-semibold uppercase tracking-wider text-subColor-orange800">
              What we offer
            </span>
          </div>
          <h2 className="mb-[16px] text-center font-pretendard text-[48px] font-bold text-black">
            Core Modules of NexERP
          </h2>
          <p className="mb-[80px] text-center font-pretendard text-[18px] font-normal leading-relaxed text-greyColor-grey600">
            데이터 기반으로 연결하여 더 효율적인 인사, 물류, 재고 서비스를 지원합니다.
          </p>
        </div>
      </section>

      {/* Core Modules 상세 */}
      <section className="bg-white px-[120px] py-[120px]">
        <div className="mx-auto max-w-[1200px] space-y-[120px]">
          {/* Personal Management */}
          <div className="flex items-center gap-[80px]">
            <div className="flex-1">
              <img
                src={personnelServiceBadge}
                alt="인사 서비스"
                className="mb-[16px] h-[34px] w-auto object-contain"
              />
              <h3 className="mb-[16px] font-pretendard text-[36px] font-bold text-black">
                Personal Management
              </h3>
              <h4
                className="mb-[48px] font-pretendard text-[20px] font-semibold"
                style={{ color: 'rgb(0, 126, 244)' }}
              >
                모든 구성원과 공정하게! 조직과 권한을 한눈에 관리하다
              </h4>
              <p className="font-pretendard text-[16px] font-normal leading-relaxed text-greyColor-grey600">
                인사서비스는 구성원의 정보와 근무 이력을 체계적으로 관리하고, 인사·급여·
                <br />
                평가 등의 업무를 자동화하여 조직 운영의 효율을 높이는 솔루션입니다.
                <br />
                <br />
                이를 통해 기업은 복잡한 인사 업무를 간소화하고, 구성원은 보다 공정하고
                <br />
                투명한 평가 및 보상을 경험할 수 있습니다.
              </p>
            </div>
            <div
              className="flex h-[400px] w-[500px] flex-shrink-0 items-center justify-center rounded-[16px] bg-white"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            ></div>
          </div>

          {/* Inventory Management */}
          <div className="flex items-center gap-[80px]">
            <div
              className="flex h-[400px] w-[500px] flex-shrink-0 items-center justify-center rounded-[16px] bg-white"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            ></div>
            <div className="flex-1">
              <img
                src={inventoryServiceBadge}
                alt="재고 서비스"
                className="mb-[16px] h-[34px] w-auto object-contain"
              />
              <h3 className="mb-[16px] font-pretendard text-[36px] font-bold text-black">
                Inventory Management
              </h3>
              <h4
                className="mb-[48px] font-pretendard text-[20px] font-semibold"
                style={{ color: 'rgb(0, 126, 244)' }}
              >
                자원을 효율적으로! 재고를 줄이고 비용을 아끼다
              </h4>
              <p className="font-pretendard text-[16px] font-normal leading-relaxed text-greyColor-grey600">
                재고 관리는 기업이 보유한 재고(제품, 원자재 등)를 효율적으로 조달, 보관,
                <br />
                추적하여 비용을 최적화하고 고객에게 적시에 공급하기 위한 활동입니다. 
                <br />
                <br />
                이를 통해 불필요한 재고로 인한 비용 낭비를 줄이고, 재고 부족으로 인한
                <br />
                판매 기회 손실을 막을 수 있습니다. 
              </p>
            </div>
          </div>

          {/* Logistics Management */}
          <div className="flex items-center gap-[80px]">
            <div className="flex-1">
              <img
                src={logisticsServiceBadge}
                alt="물류 서비스"
                className="mb-[16px] h-[34px] w-auto object-contain"
              />
              <h3 className="mb-[16px] font-pretendard text-[36px] font-bold text-black">
                Logistics Management
              </h3>
              <h4
                className="mb-[48px] font-pretendard text-[20px] font-semibold"
                style={{ color: 'rgb(0, 126, 244)' }}
              >
                승인부터 출하까지 빠르게! 데이터로 움직이는 물류 관리
              </h4>
              <p className="font-pretendard text-[16px] font-normal leading-relaxed text-greyColor-grey600">
                로지스틱스 관리는 원재료 조달부터 최종 제품이 소비자에게 전달되기까지의
                <br />
                모든 과정을 합리적으로 조정하고 효율성을 극대화하는 활동입니다. 
                <br />
                <br />
                이는 운송, 보관, 하역, 포장, 정보 관리 등 다양한 요소를 통합적으로 관리하여,
                <br />
                기업이 자원을 효율적으로 활용하고 고객 만족도를 높이도록 돕습니다. 
              </p>
            </div>
            <div
              className="flex h-[400px] w-[500px] flex-shrink-0 items-center justify-center rounded-[16px] bg-white"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                  linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
              }}
            ></div>
          </div>
        </div>
      </section>
    </div>
  );
}
