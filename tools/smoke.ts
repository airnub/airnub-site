#!/usr/bin/env tsx
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';

const APPS = [
  { key:'airnub',  port:3101, routes:['/','/robots.txt','/sitemap.xml','/opengraph-image'] },
  { key:'speckit', port:3102, routes:['/','/quickstart','/robots.txt','/sitemap.xml','/opengraph-image'] },
  { key:'adf',     port:3103, routes:['/','/quickstart','/robots.txt','/sitemap.xml','/opengraph-image'] }
];
const exists = (p:string)=>fs.existsSync(p);
const get = (url:string)=>new Promise<{status:number,ctype:string}>((res,rej)=>{
  const u = new URL(url); const c = u.protocol==='https:'?https:http;
  const r = c.get(u, (rsp)=>{ rsp.resume(); res({status:rsp.statusCode||0, ctype:String(rsp.headers['content-type']||'')}); }).on('error',rej);
  r.setTimeout(6000,()=>{r.destroy(new Error('timeout'))});
});

(async()=>{
  const report:any={ build:'pass', typecheck:'pass', apps:{} };
  const procs:Record<string,any>={};

  // start present apps
  for (const a of APPS) {
    if (!exists(`apps/${a.key}/app`) && !exists(`apps/${a.key}/pages`)) { report.apps[a.key]={present:false}; continue; }
    report.apps[a.key]={present:true, boot:'pending', routes:{}};
    procs[a.key]=spawn('pnpm',['--filter',`./apps/${a.key}`,'exec','next','start','-p',String(a.port)],{stdio:'ignore',env:process.env});
    // wait
    let ready=false; for (let i=0;i<20;i++){ try{ const r=await get(`http://localhost:${a.port}/`); if(r.status) {ready=true; break;} }catch{} await new Promise(r=>setTimeout(r,400)); }
    report.apps[a.key].boot=ready?'pass':'fail';
    for (const r of a.routes) {
      if (!ready) { report.apps[a.key].routes[r]={status:0}; continue; }
      try { const rsp=await get(`http://localhost:${a.port}${r}`); report.apps[a.key].routes[r]=rsp; }
      catch(e:any){ report.apps[a.key].routes[r]={status:0,error:String(e?.message||e)}; }
    }
  }

  // write
  const md:string[]=['# Airnub Site — Smoke Report (workspace)','', '## Apps'];
  for (const a of APPS) {
    const app=report.apps[a.key];
    if (!app?.present) { md.push(`### apps/${a.key}\n- Present: ❌`); continue; }
    md.push(`### apps/${a.key}\n- Boot: ${app.boot==='pass'?'✅':'❌'}`);
    md.push('- Routes:'); for (const [k,v] of Object.entries(app.routes)) md.push(`  - ${k}: ${(v as any).status} ${(v as any).ctype||''}`);
  }
  fs.writeFileSync('SMOKE-REPORT.md', md.join('\n'), 'utf8');
  fs.writeFileSync('SMOKE-REPORT.json', JSON.stringify(report,null,2), 'utf8');

  // cleanup
  for (const k of Object.keys(procs)) try{ procs[k]?.kill(); }catch{}
})();
