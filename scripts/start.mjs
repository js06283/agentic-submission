import {spawn} from 'node:child_process';
import {cpSync,mkdirSync} from 'node:fs';
mkdirSync('.next/standalone/.next',{recursive:true});cpSync('.next/static','.next/standalone/.next/static',{recursive:true});cpSync('public','.next/standalone/public',{recursive:true});
if(!process.env.INSTRUCTOR_PASSWORD||process.env.INSTRUCTOR_PASSWORD.length<16||!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32){console.error('Set INSTRUCTOR_PASSWORD (16+ characters) and SESSION_SECRET (32+ characters).');process.exit(1)}
const child=spawn(process.execPath,['.next/standalone/server.js'],{stdio:'inherit',env:{...process.env,HOSTNAME:'0.0.0.0',PORT:process.env.PORT||'3000'}});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code??1));
