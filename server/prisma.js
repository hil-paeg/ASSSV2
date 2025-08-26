// ...existing code...
import { PrismaClient } from '../generated/prisma/index.js';

const globalKey = globalThis;
globalKey.__prisma ??= new PrismaClient();

export const prisma = globalKey.__prisma;
// ...existing code...

// can u give me a page in next js for my ticketing app in which the page will create a new client  from the admin section . 