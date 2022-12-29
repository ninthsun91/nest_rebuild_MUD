import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    datasources: {
        db: { url: process.env.TEST_DB_URL }
    }
});
export default prisma;