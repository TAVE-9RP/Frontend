import React, { useState, useEffect } from 'react';
import Header from '@/components/signup/Header';
import { InputField } from '@/components/signup/InputField';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '@/apis/member';
import { decodeAccessToken } from '@/utils/jwt';
import AlertModal from '@/components/modals/AlertModal';

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
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

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
        const accessToken = response.result.accessToken;
        localStorage.setItem('accessToken', accessToken);

        // Access Token 디코딩하여 department 확인
        const tokenPayload = decodeAccessToken(accessToken);

        if (tokenPayload) {
          const { department } = tokenPayload;

          // 1. department: MANAGEMENT이면 /management-home
          if (department === 'MANAGEMENT') {
            navigate('/management-home');
            return;
          }

          // 2. department: LOGISTICS이면 /logistics-home
          if (department === 'LOGISTICS') {
            navigate('/logistics-home');
            return;
          }

          // 3. department: INVENTORY이면 /inventory-home
          if (department === 'INVENTORY') {
            navigate('/inventory-home');
            return;
          }
        }

        // 기본값: dashboard로 이동
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('로그인 실패:', error);

      // axios 에러 응답에서 에러 정보 추출
      const errorMessage = error?.response?.data?.message || '';

      // 승인되지 않은 계정인 경우 (메시지에 "승인되지 않은 계정" 또는 "인증 필요" 포함)
      if (
        errorMessage.includes('승인되지 않은 계정') ||
        errorMessage.includes('인증 필요') ||
        error?.response?.data?.code === 'COMMON_401_UNAUTHORIZED'
      ) {
        navigate('/signupfailure');
      }
      // 아이디와 비밀번호 확인해야 하는 경우
      else {
        setAlertModal({ isOpen: true, message: '아이디와 비밀번호를 확인해주세요.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[535px] flex-col items-center">
      <Header title="로그인" />

      <form onSubmit={handleSubmit} className="mt-[49px] flex w-full flex-1 flex-col gap-[30px]">
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

        <div className="mb-[136px] mt-auto flex w-full justify-center">
          <Button
            type="submit"
            variant={isFormValid ? 'active' : 'secondary'}
            size="md"
            disabled={!isFormValid || isLoading}
            className="h-[60px] w-[180px] whitespace-nowrap rounded-[10px] px-[10px] py-[17px] font-pretendard text-[24px] font-bold leading-none text-black"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
}
