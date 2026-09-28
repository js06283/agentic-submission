import {sqlite} from '@/lib/lab-store';
export const dynamic='force-dynamic';
export function GET(){try{if(!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32||!process.env.INSTRUCTOR_PASSWORD||process.env.INSTRUCTOR_PASSWORD.length<16)throw new Error();sqlite().prepare('SELECT 1').get();return Response.json({ok:true})}catch{return Response.json({ok:false},{status:503})}}
