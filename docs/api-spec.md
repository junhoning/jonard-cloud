# Jonard Cloud API 명세 초안

## 1. 목적

이 문서는 Jonard Cloud FastAPI 서버의 API 방향을 정의한다. 실제 구현 전 프론트엔드와 백엔드가 같은 요청/응답 구조를 바라보도록 하는 초안이다.

## 2. 기본 규칙

Base URL:

```text
http://localhost:8020
```

API prefix:

```text
/api
```

응답은 JSON을 기본으로 한다.

시간 값은 ISO 8601 문자열을 사용한다.

```text
2026-06-18T10:30:00+09:00
```

## 3. 공통 응답 형식

단일 객체:

```json
{
  "data": {
    "id": "device_001"
  }
}
```

목록:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 0
  }
}
```

에러:

```json
{
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "Device not found",
    "details": {}
  }
}
```

## 4. 상태 확인

### GET `/health`

서버 상태 확인.

응답:

```json
{
  "status": "ok"
}
```

### GET `/api/meta`

프론트엔드에서 사용할 기본 서버 메타 정보.

응답:

```json
{
  "data": {
    "name": "Jonard Cloud API",
    "version": "0.1.0",
    "environment": "local"
  }
}
```

## 5. Auth

### POST `/api/auth/login`

로그인.

요청:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

응답:

```json
{
  "data": {
    "accessToken": "token",
    "user": {
      "id": "user_001",
      "email": "admin@example.com",
      "name": "Admin",
      "role": "admin"
    }
  }
}
```

### POST `/api/auth/logout`

로그아웃.

### GET `/api/auth/me`

현재 사용자 조회.

## 6. Home

### GET `/api/home/summary`

콘솔 요약 정보.

Query:

- `scope`: `my`, `organization`, `admin`

응답:

```json
{
  "data": {
    "devices": {
      "total": 10,
      "online": 7,
      "offline": 3
    },
    "workOrders": {
      "open": 4,
      "completedToday": 2
    },
    "records": {
      "latestCount": 12
    }
  }
}
```

## 7. Devices

### GET `/api/devices`

장비 목록.

Query:

- `keyword`
- `status`
- `connectionStatus`
- `modelId`
- `ownerUserId`
- `groupId`
- `page`
- `pageSize`

### POST `/api/devices`

장비 등록.

MVP에서는 관리자만 사용한다.

### GET `/api/devices/{deviceId}`

장비 상세.

### PATCH `/api/devices/{deviceId}`

장비 수정.

### GET `/api/devices/{deviceId}/records`

장비 관련 기록.

### GET `/api/devices/{deviceId}/files`

장비 관련 파일.

### GET `/api/devices/{deviceId}/work-orders`

장비 관련 작업.

## 8. Device Groups

### GET `/api/device-groups`

장비 그룹 목록.

### POST `/api/device-groups`

장비 그룹 생성.

### PATCH `/api/device-groups/{groupId}`

장비 그룹 수정.

### POST `/api/device-groups/{groupId}/devices`

그룹에 장비 추가.

요청:

```json
{
  "deviceIds": ["device_001", "device_002"]
}
```

## 9. Device Access

### GET `/api/devices/{deviceId}/access`

장비 접근 권한 목록.

### POST `/api/devices/{deviceId}/access`

장비 공유.

요청:

```json
{
  "userId": "user_002",
  "permission": "view"
}
```

### DELETE `/api/devices/{deviceId}/access/{accessId}`

장비 공유 해제.

## 10. People

### GET `/api/people`

연락처/사용자 목록.

### GET `/api/people/{personId}`

연락처 상세.

### POST `/api/people/invitations`

초대 생성.

MVP에서는 실제 이메일 발송 없이 초대 record만 만든다.

## 11. Work Orders

### GET `/api/work-orders`

작업 목록.

Query:

- `keyword`
- `status`
- `deviceId`
- `assigneeUserId`
- `from`
- `to`
- `page`
- `pageSize`

### POST `/api/work-orders`

작업 생성.

### GET `/api/work-orders/{workOrderId}`

작업 상세.

### PATCH `/api/work-orders/{workOrderId}`

작업 수정.

### POST `/api/work-orders/{workOrderId}/status`

작업 상태 변경.

요청:

```json
{
  "status": "in_progress",
  "comment": "Started"
}
```

## 12. Records

### GET `/api/records`

기록 목록.

Query:

- `type`
- `deviceId`
- `workOrderId`
- `severity`
- `from`
- `to`
- `page`
- `pageSize`

### GET `/api/records/{recordId}`

기록 상세.

## 13. Files

### GET `/api/files`

파일 목록.

### GET `/api/files/{fileId}`

파일 상세.

### GET `/api/files/{fileId}/download`

파일 다운로드.

MVP에서는 다운로드 URL placeholder를 반환할 수 있다.

## 14. Admin

### GET `/api/admin/users`

사용자 목록.

### GET `/api/admin/users/{userId}`

사용자 상세.

### PATCH `/api/admin/users/{userId}`

사용자 수정.

### GET `/api/admin/customers`

고객/조직 목록.

### GET `/api/admin/devices`

전체 장비 목록.

### GET `/api/admin/audit-logs`

운영 이력 목록.

## 15. Commands

장비 명령 API는 MVP에서 실제 통신 없이 구조만 둔다.

### POST `/api/devices/{deviceId}/commands`

명령 요청 생성.

요청:

```json
{
  "commandType": "sync_status",
  "parameters": {}
}
```

응답:

```json
{
  "data": {
    "id": "command_001",
    "status": "pending"
  }
}
```

## 16. 권한 체크 기준

- 일반 사용자는 자신이 소유하거나 공유받은 장비만 조회한다.
- 관리자는 전체 데이터에 접근할 수 있다.
- 지사 관리자는 할당된 region, branch, organization 범위만 접근한다.
- 모든 변경 API는 Audit Log를 남긴다.

