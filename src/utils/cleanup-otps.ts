// utils/cleanup-otps.ts
// Run this periodically to clean up expired OTPs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanupExpiredOTPs() {
  try {
    const result = await prisma.otpRecord.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
    
    console.log(`Cleaned up ${result.count} expired OTP records`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// You can create an API route to call this function
// /api/admin/cleanup-otps/route.ts
export async function GET() {
  try {
    const cleaned = await cleanupExpiredOTPs();
    return Response.json({ 
      message: `Cleaned up ${cleaned} expired OTP records` 
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to cleanup OTPs' 
    }, { status: 500 });
  }
}