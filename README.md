# WhatTheBus-Web

단국대학교 셔틀버스 및 시내버스 실시간 위치 조회 웹 애플리케이션

## 기술 스택

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: TanStack Query (React Query)
- **Map**: Kakao Maps API
- **UI Components**: Radix UI + lucide-react
- **Code Quality**: Biome + ESLint

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 환경 변수 설정

`.env.sample` 파일을 복사하여 `.env.local` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```bash
cp .env.sample .env.local
```

필요한 환경 변수:
- `VITE_KAKAO_MAP_API_KEY`: Kakao Maps API 키

### 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 표시된 주소로 접속하세요.

## 사용 가능한 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드 생성
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - ESLint로 코드 검사
- `npm run lint:biome` - Biome으로 코드 검사
- `npm run format` - Biome으로 코드 포맷팅
- `npm run check` - Biome으로 코드 검사 및 자동 수정

## 프로젝트 구조

```
src/
├── components/        # React 컴포넌트
│   ├── ui/           # 재사용 가능한 UI 컴포넌트
│   ├── Bubble.tsx    # 정류장 정보 말풍선
│   ├── BusStops.tsx  # 버스 정류장 목록
│   └── ...
├── hooks/            # 커스텀 React 훅
├── utils/            # 유틸리티 함수
├── data/             # 데이터 및 타입 정의
├── types/            # TypeScript 타입 선언
├── App.tsx           # 메인 앱 컴포넌트
└── main.tsx          # 앱 진입점
```

## 주요 기능

- 🗺️ Kakao Maps 기반 실시간 버스 위치 표시
- 🚌 단국대학교 셔틀버스 및 시내버스 정보
- 📍 정류장별 도착 예정 버스 정보
- 🌐 다국어 지원 (한국어/영어)
- 📱 반응형 디자인
