import React, { useState } from 'react';
import Header from '@/components/signup/Header';
import { InputField } from '@/components/signup/InputField';
import Button from '@/components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { postMemberSignup } from '@/apis/member';

// 부서 옵션 (표시명: 서버값)
const DEPARTMENT_OPTIONS = [
  { label: '물류 부서', value: 'LOGISTICS' },
  { label: '재고 부서', value: 'INVENTORY' },
] as const;

// 직급 옵션 (표시명: 서버값)
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

  const { companyId, name, userId, email, password } =
    (location.state as {
      companyId?: number;
      name?: string;
      userId?: string;
      email?: string;
      password?: string;
    }) || {};

  const [formData, setFormData] = useState({
    department: '', // 서버에 보낼 값 (LOGISTICS, INVENTORY)
    position: '', // 서버에 보낼 값 (INTERN, ASSISTANT_MANAGER, etc.)
  });

  // 표시용 값 (한글)
  const [displayValues, setDisplayValues] = useState({
    department: '',
    position: '',
  });

  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selectedOption = DEPARTMENT_OPTIONS.find((opt) => opt.value === value);
    setFormData((prev) => ({
      ...prev,
      department: value,
    }));
    setDisplayValues((prev) => ({
      ...prev,
      department: selectedOption?.label || '',
    }));
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const selectedOption = POSITION_OPTIONS.find((opt) => opt.value === value);
    setFormData((prev) => ({
      ...prev,
      position: value,
    }));
    setDisplayValues((prev) => ({
      ...prev,
      position: selectedOption?.label || '',
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const openFileDialog = () => {
    document.getElementById('imageUploadInput')?.click();
  };

  const handleSubmit = async () => {
    if (!formData.department || !formData.position) {
      return;
    }

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
        navigate('/signupsuccess');
      } else {
        alert(response.message || '사원 등록에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('사원 등록 실패:', error);

      const serverErrorMessage = error?.response?.data?.message;

      if (serverErrorMessage) {
        alert(serverErrorMessage);
      } else {
        alert('요청 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[535px] flex-col items-center">
      <Header title="회사의 소속부서와 직급을 입력해주세요" />

      <div className="mt-[82px] flex flex-col items-center">
        <button type="button" onClick={openFileDialog} className="focus:outline-none">
          <img
            src={image || '/images/logoimg.png'}
            alt="회사 로고 업로드"
            className="h-[188px] w-[188px] cursor-pointer rounded-[10px] object-cover"
          />
        </button>

        <input
          id="imageUploadInput"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="mt-[49px] flex w-full flex-1 flex-col gap-[20px]">
        {/* 부서 드롭다운 */}
        <div className="flex w-full flex-col">
          <label className="mb-2 text-[19px] font-bold text-black">부서</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleDepartmentChange}
            className="h-[69px] w-[535px] rounded-[10px] border border-[1px] border-gray-400 bg-white px-[23px] text-[19px] font-normal text-black outline-none transition duration-150 focus:border-blue-500"
          >
            <option value="">부서를 선택하세요.</option>
            {DEPARTMENT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 직급 드롭다운 */}
        <div className="flex w-full flex-col">
          <label className="mb-2 text-[19px] font-bold text-black">직급</label>
          <select
            name="position"
            value={formData.position}
            onChange={handlePositionChange}
            className="h-[69px] w-[535px] rounded-[10px] border border-[1px] border-gray-400 bg-white px-[23px] text-[19px] font-normal text-black outline-none transition duration-150 focus:border-blue-500"
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
          onClick={() => navigate('/employeesignup/step3')}
          className="!flex !h-[60px] !w-[180px] items-center justify-center whitespace-nowrap rounded-[10px] border-[#63656C] font-pretendard text-[24px] font-bold leading-none"
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
