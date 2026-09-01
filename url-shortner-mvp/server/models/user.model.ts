import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  roles?: string[] | undefined;
  isVerified?: boolean | undefined;
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string | undefined;
  resetPasswordExpires?: Date | undefined;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
const userModelSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    roles: {
      type: [String],
      default: ["user"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

userModelSchema.plugin(mongooseAggregatePaginate)

userModelSchema.pre<UserDocument>("save", async function () {
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

userModelSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserDocument>("User", userModelSchema);

export default User;
