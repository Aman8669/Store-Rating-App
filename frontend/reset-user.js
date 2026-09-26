const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetUserPassword() {
  // Hash the exact password
  const hashedPassword = await bcrypt.hash('User@1234', 10);

  // Update password in database
  const updatedUser = await prisma.user.update({
    where: { email: 'user@example.com' },
    data: { password: hashedPassword },
  });

  console.log('✅ Password successfully reset for:', updatedUser.email);
}

resetUserPassword()
  .catch((e) => {
    console.error('❌ Error resetting password:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });