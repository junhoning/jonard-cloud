# Jonard Cloud

Jonard Cloud는 기존 Java/JSP 기반 시스템을 건드리지 않고 별도 폴더에서 준비하는 새 프로젝트 스캐폴드입니다.

이번 준비 단계에서는 실제 iot 기능을 구현하지 않습니다. 로그인, 회원가입, 장비 목록, 지도, 파일 업로드, DB 마이그레이션, 인증은 다음 단계에서 설계 후 추가합니다.

## Stack

- Frontend: React TypeScript + Vite + `@ingradient/ui`
- Backend: FastAPI
- Frontend port: `5174`
- Backend port: `8020`

## Structure

```text
jornard-cloud/
  README.md
  frontend/
    package.json
    vite.config.ts
    src/
      main.tsx
      App.tsx
  backend/
    pyproject.toml
    app/
      main.py
      api/
        health.py
```

## Frontend

```powershell
cd C:\workspace\oursourcing\jornard-cloud\frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:5174`로 접속합니다.

빌드 확인:

```powershell
npm run build
```

## Backend

```powershell
cd C:\workspace\oursourcing\jornard-cloud\backend
py -m venv .venv
.\.venv\Scripts\activate
python -m pip install -e .
uvicorn app.main:app --reload --port 8020
```

상태 확인:

```powershell
Invoke-RestMethod http://localhost:8020/health
Invoke-RestMethod http://localhost:8020/api/meta
```

## UI Package

프론트엔드는 `@ingradient/ui` 패키지를 저장소에 포함된 로컬 tgz로 참조합니다.

```text
frontend/vendor/ingradient-ui-0.0.1.tgz
```

`package.json`이 `file:./vendor/ingradient-ui-0.0.1.tgz`로 가리키므로 클론 후 `npm install`만 하면 바로 설치됩니다. 라이브러리를 수정하면 새 tgz를 다시 빌드(`npm run build:package` + `npm pack`)해 이 경로에 덮어쓰고 커밋합니다.

## Next Steps

- 기존 시스템의 핵심 화면과 데이터 흐름 정리
- 인증/회원가입 정책 설계
- 장비, 사용자, 파일, 모니터링 도메인 모델 설계
- DB 선택 및 마이그레이션 전략 결정
- API 계약 문서화
