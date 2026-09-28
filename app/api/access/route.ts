import {cookies} from 'next/headers';
import {randomUUID} from 'node:crypto';
import {equal,groupToken,sameOrigin,setSession,throttle,user,verifyGroup} from '@/lib/access';
import {sqlite} from '@/lib/lab-store';
import {blankDesign} from '@/lib/types';
export const dynamic='force-dynamic';
const reply=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){const u=await user();if(u?.userId!=='instructor')return reply({error:'Instructor access required.'},403);return reply({groups:sqlite().prepare('SELECT id,name FROM lab_groups ORDER BY name').all().map(g=>({id:g.id,name:g.name,token:groupToken(String(g.id))}))})}
export async function POST(req:Request){if(!sameOrigin(req))return reply({error:'Please use this site.'},403);const raw=await req.text();if(raw.length>2000)return reply({error:'Request too large.'},413);let p;try{p=JSON.parse(raw)}catch{return reply({error:'Invalid request.'},400)}
 if(p.type==='logout'){(await cookies()).delete('lab_session');return reply({ok:true})}
 if(p.type==='create'){const u=await user();if(u?.userId!=='instructor')return reply({error:'Instructor access required.'},403);const name=typeof p.name==='string'?p.name.trim():'';if(!name||name.length>60)return reply({error:'Enter a group name, up to 60 characters.'},400);const phase=sqlite().prepare('SELECT revealed AS phase FROM gallery_settings WHERE id=1').get() as {phase:number}|undefined;if(phase?.phase)return reply({error:'Group creation is closed after the gallery reveal.'},409);const id=randomUUID();try{sqlite().prepare('INSERT INTO lab_groups(id,owner,name,design,reflection,updated) VALUES(?,?,?,?,?,?)').run(id,id,name,JSON.stringify(blankDesign),'',new Date().toISOString())}catch{return reply({error:'That group name already exists.'},409)}return reply({token:groupToken(id),name})}
 if(!throttle(req))return reply({error:'Too many attempts. Wait 10 minutes.'},429);
 if(p.type==='instructor'){const pass=process.env.INSTRUCTOR_PASSWORD;if(!pass||pass.length<16)return reply({error:'Instructor password is not configured.'},503);if(typeof p.password!=='string'||!equal(p.password,pass))return reply({error:'Incorrect password.'},401);await setSession('instructor');return reply({ok:true})}
 if(p.type==='group'&&typeof p.token==='string'){const id=verifyGroup(p.token);if(!id)return reply({error:'This group link is invalid. Ask your instructor for the link.'},401);await setSession(id);return reply({ok:true})}return reply({error:'Invalid request.'},400)
}
