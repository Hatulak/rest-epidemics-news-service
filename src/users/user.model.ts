import * as mongoose from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  EDITOR = 'EDITOR',
  NORMAL = 'NORMAL',
}

export const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  role: { type: UserRole, required: true },
});

export interface User extends mongoose.Document {
  id: string;
  username: string;
  password: string;
  salt: string;
  role: UserRole;
}
