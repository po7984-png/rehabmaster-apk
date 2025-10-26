# RehabMaster v0.2 (PWA)

교육/의사결정 보조용 초기 문진 앱 (진단 목적 아님).

## 사용법 (스마트폰)
1) 내려받은 ZIP을 압축 해제
2) 폴더 안의 `index.html`을 크롬으로 열기
3) 우측 메뉴 → "홈 화면에 추가"로 설치형처럼 사용
4) 오프라인에서도 동작

## GitHub Pages 배포
- 저장소의 Settings → Pages → Branch: main `/root` 설정
- 페이지 주소로 접속하면 PWA로 실행됨

## APK로 만들기 (옵션)
- PC에서 `npx @bubblewrap/cli init` → `bubblewrap build`
- 또는 Capacitor/Android Studio(WebView)에 이 폴더를 넣어 빌드

## 데이터 편집
- `app.js`의 DB 상단에서 부위/질문/근거를 자유롭게 편집
