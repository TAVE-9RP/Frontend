import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/signup/InputField';
import Header from '@/components/signup/Header';
import Button from '@/components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { postMemberSignup } from '@/apis/member';

export default function CompanyRegisterSecondPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const companyId = location.state?.companyId as number | undefined;

  useEffect(() => {
    console.log('받은 companyId:', companyId);
    console.log('location.state:', location.state);
  }, [companyId, location.state]);

  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      formData.userId.trim() !== '' &&
      emailRegex.test(formData.email) &&
      passwordRegex.test(formData.password) &&
      formData.password === formData.passwordConfirm;

    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      console.log('폼 유효성 검사 실패');
      return;
    }

    if (!companyId) {
      alert('회사 정보가 없습니다. 이전 단계로 돌아가주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const requestData = {
        loginId: formData.userId,
        password: formData.password,
        name: formData.userId,
        email: formData.email,
        department: 'MANAGEMENT' as const,
        position: 'OWNER' as const,
        companyId: String(companyId),
      };

      console.log('=== 회원가입 API 요청 ===');
      console.log('요청 데이터:', requestData);

      const response = await postMemberSignup(requestData);

      console.log('=== 회원가입 API 응답 ===');
      console.log('응답:', response);

      if (response.isSuccess) {
        alert('회원가입이 완료되었습니다.');
        navigate('/login');
      } else {
        alert(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      const errorMessage = error?.response?.data?.message || '회원가입에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[535px] flex-col items-center">
      <Header title="회사 신규 등록하기" />

      <form onSubmit={handleSubmit} className="mt-[49px] flex w-full flex-col gap-[20px]">
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

        <div className="mt-[30px] flex w-full justify-center gap-[31.5px]">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => navigate('/companysignup')}
            className="h-[70px] w-[252px] rounded-[10px] border-[#63656C] px-[50px] py-[17px]"
          >
            이전 단계
          </Button>

          <Button
            type="submit"
            variant={isFormValid ? 'active' : 'secondary'}
            size="md"
            disabled={!isFormValid || isLoading}
            className="h-[70px] w-[252px] rounded-[10px] px-[50px] py-[17px] text-black"
          >
            {isLoading ? '가입 중...' : '가입 완료'}
          </Button>
        </div>
      </form>
    </div>
  );
}
