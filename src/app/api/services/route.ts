import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const f = await req.formData();
  const action = String(f.get('action') || 'create');

  if (action === 'delete') {
    await prisma.service.delete({ where: { id: Number(f.get('id')) } });
    return NextResponse.redirect(new URL('/services', req.url));
  }

  if (action === 'toggle') {
    const id = Number(f.get('id'));
    const current = String(f.get('current')) === 'true';
    await prisma.service.update({ where: { id }, data: { active: !current } });
    return NextResponse.redirect(new URL('/services', req.url));
  }

  await prisma.service.create({
    data: {
      name: String(f.get('name')),
      category: String(f.get('category')),
      description: String(f.get('description') || '') || null,
      basePrice: f.get('basePrice') ? Number(f.get('basePrice')) : null,
      active: f.get('active') === 'on',
    },
  });

  return NextResponse.redirect(new URL('/services', req.url));
}
