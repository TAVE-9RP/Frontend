import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/signup/InputField';
import Header from '@/components/signup/Header';
import Button from '@/components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';

export default function EmployeeRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // location.state에서 이전에 입력한 값이 있으면 초기값으로 설정
  const prevState = (location.state as {
    name?: string;
    userId?: string;
    email?: string;
    password?: string;
  }) || {};

  const [formData, setFormData] = useState({
    name: prevState.name || '',
    userId: prevState.userId || '',
    email: prevState.email || '',
    password: prevState.password || '',
    passwordConfirm: prevState.password || '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let errorMsg = '';

    switch (name) {
      case 'email':
        if (!emailRegex.test(value)) errorMsg = '올바른 이메일 형식이 아닙니다.';
        break;
      case 'password':
        if (!passwordRegex.test(value)) errorMsg = '영문과 숫자를 포함한 8자 이상이어야 합니다.';
        break;
      case 'passwordConfirm':
        if (value !== formData.password) errorMsg = '비밀번호가 일치하지 않습니다.';
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  useEffect(() => {
    const isValid =
      formData.name.trim() !== '' &&
      formData.userId.trim() !== '' &&
      emailRegex.test(formData.email) &&
      passwordRegex.test(formData.password) &&
      formData.password === formData.passwordConfirm;

    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    navigate('/employeesignup/step2', {
      state: {
        name: formData.name,
        userId: formData.userId,
        email: formData.email,
        password: formData.password,
      },
    });
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[535px] flex-col items-center">
      <Header title="사원 신규 등록하기" />

      <form onSubmit={handleSubmit} className="mt-[49px] flex w-full flex-1 flex-col gap-[30px]">
        <InputField
          label="이름"
          name="name"
          placeholder="이름을 입력해주세요."
          type="text"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="아이디"
          name="userId"
          placeholder="시스템 내에서 사용할 아이디를 입력하세요."
          type="text"
          value={formData.userId}
          onChange={handleChange}
        />

        <div>
          <InputField
            label="이메일"
            name="email"
            placeholder="사용할 이메일을 입력하세요."
            type="email"
            value={formData.email}
            onChange={handleChange}
            isError={!!errors.email}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <InputField
            label="비밀번호"
            name="password"
            placeholder="영문, 숫자가 모두 들어간 8자 이상 비밀번호를 입력하세요."
            type="password"
            value={formData.password}
            onChange={handleChange}
            isError={!!errors.password}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div>
          <InputField
            label="비밀번호 확인"
            name="passwordConfirm"
            placeholder="비밀번호를 한 번 더 입력하세요."
            type="password"
            value={formData.passwordConfirm}
            onChange={handleChange}
            isError={!!errors.passwordConfirm}
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
          )}
        </div>

        <div className="mb-[136px] mt-auto flex w-full justify-center gap-[31.5px]">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => navigate('/signup')}
            className="h-[50px] w-[180px] rounded-[10px] border-[#63656C] px-[10px] font-pretendard text-[24px] font-bold leading-none text-greyColor-grey500"
          >
            이전 단계
          </Button>

          <Button
            type="submit"
            variant={isFormValid ? 'active' : 'secondary'}
            size="md"
            disabled={!isFormValid}
            className="h-[50px] w-[180px] rounded-[10px] px-[10px] font-pretendard text-[24px] font-bold leading-none text-black"
          >
            다음
          </Button>
        </div>
      </form>
    </div>
  );
}
