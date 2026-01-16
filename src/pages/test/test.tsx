import { useTestValidation } from '@/hooks/mutations/useTestValidation';
import { useTest } from '@/hooks/queries/useTest';
import { useUnexpectedError } from '@/hooks/queries/useUnexpectedError';
import { useSystemError } from '@/hooks/queries/useSystemError';
import { useErrorByUserId } from '@/hooks/queries/useErrorByUserId'; // 추가
import { useState } from 'react';
import { useCustomError } from '@/hooks/queries/useCustomError';

export default function TestPage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(0);
  const [userId, setUserId] = useState(''); // /test/error/{userId}용
  const [count, setCount] = useState<number>(0);

  // POST /test/validation 훅
  const {
    mutate,
    data: postData,
    isPending: postLoading,
    isError: postError,
    error: postErr,
  } = useTestValidation();

  // GET /test 훅
  const {
    data: getData,
    isLoading: getLoading,
    isError: getError,
    error: getErr,
    refetch: refetchGet,
  } = useTest();

  // GET /test/unexpected-error 훅
  const {
    data: unexpectedData,
    isLoading: unexpectedLoading,
    isError: unexpectedError,
    error: unexpectedErr,
    refetch: refetchUnexpected,
  } = useUnexpectedError();

  // GET /test/system-error 훅
  const {
    data: systemData,
    isLoading: systemLoading,
    isError: systemError,
    error: systemErr,
    refetch: refetchSystem,
  } = useSystemError();

  // GET /test/error/{userId} 훅
  const {
    data: errorUserData,
    isLoading: errorUserLoading,
    isError: errorUserError,
    error: errorUserErr,
    refetch: refetchErrorByUser,
  } = useErrorByUserId(userId);

  const {
    data: customErrorData,
    isLoading: customErrorLoading,
    isError: customErrorError,
    error: customErrorErr,
    refetch: refetchCustomError,
  } = useCustomError(count);

  const handlePostClick = () => {
    if (!name || age <= 0) {
      alert('이름과 나이를 올바르게 입력해주세요.');
      return;
    }

    mutate(
      { name, age },
      {
        onSuccess: (res) => {
          console.log('POST 성공:', res);
          alert('POST 요청 성공! 콘솔에서 확인하세요.');
        },
        onError: (err) => {
          console.error('POST 실패:', err);
        },
      },
    );
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Test API 페이지</h1>

      {/* POST /test/validation */}
      <h2>POST /api/test/validation</h2>
      <input
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ display: 'block', margin: '10px auto', padding: '8px', width: '100%' }}
      />
      <input
        type="number"
        placeholder="나이"
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        style={{ display: 'block', margin: '10px auto', padding: '8px', width: '100%' }}
      />
      <button onClick={handlePostClick} style={{ padding: '10px 20px', margin: '10px' }}>
        POST 테스트
      </button>
      {postLoading && <p>POST 요청 중...</p>}
      {postError && <p>POST 에러: {String(postErr)}</p>}
      {postData && (
        <div style={{ textAlign: 'left', marginTop: '10px' }}>
          <h4>POST 응답</h4>
          <pre>{JSON.stringify(postData, null, 2)}</pre>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      {/* GET /test */}
      <h2>GET /api/test</h2>
      <button onClick={() => refetchGet()} style={{ padding: '10px 20px', margin: '10px' }}>
        GET 테스트
      </button>
      {getLoading && <p>GET 요청 중...</p>}
      {getError && <p>GET 에러: {String(getErr)}</p>}
      {getData && (
        <div style={{ textAlign: 'left', marginTop: '10px' }}>
          <h4>GET 응답</h4>
          <pre>{JSON.stringify(getData, null, 2)}</pre>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      {/* GET /test/unexpected-error */}
      <h2>GET /api/test/unexpected-error</h2>
      <button onClick={() => refetchUnexpected()} style={{ padding: '10px 20px', margin: '10px' }}>
        GET Unexpected Error 테스트
      </button>
      {unexpectedLoading && <p>요청 중...</p>}
      {unexpectedError && (
        <p style={{ color: 'red' }}>Unexpected Error 발생: {String(unexpectedErr)}</p>
      )}
      {unexpectedData && (
        <div style={{ textAlign: 'left', marginTop: '10px' }}>
          <h4>응답 결과</h4>
          <pre>{JSON.stringify(unexpectedData, null, 2)}</pre>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      {/* GET /test/system-error */}
      <h2>GET /api/test/system-error</h2>
      <button onClick={() => refetchSystem()} style={{ padding: '10px 20px', margin: '10px' }}>
        GET System Error 테스트
      </button>
      {systemLoading && <p>요청 중...</p>}
      {systemError && <p style={{ color: 'red' }}>System Error 발생: {String(systemErr)}</p>}
      {systemData && (
        <div style={{ textAlign: 'left', marginTop: '10px' }}>
          <h4>응답 결과</h4>
          <pre>{systemData}</pre>
        </div>
      )}

      <hr style={{ margin: '30px 0' }} />

      {/* GET /test/error/{userId} */}
      <h2>{`GET /api/test/error/${userId}`}</h2>

      <input
        placeholder="Name (userId)"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ display: 'block', margin: '10px auto', padding: '8px', width: '100%' }}
      />
      <button
        onClick={() => refetchErrorByUser()}
        style={{ padding: '10px 20px', margin: '10px' }}
        disabled={!userId}
      >
        GET Error By UserId 테스트
      </button>
      {errorUserLoading && <p>요청 중...</p>}
      {errorUserError && <p style={{ color: 'red' }}>Error 발생: {String(errorUserErr)}</p>}
      {errorUserData && (
        <div style={{ textAlign: 'left', marginTop: '10px' }}>
          <h4>응답 결과</h4>
          <pre>{JSON.stringify(errorUserData, null, 2)}</pre>
        </div>
      )}
      <hr style={{ margin: '30px 0' }} />

      {/* GET /test/custom-error */}
      <h2>GET /api/test/custom-error</h2>

      <input
        type="number"
        placeholder="count 입력"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
        style={{ display: 'block', margin: '10px auto', padding: '8px', width: '100%' }}
      />
      <button
        onClick={() => refetchCustomError()}
        style={{ padding: '10px 20px', margin: '10px' }}
        disabled={count <= 0}
      >
        GET Custom Error 테스트
      </button>

      {customErrorLoading && <p>요청 중...</p>}
      {customErrorError && <p style={{ color: 'red' }}>Error 발생: {String(customErrorErr)}</p>}
      {customErrorData && (
        <div style={{ textAlign: 'left', marginTop: '10px' }}>
          <h4>응답 결과</h4>
          <pre>{JSON.stringify(customErrorData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
