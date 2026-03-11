import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createToken, AUTH_COOKIE_OPTIONS } from '@/lib/auth';
import { usersCollection } from '@/lib/db/collections';

const MAX_NAME_LENGTH = 50;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const name: unknown = body?.name;

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Имя не может быть пустым' }, { status: 422 });
    }

    if (name.trim().length > MAX_NAME_LENGTH) {
      return NextResponse.json(
        { error: `Имя не может быть длиннее ${MAX_NAME_LENGTH} символов` },
        { status: 422 },
      );
    }

    const users = await usersCollection;
    const result = await users.insertOne({ name: name.trim(), coins: 0 });

    const token = await createToken({
      name: name.trim(),
      userId: result.insertedId.toString(),
      hasPhone: false,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth', token, AUTH_COOKIE_OPTIONS);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
