import React, { useState, useEffect } from 'react';
import Header from '@/components/signup/Header';
import { InputField } from '@/components/signup/InputField';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '@/apis/apiConnection';

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    userId: '',
    password: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      case 'userId':
        if (value.trim() === '') errorMsg = '아이디를 입력해주세요.';
        break;

      case 'password':
        if (!passwordRegex.test(value)) {
          errorMsg = '영문과 숫자를 포함한 8자 이상이어야 합니다.';
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  useEffect(() => {
    const isValid = formData.userId.trim() !== '' && passwordRegex.test(formData.password);

    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      console.log('폼 유효성 검사 실패');
      return;
    }

    setIsLoading(true);
    try {
      const response = await postLogin({
        loginId: formData.userId,
        password: formData.password,
      });
      console.log('로그인 성공:', response);

      if (response && response.result.accessToken) {
        localStorage.setItem('accessToken', response.result.accessToken);
      }
      // Access Token은 메모리에 저장됨
      // Refresh Token은 서버에서 HTTP Only Cookie로 자동 저장됨
      // ----------------분기 필요----------------
      navigate('/dashboard');
    } catch (error: any) {
      console.error('로그인 실패:', error);

      // axios 에러 응답에서 에러 정보 추출
      const errorMessage = error?.response?.data?.message || '';

      // 승인 대기 중인 경우
      if (errorMessage.includes('승인')) {
        alert('승인 대기 중입니다. 관리자 승인 후 로그인해주세요.');
      }
      // 아이디와 비밀번호 확인해야 하는 경우
      else {
        alert('아이디와 비밀번호를 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[535px] flex-col items-center">
      <Header title="로그인" />

      <form onSubmit={handleSubmit} className="mt-[49px] flex w-full flex-col gap-[20px]">
        <div>
          <InputField
            label="아이디"
            name="userId"
            placeholder="아이디를 입력하세요."
            type="text"
            value={formData.userId}
            onChange={handleChange}
            isError={!!errors.userId}
          />
          {errors.userId && <p className="mt-1 text-sm text-red-500">{errors.userId}</p>}
        </div>

        <div>
          <InputField
            label="비밀번호"
            name="password"
            placeholder="비밀번호를 입력하세요."
            type="password"
            value={formData.password}
            onChange={handleChange}
            isError={!!errors.password}
          />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
        </div>

        <div className="mt-[30px] flex w-full justify-center">
          <Button
            type="submit"
            variant={isFormValid ? 'active' : 'secondary'}
            size="md"
            disabled={!isFormValid || isLoading}
            className="h-[70px] w-full rounded-[10px] px-[50px] py-[17px] text-black"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>
    </div>
  );
}
