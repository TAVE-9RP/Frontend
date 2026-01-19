# NexERP Frontend

## 💡 1. 서비스 한 줄 요약

- NexERP는 중소·중견기업(SME)를 타켓으로, 전사적 자원 통합과 데이터 분석 기능을 제공하는 ERP 프로그램입니다.



## 🔗 2. 배포 주소
https://nex-erp.vercel.app/

## 👀 3. 서비스 둘러보기

<video src="https://github.com/user-attachments/assets/15255fda-3f61-4eb0-86e6-741c7dc02fba" autoplay loop muted playsinline width="100%"></video>

---

<video src="https://github.com/user-attachments/assets/1bd71207-38d2-4b93-ae98-b83a79d54f05" autoplay loop muted playsinline width="100%"></video>

---

<video src="https://github.com/user-attachments/assets/e85e75b7-7378-427b-ad7d-76e13fadd3fa" autoplay loop muted playsinline width="100%"></video>

---

<video src="https://github.com/user-attachments/assets/1d9eb662-3c55-49d7-b6be-faee7cf53a14" autoplay loop muted playsinline width="100%"></video>


## 🛠 4. 시작 가이드 (Getting Started)

프로젝트를 로컬 환경에서 실행하려면 아래 단계를 따라주세요.

```bash
// 1. 레포지토리 클론
git clone https://github.com/TAVE-9RP/NexERP_FE.git
cd NexERP_FE

// 2. 의존성 설치
npm install

// 3. 로컬 서버 실행
npm run dev

```

## 🏗 5. 기술 스택 (Tech Stack)

### 🎨 Frontend

- **Framework**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Visualization**: Recharts, Ant Design Charts

### 🛠 Tools

- **Build Tool**: Vite
- **Package Manager**: npm

## 🚀 6. 핵심 기능

NexERP는 효율적인 기업 운영을 위해 세 가지 핵심 모듈을 제공합니다.

### 🏢 관리 서비스 (Admin)

- **직원 가입 승인**: 신규 가입한 직원을 오너가 직접 검토하고 승인
- **권한 관리**: 오너 중심의 사용자 접근 제어 및 조직 관리

### 📦 재고 서비스 (Inventory)

- **상품 입고 관리**: 신규 상품 입고 시 수량 및 품목 상세 정보 등록
- **실시간 재고 현황**: 현재 보유 중인 자산의 수량을 한눈에 파악하고 효율적으로 재고를 조절

### 🚚 물류 서비스 (Logistics)

- **출하 업무 프로세스**: 주문 및 요청에 따른 상품의 출하 상태 관리
- **물류 이력 추적**: 입고된 상품이 출하되기까지의 흐름을 효율적으로 관리

### 📈 통합 KPI 대시보드

- **프로젝트 처리 완료율 & 업무 장기 처리율**: 실시간 업무 진행 상태 모니터링
- **안전 재고 확보율**: 품절 방지를 위한 적정 재고 유지 상태 확인
- **재고 회전율 및 익월 예측**: 효율적인 자산 유동성 파악 및 데이터 기반의 차기 재고 예측

## 📂 7. 폴더 구조 (Architecture)

```
src
 ┣ 📂apis       # API 통신 로직
 ┣ 📂components # UI 컴포넌트
 ┃ ┣ 📂common    # 공통 컴포넌트
 ┃ ┣ 📂dashboard # 차트 및 지표 컴포넌트
 ┃ ┣ 📂modals    # 시스템 모달
 ┃ ┗ 📂signup    # 회원가입 관련 컴포넌트
 ┣ 📂pages      # 도메인별 페이지 구성
 ┃ ┣ 📂inventory-service   # 재고 서비스
 ┃ ┣ 📂logistics-service   # 물류 서비스
 ┃ ┣ 📂management-service  # 관리 서비스
 ┃ ┗ 📂login & 📂signup    # 인증 관련 페이지
 ┣ 📂types      # TypeScript 타입 정의
 ┣ 📂utils      # 공용 유틸리티 함수
 ┣ 📂styles     # 글로벌 스타일 및 테마 설정
 ┣ 📜App.tsx 
 ┗ 📜main.tsx 
```

## 👥 8. 팀원 소개

|       이름       |  역할  |
| :--------------: | :----: |
| **박하은** |   FE   |
| **곽채연** | FE, BE |





