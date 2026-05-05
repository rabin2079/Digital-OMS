import { prisma } from '@/lib/prisma';
export async function POST(req:Request){const f=await req.formData();await prisma.order.create({data:{orderCode:String(f.get('orderCode')),customerId:Number(f.get('customerId')),serviceId:Number(f.get('serviceId')),customPrice:Number(f.get('customPrice')),notes:String(f.get('notes')||'')||null}});return Response.redirect(new URL('/orders',req.url));}
