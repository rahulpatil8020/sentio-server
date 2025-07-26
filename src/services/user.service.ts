import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model";
import { RegisterUserInput } from "../types/user.types";
import { AuthError } from "../utils/errors/errors";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.utils";

const SALT_ROUNDS = 10;

export const registerUser = async (
  data: RegisterUserInput
) => {
  // Normalize email
  const email = data.email.toLowerCase();

  // Check if user already exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    throw new AuthError("Email already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Create user
  const user = await User.createUser({
    ...data,
    email,
    password: hashedPassword,
  });

  const accessToken = signAccessToken({
    userId: user._id,
    email: user.email,
  });
  const refreshToken = signRefreshToken({
    userId: user._id,
    email: user.email,
  });


  // Remove password before returning
  const { password, ...safeUser } = user.toObject();
  return { accessToken, refreshToken, user: safeUser };
};

export const loginUser = async (email: string, password: string) => {
  const normalizedEmail = email.toLowerCase();

  // Find user by email
  const user = await User.findByEmail(normalizedEmail);
  if (!user) throw new AuthError("No User with this Email");

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthError("Invalid email or password");

  // Generate tokens
  const accessToken = signAccessToken({
    userId: user._id,
    email: user.email,
  });
  const refreshToken = signRefreshToken({
    userId: user._id,
    email: user.email,
  });

  // Remove password before returning
  const { password: _, ...safeUser } = user.toObject();

  return { accessToken, refreshToken, user: safeUser };
};

export const onboardUser = async (
  userId: string,
  data: {
    city?: string;
    country?: string;
    profession?: string;
    goals?: string[];
    isOnboarded: boolean;
  }
) => {
  const user = await User.updateUserById(userId, data);
  return user;
};

export const refreshAccessToken = (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  const newAccessToken = signAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  return newAccessToken;
};
