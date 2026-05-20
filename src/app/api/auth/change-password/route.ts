import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { getUserByEmail, updateUser } from '@/lib/users';

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { currentPassword, newPassword } = await request.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both fields are required' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  const user = getUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
  }

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    return NextResponse.json({ error: 'New password must be different from current password' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  updateUser({ ...user, password: hashedPassword, mustChangePassword: false });

  return NextResponse.json({ success: true });
}
