# Jonard Cloud 마이그레이션 노트

## 1. 목적

이 문서는 기존 Java/JSP 기반 시스템을 Jonard Cloud로 재구현할 때 주의할 점을 정리한다. 기존 프로젝트를 직접 수정하지 않고, 새 프로젝트에서 필요한 기능과 데이터를 단계적으로 옮기는 것을 기준으로 한다.

## 2. 기본 방향

- 기존 시스템은 reference로만 사용한다.
- 새 코드는 `jonard-cloud`에서 독립적으로 작성한다.
- UI는 그대로 복제하지 않는다.
- 업무 로직, 권한 흐름, 데이터 관계는 최대한 유지한다.
- 기존 DB를 그대로 쓸지, 새 DB로 마이그레이션할지는 별도 검토한다.

## 3. 기존 시스템에서 확인해야 할 항목

### 3.1 화면

확인 대상:

- JSP 화면 목록
- 관리자 화면과 사용자 화면 분리 방식
- 팝업 화면
- AJAX 호출 흐름
- hidden input 또는 form submit 기반 상태 전달

Jonard Cloud 반영:

- route 기반 화면으로 재구성한다.
- 팝업은 modal/drawer/detail page 중 하나로 바꾼다.
- form submit 중심 흐름은 API 호출 중심으로 변경한다.

### 3.2 서버 API

확인 대상:

- Controller URL
- 요청 parameter
- 응답 형식
- session 사용 여부
- 파일 다운로드/업로드 방식

Jonard Cloud 반영:

- FastAPI endpoint로 재정의한다.
- 응답 형식을 일관된 JSON으로 정리한다.
- session 의존 로직은 token 또는 서버 세션 정책으로 재설계한다.

### 3.3 DB

확인 대상:

- 사용자 테이블
- 장비 테이블
- 장비 권한/공유 테이블
- 작업 테이블
- 기록 테이블
- 파일 테이블
- 관리자 코드/공통 코드 테이블

Jonard Cloud 반영:

- 기존 테이블을 그대로 매핑할지 새 schema로 옮길지 결정한다.
- 우선 domain model과 기존 table mapping 문서를 따로 작성한다.
- 데이터 정합성이 중요한 serialNumber, imeiNumber는 unique 정책을 확인한다.

### 3.4 장비 통신

확인 대상:

- MQTT 사용 여부
- AMQP 사용 여부
- 장비 command payload
- command response 처리 방식
- timeout/retry 정책

Jonard Cloud 반영:

- MVP에서는 command adapter interface만 둔다.
- 실제 통신은 별도 worker 또는 service layer로 분리한다.
- API 서버가 직접 장시간 command를 기다리지 않도록 설계한다.

### 3.5 파일 처리

확인 대상:

- 파일 저장 위치
- 파일명 규칙
- SOR/SOLA/GDM 파싱 방식
- 다운로드 권한 체크
- PDF 리포트 생성 방식

Jonard Cloud 반영:

- MVP에서는 metadata와 다운로드 구조만 만든다.
- 전용 viewer와 parser는 후속 단계에서 별도 모듈로 분리한다.

## 4. 명칭 변경 기준

| 기존 시스템 | Jonard Cloud |
| --- | --- |
| Dashboard | Home |
| Device | Devices |
| Contact | People |
| Job Order | Work Orders |
| To-do | Work Orders |
| Monitor | Live Monitor |
| Record | Records |
| Overview | Analytics |
| Fiber | Network Map |
| File | Files |
| Admin | Admin Tools |

주의:

- DB field나 외부 연동 payload에서 기존 명칭을 바로 바꾸면 호환 문제가 생길 수 있다.
- UI label과 내부 domain name을 분리해서 관리한다.

## 5. 단계별 이전 전략

### 5.1 1단계: 읽기 중심 재구현

목표:

- 기존 데이터를 읽어서 새 UI에 표시한다.

대상:

- 사용자
- 장비
- 작업
- 기록
- 파일 metadata

장점:

- 위험이 낮다.
- 기존 시스템과 결과를 비교하기 쉽다.

### 5.2 2단계: 제한적 쓰기 기능

목표:

- Jonard Cloud에서 일부 데이터를 수정할 수 있다.

대상:

- 작업 생성/상태 변경
- 장비 그룹 변경
- 장비 공유 설정
- 사용자 상태 변경

주의:

- 기존 시스템과 동시에 같은 DB를 쓸 경우 충돌 정책이 필요하다.

### 5.3 3단계: 파일/리포트/지도 확장

목표:

- 기존 시스템의 고급 기능을 Jonard Cloud 방식으로 옮긴다.

대상:

- 파일 뷰어
- PDF 리포트
- Fiber/Network Map
- Excel import/export

### 5.4 4단계: 장비 통신 이전

목표:

- command, MQTT/AMQP, 상태 수신을 새 service로 이전한다.

주의:

- 실제 장비 제어는 장애 위험이 있으므로 별도 검증 환경이 필요하다.
- command payload와 response 호환성 테스트가 필요하다.

## 6. 호환성 리스크

### 6.1 인증

기존 시스템이 session 기반이면 Jonard Cloud token 방식과 충돌할 수 있다.

대응:

- MVP에서는 독립 인증을 사용한다.
- 기존 계정 DB 연동은 별도 단계에서 검토한다.

### 6.2 권한

기존 권한 로직이 화면, controller, SQL에 나뉘어 있을 수 있다.

대응:

- Jonard Cloud에서는 service layer에서 scope 계산을 중앙화한다.
- API마다 권한 체크를 반복 구현하지 않는다.

### 6.3 파일 경로

기존 파일 경로가 서버 로컬 경로에 강하게 묶여 있을 수 있다.

대응:

- FileAsset 모델에서 storagePath와 public download path를 분리한다.

### 6.4 지도 데이터

Fiber 관련 데이터는 화면 좌표, 지도 좌표, 장비/선로 관계가 섞여 있을 수 있다.

대응:

- Network Map은 MVP에서 제외한다.
- 기존 데이터 구조를 별도 분석한 뒤 구현한다.

### 6.5 장비 명령

장비 명령은 실제 현장 장비에 영향을 줄 수 있다.

대응:

- MVP에서는 mock command만 허용한다.
- 실제 command는 staging 환경과 허용 장비 목록을 둔다.

## 7. 추가로 작성할 매핑 문서

마이그레이션 전에 다음 문서를 추가로 만들면 좋다.

- `legacy-route-map.md`: 기존 JSP/Controller와 Jonard Cloud route 매핑
- `legacy-db-map.md`: 기존 table과 Jonard Cloud domain model 매핑
- `legacy-api-map.md`: 기존 AJAX/API와 신규 FastAPI endpoint 매핑
- `device-command-map.md`: 기존 command 이름/payload/response 매핑
- `file-format-notes.md`: SOR/SOLA/GDM 파일 처리 방식 정리

## 8. 개발 시 금지 사항

- 기존 시스템 프로젝트를 직접 수정하지 않는다.
- 기존 DB에 쓰기 기능을 붙이기 전 권한/이력 정책 없이 진행하지 않는다.
- 장비 command를 실제 환경에 바로 연결하지 않는다.
- 파일 parser를 UI 코드 안에 넣지 않는다.
- 기존 JSP 구조를 React 컴포넌트로 그대로 복사하지 않는다.

