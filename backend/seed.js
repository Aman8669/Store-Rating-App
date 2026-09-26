const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPasswordAdmin = await bcrypt.hash('Admin@1234', 10);
  const hashedPasswordOwner = await bcrypt.hash('Owner@1234', 10);
  const hashedPasswordUser = await bcrypt.hash('User@1234', 10);

  // 1. System Admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Alexander System Administrator',
      email: 'admin@example.com',
      address: '123 Admin Street, Tech City, NY',
      password: hashedPasswordAdmin,
      role: 'SYSTEM_ADMIN',
    },
  });

  // 2. Store Owner
  await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Samantha Store Owner Manager',
      email: 'owner@example.com',
      address: '456 Commerce Boulevard, Retail Hub',
      password: hashedPasswordOwner,
      role: 'STORE_OWNER',
    },
  });

  // 3. Normal User
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Christopher Customer User',
      email: 'user@example.com',
      address: '789 Residential Avenue, Suburban Area',
      password: hashedPasswordUser,
      role: 'NORMAL_USER',
    },
  });

  console.log('✅ Demo Users Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });