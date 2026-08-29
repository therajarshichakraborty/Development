import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";
import type { UserDocument } from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";

interface AuthResponse {
  user: Record<string, unknown>;
  token: string;
}

export class AuthService {
  private sanitizeUser(user: UserDocument): Record<string, unknown> {
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    return userObj;
  }

  async register({
    email,
    password,
    name,
  }: Partial<UserDocument>): Promise<AuthResponse> {
    if (!email || !password || !name) {
      throw ApiError.badRequest("Name, email and password are required");
    }
    const emailExists = await userRepository.existsByEmail(email);
    if (emailExists) {
      throw ApiError.conflict("Email already registered");
    }
    const newUser = await userRepository.create({
      email,
      name,
      password,
    });

    const token = generateToken({
      id: newUser._id.toString(),
      email: newUser.email,
      roles: newUser.roles,
    });

    return {
      user: this.sanitizeUser(newUser),
      token,
    };
  }

  async login({
    email,
    password,
  }: Pick<UserDocument, "email" | "password">): Promise<AuthResponse> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid credentials");
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      roles: user.roles,
    });

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getMe(userId: string): Promise<Record<string, unknown>> {
    if (!userId) {
      throw ApiError.unauthorized("User ID not provided");
    }
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return this.sanitizeUser(user);
  }
}

export const authService = new AuthService();
