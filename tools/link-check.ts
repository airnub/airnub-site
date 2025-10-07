#!/usr/bin/env tsx
import http from 'node:http'; import https from 'node:https'; import { JSDOM } from 'jsdom';
import fs from 'node:fs';

type App = { key:string; base:string; start:string; };
const APPS:App[] = [
  { key:'airnub',  base:'http://localhost:3101', start:'/' },
  { key:'speckit', base:'http://localhost:3102', start:'/' },
  { key:'adf',     base:'http://localhost:3103', start:'/' }
];
const get=(url:string)=>new Promise<{status:number,html:string}>((res,rej)=>{
  const u=new URL(url); const c=u.protocol==='https:'?https:http;
  const r=c.get(u,(rsp)=>{ const bufs:Buffer[]=[]; rsp.on('data',d=>bufs.push(Buffer.from(d))); rsp.on('end',()=>res({status:rsp.statusCode||0, html:Buffer.concat(bufs).toString('utf8')}));}).on('error',rej);
  r.setTimeout(6000,()=>r.destroy(new Error('timeout')));
});
async function crawl(app:App){
  const seen=new Set<string>(), broken:string[]=[];
  const q:[string,number][]=[[app.start,0]];
  while(q.length){
    const [path,depth]=q.shift()!;
    const url=new URL(path, app.base).toString();
    if(seen.has(url) || !url.startsWith(app.base)) continue; seen.add(url);
    try{
      const {status,html}=await get(url);
      if(status>=400){ broken.push(`${url} → ${status}`); continue; }
      if(depth<2){
        const dom=new JSDOM(html); const links=[...dom.window.document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')||'');
        for(const href of links){ if(!href) continue; if(href.startsWith('http')) { if(href.startsWith(app.base)) q.push([href,depth+1]); }
          else if(href.startsWith('/')) q.push([href,depth+1]); }
      }
    }catch(e:any){ broken.push(`${url} → ${String(e?.message||e)}`); }
  }
  return broken;
}

(async()=>{
  // Ensure servers are running (use the smoke script start if you want to automate)
  const all:any={};
  for(const a of APPS){ all[a.key]=await crawl(a); }
  const md=['# Link Check','', ...Object.entries(all).map(([k,arr]:any)=>`## ${k}\n${arr.length?arr.map((l:string)=>`- ${l}`).join('\n'):'- No broken internal links'}`)];
  fs.writeFileSync('LINK-REPORT.md', md.join('\n'), 'utf8');
  const hasBroken = Object.values(all).some((arr:any)=> (arr as string[]).length>0);
  if(hasBroken) process.exit(2);
})();
