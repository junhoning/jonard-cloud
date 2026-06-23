# Jonard Cloud 기능 로직 명세 초안

## 1. 목적

이 문서는 UI가 바뀌어도 유지해야 하는 기존 시스템의 핵심 업무 로직을 정리한다. 실제 구현 시 화면 모양보다 데이터 흐름, 권한, 상태 전이를 우선 기준으로 삼는다.

## 2. 인증 로직

### 2.1 로그인

흐름:

1. 사용자가 email/password를 입력한다.
2. 서버가 계정 상태를 확인한다.
3. 계정이 활성 상태이면 token과 사용자 정보를 반환한다.
4. 프론트엔드는 사용자 role에 따라 기본 route로 이동한다.

검증:

- email 필수
- password 필수
- disabled 계정은 로그인 불가
- pending 계정은 정책 확정 전까지 로그인 불가

### 2.2 권한별 접근

원칙:

- 일반 사용자는 자신이 소유하거나 공유받은 데이터만 본다.
- 관리자는 전체 데이터를 본다.
- 지사 관리자는 할당된 지역/고객/장비 범위만 본다.

적용 대상:

- 장비 목록
- 작업 목록
- 기록 목록
- 파일 목록
- 관리자 화면

## 3. 장비 조회 로직

### 3.1 장비 목록

입력:

- 사용자 권한
- 검색어
- 필터
- pagination

처리:

1. 사용자 권한에 맞는 장비 scope를 계산한다.
2. 검색어가 있으면 name, serialNumber, imeiNumber, model에 적용한다.
3. 상태 필터를 적용한다.
4. 정렬과 pagination을 적용한다.

출력:

- 장비 목록
- 전체 개수
- 현재 페이지 정보

### 3.2 장비 상세

처리:

1. 장비 존재 여부를 확인한다.
2. 현재 사용자의 접근 권한을 확인한다.
3. 장비 기본 정보, 소유자, 그룹, 상태 정보를 조회한다.
4. 관련 작업/기록/파일 count를 함께 반환한다.

예외:

- 장비 없음: `DEVICE_NOT_FOUND`
- 권한 없음: `DEVICE_ACCESS_DENIED`

## 4. 장비 공유 로직

### 4.1 공유 추가

흐름:

1. 공유 요청자가 해당 장비의 manage 권한을 갖는지 확인한다.
2. 대상 사용자가 존재하는지 확인한다.
3. 이미 공유되어 있으면 기존 권한을 갱신한다.
4. Device Access를 생성 또는 수정한다.
5. Audit Log를 기록한다.

권한:

- 일반 사용자는 자신이 소유한 장비만 공유할 수 있다.
- 관리자는 전체 장비 공유를 수정할 수 있다.

### 4.2 공유 해제

흐름:

1. 요청자의 manage 권한을 확인한다.
2. access record를 비활성화한다.
3. Audit Log를 기록한다.

제약:

- 장비 소유자 권한은 공유 해제로 제거하지 않는다.

## 5. 장비 그룹 로직

### 5.1 그룹 생성

검증:

- 그룹명 필수
- 같은 owner scope 안에서 중복 그룹명 제한

### 5.2 장비 그룹 이동

흐름:

1. 사용자가 장비에 대한 manage 권한을 갖는지 확인한다.
2. 대상 그룹이 같은 scope에 있는지 확인한다.
3. 장비의 groupId를 변경한다.
4. Audit Log를 기록한다.

## 6. 작업 로직

### 6.1 작업 생성

입력:

- title
- description
- deviceId
- assigneeUserId
- dueAt
- priority

검증:

- title 필수
- deviceId가 있으면 접근 가능한 장비인지 확인
- assigneeUserId가 있으면 접근 가능한 사용자 또는 조직 구성원인지 확인

초기 상태:

- 담당자가 있으면 `assigned`
- 담당자가 없으면 `draft`

### 6.2 작업 상태 전이

허용 전이:

```text
draft -> assigned
assigned -> in_progress
in_progress -> completed
draft -> cancelled
assigned -> cancelled
in_progress -> cancelled
```

처리:

1. 현재 상태와 요청 상태의 전이 가능 여부를 확인한다.
2. 상태를 변경한다.
3. 상태 변경 이력을 기록한다.
4. 필요하면 completedAt 또는 startedAt을 기록한다.

예외:

- 완료된 작업은 다시 진행 상태로 되돌리지 않는다.
- 취소된 작업은 수정하지 않는다.

## 7. 기록 로직

### 7.1 기록 목록

처리:

1. 사용자 권한에 맞는 장비 scope를 계산한다.
2. 해당 scope의 record만 조회한다.
3. type, severity, date range 필터를 적용한다.
4. 최신순으로 정렬한다.

### 7.2 기록 상세

처리:

1. record를 조회한다.
2. 연결된 device 접근 권한을 확인한다.
3. payload를 type에 맞게 반환한다.

type별 표시:

- `device_event`: 이벤트 요약과 원본 payload
- `splice_record`: 접속/작업 기록 중심
- `operation_log`: 명령 또는 사용자 작업 이력
- `monitoring`: 상태/시간/측정값 중심

## 8. 파일 로직

### 8.1 파일 목록

처리:

1. 사용자가 접근 가능한 장비/작업 scope를 계산한다.
2. 연결된 파일만 조회한다.
3. 파일 유형, 검색어, 날짜 필터를 적용한다.

### 8.2 파일 다운로드

처리:

1. 파일 존재 여부를 확인한다.
2. 접근 권한을 확인한다.
3. 다운로드 URL 또는 stream 응답을 반환한다.
4. 필요하면 Audit Log를 기록한다.

MVP 제약:

- 실제 파일 저장소 연동은 후순위다.
- 초기에는 metadata 중심으로 구현한다.

## 9. 관리자 사용자 로직

### 9.1 사용자 상태 변경

상태:

- `active`
- `disabled`
- `pending`

처리:

1. 요청자가 admin인지 확인한다.
2. 대상 사용자가 존재하는지 확인한다.
3. 자기 자신을 disabled 처리하지 못하게 제한한다.
4. 상태를 변경한다.
5. Audit Log를 기록한다.

### 9.2 사용자 역할 변경

처리:

1. admin 권한을 확인한다.
2. role 값을 검증한다.
3. 역할 변경 전후 값을 Audit Log에 기록한다.

## 10. 장비 명령 로직

MVP에서는 실제 통신하지 않고 command request 구조만 둔다.

흐름:

1. 사용자가 장비 command를 요청한다.
2. 장비 접근 권한과 operate 권한을 확인한다.
3. Command record를 `pending`으로 생성한다.
4. 실제 command adapter는 후속 단계에서 처리한다.

후속 구현:

- MQTT/AMQP 전송
- timeout 처리
- 장비 응답 수신
- command result 저장

## 11. Audit Log 로직

Audit Log 대상:

- 로그인 실패 반복
- 장비 등록/수정/삭제
- 장비 공유 추가/해제
- 작업 생성/상태 변경
- 사용자 상태/역할 변경
- 파일 다운로드
- command 요청

저장 정보:

- actor
- action
- target
- before
- after
- ip
- userAgent
- createdAt

## 12. 검색/필터 로직

공통 규칙:

- keyword 검색은 trim 후 적용한다.
- 빈 문자열은 검색 조건에서 제외한다.
- date range는 timezone을 고려한다.
- pagination 기본값은 `page=1`, `pageSize=20`이다.
- pageSize 최대값은 100으로 제한한다.

## 13. 에러 코드 기준

공통:

- `VALIDATION_ERROR`
- `UNAUTHORIZED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `INTERNAL_ERROR`

도메인:

- `DEVICE_NOT_FOUND`
- `DEVICE_ACCESS_DENIED`
- `WORK_ORDER_NOT_FOUND`
- `INVALID_WORK_ORDER_STATUS`
- `FILE_NOT_FOUND`
- `USER_NOT_FOUND`
- `COMMAND_NOT_SUPPORTED`

