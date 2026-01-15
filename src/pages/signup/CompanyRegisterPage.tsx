import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/signup/InputField';
import Header from '@/components/signup/Header';
import Button from '@/components/common/Button';
import addCircle from '@/assets/add-circle.png';
import { useNavigate } from 'react-router-dom';
import { postCompany } from '@/apis/company';

export default function CompanyRegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    businessType: '',
    companyDescription: '',
    companyLogo: null as File | null,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({
      ...prev,
      companyLogo: file,
    }));
  };

  useEffect(() => {
    const isValid =
      formData.companyName.trim() !== '' &&
      formData.businessType.trim() !== '' &&
      formData.companyDescription.trim() !== '';
    setIsFormValid(isValid);
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== handleSubmit 시작 ===');
    console.log('isFormValid:', isFormValid);
    console.log('formData:', formData);

    if (!isFormValid) {
      console.log('폼 유효성 검사 실패');
      return;
    }

    console.log('API 호출 시작...');
    setIsLoading(true);
    try {
      const requestData = {
        name: formData.companyName,
        industryType: formData.businessType,
        description: formData.companyDescription || '',
        imagePath: formData.companyLogo ? URL.createObjectURL(formData.companyLogo) : '',
      };

      console.log('=== API 요청 데이터 ===');
      console.log('요청 데이터:', requestData);
      console.log('postCompany 함수 호출 전');

      const response = await postCompany(requestData);

      console.log('postCompany 함수 호출 후');

      console.log('=== API 응답 ===');
      console.log('전체 응답:', response);
      console.log('response.result:', response.result);
      console.log('response.result?.companyId:', response.result?.companyId);

      if (response.result?.companyId) {
        console.log('companyId:', response.result.companyId);
        navigate('/companysignup/step2', {
          state: {
            companyId: response.result.companyId,
          },
        });
      } else {
        console.warn('companyId가 응답에 없습니다. 응답 구조:', response);
      }
    } catch (error: any) {
      console.error('회사 등록 실패:', error);
      const errorMessage = error?.response?.data?.message || '회사 등록에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    navigate('/signup');
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[535px] flex-col items-center">
      <Header title="회사 신규 등록하기" />

      <form onSubmit={handleSubmit} className="mt-[58px] flex w-full flex-1 flex-col gap-[30px]">
        <InputField
          label="회사명"
          name="companyName"
          placeholder="회사명을 입력하세요."
          type="text"
          value={formData.companyName}
          onChange={handleChange}
        />

        <InputField
          label="업종"
          name="businessType"
          placeholder="업종을 입력하세요."
          type="text"
          value={formData.businessType}
          onChange={handleChange}
        />

        <InputField
          label="회사 소개"
          name="companyDescription"
          placeholder="회사 소개를 입력하세요."
          type="text"
          value={formData.companyDescription}
          onChange={handleChange}
        />

        <div className="flex flex-col gap-[10px]">
          <label htmlFor="logoUpload" className="font-pretendard text-[19px] font-bold text-black">
            회사 로고
          </label>
          <label
            htmlFor="logoUpload"
            className="flex h-[103px] w-[535px] cursor-pointer flex-col items-center justify-center gap-[10px] rounded-[10px] bg-[#F7F8F9]"
          >
            <img src={addCircle} alt="아이콘" className="h-[32px] w-[32px] object-contain" />
            <span className="font-pretendard text-[19px] font-normal text-[#63656C]">
              파일을 선택해주세요
            </span>
          </label>
          <input
            id="logoUpload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        <div className="mb-[114px] mt-auto flex w-full justify-center gap-[31px]">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handlePrevStep}
            className="h-[50px] w-[180px] rounded-[10px] border-[#63656C] px-[10px] font-pretendard text-[24px] font-bold leading-none text-greyColor-grey500"
          >
            이전 단계
          </Button>

          <Button
            type="submit"
            variant={isFormValid ? 'active' : 'secondary'}
            size="md"
            disabled={!isFormValid || isLoading}
            className="h-[50px] w-[180px] rounded-[10px] px-[10px] font-pretendard text-[24px] font-bold leading-none text-black"
          >
            {isLoading ? '등록 중...' : '다음'}
          </Button>
        </div>
      </form>
    </div>
  );
}
