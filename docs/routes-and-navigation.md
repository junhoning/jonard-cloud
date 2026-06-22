# Jonard Cloud 라우팅 및 내비게이션 설계서

## 1. 목적

이 문서는 Jonard Cloud의 URL, 메뉴 구조, 권한별 접근 범위를 정의한다. 개발 시 프론트엔드 라우터, 백엔드 권한 체크, 화면 명세의 기준으로 사용한다.

## 2. 라우팅 원칙

- URL은 기능 중심으로 짧고 예측 가능하게 만든다.
- 기존 시스템의 JSP 파일명은 그대로 쓰지 않는다.
- 상세 화면은 `/:id` 패턴을 사용한다.
- 생성 화면은 가능하면 모달 또는 drawer를 우선 사용하고, 복잡한 경우에만 별도 route를 만든다.
- 관리자 기능은 `/admin/*` 아래에 둔다.
- 계정 기능은 `/account/*` 아래에 둔다.

## 3. 공통 라우트

| Route | 화면 | 인증 | 설명 |
| --- | --- | --- | --- |
| `/login` | Login | 불필요 | 로그인 |
| `/logout` | Logout | 필요 | 세션 종료 처리 |
| `/` | Home redirect | 필요 | 권한별 기본 홈으로 이동 |
| `/home` | Home | 필요 | 콘솔 요약 |
| `/account` | Account | 필요 | 내 계정 |
| `/account/profile` | Profile | 필요 | 프로필 정보 |
| `/help` | Help | 필요 | 도움말 placeholder |
| `*` | Not Found | 선택 | 잘못된 경로 안내 |

## 4. 일반 사용자 라우트

| Route | 화면 | 설명 |
| --- | --- | --- |
| `/devices` | Device List | 내 장비와 공유 장비 목록 |
| `/devices/:deviceId` | Device Detail | 장비 상세 |
| `/devices/:deviceId/records` | Device Records | 장비 관련 기록 |
| `/devices/:deviceId/files` | Device Files | 장비 관련 파일 |
| `/people` | People List | 연락처/팀 목록 |
| `/people/:personId` | Person Detail | 연락처 상세 |
| `/work-orders` | Work Order List | 작업 목록 |
| `/work-orders/:workOrderId` | Work Order Detail | 작업 상세 |
| `/records` | Record List | 모니터링/작업 기록 목록 |
| `/records/:recordId` | Record Detail | 기록 상세 |
| `/files` | File List | 파일 목록 |
| `/files/:fileId` | File Detail | 파일 상세 |
| `/analytics` | Analytics | 개인 또는 소유 장비 기준 통계 |
| `/network-map` | Network Map | 후순위 지도 화면 placeholder |

## 5. 관리자 라우트

| Route | 화면 | 설명 |
| --- | --- | --- |
| `/admin` | Admin Home | 관리자 요약 |
| `/admin/users` | User List | 사용자 목록 |
| `/admin/users/:userId` | User Detail | 사용자 상세 |
| `/admin/devices` | Admin Device List | 전체 장비 목록 |
| `/admin/devices/:deviceId` | Admin Device Detail | 장비 상세/관리 |
| `/admin/customers` | Customer List | 고객/조직 목록 |
| `/admin/customers/:customerId` | Customer Detail | 고객/조직 상세 |
| `/admin/regions` | Region List | 국가/지역 목록 |
| `/admin/products` | Product List | 제품 모델 목록 |
| `/admin/audit-logs` | Audit Log | 운영 이력 |
| `/admin/settings` | Settings | 시스템 설정 placeholder |

## 6. 지사 관리자 라우트

| Route | 화면 | 설명 |
| --- | --- | --- |
| `/branch` | Branch Home | 지사 관리자 요약 |
| `/branch/devices` | Branch Device List | 담당 범위 장비 |
| `/branch/customers` | Branch Customer List | 담당 고객 |
| `/branch/audit-logs` | Branch Audit Log | 담당 범위 이력 |

## 7. 권한별 메뉴

### 7.1 일반 사용자

- Home: `/home`
- Devices: `/devices`
- People: `/people`
- Work Orders: `/work-orders`
- Live Monitor: `/records`
- Analytics: `/analytics`
- Files: `/files`
- Network Map: `/network-map`
- Help: `/help`
- Account: `/account`

### 7.2 관리자

- Home: `/admin`
- Devices: `/admin/devices`
- Users: `/admin/users`
- Customers: `/admin/customers`
- Regions: `/admin/regions`
- Products: `/admin/products`
- Analytics: `/analytics`
- Audit Log: `/admin/audit-logs`
- Settings: `/admin/settings`
- Help: `/help`
- Account: `/account`

### 7.3 지사 관리자

- Home: `/branch`
- Devices: `/branch/devices`
- Customers: `/branch/customers`
- Audit Log: `/branch/audit-logs`
- Help: `/help`
- Account: `/account`

## 8. 페이지 간 이동 규칙

### 8.1 Devices 중심 이동

- Device List에서 장비를 선택하면 Device Detail로 이동한다.
- Device Detail에서 관련 Work Orders, Records, Files로 이동할 수 있다.
- Device Detail에서 소유자/공유 사용자를 선택하면 People 또는 Admin User Detail로 이동한다.

### 8.2 Work Orders 중심 이동

- Work Order List에서 작업을 선택하면 Work Order Detail로 이동한다.
- Work Order Detail에서 연결된 Device Detail로 이동할 수 있다.
- Work Order Detail에서 담당자 상세로 이동할 수 있다.
- 작업 기록은 Records로 연결된다.

### 8.3 Records 중심 이동

- Record List에서 기록을 선택하면 Record Detail로 이동한다.
- Record Detail에서 연결된 Device, Work Order, File로 이동할 수 있다.

### 8.4 Files 중심 이동

- File List에서 파일을 선택하면 File Detail로 이동한다.
- File Detail에서 연결된 Device, Record, Work Order로 이동할 수 있다.
- 파일 뷰어가 필요한 파일은 후속 버전에서 viewer route로 분리한다.

## 9. 라우터 구현 기준

- React Router를 사용한다.
- 인증 상태가 없으면 보호 route에서 `/login`으로 이동한다.
- 권한이 없으면 `403` 페이지 또는 권한 없음 empty state를 보여준다.
- 목록 화면은 URL query로 필터 상태를 유지한다.

예시 query:

```text
/devices?keyword=abc&status=online&page=1
/records?deviceId=123&from=2026-01-01&to=2026-01-31
```

## 10. 추후 확장 라우트

| Route | 설명 |
| --- | --- |
| `/devices/:deviceId/settings` | 장비 고급 설정 |
| `/devices/:deviceId/commands` | 장비 명령 실행 이력 |
| `/network-map/:mapId` | 지도 상세/편집 |
| `/files/:fileId/viewer` | OTDR/SOR/SOLA/GDM 파일 뷰어 |
| `/reports` | 리포트 목록 |
| `/reports/:reportId` | 리포트 상세 |

