import bcryptjs from 'bcryptjs';
import { prisma, withRetry } from './prisma';
import { generateToken } from './jwt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return await bcryptjs.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

export const registerUser = async (email, password, name) => {
  console.log('[Auth] Register attempt:', email);

  // Check if user already exists (with retry for Neon idle wake-up)
  const existingUser = await withRetry(() =>
    prisma.users.findUnique({
      where: { email },
    })
  );

  console.log('[Auth] Existing user check:', existingUser ? 'FOUND' : 'NOT FOUND');

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user (with retry)
  const user = await withRetry(() =>
    prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })
  );

  console.log('[Auth] User created:', user.id);

  // Generate token
  const token = generateToken(user.id, user.email);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

export const loginUser = async (email, password) => {
  console.log('[Auth] Login attempt:', email);

  // Find user (with retry for Neon idle wake-up)
  const user = await withRetry(() =>
    prisma.users.findUnique({
      where: { email },
    })
  );

  console.log('[Auth] User lookup:', user ? 'FOUND' : 'NOT FOUND');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  console.log('[Auth] Login successful for:', user.id);

  // Generate token
  const token = generateToken(user.id, user.email);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
};

export const getUserFromToken = async (token) => {
  const { verifyToken } = await import('./jwt');
  const decoded = verifyToken(token);

  if (!decoded) {
    return null;
  }

  const user = await withRetry(() =>
    prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })
  );

  return user;
};
