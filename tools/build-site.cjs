const fs = require('fs');
const {marked} = require('marked');
const render = s=>marked.parse(s.replace(/</g,'&lt;').replace(/>/g,'&gt;'));
const md = fs.readFileSync('docs/user-manual.ko.md','utf8');
const escape = s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pieces = md.split(/(?=<a id="(?:vertex-groups|mesh|weights|materials|game)"><\/a>\n## )/);
const intro = pieces.shift().replace(/^# .+\n/,'');
const chapters = pieces.map((part,index)=>{
 const m=part.match(/^<a id="([^"]+)"><\/a>\n## ([^\n]+)/);
 const id=m[1], title=m[2];
 const blocks=part.slice(m[0].length).split(/(?=<a id="[^"]+"><\/a>\n#### )/);
 const lead=blocks.shift();
 const entries=blocks.map((block)=>{
  const match=block.match(/^<a id="([^"]+)"><\/a>\n#### ([^\n]+)/);
  const body=block.slice(match[0].length);
  // A subsection label at the end belongs to the next tutorial.
  const nextSub=body.match(/\n### ([^\n]+)\s*$/);
  return {id:match[1],title:match[2],body:nextSub?body.slice(0,nextSub.index):body,nextSub:nextSub?.[1]};
 });
 const firstSub=lead.match(/\n### ([^\n]+)\s*$/);
 let subtitle=firstSub?.[1]||'';
 for(const entry of entries){entry.subtitle=subtitle;if(entry.nextSub)subtitle=entry.nextSub;}
 return {id,title,index,lead:firstSub?lead.slice(0,firstSub.index):lead,entries};
});
if(chapters.length!==5 || chapters.reduce((n,c)=>n+c.entries.length,0)!==82)throw Error('Incomplete handbook');
const nav=chapters.map(c=>`<details class="nav-group" open><summary><span class="nav-number">0${c.index+1}</span>${escape(c.title.split(' (')[0])}</summary><ul>${c.entries.map(e=>`<li><a href="#${e.id}">${escape(e.title)}</a></li>`).join('')}</ul></details>`).join('');
const main=chapters.map(c=>`<section class="chapter" id="${c.id}" aria-labelledby="title-${c.id}"><header class="chapter-heading"><span class="eyebrow">CHAPTER 0${c.index+1}</span><h2 id="title-${c.id}">${escape(c.title)}</h2>${render(c.lead)}</header>${c.entries.map(e=>`<article class="tutorial" id="${e.id}" aria-labelledby="title-${e.id}" data-chapter="${c.id}"><div class="section-label">${escape(e.subtitle)}</div><h3 id="title-${e.id}"><a href="#${e.id}">${escape(e.title)}<span class="anchor-sign" aria-hidden="true">#</span></a></h3>${render(e.body).replace(/<h5>/g,'<h4>').replace(/<\/h5>/g,'</h4>').replace(/<table>/g,'<div class="table-wrap" role="region" aria-label="기능 비교표" tabindex="0"><table>').replace(/<\/table>/g,'</table></div>')}</article>`).join('')}</section>`).join('');
const html=`<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#145d64"><title>Velo Tools 한국어 가이드 · v1.7.1</title><meta name="description" content="Velo Tools 1.7.1 핸드북의 비공식 한국어 번역. 명조·엔드필드 모드 제작, MMD 매핑, 메시, 웨이트, 머티리얼과 내보내기 안내."><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="style.css"><script src="app.js" defer></script></head>
<body><a class="skip-link" href="#content">본문으로 이동</a><header class="topbar"><a class="brand" href="#top"><span class="brand-icon" aria-hidden="true">V</span><span>Velo Tools<small>한국어 핸드북</small></span></a><div class="top-actions"><span class="version">v1.7.1</span><a class="source-link" href="https://github.com/visaokc/Velo-Tools/blob/main/docs/user-manual.en.md">영문 원문 ↗</a><a class="download" href="guide.pdf" download>PDF 다운로드 <span aria-hidden="true">↓</span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="sidebar">목차</button></div></header>
<button class="scrim" type="button" aria-label="목차 닫기" hidden></button><aside id="sidebar" class="sidebar" aria-label="가이드 목차"><div class="search-wrap"><label for="search">가이드 검색</label><div class="search-field"><span aria-hidden="true">⌕</span><input id="search" type="search" placeholder="기능·설정 이름 검색" autocomplete="off"><kbd>/</kbd></div><p>한글 설명과 영문 설정 이름으로 찾기</p></div><nav>${nav}</nav><div class="sidebar-footer"><a href="https://github.com/edd202/velo-tools-guide-ko">번역 저장소 ↗</a><span>82개 튜토리얼 · 5개 영역</span></div></aside>
<main id="content"><div class="reading-column"><header class="intro" id="top"><div class="eyebrow">VELO TOOLS / KOREAN HANDBOOK</div><h1>필요한 기능부터,<br>하나씩 살펴보세요.</h1><p class="intro-description">Blender에서 모델을 준비하고, 웨이트와 텍스처를 편집해 게임 모드로 내보내기까지. Velo Tools의 전체 사용 안내를 한국어로 읽을 수 있습니다.</p><div class="quick-links" aria-label="주요 안내 바로가기"><a href="#game-wwmi-extract"><span>명조</span>추출부터 시작하기 →</a><a href="#vg-mmd-setup"><span>MMD</span>게임 그룹 매핑하기 →</a><a href="#weight-transfer"><span>웨이트</span>의상에 전송하기 →</a></div><div class="translation-note"><strong>비공식 한국어 번역 · 원문 v1.7.1</strong><p>2026년 9월 15일 확인한 핸드북 기준입니다. 버튼·설정·파일 이름은 실제 화면과 비교하기 쉽도록 영문 표기를 유지했습니다.</p><details><summary>읽기 전에</summary>${render(intro)}</details></div></header>
<div id="search-status" class="search-status" role="status" aria-live="polite" hidden></div><div id="empty" class="empty" hidden><h2>일치하는 항목이 없습니다.</h2><p>다른 단어나 영문 설정 이름으로 검색해 보세요.</p><button class="clear-search" type="button">검색 초기화</button></div><div id="handbook">${main}</div>
<footer class="page-footer"><strong>Velo Tools 한국어 핸드북</strong><p>원문: <a href="https://github.com/visaokc/Velo-Tools">visaokc / Velo-Tools</a> · 비공식 한국어 번역</p><p><a href="LICENSE">GNU GPL v3</a> · <a href="docs/user-manual.ko.md" download>한국어 Markdown</a> · <a href="guide.pdf" download>PDF 다운로드</a></p></footer></div></main></body></html>`;
fs.writeFileSync('index.html',html);
console.log(`Built ${chapters.length} chapters, 82 tutorials`);
