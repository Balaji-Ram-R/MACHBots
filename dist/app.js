const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#main-nav').classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});

const uses={events:['A guest that starts conversations.','Explore a robot experience for your exhibition, celebration or brand event. Tell us about the audience and the moment you want to create.'],schools:['Turn curiosity into a closer look.','Make room for questions, discovery and a planned introduction to humanoid robotics. We discuss the activities, supervision and setup with your school.'],business:['Make your next showcase different.','Explore a distinctive presence for your launch, exhibition or business gathering. The interaction and programming are shaped around an agreed scope.']};
const tabs=[...document.querySelectorAll('[data-use]')];
function activate(tab){tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});const p=document.querySelector('#use-panel');p.setAttribute('aria-labelledby',tab.id);p.querySelector('h3').textContent=uses[tab.dataset.use][0];p.querySelector('p').textContent=uses[tab.dataset.use][1];}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activate(tab));tab.addEventListener('keydown',e=>{let i=index;if(e.key==='ArrowRight')i=(i+1)%tabs.length;else if(e.key==='ArrowLeft')i=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=tabs.length-1;else return;e.preventDefault();activate(tabs[i]);tabs[i].focus();});});

const form=document.querySelector('#enquiry-form');
if(form){const params=new URLSearchParams(location.search);const robot=params.get('robot');if(['r1','g1'].includes(robot))form.elements.robot.value=robot;const topic=params.get('topic');if(['rental','customization','general'].includes(topic))form.elements.topic.value=topic;
const result=document.querySelector('#brief-result'), text=document.querySelector('#brief-text'),status=document.querySelector('#copy-status');
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const d=new FormData(form);const models={r1:'Unitree R1 Air',g1:'Unitree G1 EDU U9',unsure:'Please help me choose'};const topics={rental:'Rental and pricing',customization:'Customization',general:'General query'};text.value=['Hello Robogen Technologies,','',`I would like to discuss: ${topics[d.get('topic')]}`,`Robot: ${models[d.get('robot')]}`,`Occasion: ${d.get('occasion')}`,`Preferred date: ${d.get('date')||'Not decided'}`,`City: ${String(d.get('city')).trim()||'To be discussed'}`,'',String(d.get('message')).trim()||'Please help me explore the options.','','Please let me know the possibilities, availability and pricing.'].join('\n');
const config=JSON.parse(document.querySelector('#business-config').textContent);if(config.email){const a=document.querySelector('#email-brief');a.hidden=false;a.href=`mailto:${config.email}?subject=${encodeURIComponent('Robot rental enquiry')}&body=${encodeURIComponent(text.value)}`;}if(config.whatsapp){const a=document.querySelector('#whatsapp-brief');a.hidden=false;a.href=`https://wa.me/${config.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent(text.value)}`;a.target='_blank';a.rel='noopener noreferrer';}
form.hidden=true;result.hidden=false;status.textContent='Your brief is ready to copy. It has not been sent.';document.querySelector('#brief-heading').focus();});
document.querySelector('#edit-brief').addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.querySelector('input').focus();});
document.querySelector('#copy-brief').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text.value);status.textContent='Copied. Share your brief with the team when you’re ready.';}catch{text.focus();text.select();status.textContent='Select and copy the brief above using your device’s copy command.';}});
}

// Embed the verified Community preview, never a guessed runtime URL.
const stage=document.querySelector('#spline-stage');
if(stage){
const config=JSON.parse(document.querySelector('#business-config').textContent),button=document.querySelector('#toggle-spline'),status=document.querySelector('#spline-status');
let frame=null,timer=null;
function unload(){clearTimeout(timer);frame?.remove();frame=null;stage.classList.remove('scene-open');button.textContent='Load interactive robot';button.setAttribute('aria-pressed','false');status.textContent='3D is paused. You can explore the rental robots below.';}
function load(){if(frame)return;const url=new URL(config.splinePreview);if(url.origin!=='https://app.spline.design')return;frame=document.createElement('iframe');frame.src=url.href;frame.title='Interactive NEXBOT robot by aximoris, made with Spline';frame.allow='fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';frame.setAttribute('allowfullscreen','');frame.addEventListener('load',()=>{clearTimeout(timer);status.textContent='Move your pointer inside the scene to explore. Rendering may take a moment.';});stage.append(frame);stage.classList.add('scene-open');button.textContent='Pause 3D';button.setAttribute('aria-pressed','true');status.textContent='Loading the interactive Spline scene…';timer=setTimeout(()=>{status.textContent='Still loading? Pause 3D or open the scene directly in Spline.';},20000);}
button.addEventListener('click',()=>frame?unload():load());
if(matchMedia('(min-width: 701px) and (prefers-reduced-motion: no-preference)').matches)load();
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches)unload();});
}
document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(other!==v)other.pause();})));
