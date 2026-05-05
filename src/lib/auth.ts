import { cookies } from 'next/headers';
import crypto from 'crypto';
const SESSION_KEY='oms_session';
export function createSession(email:string){
 const token = crypto.createHmac('sha256',process.env.SESSION_SECRET||'dev').update(email).digest('hex');
 cookies().set(SESSION_KEY,`${email}:${token}`,{httpOnly:true,path:'/'});
}
export function clearSession(){ cookies().delete(SESSION_KEY); }
export function getSessionEmail(){ const c=cookies().get(SESSION_KEY)?.value; if(!c) return null; const [email,token]=c.split(':'); const valid=crypto.createHmac('sha256',process.env.SESSION_SECRET||'dev').update(email).digest('hex'); return token===valid?email:null; }
