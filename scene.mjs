import {Application} from '@splinetool/runtime';
const canvas=document.querySelector('#robot-canvas');
if(canvas){
 const status=document.querySelector('#scene-status'),button=document.querySelector('#motion-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let app,paused=reduced.matches;
 const update=()=>{button.textContent=paused?'Resume motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));};
 update();
 try{
  app=new Application(canvas,{renderOnDemand:true});
  await app.load('https://prod.spline.design/2HkZDmfVk8kWAnOi/scene.splinecode');
  app.setBackgroundColor('transparent');
  // The exported wordmark is a group of meshes named logo, not a text object.
  const logo=app.findObjectByName('logo');
  if(logo)logo.visible=false;
  const fit=()=>app.setZoom(innerWidth<560?.62:innerWidth<900?.8:1);
  fit();
  window.addEventListener('resize',fit);
  app.setGlobalEvents(true);
  status.textContent='MOVE YOUR CURSOR. SAY HELLO.';
  if(paused)app.stop();
  button.addEventListener('click',()=>{paused=!paused;paused?app.stop():app.play();update();});
  reduced.addEventListener('change',e=>{paused=e.matches;paused?app.stop():app.play();update();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)app.stop();else if(!paused)app.play();});
 }catch(error){console.error('Robot scene could not load',error);canvas.closest('section').classList.add('scene-error');status.textContent='3D unavailable. Explore our rental robots below.';button.hidden=true;}
}
