import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const pages=['index.html','robots-in-action/index.html','contact/index.html','privacy/index.html','404.html'];
test('Every generated page has one main heading and valid local assets and navigation',async()=>{
for(const page of pages){const html=await readFile(`dist/${page}`,'utf8');assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page);for(const [,href] of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){const file=resolve('dist','.'+href+(href.endsWith('/')?'index.html':''));assert.ok((await stat(file)).isFile(),`${page}: ${href}`);}}
});
test('Both robot options are actual options and contact remains explicit about sending',async()=>{const html=await readFile('dist/contact/index.html','utf8');assert.match(html,/<option value="r1">Unitree R1 Air<\/option>/);assert.match(html,/<option value="g1">Unitree G1 EDU U9<\/option>/);assert.doesNotMatch(html,/<\/option\s/);assert.match(html,/Nothing is sent or booked/);assert.match(html,/Copying a brief does not send it/);});
test('Gallery does not invent client deployments when content is empty',async()=>{const html=await readFile('dist/robots-in-action/index.html','utf8');assert.match(html,/There are no client stories published yet/);assert.doesNotMatch(html,/<video/);});
test('Preview stays out of search and uses no external scripts',async()=>{for(const page of pages){const html=await readFile(`dist/${page}`,'utf8');assert.match(html,/noindex,nofollow/);assert.doesNotMatch(html,/<script[^>]*src="https?:/);}});
test('Live Spline uses the observed preview with attribution and a pause control',async()=>{const html=await readFile('dist/index.html','utf8');assert.match(html,/b5699b21-c899-49e4-93ea-c50ffc534501\?view=preview/);assert.match(html,/id="toggle-spline"/);assert.match(html,/aximoris/);assert.match(html,/CC BY 4.0/);const headers=await readFile('dist/_headers','utf8');assert.match(headers,/frame-src https:\/\/app.spline.design/);});
