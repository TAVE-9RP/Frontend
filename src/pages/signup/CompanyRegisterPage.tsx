import React, { useState, useEffect } from 'react';
import { InputField } from '@/components/signup/InputField';
import Header from '@/components/signup/Header';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';
import { postCompany, uploadCompanyLogo } from '@/apis/company';
import type { CompanyRegisterRequest } from '@/types/company';
import AlertModal from '@/components/modals/AlertModal';

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
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '' });

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

    if (!isFormValid) return;

    setIsLoading(true);
    try {
      const requestData: CompanyRegisterRequest = {
        name: formData.companyName,
        industryType: formData.businessType,
        description: formData.companyDescription || '',
        imagePath: '',
      };

      const response = await postCompany(requestData);
      const companyId = response.result?.companyId;

      if (!companyId) {
        throw new Error('Company ID is missing in response');
      }

      if (formData.companyLogo) {
        try {
          await uploadCompanyLogo(companyId, formData.companyLogo);
        } catch (logoError) {
          console.error('Logo upload failed:', logoError);
          setAlertModal({ isOpen: true, message: '회사 등록은 완료되었으나 로고 업로드에 실패했습니다.' });
        }
      }

      navigate('/companysignup/step2', { state: { companyId } });
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error?.response?.data?.message || '등록 중 오류가 발생했습니다.';
      setAlertModal({ isOpen: true, message: errorMessage });
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
            className="flex h-[103px] w-[535px] cursor-pointer flex-col items-center justify-center gap-[10px] rounded-[10px] border border-transparent bg-[#F7F8F9] transition-all hover:border-blue-400"
          >
            {formData.companyLogo ? (
              <div className="flex flex-col items-center">
                <span className="font-pretendard text-[16px] font-bold text-blue-600">
                  선택된 파일: {formData.companyLogo.name}
                </span>
                <span className="mt-1 text-[12px] text-gray-400">클릭하여 변경</span>
              </div>
            ) : (
              <>
                <img
                  src="/images/add-circle.png"
                  alt="아이콘"
                  className="h-[32px] w-[32px] object-contain"
                />
                <span className="font-pretendard text-[19px] font-normal text-[#63656C]">
                  파일을 선택해주세요
                </span>
              </>
            )}
          </label>
          <input
            id="logoUpload"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
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

      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ isOpen: false, message: '' })}
        message={alertModal.message}
      />
    </div>
  );
}
