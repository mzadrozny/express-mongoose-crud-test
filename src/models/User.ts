import { Document, Schema, Model, model } from "mongoose";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

export interface IUser {
  email?: string;
  name: string;
  password: string;
  tokens: {
    token: {
      type: String,
      required: true
    }
  }[];
}

export interface IUserDocument extends IUser, Document {
  generateAuthToken(): Promise<string>;

};

export interface IUserModel extends Model<IUserDocument> {
  findByCredentials(email: string, password: string): Promise<IUserDocument>;
}

export const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, },
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, minlength: 7 },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.pre<IUserDocument>('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
})

UserSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user = this;
  const token = jwt.sign({
    _id: user._id
  }, process.env.JWT_KEY);
  return token;
}

UserSchema.statics.findByCredentials = async (email: string, password: string): Promise<IUserDocument> => {
  const user = await User.findOne({
    email
  });
  if (!user) {
    throw new Error('Invalid login credentials');
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error('Invalid login credentials');
  }
  return user
}

export const User: IUserModel = model<IUserDocument, IUserModel>('User', UserSchema);