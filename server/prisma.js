// ...existing code...
import { PrismaClient } from '../generated/prisma/index.js';

const globalKey = globalThis;
globalKey.__prisma ??= new PrismaClient();

export const prisma = globalKey.__prisma;
// ...existing code...