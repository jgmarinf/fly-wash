import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Sesión cerrada' });
  
  response.cookies.set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/'
  });

  return response;
}
