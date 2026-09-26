const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const userPassword = await bcrypt.hash('User@1234', 10);
  const ownerPassword = await bcrypt.hash('Owner@1234', 10);

  // Admin User
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { password: adminPassword },
    create: {
      name: 'System Admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'SYSTEM_ADMIN',
    },
  });

  // Normal User
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: { password: userPassword },
    create: {
      name: 'Normal User',
      email: 'user@example.com',
      password: userPassword,
      role: 'NORMAL_USER',
    },
  });

  // Store Owner
  await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: { password: ownerPassword },
    create: {
      name: 'Samantha Store Owner Manager',
      email: 'owner@example.com',
      password: ownerPassword,
      role: 'STORE_OWNER',
    },
  });

  console.log('Database seeded with fresh hashed passwords successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });