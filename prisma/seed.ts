import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const password = await hash('password');
  await prisma.user.create({
    data: {
      username: 'admin',
      password,
      email: 'admin@hydromint.xyz',
      roles: ['ADMIN', 'USER'],
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
