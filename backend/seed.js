const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting old data...');
  await prisma.rating.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding Demo Data...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. System Admin
  await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@storerating.com',
      password: hashedPassword,
      role: 'SYSTEM_ADMIN',
      address: 'Main HQ, Silicon Valley',
    },
  });

  // 2. Store Owner
  const owner = await prisma.user.create({
    data: {
      name: 'John Store Owner',
      email: 'owner@storerating.com',
      password: hashedPassword,
      role: 'STORE_OWNER',
      address: '456 Business Ave, NY',
    },
  });

  // 3. Normal User
  const user = await prisma.user.create({
    data: {
      name: 'Alice Normal User',
      email: 'user@storerating.com',
      password: hashedPassword,
      role: 'NORMAL_USER',
      address: '789 Residential St, CA',
    },
  });

  // 4. Demo Stores
  const store1 = await prisma.store.create({
    data: {
      name: 'Tech Zone Superstore',
      email: 'techzone@store.com',
      address: '101 Innovation Park',
      ownerId: owner.id,
    },
  });

  await prisma.store.create({
    data: {
      name: 'Urban Fresh Market',
      email: 'urban@store.com',
      address: '202 Market Square',
      ownerId: owner.id,
    },
  });

  // 5. Demo Rating (Fixed to ratingValue)
  await prisma.rating.create({
    data: {
      ratingValue: 5,
      userId: user.id,
      storeId: store1.id,
    },
  });

  console.log('Demo Data Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });