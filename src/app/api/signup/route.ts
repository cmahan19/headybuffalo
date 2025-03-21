import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

interface SignupRequest {
  email: string;
  password: string;
}

// Simulating an in-memory "database" for demo purposes
let users: { email: string; password: string }[] = [];

export async function POST(request: Request) {
  const { email, password }: SignupRequest = await request.json();

  // Validation: Ensure email and password are provided
  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required.' },
      { status: 400 }
    );
  }

  // Check if the email already exists in the "database"
  if (users.find((user) => user.email === email)) {
    return NextResponse.json(
      { message: 'Email already exists.' },
      { status: 400 }
    );
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save the new user (in-memory for now)
  users.push({ email, password: hashedPassword });

  return NextResponse.json(
    { message: 'User signed up successfully.' },
    { status: 201 }
  );
}
