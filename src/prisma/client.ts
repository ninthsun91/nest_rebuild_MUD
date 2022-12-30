import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient({
//   datasources: {
//     db: { url: process.env.TEST_DB_URL },
//   },
// });
const prisma = new PrismaClient();
export default prisma;