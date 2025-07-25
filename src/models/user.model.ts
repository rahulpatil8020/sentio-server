import mongoose, { Document, Schema, Model } from "mongoose";

// --------------------
// User Interface
// --------------------
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  isOnboarded: boolean;
}

// --------------------
// Static Methods Interface
// --------------------
interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  createUser(data: Partial<IUser>): Promise<IUser>;
  updateUserById(id: string, data: Partial<IUser>): Promise<IUser | null>;
  deleteUserById(id: string): Promise<IUser | null>;
}

// --------------------
// Schema Definition
// --------------------
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, minlength: 4, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isOnboarded: { type: Boolean, default: false },
  },
  {
    versionKey: false,
  }
);

// --------------------
// Static Methods
// --------------------
UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

UserSchema.statics.createUser = function (data: Partial<IUser>) {
  return this.create(data);
};

UserSchema.statics.updateUserById = function (
  id: string,
  data: Partial<IUser>
) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

UserSchema.statics.deleteUserById = function (id: string) {
  return this.findByIdAndDelete(id);
};

// --------------------
// Model
// --------------------
const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
export default User;
