import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

const canvas=document.querySelector('#robot-canvas');
if(canvas){
 const status=document.querySelector('#scene-status'),button=document.querySelector('#motion-toggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let renderer,paused=reduced.matches,visible=true,head,baseHead,frame=0,last=0;
 const pointer=new THREE.Vector2(),current=new THREE.Vector2();
 const updateButton=()=>{button.textContent=paused?'Resume motion':'Pause motion';button.setAttribute('aria-pressed',String(paused));};
 updateButton();
 try{
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.setClearColor(0x000000,0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  const scene=new THREE.Scene();
  const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();
  const environment=pmrem.fromScene(room,.04);
  scene.environment=environment.texture;
  room.dispose();pmrem.dispose();
  const gltf=await new GLTFLoader().loadAsync('/assets/nexbot.gltf');
  const model=gltf.scene;
  model.getObjectByName('logo').visible=false;
  const shell=new THREE.MeshPhysicalMaterial({color:0x081425,metalness:.88,roughness:.18,clearcoat:1,clearcoatRoughness:.08});
  const face=new THREE.MeshPhysicalMaterial({color:0x02050c,metalness:1,roughness:.04,clearcoat:1,clearcoatRoughness:.03});
  model.traverse(object=>{if(object.isLight)object.visible=false;if(object.isMesh)object.material=object.name==='Head_2'?face:shell;});
  scene.add(model);scene.updateMatrixWorld(true);
  const camera=new THREE.PerspectiveCamera(45,1,.1,1000);
  const bounds=new THREE.Box3().setFromObject(model.getObjectByName('Bot'));
  const size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
  head=model.getObjectByName('Head');baseHead=head?.quaternion.clone();
  const key=new THREE.DirectionalLight(0x7cf7ff,5);key.position.set(-8,12,10);scene.add(key);
  const rim=new THREE.DirectionalLight(0x925cff,5);rim.position.set(9,7,-4);scene.add(rim);
  const front=new THREE.DirectionalLight(0xeaf9ff,1.5);front.position.set(0,4,10);scene.add(front);
  const render=()=>renderer.render(scene,camera);
  const fit=()=>{const {width,height}=canvas.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;const distance=Math.max(size.y*.82,size.x/camera.aspect*.64)/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)));const target=center.clone().add(new THREE.Vector3(0,size.y*.16,0));camera.position.set(target.x,target.y,bounds.max.z+distance);camera.lookAt(target);camera.updateProjectionMatrix();render();};
  new ResizeObserver(fit).observe(canvas);fit();
  const animate=time=>{frame=0;if(paused||!visible||document.hidden)return;const dt=Math.min((time-last)/1000,.05);last=time;current.lerp(pointer,1-Math.exp(-7*dt));if(head){const offset=new THREE.Quaternion().setFromEuler(new THREE.Euler(current.y*.22,current.x*.42,0,'YXZ'));head.quaternion.copy(baseHead).multiply(offset);}render();frame=requestAnimationFrame(animate);};
  const start=()=>{if(!frame&&!paused&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(animate);}};
  window.addEventListener('pointermove',event=>{const r=canvas.getBoundingClientRect();pointer.set(THREE.MathUtils.clamp((event.clientX-r.left)/r.width*2-1,-1,1),THREE.MathUtils.clamp((event.clientY-r.top)/r.height*2-1,-1,1));},{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>pointer.set(0,0));
  button.addEventListener('click',()=>{paused=!paused;updateButton();if(paused){cancelAnimationFrame(frame);frame=0;}else start();});
  reduced.addEventListener('change',event=>{paused=event.matches;updateButton();if(paused){cancelAnimationFrame(frame);frame=0;}else start();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;start();}).observe(canvas);
  document.addEventListener('visibilitychange',start);
  status.textContent='MOVE YOUR CURSOR. SAY HELLO.';start();
 }catch(error){console.error('Robot model could not load',error);status.textContent='3D unavailable. Explore our rental robots below.';button.hidden=true;}
}
