import Header from '@/components/signup/Header';
import Button from '@/components/common/Button';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SignupSuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const name = (location.state as { name?: string })?.name || '회원';

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Header title="" />

      <h1
        className="mt-[80px] text-center font-pretendard text-[32px] font-bold leading-[100%] text-black"
        style={{ letterSpacing: '0%' }}
      >
        <span className="text-blue-600"></span>가입 요청이 완료되었습니다.
      </h1>

      <p className="mt-[22px] text-center font-pretendard text-[19px] font-normal leading-normal text-gray-600">
        회사의 승인 요청 후 가입이 완료됩니다.
      </p>

      <img
        src="/images/Checkmark in circle.png"
        alt="가입 완료 체크 아이콘"
        className="mt-[46px] h-[254px] w-[254px] flex-shrink-0 object-contain"
      />

      <div className="mb-[136px] mt-auto">
        <Button
          variant="active"
          size="md"
          className="h-[60px] w-[180px] rounded-[10px] px-[10px] font-pretendard text-[24px] font-bold leading-none text-black"
          onClick={() => navigate('/')}
        >
          홈 바로가기
        </Button>
      </div>
    </div>
  );
}
