(() => {
 'use strict';
 const input=document.querySelector('#search');
 const status=document.querySelector('#search-status');
 const empty=document.querySelector('#empty');
 const chapters=[...document.querySelectorAll('.chapter')];
 const tutorials=[...document.querySelectorAll('.tutorial')];
 const index=tutorials.map(el=>({el,text:el.textContent.toLocaleLowerCase('ko')}));
 const links=[...document.querySelectorAll('.nav-group a')];
 const menu=document.querySelector('.menu-toggle');
 const scrim=document.querySelector('.scrim');
 const groupMap=new Map(links.map(a=>[a.hash.slice(1),a]));
 let delay;
 function setMenu(open){document.body.classList.toggle('nav-open',open);menu.setAttribute('aria-expanded',String(open));scrim.hidden=!open;if(open)input.focus();}
 menu.addEventListener('click',()=>setMenu(!document.body.classList.contains('nav-open')));
 scrim.addEventListener('click',()=>{setMenu(false);menu.focus();});
 function search(){
  const query=input.value.trim().toLocaleLowerCase('ko');
  const words=query.split(/\s+/).filter(Boolean);
  let count=0;
  for(const {el,text} of index){const match=words.every(word=>text.includes(word));el.hidden=!match;if(match)count++;}
  for(const ch of chapters)ch.hidden=![...ch.querySelectorAll('.tutorial')].some(e=>!e.hidden);
  document.body.classList.toggle('searching',!!query);status.hidden=!query;empty.hidden=!query||count>0;
  status.replaceChildren();
  if(query){const label=document.createElement('span');label.textContent=`“${input.value.trim()}” 검색 결과 ${count}개`;const btn=document.createElement('button');btn.type='button';btn.className='clear-search';btn.textContent='검색 초기화';btn.addEventListener('click',clear);status.append(label,btn);}
 }
 function clear(){clearTimeout(delay);input.value='';search();}
 input.addEventListener('input',()=>{clearTimeout(delay);delay=setTimeout(search,120);});
 document.querySelector('#empty .clear-search').addEventListener('click',()=>{clear();input.focus();});
 document.addEventListener('keydown',e=>{
  const typing=/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)||document.activeElement.isContentEditable;
  if(e.key==='/'&&!typing){e.preventDefault();if(matchMedia('(max-width:760px)').matches)setMenu(true);input.focus();}
  if(e.key==='Escape'){if(input.value)clear();if(document.body.classList.contains('nav-open')){setMenu(false);menu.focus();}}
 });
 function activate(id){for(const link of links){const active=link.hash===`#${id}`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}}
 document.addEventListener('click',e=>{
  const link=e.target.closest('a[href^="#"]');if(!link)return;
  const id=link.getAttribute('href').slice(1);const target=document.getElementById(id);if(!target)return;
  if(input.value)clear();setMenu(false);activate(id);
  if(target.classList.contains('tutorial')){const nav=groupMap.get(id);if(nav)nav.closest('details').open=true;}
 });
 function restoreHash(){const id=decodeURIComponent(location.hash.slice(1));const target=document.getElementById(id);if(target){if(target.hidden)clear();const nav=groupMap.get(id);if(nav)nav.closest('details').open=true;activate(id);}}
 window.addEventListener('hashchange',restoreHash);restoreHash();
 const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top);if(visible.length)activate(visible[0].target.id);},{rootMargin:'-90px 0px -65% 0px',threshold:0});
 tutorials.forEach(el=>observer.observe(el));
 matchMedia('(max-width:760px)').addEventListener('change',()=>setMenu(false));
})();
