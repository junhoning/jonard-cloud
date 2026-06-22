# Jonard Cloud 도메인 모델 초안

## 1. 목적

이 문서는 Jonard Cloud에서 다룰 핵심 데이터 구조를 정리한다. 실제 DB 스키마는 이후 확정하되, API와 화면 구현이 같은 용어를 쓰도록 도메인 단위를 먼저 고정한다.

## 2. 공통 모델 규칙

모든 주요 엔티티는 다음 필드를 기본으로 가진다.

```text
id
createdAt
updatedAt
createdBy
updatedBy
status
```

삭제는 가능하면 soft delete를 사용한다.

```text
deletedAt
deletedBy
```

## 3. User

사용자 계정.

주요 필드:

- `id`
- `email`
- `name`
- `phone`
- `role`
- `organizationId`
- `branchId`
- `status`
- `lastLoginAt`

역할:

- `user`
- `admin`
- `branch_admin`

상태:

- `active`
- `invited`
- `disabled`
- `pending`

관계:

- User는 Organization에 속할 수 있다.
- User는 여러 Device에 접근 권한을 가질 수 있다.
- User는 Work Order의 담당자일 수 있다.

## 4. Organization

고객사, 회사, 팀 등 소속 단위.

주요 필드:

- `id`
- `name`
- `type`
- `countryCode`
- `regionId`
- `status`

유형:

- `customer`
- `partner`
- `internal`

관계:

- Organization은 여러 User를 가진다.
- Organization은 여러 Device를 소유할 수 있다.

## 5. Branch

지사 또는 지역 관리 단위.

주요 필드:

- `id`
- `name`
- `regionId`
- `managerUserId`
- `status`

관계:

- Branch는 여러 Organization, User, Device를 관리 범위로 가질 수 있다.

## 6. Region

국가/지역 정보.

주요 필드:

- `id`
- `name`
- `countryCode`
- `timezone`
- `parentRegionId`
- `status`

관계:

- Region은 계층 구조를 가질 수 있다.
- User, Organization, Device의 운영 범위와 연결된다.

## 7. Device

Jonard Cloud의 중심 엔티티.

주요 필드:

- `id`
- `serialNumber`
- `imeiNumber`
- `name`
- `modelId`
- `ownerUserId`
- `organizationId`
- `groupId`
- `status`
- `connectionStatus`
- `firmwareVersion`
- `lastSeenAt`
- `registeredAt`

상태:

- `active`
- `inactive`
- `disabled`
- `lost`
- `retired`

연결 상태:

- `online`
- `offline`
- `unknown`

관계:

- Device는 Product Model에 속한다.
- Device는 Organization 또는 User가 소유한다.
- Device는 Device Group에 속할 수 있다.
- Device는 여러 Record, File, Work Order와 연결된다.
- Device는 여러 User에게 공유될 수 있다.

## 8. Device Group

장비를 사용자 또는 조직 단위로 묶는 그룹.

주요 필드:

- `id`
- `name`
- `ownerUserId`
- `organizationId`
- `description`
- `status`

관계:

- Device Group은 여러 Device를 가진다.

## 9. Device Access

장비 공유/권한 관계.

주요 필드:

- `id`
- `deviceId`
- `userId`
- `permission`
- `grantedBy`
- `grantedAt`
- `expiresAt`
- `status`

권한:

- `view`
- `operate`
- `manage`

MVP 기준:

- `view` 중심으로 시작한다.
- `operate`, `manage`는 후속 단계에서 실제 동작을 연결한다.

## 10. Product Model

장비 모델 정보.

주요 필드:

- `id`
- `name`
- `manufacturer`
- `category`
- `firmwareFamily`
- `status`

관계:

- Product Model은 여러 Device와 연결된다.

## 11. Work Order

작업 지시 또는 할 일.

주요 필드:

- `id`
- `title`
- `description`
- `deviceId`
- `assigneeUserId`
- `requesterUserId`
- `organizationId`
- `priority`
- `status`
- `dueAt`
- `startedAt`
- `completedAt`

상태:

- `draft`
- `assigned`
- `in_progress`
- `completed`
- `cancelled`

우선순위:

- `low`
- `normal`
- `high`
- `urgent`

관계:

- Work Order는 Device와 연결될 수 있다.
- Work Order는 담당 User와 연결된다.
- Work Order는 Record, File, Comment를 가질 수 있다.

## 12. Record

장비 모니터링 기록, 작업 기록, 이벤트 기록을 포괄하는 모델.

주요 필드:

- `id`
- `deviceId`
- `workOrderId`
- `type`
- `eventTime`
- `payload`
- `summary`
- `severity`
- `source`

유형:

- `device_event`
- `splice_record`
- `operation_log`
- `monitoring`

심각도:

- `info`
- `warning`
- `error`
- `critical`

관계:

- Record는 Device와 연결된다.
- Record는 Work Order와 연결될 수 있다.
- Record는 File을 가질 수 있다.

## 13. File Asset

장비 파일, 측정 파일, 첨부 파일.

주요 필드:

- `id`
- `name`
- `originalName`
- `fileType`
- `mimeType`
- `size`
- `storagePath`
- `deviceId`
- `workOrderId`
- `recordId`
- `uploadedBy`
- `uploadedAt`
- `status`

유형:

- `image`
- `document`
- `sor`
- `sola`
- `gdm`
- `log`
- `other`

## 14. Command

장비 명령 실행 요청과 결과.

주요 필드:

- `id`
- `deviceId`
- `requestedBy`
- `commandType`
- `parameters`
- `status`
- `requestedAt`
- `sentAt`
- `completedAt`
- `result`
- `errorMessage`

상태:

- `pending`
- `sent`
- `success`
- `failed`
- `timeout`
- `cancelled`

MVP 기준:

- 실제 장비 전송은 하지 않는다.
- API와 데이터 구조만 준비한다.

## 15. Audit Log

운영 이력.

주요 필드:

- `id`
- `actorUserId`
- `action`
- `targetType`
- `targetId`
- `before`
- `after`
- `ipAddress`
- `userAgent`
- `createdAt`

대상:

- `user`
- `device`
- `work_order`
- `file`
- `organization`
- `command`

## 16. Comment

작업 또는 장비에 남기는 메모.

주요 필드:

- `id`
- `targetType`
- `targetId`
- `authorUserId`
- `body`
- `createdAt`
- `updatedAt`

MVP 기준:

- Work Order Detail에서 우선 사용한다.

## 17. 도메인 관계 요약

```text
Organization 1 - N User
Organization 1 - N Device
Branch 1 - N Organization
Region 1 - N Branch
ProductModel 1 - N Device
DeviceGroup 1 - N Device
Device N - N User through DeviceAccess
Device 1 - N WorkOrder
Device 1 - N Record
Device 1 - N FileAsset
WorkOrder 1 - N Record
WorkOrder 1 - N FileAsset
WorkOrder 1 - N Comment
Device 1 - N Command
User 1 - N AuditLog
```

