import bcrypt from "bcrypt";
import jwt, { type SignOptions } from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { ApiError } from "../utils/ApiError.js";
import type { UserDocument } from "../models/user.model.js";

interface AuthResponse {
  user: Omit<UserDocument, "password">;
  token: string;
}

export class AuthService {
  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET || "fallback_secret_key";
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
      "1d") as SignOptions["expiresIn"];

    return jwt.sign({ id: userId }, secret, { expiresIn });
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    return userObj;
  }

  async register({
    email,
    password,
    name,
  }: Partial<UserDocument>): Promise<AuthResponse> {
    if (!email || !password) {
      throw ApiError.badRequest("Email and password are required");
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

    const token = this.generateToken(newUser._id.toString());

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

    const token = this.generateToken(user._id.toString());

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getMe(userId: string): Promise<Omit<UserDocument, "password">> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return this.sanitizeUser(user);
  }
}
