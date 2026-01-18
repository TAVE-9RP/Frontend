import React, { useState, useEffect } from 'react';
import Header from '@/components/signup/Header';
import { InputField } from '@/components/signup/InputField';
import Button from '@/components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { postMemberSignup } from '@/apis/member';

const DEPARTMENT_OPTIONS = [
  { label: '물류 부서', value: 'LOGISTICS' },
  { label: '재고 부서', value: 'INVENTORY' },
] as const;

const POSITION_OPTIONS = [
  { label: '인턴', value: 'INTERN' },
  { label: '주임', value: 'ASSISTANT_MANAGER' },
  { label: '대리', value: 'MANAGER' },
  { label: '과장', value: 'SENIOR_MANAGER' },
  { label: '부장', value: 'DEPARTMENT_HEAD' },
] as const;

export default function EmployeeRegisterFourthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { companyId, companyName, companyImagePath, name, userId, email, password } =
    (location.state as {
      companyId?: number;
      companyName?: string;
      companyImagePath?: string;
      name?: string;
      userId?: string;
      email?: string;
      password?: string;
    }) || {};

  const [formData, setFormData] = useState({
    department: '',
    position: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, department: e.target.value }));
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, position: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.position) return;

    if (!companyId || !name || !userId || !email || !password) {
      alert('필수 정보가 누락되었습니다. 이전 단계로 돌아가주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        loginId: userId,
        password: password,
        name: name,
        email: email,
        department: formData.department as 'LOGISTICS' | 'INVENTORY',
        position: formData.position as any,
        companyId: String(companyId),
      };

      const response = await postMemberSignup(requestData);

      if (response.isSuccess) {
        alert('사원 등록이 완료되었습니다.');
        navigate('/login');
      } else {
        alert(response.message || '사원 등록에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('사원 등록 실패:', error);
      const serverErrorMessage = error?.response?.data?.message;
      alert(serverErrorMessage || '요청 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[535px] flex-col items-center">
      <Header title="회사의 소속부서와 직급을 입력해주세요" />

      <div className="mt-[82px] flex flex-col items-center gap-4">
        <div className="relative h-[188px] w-[188px]">
          <img
            src={companyImagePath || '/images/logoimg.png'}
            alt="선택된 회사 로고"
            className="h-full w-full rounded-[10px] border border-gray-100 object-cover shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/logoimg.png';
            }}
          />
        </div>
      </div>

      <div className="mt-[49px] flex w-full flex-1 flex-col gap-[20px]">
        <div className="flex w-full flex-col">
          <label className="mb-2 text-[19px] font-bold text-black">부서</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleDepartmentChange}
            className="h-[69px] w-[535px] rounded-[10px] border border-gray-400 bg-white px-[23px] text-[19px] font-normal text-black outline-none transition duration-150 focus:border-blue-500"
          >
            <option value="">부서를 선택하세요.</option>
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-full flex-col">
          <label className="mb-2 text-[19px] font-bold text-black">직급</label>
          <select
            name="position"
            value={formData.position}
            onChange={handlePositionChange}
            className="h-[69px] w-[535px] rounded-[10px] border border-gray-400 bg-white px-[23px] text-[19px] font-normal text-black outline-none transition duration-150 focus:border-blue-500"
          >
            <option value="">직급을 선택하세요.</option>
            {POSITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-[136px] mt-auto flex w-full justify-center gap-[31.5px]">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => navigate('/employeesignup/step3', { state: location.state })}
          className="!flex !h-[60px] !w-[180px] items-center justify-center whitespace-nowrap rounded-[10px] border-[#63656C] font-pretendard text-[24px] font-bold leading-none text-greyColor-grey500"
        >
          이전 단계
        </Button>

        <Button
          type="button"
          variant={formData.department && formData.position ? 'active' : 'secondary'}
          size="md"
          disabled={!formData.department || !formData.position || isLoading}
          onClick={handleSubmit}
          className="!flex !h-[60px] !w-[180px] items-center justify-center whitespace-nowrap rounded-[10px] font-pretendard text-[24px] font-bold leading-none text-black"
        >
          {isLoading ? '등록 중...' : '다음'}
        </Button>
      </div>
    </div>
  );
}
