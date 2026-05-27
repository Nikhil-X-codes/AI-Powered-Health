import bcryptjs from 'bcryptjs';
import { prisma } from './prisma';
import { generateToken } from './jwt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  return await bcryptjs.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

export const registerUser = async (email, password, name) => {
  // Check if user already exists
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

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
  // Find user
  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

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

  const user = await prisma.users.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
};
