import React, { useState, useEffect } from 'react';
import Header from '@/components/signup/Header';
import Button from '@/components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { postMemberSignup } from '@/apis/apiConnection';
import defaultLogoImg from '@/assets/logoimg.png';

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

  const { companyId, userId, email, password } =
    (location.state as {
      companyId?: number;
      userId?: string;
      email?: string;
      password?: string;
    }) || {};

  useEffect(() => {
    console.log('=== EmployeeRegisterFourthPage에서 받은 데이터 ===');
    console.log('companyId:', companyId);
    console.log('userId:', userId);
    console.log('email:', email);
    console.log('password:', password);
  }, [companyId, userId, email, password]);

  const [formData, setFormData] = useState({
    department: '',
    position: '',
  });

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

  const handleSignup = async () => {
    if (!formData.department || !formData.position) {
      alert('부서와 직급을 선택해주세요.');
      return;
    }

    if (!companyId || !userId || !email || !password) {
      alert('필수 정보가 누락되었습니다. 이전 단계로 돌아가주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        loginId: userId,
        password: password,
        name: userId,
        email: email,
        department: formData.department as 'LOGISTICS' | 'INVENTORY',
        position: formData.position as
          | 'INTERN'
          | 'ASSISTANT_MANAGER'
          | 'MANAGER'
          | 'SENIOR_MANAGER'
          | 'DEPARTMENT_HEAD',
        companyId: String(companyId),
      };

      console.log('=== 회원가입 API 요청 ===');
      console.log('요청 데이터:', requestData);

      const response = await postMemberSignup(requestData);

      console.log('=== 회원가입 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        navigate('/signupsuccess', {
          state: {
            name: userId,
          },
        });
      } else {
        alert(response.message || '가입 요청에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('가입 요청 실패:', error);
      const errorMessage = error?.response?.data?.message || '가입 요청에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[535px] flex-col items-center">
      <Header title="회사의 소속부서와 직급을 입력해주세요" />

      <div className="mt-[82px] flex flex-col items-center">
        <button type="button" onClick={openFileDialog} className="focus:outline-none">
          <img
            src={image || defaultLogoImg}
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

      <div className="mt-[49px] flex w-full flex-col gap-[20px]">
        <div className="flex w-full flex-col">
          <label className="mb-2 font-pretendard text-[19px] font-bold text-black">부서</label>
          <select
            name="department"
            value={formData.department}
            onChange={handleDepartmentChange}
            className="h-[69px] w-[535px] rounded-[10px] border border-[1px] border-gray-400 bg-white px-[23px] py-[23px] font-pretendard text-[19px] font-normal text-black outline-none transition duration-150 focus:border-blue-500"
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
          <label className="mb-2 font-pretendard text-[19px] font-bold text-black">직급</label>
          <select
            name="position"
            value={formData.position}
            onChange={handlePositionChange}
            className="h-[69px] w-[535px] rounded-[10px] border border-[1px] border-gray-400 bg-white px-[23px] py-[23px] font-pretendard text-[19px] font-normal text-black outline-none transition duration-150 focus:border-blue-500"
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

      <div className="mt-[31px] flex w-full justify-center gap-[31.5px]">
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={() => navigate('/employeesignup/step3')}
          className="h-[70px] w-[252px] rounded-[10px] border-[#63656C] px-[50px] py-[17px]"
        >
          이전 단계
        </Button>

        <Button
          type="button"
          variant={formData.department && formData.position ? 'active' : 'secondary'}
          size="md"
          disabled={!formData.department || !formData.position || isLoading}
          onClick={handleSignup}
          className="h-[70px] w-[252px] rounded-[10px] px-[50px] py-[17px] text-black"
        >
          {isLoading ? '요청 중...' : '가입 요청'}
        </Button>
      </div>
    </div>
  );
}
