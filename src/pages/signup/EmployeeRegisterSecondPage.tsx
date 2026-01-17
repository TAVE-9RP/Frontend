import React, { useState, useEffect } from 'react';
import Header from '@/components/signup/Header';
import Button from '@/components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCompanies } from '@/apis/company';
import type { Company } from '@/types/company';

export default function EmployeeRegisterSecondPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { name, userId, email, password } =
    (location.state as {
      name?: string;
      userId?: string;
      email?: string;
      password?: string;
    }) || {};

  useEffect(() => {
    console.log('=== EmployeeRegisterSecondPage에서 받은 데이터 ===');
    console.log('userId:', userId);
    console.log('email:', email);
    console.log('password:', password);
  }, [userId, email, password]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchCompanies = async () => {
      if (searchTerm.trim() === '') {
        setCompanies([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getCompanies(searchTerm);
        console.log('회사 검색 결과:', response);
        if (response.result) {
          setCompanies(response.result);
        } else {
          setCompanies([]);
        }
      } catch (error) {
        console.error('회사 검색 실패:', error);
        setCompanies([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchCompanies();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[535px] flex-col items-center">
      <Header title="회사를 선택해주세요" />

      <div className="mt-[49px] flex h-[69px] w-[535px] shrink-0 items-center gap-[14px] rounded-[10px] border border-greyColor-grey300 bg-[#F7F8F9] px-[15px]">
        {!searchTerm && (
          <img src="/images/search.png" alt="검색" className="h-[36px] w-[36px] shrink-0" />
        )}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setSelectedCompanyId(null);
          }}
          placeholder="회사명을 입력하세요"
          className="flex-1 bg-transparent font-pretendard text-[19px] font-normal text-greyColor-grey900 outline-none placeholder:text-greyColor-grey300"
        />
      </div>

      <div className="mt-[30px] flex w-full flex-1 flex-col overflow-y-auto">
        {isLoading && <p className="py-4 text-center text-gray-500">검색 중...</p>}
        {!isLoading && companies.length === 0 && searchTerm && (
          <p className="py-4 text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
        {companies.map((company) => {
          const isSelected = selectedCompanyId === company.id;
          return (
            <div
              key={company.id}
              onClick={() => setSelectedCompanyId(company.id)}
              className="flex h-[75px] w-[535px] shrink-0 cursor-pointer items-center border-b border-greyColor-grey200 px-[10px] transition-colors hover:bg-gray-50"
            >
              <img
                src="/images/companyimage.png"
                alt="로고"
                className="h-[36px] w-[36px] shrink-0"
              />

              <span className="ml-[17px] flex-1 font-pretendard text-[19px] font-bold text-greyColor-grey900">
                {company.name}
              </span>

              <div
                className={`mr-[19px] h-[36px] w-[36px] transition-colors duration-200 ${
                  isSelected ? 'bg-mainColor-blue600' : 'bg-greyColor-grey300'
                }`}
                style={{
                  WebkitMaskImage: `url(/images/checkicon.png)`,
                  maskImage: `url(/images/checkicon.png)`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="mb-[136px] mt-[40px] flex w-full shrink-0 justify-center gap-[31.5px]">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => navigate('/signup')}
          // !를 추가하여 60x180 크기를 강제하고 leading-none으로 텍스트 줄바꿈 방지
          className="flex !h-[60px] !w-[180px] items-center justify-center whitespace-nowrap rounded-[10px] border-[#63656C] font-pretendard text-[24px] font-bold leading-none text-greyColor-grey500"
        >
          이전 단계
        </Button>

        <Button
          type="button"
          variant={selectedCompanyId ? 'active' : 'secondary'}
          disabled={!selectedCompanyId}
          onClick={() => {
            if (!selectedCompanyId) return;
            const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
            navigate('/employeesignup/step4', {
              state: {
                companyId: selectedCompanyId,
                companyName: selectedCompany?.name,
                name,
                userId,
                email,
                password,
              },
            });
          }}
          className="flex !h-[60px] !w-[180px] items-center justify-center whitespace-nowrap rounded-[10px] font-pretendard text-[24px] font-bold leading-none text-black"
        >
          다음
        </Button>
      </div>
    </div>
  );
}
