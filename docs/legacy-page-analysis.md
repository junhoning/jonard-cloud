# 기존 시스템 페이지별 기능 분석

이 문서는 기존 Java/JSP 프로젝트를 기준으로 Jonard Cloud 재구현을 준비하기 위한 화면/기능 분석 문서다.

분석 기준 파일:

- 화면: `src/main/webapp/WEB-INF/views/**/*.jsp`
- 화면 스크립트: `src/main/webapp/resources/views/**/*.js`
- 서버 라우트: `src/main/java/**/*.java`
- 데이터 접근: `src/main/java/**/Dao.xml`, `src/main/resources/mapper/*.xml`

## 1. 전체 구조

기존 시스템은 Spring Boot + JSP + jQuery/jqWidgets 기반의 단일 페이지형 운영 콘솔이다. 로그인 후 `MainController`가 사용자 권한에 따라 서로 다른 메인 JSP를 반환한다.

- 일반 사용자: `front/main/main.jsp`
- 관리자/지사 관리자: `admin/main/main.jsp`

공통적으로 상단 메뉴를 클릭하면 페이지 이동이 아니라 `goAjaxLoad('.content', url)` 방식으로 중앙 `.content` 영역에 JSP fragment를 불러온다. 즉, 실제 UX는 멀티 페이지라기보다 “JSP 기반 탭 없는 SPA”에 가깝다.

권한은 주로 `roleCode`, `roleName`으로 분기된다.

- `ROLE_ADMIN`, roleCode `1000`: 전체 관리자
- `ROLE_BRANCH`, roleCode `1001`: 지사 관리자
- 그 외: 일반 사용자

## 2. 공통 UI/시스템

### 2.1 공통 레이아웃

관련 파일:

- `WEB-INF/views/common/header.jsp`
- `WEB-INF/views/common/meta.jsp`
- `WEB-INF/views/common/common.jsp`
- `WEB-INF/views/front/main/main.jsp`
- `WEB-INF/views/admin/main/main.jsp`

기능:

- jqWidgets, jQuery, chart, 지도, TinyMCE 등 공통 라이브러리 로딩
- 다국어 메시지 사용: `<spring:message>`
- 공통 AJAX 헬퍼 사용: `goAjaxGet`, `goAjaxPost`, `goAjaxPostForm`, `goAjaxLoad`
- 공통 팝업: `showMenuPopup`
- 서버 시간/리소스 조회: `/system/resource`
- WebSocket/STOMP 기반 `/push` 구독 코드가 있으나 현재 일부는 주석 처리되어 있음

Jonard Cloud 구현 메모:

- `AppShell` + 상단 내비게이션 + content outlet 구조가 필요하다.
- 메뉴 클릭마다 route 전환을 하되, 기존처럼 content만 갈아끼우는 느낌보다는 React Router 기반 페이지 전환이 적합하다.
- 공통 권한/세션/다국어/알림/팝업 모듈을 먼저 설계해야 한다.

### 2.2 Notice 공지 화면

관련 파일:

- `WEB-INF/views/common/notice.jsp`
- `NoticeController`

라우트/API:

- `GET /notice/view`: 최신 공지 표시 화면
- `GET /admin/notice`: 공지 조회
- `POST /admin/notice`: 공지 추가/수정/삭제

기능:

- 로그인 후 메인 초기 화면으로 공지사항을 로드한다.
- 가장 최근 공지의 HTML 내용을 표시한다.
- 관리자는 별도 관리 화면에서 TinyMCE 기반으로 공지를 작성/수정/삭제한다.

### 2.3 Help 도움말

관련 파일:

- `WEB-INF/views/common/help.jsp`
- `resources/views/common/help.js`
- `HelpController`

라우트/API:

- `GET /help/view`: 일반 도움말 화면
- `GET /help`: 도움말 전체/트리 데이터 조회
- `GET /help/detail`: 도움말 단건 조회
- `GET /help/list`: 하위 도움말 목록 조회
- `GET /admin/help/view`: 관리자 도움말 편집 화면
- `POST /admin/help`: 도움말 추가/수정/삭제

기능:

- 좌측 트리에서 도움말 항목을 선택한다.
- 선택한 항목의 HTML 콘텐츠를 우측에 표시한다.
- 관리자는 도움말 트리와 콘텐츠를 편집한다.

## 3. 인증/계정

### 3.1 로그인

관련 파일:

- `WEB-INF/views/front/login/login.jsp`
- `resources/views/front/login/login.js`
- `LoginController`
- Spring Security 설정/핸들러: `SecurityConfig`, `LoginHandler`, `LogoutHandler`

라우트/API:

- `GET /login/index`: 로그인 화면
- `GET /login/captcha`: captcha 이미지 생성
- `GET /login/isRight`: captcha 문자열 검증
- `POST /login/emailCheck`: 로그인 전 captcha, 계정/비밀번호, 2차 인증 여부 확인
- `POST /login/secondAuth`: 이메일 인증 코드 검증
- `POST /login/proc`: 실제 Spring Security 로그인 처리
- `GET /logout`: 로그아웃

기능:

- ID/비밀번호 입력
- captcha 확인
- 일반 사용자는 2차 인증 옵션이 켜진 경우 이메일 인증 코드 발송 및 검증
- 관리자/지사 계정은 이메일 2차 인증 없이 통과하는 로직 존재
- 로그인 성공 후 권한에 따라 관리자 콘솔 또는 일반 콘솔로 이동

Jonard Cloud 구현 메모:

- 로그인은 단순 폼이 아니라 captcha, 2FA, Spring Security 세션 흐름을 포함한다.
- 새 구현에서는 JWT/session 중 하나를 결정하고, 이메일 인증 재사용 여부를 정해야 한다.

### 3.2 회원가입

관련 파일:

- `WEB-INF/views/user/regist.jsp`
- `WEB-INF/views/user/regist2.jsp`
- `resources/views/user/regist.js`
- `UserController`

라우트/API:

- `GET /user/regist`: 일반 회원가입 화면
- `GET /user/invite-and-regist`: 초대 링크 기반 회원가입 화면
- `GET /user/regist/consent`: 개인정보 처리방침 팝업
- `GET /country`: 국가 목록
- `GET /user/checkId`: 이메일/사용자 ID 중복 확인
- `POST /user/regist`: 회원가입 처리
- `GET /user/emailLink`: 이메일 검증 안내 화면
- `GET /user/email-check`: 이메일 검증 처리

입력/검증:

- Serial Number
- IMEI Number
- User ID, 이메일
- Password / Confirm Password
- Name
- Country
- Company
- Privacy Policy 동의
- 초대 가입 시 `invitee`, `inviteKey`를 포함

기능:

- 국가 드롭다운 로드
- 이메일 형식/중복 검사
- 비밀번호 확인
- 개인정보 동의 체크 시 가입 버튼 활성화
- 일반 가입은 장비 Serial/IMEI를 기반으로 등록 검증을 하는 구조
- 초대 가입은 invite key를 통해 연락처 초대 흐름과 연결된다.

### 3.3 프로필/계정 관리

관련 파일:

- `WEB-INF/views/user/profile.jsp`
- `resources/views/user/profile.js`
- `UserController`

라우트/API:

- `GET /user/profile`: 내 프로필 팝업
- `POST /user/change`: 사용자 정보 변경, 비밀번호 변경, 탈퇴 요청
- `POST /user/activate`: 계정 삭제 취소/재활성화
- `POST /user/twoface/update`: 2차 인증 설정 변경
- `POST /login/twoface/get`: 2차 인증 사용 여부 조회
- `GET /country`: 국가 목록

기능:

- 내 정보 수정: 이름, 국가, 회사 등
- 비밀번호 변경
- 계정 비활성화/삭제 요청
- 비활성화 계정의 재활성화
- 2차 이메일 인증 활성/비활성 설정
- 일부 권한 또는 상태에서는 필드가 readonly 처리된다.

### 3.4 비밀번호 재설정

관련 파일:

- `WEB-INF/views/front/retrieve/retrieve.jsp`
- `resources/views/front/retrieve/retrieve.js`
- `RetrieveController`

라우트/API:

- `GET /retrieve/view`: 비밀번호 재설정 화면
- `GET /retrieve/captcha`: 이메일/사용자 ID로 인증 코드 전송
- `POST /retrieve/passwordReset`: 새 비밀번호 저장

기능:

- 사용자 ID 입력
- 인증 코드 발송
- 인증 코드와 새 비밀번호 입력
- 비밀번호 재설정 처리

## 4. 일반 사용자 콘솔

일반 사용자 메인 메뉴:

- Dashboard
- Device
- Contact
- Monitor
- To-do
- Fiber
- Overview
- File
- Help
- My Profile
- Logout

### 4.1 Dashboard

관련 파일:

- `WEB-INF/views/front/main/dashboard.jsp`
- `resources/views/front/main/dashboard.js`
- `DashboardController`

라우트/API:

- `GET /dashboard/view`: 화면
- `GET /dashboard/device`: 내 장비 목록
- `GET /dashboard/job`: 내 작업 목록
- `GET /dashboard/received`: 수신 메시지 목록

기능:

- 사용자가 소유/접근 가능한 장비 요약
- 작업(Job Order) 요약
- 수신 메시지 목록
- jqxGrid 기반 목록과 페이징
- 일부 텍스트는 줄바꿈 가공 후 표시

Jonard Cloud 구현 메모:

- 첫 대시보드는 “장비 상태, 예정 작업, 메시지” 세 개의 요약 패널로 구성 가능하다.

### 4.2 Device

관련 파일:

- `WEB-INF/views/front/configuration/device.jsp`
- `resources/views/front/configuration/device.js`
- `DeviceController`
- `DeviceMessageController`
- `DeviceSpliceController`

라우트/API:

- `GET /device/view`: 화면
- `GET /device`: 장비 단건 상세
- `GET /device/list`: 장비 목록
- `POST /device`: 장비 수정
- `POST /device/multiple`: 여러 장비 일괄 수정
- `POST /device/delete`: 장비 삭제
- `GET /device/group`: 장비 그룹 조회
- `POST /device/group`: 장비 그룹 생성/수정/삭제
- `POST /device/group/map`: 장비-그룹 매핑 생성/수정/삭제
- `GET /device/user`: 장비 사용자/권한 목록
- `POST /device/transfer-ownership`: 소유권 이전
- `POST /device/delete-user`: 장비 사용자 제거
- `POST /device/lock`: 장비 잠금/해제
- `GET /device/security`, `POST /device/security`: 보안 설정 조회/저장
- `POST /device/security/multiple`: 여러 장비 보안 설정
- `GET /device/setting`, `POST /device/setting`: 장비 설정 조회/저장
- `POST /device/setting/multiple`: 여러 장비 설정
- `GET /device/params`, `POST /device/params`: 장비 파라미터 조회/저장
- `POST /device/import`: 장비 Excel import
- `POST /device/excel`: 장비 Excel export
- `POST /device/message/send`: 장비로 유지보수 메시지 전송
- `POST /device/splice/note/update`: splice note 수정
- `GET /device/splice/image`: splice 이미지 조회

화면 구성:

- 좌측 장비 그룹 트리
- 우측 장비 목록 grid
- 선택 장비의 사용자/공유 권한 grid
- 장비 상세/수정 팝업
- 보안 설정 팝업
- 파라미터 설정 팝업
- Excel import/export

주요 기능:

- 장비 검색/필터/정렬/페이징
- 장비 그룹 생성, 수정, 삭제
- 장비를 그룹에 배치
- 장비 이름/색상/그룹/공유 사용자 등 수정
- 연락처 그룹과 장비 공유
- 장비 소유권 이전
- 장비 잠금/해제
- 분실/도난 상태, 오프라인 허용 기간, GPS 주기, 암호화, Time Lock 설정
- Splice/Heat/Motor/Machine 관련 파라미터 변경
- 설정 변경 시 MQTT/AMQP로 실제 장비에 명령 전송

Jonard Cloud 구현 메모:

- Device는 가장 큰 도메인이다. “목록/그룹/권한/보안/파라미터/메시지/엑셀”을 한 번에 만들지 말고 단계 분리 필요.
- 장비 설정은 단순 DB update가 아니라 MQTT side effect가 있으므로 API 계층에서 command/event 설계가 필요하다.

### 4.3 Contact

관련 파일:

- `WEB-INF/views/front/configuration/contact.jsp`
- `resources/views/front/configuration/contact.js`
- `ContactController`

라우트/API:

- `GET /configuration/contact/view`: 화면
- `GET /configuration/contact`: 연락처 목록
- `POST /configuration/contact`: 연락처 초대/삭제
- `POST /configuration/contact/accept`: 초대 수락
- `GET /configuration/contact/group`: 연락처 그룹 조회
- `POST /configuration/contact/group`: 그룹 생성/수정/삭제
- `GET /configuration/contact/group/user`: 그룹별 사용자 조회
- `POST /configuration/contact/group/user`: 그룹 사용자 추가/삭제
- `GET /configuration/contact/inviteeId`: 초대 대상 사용자 조회

기능:

- 연락처 초대
- 초대 상태 관리
- 연락처 삭제
- 연락처 그룹 트리 관리
- 그룹에 연락처 배치
- 초대 수락 시 수신 메시지 상태 갱신

### 4.4 Monitor

관련 파일:

- `WEB-INF/views/front/main/monitor.jsp`
- `resources/views/front/main/monitor.js`
- `MonitorController`

라우트/API:

- `GET /monitor/view`: 화면
- `GET /monitor/device-group`: 장비 그룹 트리
- `GET /monitor/device-detail`: 장비 상세
- `GET /monitor/device-splice`: 선택 장비들의 splice data
- `GET /monitor/device/record`: 장비 record
- `GET /monitor/device-status`: 장비 상태와 위치
- `GET /monitor/device-status-count`: 온라인/오프라인 등 상태 카운트
- `GET /monitor/device-splice-fiber`: 다심 fiber 상세
- `GET /monitor/excel`: splice data Excel export
- `POST /monitor/job-order-location`: 작업 위치 업데이트
- `POST /monitor/delete/splice`: splice record 삭제
- `POST /monitor/update/spliceFiber`: fiber 값 수정
- `GET /monitor/otdr/gdm/value`: GDM 값 조회

기능:

- 장비 그룹 트리
- 온라인/오프라인/전체 장비 상태 탭
- 지도 기반 장비 위치 표시
- 선택 장비의 splice 기록 목록
- splice 세부 데이터/다심 fiber 데이터 조회
- 작업 위치를 지도상 위치와 연결
- splice 기록 삭제 및 fiber 데이터 수정
- Excel export

### 4.5 Record

관련 파일:

- `WEB-INF/views/front/main/record.jsp`
- `resources/views/front/main/record.js`
- `MonitorController`

라우트/API:

- `GET /record/view`: 화면
- 주로 `/monitor/*`, `/device/group`, `/device/user`, `/job-order` API를 재사용

기능:

- Monitor와 유사하게 장비 그룹/상태별 트리를 제공
- 장비별 기록을 grid로 조회
- 기록 상세, 사용자, 다심 fiber 데이터를 표시
- 지도 위치와 Job Order 위치 매핑 기능 존재

현재 메뉴에서는 `record` 메뉴가 주석 처리되어 있어 기본 노출은 되지 않는 것으로 보인다.

### 4.6 To-do / Job To-do

관련 파일:

- `WEB-INF/views/front/main/to-do.jsp`
- `WEB-INF/views/front/main/job-to-do.jsp`
- `resources/views/front/main/to-do.js`
- `resources/views/front/main/job-to-do.js`
- `ToDoController`

라우트/API:

- `GET /to-do/view`: 기존 To-do 화면
- `GET /job-to-do/view`: 현재 메뉴에 연결된 To-do 화면
- `GET /to-do`: 할 일/작업 조회
- `POST /to-do/complete-manually`: 수동 완료 처리
- `GET /job-order/record`: 작업 관련 기록 조회
- `GET /recent_map_location/list`: 최근 지도 위치
- `POST /recent_map_location/move`: 지도 이동 위치 저장

기능:

- Job Order를 날짜/작업 단위 트리로 표시
- 작업 상세 grid
- 작업 관련 splice record grid
- 선택 작업 위치를 지도에 표시
- 작업을 수동 완료 처리

### 4.7 Job Order

관련 파일:

- `WEB-INF/views/front/main/job_order.jsp`
- `resources/views/front/main/job_order.js`
- `JobOrderController`

라우트/API:

- `GET /job-order/view`, `GET /job-order/view2`: 화면
- `GET /job-order`: 내 Job Order 목록
- `POST /job-order-list`: Job Order와 관련 splice record 동시 조회
- `POST /job-order`: 작업 생성/수정/삭제
- `GET /job-order/record`: 작업 기록 조회
- `GET /job-order/send`: 작업 전송 대상 연락처 조회
- `POST /job-order/send`: 작업 전송
- `GET /job-order/is-owner`: 장비 소유자 여부 확인
- `GET /job-order/excel`: 작업 기록 Excel export

기능:

- 작업 생성, 수정, 삭제
- due date, 이름, 설명, 위치, 상태 관리
- 연락처/그룹에 작업 전송
- 작업과 splice record 연결
- Excel export

현재 일반 메뉴에서는 Job Order 단독 메뉴가 주석 처리되어 있고, To-do 중심으로 노출된다.

### 4.8 Fiber

관련 파일:

- `WEB-INF/views/front/main/fiber.jsp`
- `resources/views/front/main/fiber.js`
- `FiberController`

라우트/API:

- `GET /fiber/view`: 화면
- `POST /fiber/insert`: 지도 shape 생성
- `POST /fiber/select`: 선택 지도 shape 조회
- `GET /fiber/selectAll`: 내 지도와 공유 지도 전체 조회
- `POST /fiber/update`: shape 수정 및 이력 저장
- `POST /fiber/delete`: shape 삭제
- `GET /fiber/selectUser`: 공유 가능 사용자 조회
- `POST /fiber/insert/ShareMap`: 지도 공유 추가/변경
- `GET /fiber/selectHistory`: 지도 변경 이력 조회
- `GET /fiber/selectShareUser`: 지도 공유 사용자 조회
- `POST /fiber/group`: fiber 그룹 생성
- `POST /fiber/group/map`: fiber-group 매핑 생성/수정/삭제
- `POST /fiber/group/rename`: 그룹 이름 변경
- `POST /fiber/delete/group`: 그룹 삭제
- `POST /fiber/map/rename`: 지도 이름 변경
- `POST /fiber/map/copy`: 지도 복사
- `POST /fiber/insert/icon`: 커스텀 마커 아이콘 업로드
- `GET /fiber/select/icon`: 커스텀 마커 아이콘 조회

기능:

- 지도 위에 선/도형/마커 등을 생성
- Fiber map 저장, 수정, 삭제
- Fiber 그룹 트리 관리
- 공유 사용자 설정
- 변경 이력 조회
- 지도 복사/이름 변경
- 커스텀 아이콘 등록

Jonard Cloud 구현 메모:

- 지도 편집 도구는 별도 큰 기능이다. drawing library, 좌표 모델, 공유 권한을 먼저 결정해야 한다.

### 4.9 Overview

관련 파일:

- `WEB-INF/views/front/main/overview.jsp`
- `resources/views/front/main/overview.js`
- `OverviewController`

라우트/API:

- `GET /overview/view`: 화면
- `GET /overview/device-group`: 장비 그룹
- `GET /overview/device-status-count`: 장비 상태 카운트
- `GET /overview/total-splice`: 전체 splice 통계
- `GET /overview/device-splice`: 장비별 splice 통계
- `GET /overview/device-splice-total`: splice 총계
- `GET /overview/device-user-total`: 사용자별 통계
- `GET /overview/device-splice-detail`: 장비 splice 상세
- `GET /overview/device-splice-record`: splice record 목록
- `GET /overview/device-splice-fiber`: fiber 상세
- `POST /overview/export-pdf`: PDF 리포트 생성
- `GET /overview/filedownload`: 생성 PDF 다운로드
- `GET /device/splice/image`: splice 이미지 조회

기능:

- 장비 그룹 기준 통계
- 기간별/장비별 splice 통계
- 전체/장비/사용자별 집계
- splice record drill-down
- 다심 fiber 상세 표시
- PDF 리포트 생성 옵션 제공
- splice 이미지 팝업

### 4.10 File

관련 파일:

- `WEB-INF/views/front/main/file.jsp`
- `resources/views/front/main/file.js`
- `DeviceFileController`
- 팝업: `sor.jsp/js`, `sola.jsp/js`, `gdm.jsp/js`, `send_message.jsp/js`

라우트/API:

- `GET /device/file/view`: 화면
- `GET /device/file/list`: 장비별 파일 목록
- `GET /device/group`: 장비 그룹 트리
- `GET /monitor/otdr/gdm/value`: GDM 파일 값 조회

기능:

- 장비 그룹 트리에서 장비 선택
- 날짜 범위로 파일 조회
- 파일 타입 표시: image, PDF, SOR, SOLA, GDM 등
- SOR 파일은 전용 viewer 팝업으로 trace/chart/event grid 표시
- SOLA 파일은 전용 parser/viewer 팝업 사용
- GDM 파일은 서버에서 값을 읽어 팝업 표시
- PDF는 새 창으로 열기
- 이미지 파일은 이미지 팝업으로 표시

### 4.11 Remote

관련 파일:

- `WEB-INF/views/front/main/remote.jsp`
- `resources/views/front/main/remote.js`
- `DeviceRemoteController`

라우트/API:

- `GET /device/remote/view`: 화면

기능:

- 컨트롤러상 화면만 존재한다.
- 현재 일반 메뉴에서는 remote 메뉴가 주석 처리되어 있다.
- JS도 초기화 구조만 있고 실제 API 호출은 제한적이다.

### 4.12 Job History

관련 파일:

- `WEB-INF/views/front/history/job-history.jsp`
- `resources/views/front/history/job-history.js`
- `HistoryController`
- `JobHistoryController`

라우트/API:

- `GET /history/job/view`, `GET /job-history`: 화면
- `GET /history/job`: 작업 이력 조회
- `GET /history/job/excel`: 작업 이력 Excel export

기능:

- 기간/조건별 작업 이력 목록 조회
- Excel 다운로드
- 일반 사용자 기준으로 본인 작업 이력만 조회

## 5. 관리자 콘솔

관리자 메인 메뉴:

- Dashboard
- Device
- User
- Country
- Customer
- History > Job History, Operation History
- Admin
- Basic Management > Consent, Notice, Help, Product Management
- Help
- My Profile
- Logout

지사 관리자 메뉴:

- Device
- Customer
- History
- Help
- My Profile
- Logout

### 5.1 Admin Dashboard

관련 파일:

- `WEB-INF/views/admin/main/dashboard.jsp`
- `resources/views/admin/main/dashboard.js`
- `AdminDashboardController`

라우트/API:

- `GET /admin/dashboard/view`: 화면
- `GET /admin/dashboard/device`: 최근 장비 목록
- `GET /admin/dashboard/device/chart`: 장비 등록 차트
- `GET /admin/dashboard/user`: 최근 사용자 목록
- `GET /admin/dashboard/user/chart`: 사용자 등록 차트

기능:

- 최근 등록 장비/사용자 조회
- 장비/사용자 차트 데이터 조회
- 관리자용 운영 현황 요약

### 5.2 Admin Device

관련 파일:

- `WEB-INF/views/admin/main/device.jsp`
- `resources/views/admin/main/device.js`
- `WEB-INF/views/admin/configuration/admin-device.jsp`
- `resources/views/admin/configuration/admin-device.js`
- `WEB-INF/views/admin/configuration/branch-device.jsp`
- `resources/views/admin/configuration/branch-device.js`
- `AdminDeviceController`

라우트/API:

- `GET /admin/device/view`: 관리자 장비 화면
- `GET /admin/admin-device-popup/view`: Admin 장비 추가/수정 팝업
- `GET /admin/branch-device-popup/view`: Branch 장비 팝업
- `GET /admin/device`: 장비 상세
- `GET /admin/device/all`: 전체 장비
- `GET /admin/device/group`: 장비 그룹
- `GET /admin/device/list`: 장비 목록
- `GET /admin/device/location`: 장비 위치
- `GET /admin/device/list/excel`, `GET /admin/device/excel`: Excel export
- `POST /admin/device/import`: Excel import
- `POST /admin/device/add`: 장비 등록
- `POST /admin/device/modify`: 장비 수정
- `POST /admin/device/delete`: 장비 삭제
- `POST /admin/device/stolen/status`: 장비 분실/도난 상태 변경
- `GET /admin/storage/user/list`: 입고 가능 사용자 목록
- `GET /admin/device/param/refresh`: 장비 파라미터 갱신 명령
- `GET /admin/device/params/*`: 장비 파라미터 종류별 조회
- `DELETE /admin/device/splice/delete`: 장비 splice 데이터 삭제

기능:

- 장비 목록 검색/필터/정렬/페이징
- 국가/지역/고객/모델/상태 기준 검색
- 장비 Excel import/export
- 장비 등록, 수정, 삭제
- 지사 권한일 경우 담당 region 기반 필터
- 장비 분실/도난 상태 및 오프라인 허용 기간 변경
- MQTT 명령 전송
- 생산/입고 사용자 연동
- 장비별 파라미터 조회/갱신

### 5.3 Admin User

관련 파일:

- `WEB-INF/views/admin/main/user.jsp`
- `resources/views/admin/main/user.js`
- `WEB-INF/views/admin/configuration/admin-user.jsp`
- `resources/views/admin/configuration/admin-user.js`
- `AdminUserController`

라우트/API:

- `GET /admin/user/view`: 일반 사용자 관리 화면
- `GET /admin/admin-user/view`: 관리자 계정 관리 화면
- `GET /admin/user/list`: 일반 사용자 목록
- `GET /admin/user/device`: 사용자 사용 장비 목록
- `GET /admin/adminuser/list`: 관리자 계정 목록
- `GET /admin/user/checkId`: 계정 중복 확인
- `POST /admin/adminuser`: 관리자 계정 생성/수정/삭제
- `GET /admin/user/list/excel`: 사용자 목록 Excel
- `GET /admin/user/password/reset`: 사용자 비밀번호 초기화
- `POST /admin/user/lock`: 사용자 잠금/해제

기능:

- 사용자 목록 조회
- 사용자별 장비 목록 팝업
- 사용자 잠금/해제
- 비밀번호 초기화
- 관리자/지사 관리자 계정 생성, 수정, 삭제
- root 계정 삭제/수정 제한
- 본인 계정 삭제 제한
- Excel export

### 5.4 Country / Region

관련 파일:

- `WEB-INF/views/admin/main/country.jsp`
- `resources/views/admin/main/country.js`
- `CountryController`

라우트/API:

- `GET /admin/country/view`: 화면
- `GET /admin/country-popup/view`: 설정 팝업
- `GET /country`: 국가 목록
- `GET /region`: region 목록
- `POST /region`: region 생성/수정/삭제
- `POST /update/country`: 국가의 region 변경

기능:

- 국가 목록 조회
- region 생성/수정/삭제
- 국가를 특정 region에 배정
- Branch 계정은 자기 region으로 조회가 제한된다.
- region 변경은 Admin 권한만 허용된다.

### 5.5 Customer

관련 파일:

- `WEB-INF/views/admin/main/customer.jsp`
- `resources/views/admin/main/customer.js`
- `WEB-INF/views/admin/configuration/customer.jsp`
- `resources/views/admin/configuration/customer.js`
- `AdminCustomerController`

라우트/API:

- `GET /admin/customer/view`: 화면
- `GET /admin/customer-popup/view`: 고객 설정 팝업
- `GET /admin/customer`: 고객 목록
- `POST /admin/customer`: 고객 생성/수정/삭제
- `GET /admin/customer/list/excel`: 고객 목록 Excel

기능:

- region/country/customer 조건 검색
- 고객 담당자, 전화번호, 주소 관리
- 고객 생성/수정/삭제
- Branch 계정은 자기 region 기반 필터
- Excel export

### 5.6 History

관련 파일:

- `WEB-INF/views/admin/history/job-history.jsp`
- `resources/views/admin/history/job-history.js`
- `WEB-INF/views/admin/history/operation-history.jsp`
- `resources/views/admin/history/operation-history.js`
- `AdminHistoryController`

라우트/API:

- `GET /admin/history/job/view`: Job History 화면
- `GET /admin/history/operation/view`: Operation History 화면
- `GET /admin/history/job`: 작업 이력 조회
- `GET /admin/history/operation`: 운영 이력 조회
- `GET /admin/history/job/excel`: 작업 이력 Excel
- `GET /admin/history/operation/excel`: 운영 이력 Excel

기능:

- 기간 조건 검색
- 작업명/상태/담당자/위치 등 검색
- 운영 명령, 파라미터, 결과, 실패 사유, 이벤트 시각 조회
- Excel export

### 5.7 Statistics

관련 파일:

- `WEB-INF/views/admin/statistics/*.jsp`
- `resources/views/admin/statistics/*.js`
- `AdminStatisticsController`

라우트/API:

- `GET /admin/statistics/resource/view`: 리소스 통계
- `GET /admin/statistics/resource/cpu/view`: CPU 통계
- `GET /admin/statistics/resource/memory/view`: Memory 통계
- `GET /admin/statistics/device/view`: 장비 통계
- `GET /admin/statistics/user/view`: 사용자 통계
- `GET /admin/statistics/device-registered/view`: 등록 장비 통계
- `GET /admin/statistics/device-splice/view`: splice 통계
- `GET /admin/statistics/device-country/view`: 국가별 장비 통계
- `GET /admin/statistics/resource`: 리소스 데이터
- `GET /admin/statistics/device-country`: 국가별 장비 데이터
- `GET /admin/statistics/device-splice`: 기간별 splice 데이터
- `GET /admin/statistics/device-registered`: 기간별 등록 장비 데이터
- `GET /admin/statistics/device-unit`: 장비 수량 통계
- `GET /admin/statistics/device-price`: 장비 금액 통계
- `GET /admin/statistics/user`: 사용자 통계
- `GET /admin/statistics/splice`: 사용자 splice 통계

기능:

- 기간별/국가별/모델별 통계
- resource, CPU, memory 통계 화면
- 장비 등록/판매/가격/수량 통계
- 사용자 및 splice 사용량 통계

현재 관리자 메인 메뉴에서는 Statistics 상위 메뉴가 직접 노출되어 있지 않거나 일부가 숨겨진 것으로 보인다.

### 5.8 Admin Account Management

관련 파일:

- `WEB-INF/views/admin/configuration/admin-user.jsp`
- `resources/views/admin/configuration/admin-user.js`
- `AdminUserController`

기능:

- 관리자/지사 계정 목록
- 계정 추가/수정/삭제
- 권한 및 region 지정
- ID 중복 확인
- root/본인 계정 보호 로직

### 5.9 Consent Management

관련 파일:

- `WEB-INF/views/admin/configuration/consent.jsp`
- `resources/views/admin/configuration/consent.js`
- `AdminConsentController`

라우트/API:

- `GET /admin/consent/view`: 화면
- `GET /admin/consent`: 개인정보 동의서 조회
- `POST /admin/consent/save`: 동의서 저장

기능:

- 회원가입에서 보여줄 Privacy Policy/Consent HTML 관리
- TinyMCE 기반 편집

### 5.10 Notice Management

관련 파일:

- `WEB-INF/views/admin/configuration/notice.jsp`
- `resources/views/admin/configuration/notice.js`
- `NoticeController`

기능:

- 공지 목록 조회
- 공지 HTML 작성/수정/삭제
- 메인 첫 화면 공지와 연결

### 5.11 Help Management

관련 파일:

- `WEB-INF/views/admin/configuration/help.jsp`
- `resources/views/admin/configuration/help.js`
- `HelpController`

기능:

- 도움말 트리 관리
- 도움말 콘텐츠 작성/수정/삭제
- 일반 도움말 화면과 연결

### 5.12 Product Management / Device Properties

관련 파일:

- `WEB-INF/views/admin/main/device-properties.jsp`
- `resources/views/admin/main/device-properties.js`
- `AdminDeviceController`

라우트/API:

- `GET /admin/device-properties/view`: 화면
- `GET /admin/device-properties/list`: 제품/모델 속성 목록
- `POST /admin/device-properties/update`: 제품 속성 수정
- `POST /admin/device-properties/delete`: 제품 속성 삭제

기능:

- 모델 코드, 펌웨어 버전, arc threshold, maintenance threshold 등 관리
- 제품 속성 수정/삭제

### 5.13 Parameter Management

관련 파일:

- `WEB-INF/views/admin/parameter/parameter.jsp`
- `resources/views/admin/parameter/parameter.js`
- `AdminDeviceController`

라우트/API:

- `GET /admin/parameter/device/view`: 화면
- `GET /admin/device/params/machine`
- `GET /admin/device/params/factory`
- `GET /admin/device/params/motor`
- `GET /admin/device/params/splice/temp`
- `GET /admin/device/params/splice/mode`
- `GET /admin/device/params/heat/temp`
- `GET /admin/device/params/heat/mode`
- `GET /admin/device/param/refresh`

기능:

- 장비 serial number 기준 파라미터 조회
- machine/factory/motor/splice/heat 계열 파라미터 확인
- 장비에 파라미터 refresh 명령 전송

## 6. 팝업/보조 화면

### 6.1 Device Popup

관련 파일:

- `WEB-INF/views/front/popup/device_popup.jsp`
- `resources/views/front/popup/device_popup.js`

기능:

- 장비 선택 또는 장비 상세 표시용 공통 팝업으로 보인다.
- 여러 화면에서 장비 선택이 필요한 곳에서 재사용 가능성이 있다.

### 6.2 Send Message Popup

관련 파일:

- `WEB-INF/views/front/popup/send_message.jsp`
- `resources/views/front/popup/send_message.js`
- `DeviceMessageController`

기능:

- 선택 장비로 유지보수/안내 메시지 전송
- `/device/message/send` 호출
- MQTT 명령으로 장비에 메시지 전달

### 6.3 SOR Viewer

관련 파일:

- `WEB-INF/views/front/popup/sor.jsp`
- `resources/views/front/popup/sor.js`

기능:

- SOR 파일을 AJAX로 읽고 parsing
- trace chart 표시
- event grid 표시
- OTDR 관련 파라미터 표시

### 6.4 SOLA Viewer

관련 파일:

- `WEB-INF/views/front/popup/sola.jsp`
- `resources/views/front/popup/sola.js`

기능:

- SOLA 파일 로드
- 전용 parser/viewer로 결과 표시

### 6.5 GDM Viewer

관련 파일:

- `WEB-INF/views/front/popup/gdm.jsp`
- `resources/views/front/popup/gdm.js`

기능:

- GDM 파일 값 조회
- `/monitor/otdr/gdm/value`로 서버에서 parsed value 조회
- popup grid/상세로 표시

## 7. 핵심 도메인 정리

### Device

- 식별자: `deviceId`, `serialNumber`, `imei`
- 모델/펌웨어/배터리/위치/상태/잠금/분실 여부/오프라인 허용 기간
- 사용자 권한: owner, observer 등 userType 기반
- 그룹: 장비 그룹 트리와 매핑
- 파라미터: machine, factory, motor, splice temp/mode, heat temp/mode, time lock 등
- 외부 연동: MQTT/AMQP, Redis 상태 캐시

### User / Contact

- 사용자 ID는 이메일 형태
- roleCode/roleName으로 관리자/지사/일반 사용자 분기
- 연락처 초대, 수락, 삭제
- 연락처 그룹과 그룹별 사용자 매핑
- 초대/작업/메시지는 수신 메시지와 연결

### Job Order

- 작업 이름, 설명, due date, 위치, 상태
- 연락처에게 작업 전송
- splice record와 연결
- To-do와 History에서 재사용

### Splice / Fiber / File

- 장비에서 올라오는 splice record가 Monitor, Record, Overview, Job Order, File에 걸쳐 사용된다.
- 다심 fiber 데이터는 별도 상세 grid로 조회한다.
- 이미지/SOR/SOLA/GDM/PDF 파일 뷰어가 존재한다.

### Admin

- 장비 생산/입고/고객/국가/region/제품 속성/관리자 계정/공지/도움말/동의서 관리
- 운영 이력은 대부분 CRUD성 기능의 감사 로그로 저장된다.

## 8. Jonard Cloud 단계별 구현 제안

### Phase 1. 인증과 레이아웃

- 로그인/로그아웃
- 권한별 메뉴
- 공통 AppShell
- Notice/Help 읽기 전용
- `/health`, `/api/meta` 이후 실제 auth API 설계

### Phase 2. Device 최소 기능

- 장비 목록
- 장비 상세
- 장비 그룹 트리
- 장비 사용자 권한 조회
- 장비 Excel import/export는 후순위

### Phase 3. Contact + Job

- 연락처 목록/초대/수락
- 연락처 그룹
- Job Order 생성/전송/To-do

### Phase 4. Monitor/Overview

- 장비 상태 카운트
- 지도 위치
- splice record 목록
- overview 통계

### Phase 5. Fiber/File/OTDR

- Fiber map 편집
- 파일 목록
- 이미지/PDF viewer
- SOR/SOLA/GDM parser/viewer

### Phase 6. Admin

- 관리자 장비/사용자/고객/국가/region
- 제품 속성/파라미터
- 공지/도움말/동의서 관리
- 운영 이력/통계

## 9. 구현 시 주의점

- 기존 화면은 jqxGrid/jqxTree/jqxForm에 강하게 의존한다. React에서는 table/tree/form 컴포넌트를 새로 설계해야 한다.
- 많은 API가 `ResponseVo` 형식으로 `{ result, message, data, totalCount }`를 반환한다. Jonard Cloud에서도 공통 응답 규격을 먼저 정해야 한다.
- 장비 설정 변경은 DB 저장 + MQTT 명령 + Redis 캐시 갱신이 섞여 있다. 단순 CRUD로 보면 안 된다.
- 관리자와 일반 사용자 API가 경로만 다르고 비슷한 기능이 많다. 새 구현에서는 권한 정책을 API 내부에서 일관되게 처리하는 편이 좋다.
- 지도, OTDR 파일 뷰어, PDF 생성은 난도가 높은 독립 모듈이다. 초기 MVP에서 제외하거나 별도 milestone로 분리하는 것이 안전하다.

## 10. UI/UX 상세 분석

### 10.1 전체 UI 성격

기존 시스템은 시각적으로 “운영 도구”에 가깝다. 화면은 넓은 데스크톱 기준으로 설계되어 있고, 대부분의 페이지가 다음 패턴을 공유한다.

- 상단 고정 메뉴
- 중앙 content 영역 Ajax 교체
- 좌측 트리 또는 검색 영역
- 우측/중앙 jqxGrid 목록
- 하단 또는 우측 상세 grid
- jqxWindow 팝업 기반 추가/수정/상세/설정
- 작은 icon button 또는 input button 중심
- 검색 조건, 필터, Excel export를 거의 모든 목록 화면에 제공

반응형 처리는 일부 메뉴와 좌측 패널에서만 제한적으로 있다. 모바일 친화적인 화면이라기보다 최소 1300px 이상 데스크톱 콘솔을 전제로 한다.

Jonard Cloud에서는 같은 정보 밀도는 유지하되, 다음처럼 현대화하는 것이 적합하다.

- 상단 메뉴 또는 좌측 사이드바 중 하나로 통일
- 페이지별 toolbar + data table + split panel 패턴 사용
- jqxWindow 팝업은 modal/drawer로 재해석
- grid filter/list box는 table column menu로 통합
- 지도/통계/파일 뷰어는 별도 workspace형 레이아웃으로 분리

### 10.2 공통 상호작용 패턴

#### 메뉴 이동

현재 구조:

1. 사용자가 상단 메뉴를 클릭한다.
2. 메뉴의 `data-value`에 담긴 URL을 읽는다.
3. `goAjaxLoad('.content', menuUrl)`로 JSP fragment를 중앙에 로드한다.
4. 해당 JSP가 자기 JS 파일을 include하고, JS의 `$(function(){ ... })` 초기화가 실행된다.
5. 페이지 JS가 splitter, panel, grid, tree, window를 초기화한다.
6. 초기 데이터 API를 호출해 grid/tree/chart/map을 채운다.

중요한 점:

- 브라우저 URL이 페이지별로 바뀌지 않는다.
- 뒤로가기/새로고침 UX가 약하다.
- 화면 초기화/해제가 명확하지 않아, 이전 화면의 DOM 또는 이벤트가 남을 수 있는 구조다.

Jonard Cloud 대응:

- React Router로 실제 URL을 부여한다.
- 메뉴 상태는 route 기준으로 활성화한다.
- 각 페이지 컴포넌트 mount/unmount에서 query cleanup을 보장한다.

#### Grid 조회

대부분의 목록 화면은 동일한 흐름이다.

1. 검색 input, combo, date input 값을 읽는다.
2. grid를 첫 페이지로 보낸다: `jqxGrid('gotopage', 0)`
3. `getPagingDataAdapter(param, url, 'data')`를 grid source로 지정한다.
4. 서버는 `{ data, totalCount, result, message }` 형태로 응답한다.
5. 정렬 이벤트가 발생하면 `updatebounddata('sort')`로 서버 재조회한다.
6. filter 버튼은 grid column filter 또는 별도 listBox를 노출한다.

Jonard Cloud 대응:

- 공통 `DataTable` 컴포넌트 필요
- 서버 페이지네이션, 정렬, 필터 공통 query model 필요
- `ResponseVo` 호환 레이어 또는 새 응답 스키마 변환 필요

#### Tree + Grid 연동

Device, Monitor, Record, File, Fiber에서 반복되는 핵심 패턴이다.

1. 좌측 tree를 API로 로드한다.
2. folder/group node와 leaf/device/map node가 섞여 있다.
3. 사용자가 tree node를 체크하거나 선택한다.
4. 선택된 leaf id 목록을 만든다.
5. 이 id 목록을 grid 조회 파라미터로 넘긴다.
6. grid가 비어 있으면 상세 grid, 사용자 grid, 지도 marker도 clear한다.

Jonard Cloud 대응:

- `TreeFilterPanel` 같은 공통 컴포넌트화 가능
- checked node state와 table query state를 분리 관리
- 전체/온라인/오프라인 트리처럼 동일 데이터의 파생 tree를 다루는 화면은 tab state도 필요

#### 팝업/모달

기존 팝업은 대부분 `jqxWindow`다.

- Add/Modify form
- Security/Setting form
- 그룹 생성/수정
- 지도 위치 매핑
- 이미지/파일 viewer
- 상세 grid 팝업
- Excel import 결과 팝업

Jonard Cloud 대응:

- 단순 입력: modal
- 큰 설정 화면: side drawer 또는 full modal
- 지도/파일 viewer: dedicated overlay/workspace
- 성공 후 동작은 `modal close -> parent query invalidate -> grid refresh`

## 11. 일반 사용자 페이지 UI/상호작용 상세

### 11.1 Dashboard

UI:

- 상단 메뉴에서 Dashboard 클릭 시 `.content`에 dashboard fragment가 로드된다.
- 대시보드 내부는 여러 grid/summary 영역으로 구성된다.
- 내 장비, 작업, 수신 메시지를 각각 목록 형태로 보여주는 운영 홈 성격이다.

상호작용:

- 화면 로드 시 `/dashboard/device`, `/dashboard/job`, `/dashboard/received`를 호출한다.
- 각 grid는 paging adapter를 사용한다.
- Dashboard에서 특정 장비/작업/메시지를 클릭하면 관련 상세 화면으로 직접 route 이동하기보다는, 현재 코드상 grid 중심 조회만 수행하는 구조로 보인다.

Jonard Cloud 상세 구현 아이디어:

- “My Devices”, “Assigned Jobs”, “Inbox” 3개 패널
- 각 패널 행 클릭 시 Device detail, To-do detail, Message detail로 이동
- 새 메시지/초대 수신 상태를 badge로 표시

### 11.2 Device

UI 구조:

- 전체 화면은 좌우 splitter다.
- 좌측: `Device Group` panel, 장비 그룹 tree, Add/Modify/Delete 버튼
- 중앙/우측 상단: `Device List` panel
- 중앙/우측 하단: `Authority` panel, 선택 장비의 사용자 권한 grid
- Device List toolbar:
  - 검색 input
  - Search
  - Add
  - Modify
  - Security
  - Setting
  - Delete
  - Import
  - Export
  - list icon
  - filter icon
- 별도 팝업:
  - 그룹 생성/수정 팝업
  - Security 팝업
  - Time Lock 추가 팝업
  - Setting/Parameter 팝업
  - Send Message 팝업

주요 사용자 흐름:

1. 화면 진입
   - `/device/group`으로 장비 그룹 tree를 로드한다.
   - `/device/list`로 장비 목록 grid를 로드한다.

2. 그룹 tree 체크
   - 체크된 장비 또는 그룹 기준으로 device id/group 조건을 만든다.
   - `/device/list`를 다시 호출한다.
   - 장비 목록이 갱신되고 권한 grid는 clear된다.

3. 장비 row 선택
   - 선택 장비 배열을 갱신한다.
   - `/device/user`를 호출해 해당 장비의 사용자/권한 목록을 하단 grid에 표시한다.
   - 여러 장비 선택 시 일괄 수정/보안 설정 대상이 된다.

4. Add/Modify
   - Add는 새 장비 연결/등록 흐름으로 이어진다.
   - Modify는 선택한 장비 상세를 `/device`로 조회 후 form에 채운다.
   - 저장 시 `POST /device` 또는 `POST /device/multiple` 호출 후 목록 reload.

5. Security
   - 선택 장비가 1개면 `/device/security?deviceId=...` 조회 후 보안 form 오픈.
   - 여러 장비면 공통 보안 설정 form으로 오픈.
   - Time Lock grid에서 stage를 추가/삭제한다.
   - 저장 시 `POST /device/security` 또는 `/device/security/multiple`.
   - 서버에서는 DB 저장 후 MQTT 명령과 Redis cache 갱신을 수행한다.

6. Setting
   - `/device/setting` 또는 `/device/params` 계열 데이터를 읽어 설정 팝업을 구성한다.
   - 저장 시 `/device/setting`, `/device/params` 또는 multiple endpoint 호출.

7. Import/Export
   - Import 버튼은 숨겨진 file input을 클릭하게 한다.
   - 파일 선택 후 `POST /device/import`.
   - Export는 현재 grid 데이터를 JSON으로 정리해 `/device/excel`로 전송한다.

8. Lock/Unlock
   - grid 내부 lock icon 클릭.
   - `POST /device/lock` 호출.
   - 성공 시 해당 row의 lock cell만 즉시 갱신한다.

UI 관찰:

- 이 페이지는 단일 화면에 기능이 매우 많이 몰려 있다.
- Security와 Setting은 별도 페이지로 분리해도 될 정도로 복잡하다.
- Group 관리와 Device 관리가 한 화면에 섞여 있어 초보 사용자는 작업 경로를 헷갈릴 수 있다.

Jonard Cloud 권장 UI:

- `/devices`: 장비 목록 + 그룹 필터
- `/devices/:id`: 장비 상세 탭
- 상세 탭: Overview, Users, Security, Settings, Parameters, Files, Logs
- 일괄 작업은 table selection toolbar로 제공

### 11.3 Contact

UI 구조:

- 상단: 전체 연락처 grid
- 중간: 아래/위 화살표 버튼
- 하단: 좌측 연락처 그룹 tree, 우측 그룹 사용자 grid
- Invite popup
- Group add/modify popup
- Tree context menu

주요 사용자 흐름:

1. 화면 진입
   - `/configuration/contact`로 전체 연락처 조회
   - `/configuration/contact/group`으로 그룹 tree 조회

2. 연락처 검색
   - 검색 input 값으로 연락처 grid source를 `/configuration/contact`에 재지정

3. 연락처 초대
   - Invite 버튼 클릭
   - invite form 팝업 오픈
   - 이메일/사용자 ID 입력 후 `/configuration/contact/inviteeId`로 존재 여부 확인
   - `POST /configuration/contact` with requestType `I`
   - 성공 시 팝업 닫고 연락처 목록 reload

4. 연락처 삭제
   - grid에서 연락처 선택
   - `POST /configuration/contact` with requestType `D`
   - 성공 시 연락처 목록 및 그룹 사용자 목록 갱신

5. 그룹에 연락처 추가
   - 연락처 grid에서 사용자 선택
   - 그룹 tree에서 대상 그룹 선택
   - 아래 화살표 버튼 클릭
   - `POST /configuration/contact/group/user` with requestType `I`
   - 우측 그룹 사용자 grid refresh

6. 그룹에서 사용자 제거
   - 그룹 사용자 grid에서 사용자 선택
   - 위 화살표 버튼 클릭
   - `POST /configuration/contact/group/user` with requestType `D`

7. 그룹 생성/수정/삭제
   - 버튼 또는 tree context menu 사용
   - `POST /configuration/contact/group`
   - 삭제 후 사용자 grid clear

Jonard Cloud 권장 UI:

- 좌측 group tree + 우측 contact table로 단순화
- 초대는 “Invite Contact” modal
- 그룹 배치는 drag/drop 또는 multi-select action으로 제공
- 초대 상태는 badge로 표시: invited, accepted 등

### 11.4 Monitor

UI 구조:

- 좌측 splitter:
  - 장비 검색
  - 상태 tab: All / Online / Offline
  - 각 tab 안에 장비 tree
- 중앙 상단:
  - Map panel
  - 기간 quick filter: one day / three day / a week
  - start/end date
  - M 버튼
  - 검색 icon 버튼
  - refresh icon 버튼
  - Google Map 영역
- 중앙 하단:
  - tab: Splice Data / Details / Authority
  - Splice Data tab 안에 filter icon, export icon
  - splice grid
  - 선택 장비 detail grid
  - 사용자 권한 grid
- 팝업:
  - 그룹 생성/수정
  - Map to Job Location
  - Splice image
  - SOR/SOLA/GDM viewer
  - Send Message

주요 사용자 흐름:

1. 화면 진입
   - `/monitor/device-group`으로 tree 구성
   - `/monitor/device-status-count`로 상태 count 조회
   - 최근 지도 위치 `/recent_map_location/list` 조회
   - 지도 초기화

2. 장비 tree check
   - 선택 장비 id 목록 생성
   - `/monitor/device-status` 호출
   - 응답 데이터로 지도 marker/polyline을 갱신
   - `/monitor/device-splice` 호출로 splice grid 갱신
   - 선택 장비가 없으면 grid와 detail clear

3. 날짜/기간 변경
   - one day/three day/week 라디오 클릭 시 날짜 범위가 바뀐다.
   - 검색 버튼 클릭 시 선택 장비 + 날짜 조건으로 상태/기록 재조회

4. 지도 이동
   - 사용자가 지도 중심/zoom을 이동하면 `/recent_map_location/move`에 저장한다.
   - 다음 진입 시 같은 mapType으로 마지막 위치를 복원한다.

5. splice row 선택
   - rowselect 시 Details tab grid가 `/monitor/device-splice-fiber`로 갱신된다.
   - Authority tab은 `/device/user`로 해당 장비 사용자 권한을 표시한다.

6. splice note 수정
   - grid cell edit 후 `POST /device/splice/note/update`.
   - 실패하면 이전 값으로 rollback한다.

7. 파일 버튼
   - splice row의 파일 타입에 따라 viewer 선택
   - SOR: SOR popup
   - SOLA: SOLA popup
   - GDM: GDM popup
   - PDF: 새 창
   - Image: splice image popup

8. Map to Job Location
   - 특정 기록/위치에서 작업 위치 매핑 팝업 오픈
   - 좌측 job tree는 `/job-order`
   - 우측 map에서 위치 선택
   - 저장 시 `POST /monitor/job-order-location`

Jonard Cloud 권장 UI:

- 좌측 DeviceFilterPanel, 중앙 Map, 하단 RecordDrawer/Table
- 기록 row 클릭 시 우측 detail drawer
- 파일 viewer는 route 또는 modal viewer로 통합
- note inline edit은 optimistic update + toast error rollback

### 11.5 To-do / Job To-do

UI 구조:

- 좌측 Job tree
- 중앙/우측 지도
- 하단 또는 우측 detail grid
- 작업 record grid

상호작용:

1. `/to-do`로 현재 사용자에게 할당된 작업 목록을 가져온다.
2. 날짜별/작업별 tree로 구성한다.
3. tree node 선택 시 작업 상세 grid를 갱신한다.
4. 작업에 연결된 splice record는 `/job-order/record`로 조회한다.
5. 지도 위치는 `recent_map_location`으로 저장/복원한다.
6. 수동 완료 버튼은 `POST /to-do/complete-manually`를 호출한다.

Jonard Cloud 권장 UI:

- `/tasks` 페이지로 명명 가능
- 좌측 task list, 중앙 map, 우측 task detail
- 상태 필터: pending/completed/overdue

### 11.6 Fiber

UI 구조:

- 좌측:
  - New Map
  - New Folder
  - Rename Map
  - Copy Map
  - Fiber tree
- 중앙:
  - 지도 panel
  - drawing toolbar: marker, polygon, line, rectangle, circle, mouse, save, eraser, delete all, shape edit, undo
  - Google Map drawing area
- 우측:
  - Share tab
  - History tab
- 팝업:
  - 새 map
  - 새 folder
  - shape edit
  - marker edit 및 icon upload
  - icon list
  - folder rename
  - map rename
  - map copy
  - share contact

주요 사용자 흐름:

1. 화면 진입
   - `/fiber/selectAll`로 내 map과 공유 map을 모두 가져온다.
   - tree 구성 후 지도 초기화.
   - 최근 지도 위치 `/recent_map_location/list?mapType=1003` 복원.

2. 새 Map
   - New Map 버튼 클릭
   - form 팝업에서 map 이름/설명 입력
   - `POST /fiber/insert`
   - tree refresh

3. 새 Folder
   - New Folder 버튼 클릭
   - `POST /fiber/group`
   - tree refresh

4. Map 선택
   - tree checkChange가 발생한다.
   - 선택 map id를 기준으로 `/fiber/select` 호출
   - 지도에 shape를 렌더링한다.
   - share grid와 history grid 갱신

5. Drawing toolbar
   - marker/polygon/line/rectangle/circle 선택 시 drawing mode 변경
   - mouse는 편집/선택 모드
   - eraser는 선택 shape 제거
   - delete all은 현재 map의 shape 전체 제거
   - undo는 직전 작업 취소
   - save는 변경된 shape JSON을 `/fiber/update`로 저장

6. Shape edit
   - 지도 위 shape 클릭 또는 toolbar shape edit
   - shape별 편집 팝업 오픈
   - marker는 icon upload/icon list와 연결
   - 저장 후 지도 object와 내부 JSON state 갱신

7. Share
   - Share tab 또는 share window 오픈
   - `/configuration/contact/group`으로 연락처 그룹 조회
   - 선택 연락처를 share grid에 추가
   - `POST /fiber/insert/ShareMap`으로 공유 저장

8. History
   - `/fiber/selectHistory`로 map 변경 이력 조회
   - 현재 map 선택에 따라 history grid가 바뀐다.

Jonard Cloud 권장 UI:

- Fiber는 별도 “map editor” 앱처럼 다루는 것이 좋다.
- 자동 저장보다 명시적 Save가 기존 UX와 맞는다.
- Drawing mode는 아이콘 toolbar와 tooltip으로 구성한다.
- 공유 설정은 drawer로 분리하면 지도 편집 공간을 덜 가린다.

### 11.7 Overview

UI 구조:

- 좌측:
  - 장비 검색
  - 장비 tree
- 중앙 상단:
  - start/end date
  - Query
  - Export
  - Back
- 중앙:
  - Total Splice chart
  - Data of each device chart
  - Device Data/User Data tab chart
  - Device Info grid
- Record mode:
  - chart 영역을 숨기고 splice record grid를 크게 표시
- 팝업:
  - PDF export 옵션 form
  - splice image popup

주요 사용자 흐름:

1. 화면 진입
   - `/overview/device-group`
   - `/overview/device-status-count`
   - 기본 기간 설정 후 chart API 호출

2. 장비 선택
   - tree checkChange로 선택 장비 목록 변경
   - Query 클릭 시 선택 장비 + 기간으로 모든 차트/테이블 재조회

3. 집계 단위 변경
   - Daily/Monthly/Yearly 라디오로 chart aggregation 단위 변경
   - `/overview/total-splice`, `/overview/device-splice` 재호출

4. Device/User chart
   - `/overview/device-splice-total`
   - `/overview/device-user-total`
   - 선택 장비 수와 기간 텍스트를 함께 표시

5. Device Info
   - 100/500/1000 라디오로 last splice 표시 범위를 변경
   - `/overview/device-splice-detail` 결과를 grid에 표시

6. Record 버튼
   - chart dashboard에서 record grid mode로 전환
   - `/overview/device-splice-record` 호출
   - Back 버튼으로 chart dashboard 복귀

7. Export
   - PDF 옵션 팝업 오픈
   - 포함할 섹션과 custom key/value, remark를 입력
   - `POST /overview/export-pdf`
   - 성공 시 `/overview/filedownload`로 다운로드

Jonard Cloud 권장 UI:

- 통계 dashboard와 record explorer를 탭으로 분리
- PDF export는 report builder modal로 구성
- chart filter state를 URL query에 반영하면 공유/복원이 쉬워진다.

### 11.8 File

UI 구조:

- 좌측: File Viewer device tree
- 우측:
  - 날짜 범위 start/end
  - Query
  - file grid
- 팝업:
  - splice image
  - SOR viewer
  - SOLA viewer
  - GDM viewer
  - Send Message popup include

주요 사용자 흐름:

1. 화면 진입
   - `/device/group`으로 device tree 구성
   - 기본 날짜는 최근 1개월부터 오늘까지

2. 장비 선택
   - tree checkChange로 선택 device id 목록 생성
   - `/device/file/list` 호출
   - grid 갱신

3. Query
   - 선택 장비 + 기간 조건으로 `/device/file/list`

4. View 버튼
   - fileType에 따라 viewer가 갈린다.
   - `sor`: SOR popup parser
   - `sola`: SOLA popup parser
   - `gdm`: `/monitor/otdr/gdm/value` 호출 후 GDM popup
   - `pdf`: `window.open(fileUrl)`
   - image: image popup

Jonard Cloud 권장 UI:

- 파일 목록은 Device detail의 Files tab과 별도 `/files` global explorer 둘 다 고려 가능
- 파일 타입별 viewer registry를 만들면 확장 가능하다.

## 12. 관리자 페이지 UI/상호작용 상세

### 12.1 Admin Device

UI 구조:

- 상단 search bar:
  - 검색 combo
  - storage/create user combo
  - start/end date
  - search input
  - Search
  - Filter icon
  - Export
  - Configuration
  - Statistics
- 본문:
  - `deviceGrid`
- 팝업:
  - Device Location map
  - Device Detail grid
  - Device Log grid

주요 사용자 흐름:

1. 화면 진입
   - `/admin/device/list`로 grid 초기 로드
   - `/admin/storage/user/list`로 create user/storage user combo 구성

2. 검색
   - 날짜/검색어/필터/사용자/상태 조건을 조합
   - `/admin/device/list` 재조회

3. Configuration
   - Admin 권한이면 `/admin/admin-device-popup/view`
   - Branch 권한이면 `/admin/branch-device-popup/view`
   - 같은 `.content` 영역에 configuration 화면을 로드한다.

4. Statistics
   - `/admin/statistics/device/view`로 content 전환

5. Grid action
   - Location button: `/admin/device/location` 조회 후 map popup
   - Detail button: 선택 장비 상세 grid popup
   - Device Log button: `/device/log/list` grid popup
   - Parameter button: `/admin/parameter/device/view`로 이동
   - Lock icon: `POST /device/lock` 호출 후 row 갱신

6. Configuration 화면
   - import grid와 list grid가 따로 있다.
   - template download: `/resources/form/device_form.xlsx`
   - Excel import: `POST /admin/device/import`
   - import 결과 중 선택 row를 `/admin/device/add`로 실제 등록
   - Add popup, Modify popup, Encryption popup 제공
   - region -> country -> customer dependent dropdown 흐름이 있다.

Jonard Cloud 권장 UI:

- Admin Device와 일반 Device는 같은 Device domain을 공유하되 권한별 action만 다르게 노출
- Import flow는 stepper로 분리: upload -> validate -> review -> commit

### 12.2 Admin User

UI 구조:

- 상단 search bar:
  - registered date range
  - search input
  - Search
  - Filter
  - Export
  - Statistics
- 본문:
  - userGrid
- 팝업:
  - user detail grid

상호작용:

1. `/admin/user/list`로 사용자 목록 조회
2. 검색/정렬/필터 시 grid source 갱신
3. Device List column button 클릭 시 `/admin/user/device` 조회 후 detail popup
4. Password Reset button 클릭 시 `/admin/user/password/reset`
5. Lock icon 클릭 시 `POST /admin/user/lock`, 성공하면 row의 lock icon 갱신
6. Statistics 버튼 클릭 시 `/admin/statistics/user/view`
7. Export 버튼 클릭 시 `/admin/user/list/excel`

Jonard Cloud 권장 UI:

- User table + side detail panel
- password reset/lock은 row actions menu로 통합
- 사용자 장비 목록은 detail drawer 안의 Devices tab

### 12.3 Admin Account

UI 구조:

- 관리자 계정 목록 grid
- Add/Modify/Delete 버튼
- Add popup
- Modify popup
- region 선택

상호작용:

1. `/admin/adminuser/list`로 관리자/지사 계정 조회
2. Add popup에서 ID 중복 확인: `/admin/user/checkId`
3. region 목록은 `/region`에서 로드
4. 저장: `POST /admin/adminuser`
5. Modify는 선택 row의 상세를 `/admin/adminuser/list?userId=...`로 다시 조회 후 팝업 오픈
6. Delete는 root 또는 본인 계정이면 서버에서 차단

### 12.4 Admin Customer

UI 구조:

- 상단:
  - search input
  - Search
  - Filter
  - Export
  - Configuration
- 본문:
  - customerGrid
- Configuration 화면:
  - customer 목록
  - Add/Modify/Delete
  - region/country 연동

상호작용:

1. `/admin/customer`로 고객 grid 조회
2. Configuration 클릭 시 `/admin/customer-popup/view` content 로드
3. Add/Modify/Delete는 `POST /admin/customer`
4. Branch 계정은 region 필터가 서버에서 제한된다.
5. Export는 `/admin/customer/list/excel`

### 12.5 Admin Country/Region

UI 구조:

- 국가 목록 grid
- region 관리 popup/configuration
- country를 region에 배정하는 action

상호작용:

1. `/country`로 국가 목록 조회
2. `/region`으로 region 목록 조회
3. region 생성/수정/삭제: `POST /region`
4. 국가 region 변경: `POST /update/country`
5. Admin이 아닌 사용자는 region 변경/관리 제한

### 12.6 Admin History

UI 구조:

- Job History:
  - start/end date
  - search combo/input
  - Search
  - Export
  - jobHistoryGrid
- Operation History:
  - start/end date
  - search combo/input
  - Search
  - Export
  - operationHistoryGrid

상호작용:

1. 기간을 설정한다.
2. 검색 조건을 선택한다.
3. grid source를 `/admin/history/job` 또는 `/admin/history/operation`으로 지정한다.
4. Excel은 각각 `/admin/history/job/excel`, `/admin/history/operation/excel`.
5. Operation History는 현재 operatorId를 session user로 제한한다.

### 12.7 Admin Statistics

UI 구조:

- 대부분 chart 중심 화면
- 기간/범위 선택 control
- list button으로 목록형 데이터 조회하는 화면도 존재

상호작용:

- Resource: `/admin/statistics/resource`
- Device Country: `/admin/statistics/device-country`
- Device Splice: `/admin/statistics/device-splice`
- Device Registered: `/admin/statistics/device-registered`
- Device Unit/Price: monthly와 model 데이터를 함께 가져와 chart 구성
- User/Splice: 사용자별 사용량 통계

Jonard Cloud 권장 UI:

- `/admin/statistics` 아래 dashboard tabs로 통합
- chart query model을 공통화한다.

### 12.8 Notice/Help/Consent/Product

UI 공통:

- 좌측 목록 또는 tree
- 우측 editor/form
- Add/Apply/Delete 버튼
- TinyMCE editor 사용

상호작용:

- Notice:
  - `/admin/notice` GET으로 목록/단건
  - `/admin/notice` POST로 I/U/D
- Help:
  - `/help`, `/help/detail`, `/help/list`
  - `/admin/help` POST로 I/U/D
- Consent:
  - `/admin/consent` GET
  - `/admin/consent/save` POST
- Product:
  - `/admin/device-properties/list`
  - `/admin/device-properties/update`
  - `/admin/device-properties/delete`

Jonard Cloud 권장 UI:

- CMS 성격 화면으로 묶을 수 있다.
- rich text editor를 공통 컴포넌트로 도입한다.

## 13. 페이지 간 상호작용 맵

### Device 중심 연결

Device는 여러 페이지의 기준 도메인이다.

- Dashboard는 내 장비 요약으로 Device 데이터를 보여준다.
- Monitor는 Device group/tree를 사용해 상태와 splice record를 조회한다.
- Record는 Monitor와 동일한 Device tree/record API를 재사용한다.
- File은 Device group/tree를 사용해 장비별 파일을 조회한다.
- Overview는 Device group/tree를 사용해 통계와 record drill-down을 만든다.
- Admin Device는 전체 장비를 관리하고 일반 Device 화면보다 더 강한 권한을 가진다.
- Product Management와 Parameter Management는 장비 모델/파라미터와 연결된다.

Jonard Cloud에서는 Device domain을 중심으로 다음 관계를 명확히 해야 한다.

- `Device`
- `DeviceGroup`
- `DeviceUserPermission`
- `DeviceSecurity`
- `DeviceSetting`
- `DeviceParameter`
- `DeviceFile`
- `DeviceSpliceRecord`
- `DeviceLocation`

### Contact와 Job Order 연결

- Contact에서 초대/수락된 사용자가 Job Order 전송 대상이 된다.
- Contact group은 Job Order send UI와 Fiber share UI에서 재사용된다.
- 초대 메시지는 Dashboard received message와 연결된다.
- 초대 수락 시 message status가 변경된다.

Jonard Cloud에서는 Contact를 단순 주소록이 아니라 “공유/작업 전송 권한의 기반”으로 설계해야 한다.

### Job Order와 Monitor/To-do 연결

- Job Order는 작업 생성/전송의 원천이다.
- To-do는 사용자가 받은 Job Order를 수행하는 화면이다.
- Monitor/Record의 splice data는 Job Order 위치와 매핑될 수 있다.
- Job History는 완료/과거 Job Order 조회다.

흐름:

1. 사용자가 Job Order 생성
2. Contact에게 Job Order send
3. 수신자는 To-do에서 작업 확인
4. 장비 splice record 발생
5. Monitor/Record에서 record 확인
6. record를 Job Order location과 연결
7. Job History/Overview에 집계

### Fiber와 Contact 연결

- Fiber map은 공유 기능을 가진다.
- 공유 대상은 Contact group/user에서 가져온다.
- Fiber share 저장은 `/fiber/insert/ShareMap`을 사용한다.

즉, Fiber는 지도 편집 도구이면서 협업/공유 기능을 가진다.

### File과 Monitor/Overview 연결

- File 화면은 장비별 파일 목록의 글로벌 explorer다.
- Monitor/Overview의 splice record row에서도 SOR/SOLA/GDM/PDF/Image viewer가 열린다.
- GDM 값은 Monitor API `/monitor/otdr/gdm/value`를 공유한다.

Jonard Cloud에서는 파일 viewer를 한 곳에서 공통 관리해야 한다.

### Notice/Help/Consent와 인증/메인 연결

- Notice는 로그인 후 메인 초기 content다.
- Help는 일반/관리자 모두 접근한다.
- Consent는 회원가입 Privacy Policy에 사용된다.
- Admin의 Notice/Help/Consent Management에서 작성한 HTML이 일반 화면에 반영된다.

## 14. 기능 단위 세부 목록

### 검색/필터

- text input 검색
- date range 검색
- combo/dropdown 검색
- grid column filter
- listBox 형태의 컬럼 선택/필터
- 서버 pagination/sort 연동

### Export/Import

- Device export/import
- Admin Device import review 후 등록
- User export
- Customer export
- Job History export
- Operation History export
- Monitor splice export
- Overview PDF export

### 지도

- Monitor 지도: 장비 위치, 상태, 이동 경로, 작업 위치 매핑
- To-do 지도: 작업 위치 확인
- Fiber 지도: 직접 도형 편집
- Admin Device 지도: 장비 위치 상세
- 최근 지도 위치 저장: `recent_map_location`

### 알림/메시지

- Dashboard received message
- Contact invite message
- 장비 maintenance recommendation message
- 이메일 2차 인증 code
- 회원가입 이메일 검증

### 장비 원격/명령성 기능

- device lock/unlock
- stolen/lost status 변경
- offline available duration 설정
- security/time lock 설정
- device setting/parameter 전송
- parameter refresh
- maintenance message 전송

### 파일/OTDR

- 장비 파일 목록
- image viewer
- PDF open
- SOR parser/chart/event grid
- SOLA parser/viewer
- GDM value viewer
- splice image viewer

### 이력/감사

- Device add/modify/delete
- Contact invite/group 변경
- Job Order create/modify/delete
- Fiber group/map 변경
- Admin user/customer/country 변경
- Operation History 조회

## 15. Jonard Cloud 화면 설계에 반영할 UX 원칙

- 기능을 기존 메뉴 이름 그대로 옮기기보다 사용자의 작업 흐름 단위로 재배치한다.
- Device는 하나의 거대한 화면이 아니라 목록, 상세, 보안, 설정, 파일, 기록으로 분리한다.
- Monitor와 Overview는 데이터 원천이 비슷하지만 목적이 다르다. Monitor는 실시간/운영, Overview는 분석/리포트로 구분한다.
- Contact는 단순 주소록이 아니라 공유와 작업 배정의 기반이다.
- Fiber는 별도 지도 편집 워크스페이스로 취급한다.
- Import/Export는 목록 화면 우측 action으로 유지하되 import는 검증 단계가 보이도록 한다.
- 모든 grid는 공통 table UX를 제공한다: 검색, 정렬, 필터, 컬럼 표시, 페이징, 선택, row action.
- 모든 command성 기능은 성공/실패 피드백과 이력 추적이 필요하다.
