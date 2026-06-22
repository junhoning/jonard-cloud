# Jonard Cloud UI 화면 명세 초안

## 1. 목적

이 문서는 Jonard Cloud 화면을 어떻게 구성할지 정의한다. 기존 시스템의 기능 흐름은 유지하되, UI는 Ingradient UI 기반의 새로운 운영 콘솔로 재설계한다.

## 2. 공통 UI 방향

- 운영자가 반복적으로 쓰는 콘솔이므로 정보 밀도를 적당히 높인다.
- 목록, 필터, 상세, 액션의 흐름을 일관되게 유지한다.
- 페이지마다 새로운 레이아웃을 만들지 않고 공통 패턴을 재사용한다.
- 기능 설명 문구보다 실제 데이터와 액션을 우선한다.
- 카드 남용을 피하고, 목록/패널/툴바 중심으로 구성한다.

## 3. 공통 화면 패턴

### 3.1 Console Layout

구성:

- Global navigation
- User menu
- Page header
- Page content
- Toast area
- Modal root

동작:

- 권한에 따라 navigation 항목이 다르게 표시된다.
- 현재 route와 일치하는 메뉴가 active 상태가 된다.

### 3.2 List Page

구성:

- Page title
- Primary action button
- Search input
- Filter controls
- Data table
- Pagination
- Empty state

사용 화면:

- Devices
- People
- Work Orders
- Records
- Files
- Admin Users
- Admin Customers

### 3.3 Detail Page

구성:

- Title area
- Status badge
- Primary actions
- Summary section
- Tab section
- Related data lists

사용 화면:

- Device Detail
- Work Order Detail
- Record Detail
- User Detail
- File Detail

### 3.4 Form Modal

구성:

- Modal title
- Required fields
- Secondary fields
- Cancel
- Save

사용:

- 장비 그룹 생성
- 작업 생성
- 사용자 초대
- 권한 공유

### 3.5 Detail Drawer

구성:

- 오른쪽 side panel
- 간단 상세 정보
- 빠른 액션

사용:

- 목록에서 행을 빠르게 확인할 때
- 전체 상세 페이지로 이동하기 전 미리보기

## 4. Home

목적:

- 사용자가 오늘 확인해야 할 장비, 작업, 기록을 빠르게 본다.

구성:

- Device summary
- Work order summary
- Latest records
- Recent files
- Admin일 경우 system summary

주요 액션:

- Devices로 이동
- Work Orders로 이동
- Records로 이동

상호작용:

- summary 항목 클릭 시 해당 필터가 적용된 목록으로 이동한다.
- 예: Offline Devices 클릭 -> `/devices?connectionStatus=offline`

## 5. Devices List

목적:

- 장비를 찾고 상태를 확인한다.

컬럼:

- Status
- Name
- Serial Number
- IMEI Number
- Model
- Owner
- Group
- Last Seen
- Actions

필터:

- keyword
- connection status
- device status
- model
- group
- owner

주요 액션:

- 장비 상세 보기
- 장비 등록
- 그룹 변경
- 공유 설정

상호작용:

- 행 클릭 시 detail drawer 또는 detail page로 이동한다.
- Serial/IMEI 검색은 keyword 검색에 포함한다.
- status badge는 온라인/오프라인/알 수 없음 상태를 구분한다.

## 6. Device Detail

목적:

- 장비의 핵심 정보와 연결된 작업/기록/파일을 한 곳에서 확인한다.

구성:

- 기본 정보
- 연결 상태
- 소유자/조직
- 위치 또는 마지막 접속 정보
- Tabs

Tabs:

- Overview
- Records
- Work Orders
- Files
- Access
- Settings placeholder

주요 액션:

- 장비 정보 수정
- 공유 설정
- 작업 생성
- 기록 보기
- 파일 보기

상호작용:

- Work Orders tab에서 작업 선택 시 Work Order Detail로 이동한다.
- Records tab에서 기록 선택 시 Record Detail로 이동한다.
- Files tab에서 파일 선택 시 File Detail로 이동한다.
- Access tab에서 사용자 공유를 추가/해제한다.

## 7. People List

목적:

- 사용자, 연락처, 공유 대상을 관리한다.

컬럼:

- Name
- Email
- Organization
- Role
- Status
- Last Active
- Actions

필터:

- keyword
- role
- organization
- status

주요 액션:

- 초대
- 상세 보기
- 공유 장비 확인

상호작용:

- 초대 버튼은 Form Modal을 연다.
- 사용자 선택 시 Person Detail로 이동한다.

## 8. Work Orders List

목적:

- 작업 상태와 담당자를 확인하고 작업을 생성한다.

컬럼:

- Status
- Title
- Device
- Assignee
- Priority
- Due Date
- Updated At
- Actions

필터:

- keyword
- status
- device
- assignee
- priority
- date range

주요 액션:

- 작업 생성
- 상태 변경
- 상세 보기

상호작용:

- 상태 변경은 빠른 액션으로 제공하되, 이력 기록을 남긴다.
- 장비명 클릭 시 Device Detail로 이동한다.

## 9. Work Order Detail

목적:

- 작업의 전체 내용을 확인하고 진행 상태를 변경한다.

구성:

- 작업 제목/상태/우선순위
- 연결 장비
- 담당자
- 설명
- 상태 변경 이력
- 관련 Records
- 관련 Files
- Comments

주요 액션:

- 상태 변경
- 담당자 변경
- 파일 연결
- 코멘트 작성

상호작용:

- 상태 변경 시 변경 사유를 입력할 수 있다.
- 완료 처리 시 `completedAt`이 기록된다.

## 10. Records List

목적:

- 장비 이벤트와 작업 기록을 시간순으로 확인한다.

컬럼:

- Severity
- Type
- Device
- Summary
- Event Time
- Source
- Actions

필터:

- type
- severity
- device
- date range

주요 액션:

- 기록 상세 보기
- 관련 장비 보기
- 관련 파일 보기

상호작용:

- 심각도에 따라 badge 색상을 다르게 표시한다.
- record type에 따라 상세 payload 표시 방식이 달라진다.

## 11. Files List

목적:

- 장비와 작업에 연결된 파일을 찾는다.

컬럼:

- File Name
- Type
- Device
- Work Order
- Size
- Uploaded By
- Uploaded At
- Actions

필터:

- keyword
- file type
- device
- date range

주요 액션:

- 상세 보기
- 다운로드

상호작용:

- SOR/SOLA/GDM 파일은 MVP에서 viewer 대신 metadata와 다운로드만 제공한다.

## 12. Admin Users

목적:

- 전체 사용자를 관리한다.

컬럼:

- Name
- Email
- Role
- Organization
- Status
- Last Login
- Actions

주요 액션:

- 사용자 상태 변경
- 역할 변경
- 상세 보기

상호작용:

- 비활성화 시 확인 modal을 표시한다.
- 역할 변경은 audit log 대상이다.

## 13. Admin Devices

목적:

- 전체 장비를 운영 관점에서 관리한다.

컬럼:

- Status
- Name
- Serial
- IMEI
- Owner
- Organization
- Model
- Last Seen
- Actions

주요 액션:

- 장비 등록
- 장비 수정
- 소유자 변경
- 상세 보기

상호작용:

- 사용자 화면보다 더 많은 필터를 제공한다.
- 장비 소유자 변경은 audit log 대상이다.

## 14. UI 상태

모든 화면은 다음 상태를 가진다.

- Loading
- Empty
- Error
- Permission denied
- Saving
- Success toast
- Confirm dialog

## 15. 우선 제작 컴포넌트

- `ConsoleLayout`
- `PageHeader`
- `PageToolbar`
- `DataTable`
- `StatusBadge`
- `SearchInput`
- `DateRangeFilter`
- `ActionMenu`
- `DetailDrawer`
- `FormModal`
- `ConfirmDialog`
- `EmptyState`
- `ErrorState`
- `LoadingOverlay`

