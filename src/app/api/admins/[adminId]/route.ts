import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: { adminId: string } }) {
  const adminId = parseInt(params.adminId);
  if (!adminId) return new Response('Admin ID required', { status: 400 });

  try {
    await prisma.admin.delete({ where: { admin_id: adminId } });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
}
