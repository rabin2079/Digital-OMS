import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@digitalsolution.com.np' },
    update: {},
    create: { email: 'admin@digitalsolution.com.np', passwordHash, name: 'Admin' }
  });
  await prisma.setting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });
}
main().finally(()=>prisma.$disconnect());
