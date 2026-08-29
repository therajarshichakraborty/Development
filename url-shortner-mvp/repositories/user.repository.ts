import type { UserDocument } from "../models/user.model.js";
import User from "../models/user.model.js";

class UserRepository {
  async findByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email: email.toLowerCase().trim() }).select(
      "+password"
    );
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await User.findById(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const userExists = await User.exists({ email: email.toLowerCase().trim() });
    return userExists !== null;
  }

  async create(userData: Partial<UserDocument>): Promise<UserDocument> {
    const newUser = new User(userData);
    return newUser.save();
  }
}

export const userRepository = new UserRepository();
