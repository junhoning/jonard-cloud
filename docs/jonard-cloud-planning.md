# Jonard Cloud 개발 기획서

## 1. 목표

Jonard Cloud는 기존 Java/JSP 기반 시스템을 그대로 복제하는 프로젝트가 아니다. 기존 시스템의 핵심 업무 로직과 데이터 흐름은 유지하되, UI 구조, 화면 명칭, 사용자 경험, 프론트엔드 아키텍처를 새롭게 설계하는 운영 콘솔이다.

핵심 원칙:

- 기존 기능 알고리즘과 업무 흐름은 최대한 유지한다.
- UI는 React 기반으로 새롭게 구성한다.
- 화면 명칭은 더 직관적인 운영 콘솔 용어로 변경할 수 있다.
- 기존 시스템의 큰 기능을 한 번에 옮기지 않고, Device 중심으로 단계별 구현한다.
- 초기에는 “쓸 수 있는 작은 운영 콘솔”을 목표로 하고, Fiber/OTDR/PDF/MQTT 고급 기능은 후순위로 둔다.

## 2. 제품 방향

기존 시스템은 장비 관리, 작업 관리, 지도, 기록, 통계, 관리자 기능이 한 콘솔에 모여 있다. Jonard Cloud에서는 이를 다음과 같은 제품 구조로 재정리한다.

| 기존 명칭 | Jonard Cloud 제안 명칭 | 설명 |
| --- | --- | --- |
| Dashboard | Home | 내 장비, 작업, 메시지 요약 |
| Device | Devices | 장비 목록, 상세, 그룹, 권한, 설정 |
| Contact | People | 연락처, 초대, 팀/그룹 |
| Job Order / To-do | Work Orders | 작업 생성, 배정, 수행, 이력 |
| Monitor / Record | Live Monitor / Records | 장비 상태, 위치, splice record |
| Overview | Analytics | 통계, 분석, 리포트 |
| Fiber | Network Map | 지도 기반 fiber map 편집 |
| File | Files | 장비 파일과 OTDR viewer |
| Admin | Admin Tools | 사용자, 고객, 지역, 제품, 운영 관리 |

## 3. 권한별 콘솔 구조

### 3.1 일반 사용자

일반 사용자는 자신이 소유하거나 공유받은 장비와 작업을 중심으로 사용한다.

메뉴:

- Home
- Devices
- People
- Work Orders
- Live Monitor
- Analytics
- Files
- Network Map
- Help
- Account

### 3.2 관리자

관리자는 전체 장비, 사용자, 고객, 국가/지역, 제품 모델, 운영 이력, CMS성 콘텐츠를 관리한다.

메뉴:

- Home
- Devices
- Users
- Customers
- Regions
- Analytics
- Audit Log
- Admin Tools
- Help
- Account

### 3.3 지사 관리자

지사 관리자는 자신에게 허용된 region/customer/device 범위만 관리한다.

메뉴:

- Home
- Devices
- Customers
- Audit Log
- Help
- Account

## 4. 핵심 도메인

### 4.1 Device

Jonard Cloud의 중심 도메인이다.

포함 기능:

- 장비 목록
- 장비 상세
- 장비 그룹
- 장비 접근 권한
- 장비 잠금/해제
- 장비 보안 설정
- 장비 설정/파라미터
- 장비 위치
- 장비 파일
- 장비 splice record
- 관리자용 장비 등록/수정/삭제

우선순위:

1. 장비 목록/상세
2. 장비 그룹
3. 장비 접근 권한
4. 장비 상태/위치
5. 보안/설정/파라미터
6. import/export
7. MQTT command 연동

### 4.2 People

기존 Contact 기능을 새 이름으로 정리한다.

포함 기능:

- 사용자 검색
- 연락처 초대
- 초대 수락
- 연락처 목록
- 팀/그룹 생성
- 그룹 사용자 관리
- Work Orders, Network Map 공유 대상 제공

### 4.3 Work Orders

기존 Job Order와 To-do를 하나의 업무 흐름으로 합친다.

포함 기능:

- 작업 생성
- 작업 위치 지정
- 작업 설명/기한/상태 관리
- 담당자 배정
- 작업 전송
- 내가 받은 작업
- 작업 완료 처리
- 작업 이력
- 작업 관련 splice record 조회

### 4.4 Live Monitor / Records

기존 Monitor와 Record를 운영 감시 화면으로 재구성한다.

포함 기능:

- 장비 상태 필터: 전체, 온라인, 오프라인
- 장비 그룹 tree
- 지도에서 장비 위치 표시
- 기간별 splice record 조회
- splice detail/fiber detail 조회
- record note 수정
- 작업 위치 매핑
- 파일 viewer 연결

### 4.5 Analytics

기존 Overview를 분석 화면으로 재구성한다.

포함 기능:

- 기간별 splice 통계
- 장비별 통계
- 사용자별 통계
- 장비 상태 집계
- splice record drill-down
- PDF report 생성

### 4.6 Files

장비에서 올라온 파일을 조회하고 viewer로 확인하는 영역이다.

포함 기능:

- 장비별 파일 목록
- 날짜 필터
- 이미지 viewer
- PDF viewer
- SOR viewer
- SOLA viewer
- GDM viewer

### 4.7 Network Map

기존 Fiber 기능이다. 난도가 높으므로 후순위로 둔다.

포함 기능:

- 지도 위 marker/line/polygon/rectangle/circle 편집
- map/folder 관리
- shape 편집
- 공유 권한
- 변경 이력
- custom icon upload

### 4.8 Admin Tools

관리자 기능 모음이다.

포함 기능:

- 사용자 관리
- 관리자/지사 관리자 계정 관리
- 장비 전체 관리
- 고객 관리
- 국가/지역 관리
- 제품/모델 속성 관리
- 공지 관리
- 도움말 관리
- 개인정보 동의서 관리
- 운영 이력
- 시스템 통계

## 5. MVP 범위

첫 번째 목표는 전체 legacy을 완성하는 것이 아니라, 실제 개발 방향을 검증할 수 있는 최소 운영 콘솔을 만드는 것이다.

### MVP에 포함

- 로그인/로그아웃
- 권한별 메뉴
- 공통 레이아웃
- Devices 목록
- Devices 상세
- Device group tree
- Device access 목록
- People 목록
- People 초대 flow
- Work Orders 기본 목록
- Live Monitor 기본 record 목록
- Admin 사용자 목록
- Admin 장비 목록

### MVP에서 제외

- Fiber/Network Map drawing
- SOR/SOLA/GDM 정식 viewer
- PDF report 생성
- Excel import/export
- MQTT 실제 명령 전송
- 고급 장비 파라미터 편집
- 실시간 WebSocket push
- 다국어 전체 적용
- 복잡한 관리자 통계

## 6. 개발 단계

### Phase 0. 기반 준비

목표:

- 현재 스캐폴드에 실제 개발 기반을 추가한다.

작업:

- React Router 도입
- API client 구성
- 공통 응답 타입 정의
- 권한/세션 상태 관리 방식 결정
- 공통 layout 구성
- 공통 table/tree/modal/form prototype 작성
- FastAPI app 구조 정리

결과물:

- 빈 화면이 아니라 route가 나뉜 콘솔 skeleton
- mock API 또는 fixture 기반 화면 개발 가능 상태

### Phase 1. Core Console

목표:

- 로그인 후 권한별 콘솔에 진입할 수 있게 한다.

작업:

- 로그인 화면
- 세션 또는 토큰 인증 설계
- 권한별 메뉴
- Account/Profile 기본 화면
- Home 빈 dashboard
- Notice/Help 읽기 전용 skeleton

주의:

- 기존 Spring Security를 그대로 쓰지 않을 가능성이 높다.
- FastAPI 기준 인증 방식을 별도로 정해야 한다.

### Phase 2. Devices

목표:

- legacy의 중심 기능인 장비 목록/상세/그룹을 먼저 구현한다.

작업:

- Devices page
- Device group tree
- Device table
- Device detail drawer
- Device access tab
- 검색/정렬/필터/페이징
- 관리자용 Device table과 일반 사용자용 Device table 차이 정리

보류:

- MQTT 명령
- 장비 setting/security/parameter 고급 form
- Excel import/export

### Phase 3. People + Work Orders

목표:

- 장비 공유와 작업 배정의 기반을 만든다.

작업:

- People page
- Invite modal
- Teams/group 관리
- Work Orders page
- 작업 목록
- 작업 상세
- 담당자 배정
- 작업 상태 변경

상호작용:

- People에서 초대한 사용자가 Work Order 담당자가 된다.
- Work Order는 Live Monitor/Records와 연결된다.

### Phase 4. Live Monitor

목표:

- 장비 상태와 splice record를 조회할 수 있게 한다.

작업:

- Device status filter
- Device tree
- Map placeholder 또는 실제 지도
- Splice record table
- Record detail
- Device access detail
- 날짜 필터

보류:

- SOR/SOLA/GDM viewer
- 작업 위치 매핑 고도화
- 실시간 push

### Phase 5. Analytics

목표:

- 기존 Overview의 핵심 통계를 새 UI로 제공한다.

작업:

- 기간 필터
- Total splice chart
- Device chart
- User chart
- Device info table
- Record drill-down

보류:

- PDF report export

### Phase 6. Files

목표:

- 장비 파일 목록과 기본 viewer를 제공한다.

작업:

- Device file tree/filter
- File table
- image/pdf 기본 보기
- viewer registry 구조

보류:

- SOR/SOLA/GDM full parser

### Phase 7. Admin Tools

목표:

- 관리자 운영 기능을 단계적으로 이식한다.

작업:

- Users
- Admin accounts
- Customers
- Regions
- Device Models
- Notice/Help/Privacy Policy
- Audit Log

### Phase 8. Advanced Device Commands

목표:

- 실제 장비 명령과 파라미터 전송 기능을 복구한다.

작업:

- lock/unlock
- stolen/lost status
- offline available duration
- security/time lock
- setting/parameter
- MQTT/AMQP command adapter
- Redis state cache
- command history/audit

### Phase 9. Network Map

목표:

- 기존 Fiber map 편집 기능을 새 UI로 구현한다.

작업:

- 지도 라이브러리 결정
- drawing tools
- shape model
- map/folder tree
- share access
- history
- icon upload

## 7. 추천 화면 구조

### 7.1 Devices

페이지 구조:

- 좌측: Device Groups
- 상단: Search toolbar
- 중앙: Device table
- 우측 drawer: Device detail

Device detail tabs:

- Summary
- Access
- Security
- Settings
- Parameters
- Records
- Files
- Logs

### 7.2 People

페이지 구조:

- 좌측: Teams
- 중앙: People table
- 우측 drawer: Person detail
- 상단 action: Invite, Add to Team, Remove

### 7.3 Work Orders

페이지 구조:

- 좌측: status/date filter
- 중앙: Work Order table
- 우측 drawer: Work Order detail
- detail 내부: assigned people, location, records

### 7.4 Live Monitor

페이지 구조:

- 좌측: Device tree/status tabs
- 중앙: Map
- 하단: Records table
- 우측 drawer: selected record detail

### 7.5 Analytics

페이지 구조:

- 상단: date/device filters
- 중앙: charts
- 하단: drill-down table
- report modal

### 7.6 Files

페이지 구조:

- 좌측: Device tree
- 중앙: File table
- 우측/Modal: file viewer

### 7.7 Admin

페이지 구조:

- Admin Tools 안에서 기능별 sub page
- table 중심
- row action menu
- add/edit drawer
- audit/history 링크

## 8. API 설계 방향

기존 시스템 API는 화면 중심 endpoint가 많다. Jonard Cloud에서는 도메인 중심으로 다시 정리한다.

예시:

```text
/api/auth/login
/api/auth/logout
/api/me

/api/devices
/api/devices/{device_id}
/api/devices/{device_id}/access
/api/devices/{device_id}/security
/api/devices/{device_id}/settings
/api/devices/{device_id}/parameters
/api/devices/{device_id}/records
/api/devices/{device_id}/files
/api/device-groups

/api/people
/api/people/invitations
/api/teams

/api/work-orders
/api/work-orders/{work_order_id}
/api/work-orders/{work_order_id}/records

/api/monitor/device-status
/api/monitor/records

/api/analytics/splice
/api/analytics/devices
/api/analytics/users

/api/admin/users
/api/admin/devices
/api/admin/customers
/api/admin/regions
/api/admin/audit-logs
```

응답 형식 제안:

```json
{
  "ok": true,
  "data": {},
  "message": null,
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": 120
  }
}
```

기존 `ResponseVo`와 호환이 필요하면 backend adapter에서 변환한다.

## 9. 데이터 설계 방향

먼저 정리해야 할 핵심 엔티티:

- User
- Role
- Region
- Customer
- Device
- DeviceModel
- DeviceGroup
- DeviceGroupMap
- DeviceAccess
- Contact/People
- Team
- TeamMember
- Invitation
- WorkOrder
- WorkOrderAssignee
- WorkOrderLocation
- SpliceRecord
- SpliceFiber
- DeviceFile
- FiberMap
- FiberShape
- AuditLog
- Notice
- Help
- PrivacyPolicy

결정 필요:

- 기존 DB를 그대로 사용할지
- 새 DB schema로 마이그레이션할지
- 기존 테이블명/컬럼명을 유지할지
- API에서는 새 이름을 쓰고 DB adapter에서 기존 이름으로 변환할지

추천:

- 초기에는 기존 DB를 최대한 읽을 수 있게 adapter를 둔다.
- API/프론트에서는 새 도메인 명칭을 사용한다.
- DB migration은 MVP 이후에 별도 단계로 진행한다.

## 10. UI 컴포넌트 우선 제작 목록

Ingradient UI 위에 다음 공통 컴포넌트를 먼저 만든다.

- `ConsoleLayout`
- `PageToolbar`
- `DataTable`
- `TreePanel`
- `DetailDrawer`
- `ConfirmDialog`
- `FormModal`
- `StatusBadge`
- `DateRangeFilter`
- `SearchInput`
- `ActionMenu`
- `EmptyState`
- `ErrorState`
- `LoadingOverlay`

초기 MVP에서는 fancy한 화면보다 데이터 작업이 안정적인 UI가 중요하다.

## 11. 리스크

### 11.1 기능 범위 과대

기존 시스템은 기능이 매우 많다. 한 번에 전체를 만들면 일정이 크게 늘어난다.

대응:

- MVP 범위를 강하게 제한한다.
- Device 중심으로 기능을 붙인다.

### 11.2 장비 명령/MQTT

장비 설정 변경은 단순 CRUD가 아니다.

대응:

- command adapter 설계
- command history
- 실패/재시도/timeout 정책
- 실제 장비 연동 전 mock command mode 제공

### 11.3 지도/Fiber

Fiber map은 UI와 데이터 구조가 복잡하다.

대응:

- MVP 제외
- 별도 spike로 지도 라이브러리 검증

### 11.4 파일 viewer

SOR/SOLA/GDM은 전용 parser/viewer가 필요하다.

대응:

- MVP에서는 파일 목록과 image/pdf만 제공
- OTDR viewer는 별도 milestone

### 11.5 기존 데이터 이해

테이블과 Mapper가 많고 일부 주석/문자 인코딩이 깨져 있다.

대응:

- DB schema 문서화
- 주요 query별 input/output 샘플 확보
- 기존 화면에서 실제 API 호출 캡처

## 12. 바로 다음 작업

다음 순서로 문서를 더 만들면 개발에 바로 들어가기 쉬워진다.

1. MVP 상세 범위 문서
2. 메뉴/라우팅 구조 문서
3. API 초안 문서
4. DB 엔티티 초안 문서
5. UI 컴포넌트 설계 문서

추천 첫 작업:

- `MVP 상세 범위 문서`를 먼저 만든다.
- 그 다음 `Devices` 페이지를 기준으로 실제 화면 설계와 API 계약을 작성한다.

## 13. 개발 의사결정 초안

현재 추천 결정:

- 프론트: React + TypeScript + Vite
- UI: Ingradient UI
- 백엔드: FastAPI
- 인증: FastAPI session/JWT 중 선택 필요
- DB: 초기에는 기존 DB 호환 우선
- 지도: 추후 Google Maps 또는 대체 라이브러리 검토
- Table: 자체 DataTable wrapper 제작
- Tree: 자체 TreePanel wrapper 제작
- Charts: 추후 선택
- MQTT/AMQP: command adapter로 분리

## 14. 최종 방향 요약

Jonard Cloud는 Device를 중심으로 재설계한다.

가장 먼저 만들어야 하는 것은 멋진 통계나 지도 편집기가 아니라, 다음 흐름이다.

1. 사용자가 로그인한다.
2. 권한에 맞는 메뉴를 본다.
3. 장비 목록을 본다.
4. 장비 그룹으로 필터링한다.
5. 장비 상세와 접근 권한을 확인한다.
6. 사람을 초대하고 팀을 만든다.
7. 작업을 만들고 배정한다.
8. 장비 상태와 기록을 모니터링한다.

이 흐름이 안정되면 Analytics, Files, Admin Tools, Network Map, 고급 장비 명령을 순서대로 붙인다.
