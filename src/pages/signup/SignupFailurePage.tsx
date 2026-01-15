import Header from '@/components/signup/Header';
import locked from '@/assets/Locked padlock.png';
import Button from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function SignupSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center">
      <Header title="" />

      <h1
        className="mt-[80px] text-center font-pretendard text-[32px] font-bold leading-[100%] text-black"
        style={{ letterSpacing: '0%' }}
      >
        <span className="text-blue-600">홍길동</span>님의 가입 요청이 승인되지 않았습니다.
      </h1>

      <p className="mt-[22px] text-center font-pretendard text-[19px] font-normal leading-normal text-gray-600">
        회사의 승인 요청 진행이 완료될 때까지 기다려주세요.
      </p>

      <img
        src={locked}
        alt="가입 실패 아이콘"
        className="mt-[46px] h-[254px] w-[254px] flex-shrink-0 object-contain"
      />

      <div className="mb-[136px] mt-auto">
        <Button
          variant="active"
          size="md"
          className="h-[60px] w-[180px] overflow-hidden whitespace-nowrap rounded-[10px] px-[10px] font-pretendard text-[24px] font-bold leading-none text-black"
          onClick={() => navigate('/')}
        >
          홈 바로가기
        </Button>
      </div>
    </div>
  );
}
