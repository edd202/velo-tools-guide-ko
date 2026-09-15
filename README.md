# velo-tools-guide-ko

Velo Tools 튜토리얼 핸드북 v1.7.1의 **비공식 한국어 번역**입니다.

- 웹 가이드: https://edd202.github.io/velo-tools-guide-ko/
- [한국어 PDF](guide.pdf)
- [한국어 Markdown](docs/user-manual.ko.md)
- [영문 원문](https://github.com/visaokc/Velo-Tools/blob/main/docs/user-manual.en.md)

원문 확인 및 번역 기준일: 2026-09-15. 원본 프로젝트: [visaokc/Velo-Tools](https://github.com/visaokc/Velo-Tools).

전체 82개 튜토리얼을 수록했습니다. 원문의 버튼·옵션·파일 이름은 영문으로 유지하고, 웹용 목차·본문 검색·모바일 화면·PDF 다운로드를 추가했습니다. 원문 저장소에서 제공하는 GNU GPL v3 라이선스를 따릅니다. [LICENSE](LICENSE)를 참고하세요.

## GitHub Pages 게시

저장소 **Settings → Pages → Build and deployment**에서 아래를 선택합니다.

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**
- **Save** 클릭

완료 후 같은 페이지의 **Visit site**에서 확인할 수 있습니다. 별도 빌드 설정은 필요하지 않습니다.

## 번역 수정

`docs/user-manual.ko.md`를 수정하고 다음 명령으로 `index.html`을 다시 만듭니다.

```sh
npm install
npm run build
```

변경된 Markdown과 생성된 `index.html`을 함께 커밋합니다. 스타일은 `style.css`, 검색·모바일 목차 동작은 `app.js`에서 관리합니다. PDF는 별도 편집본으로, Markdown 변경 시 자동 갱신되지 않습니다.
