import { User } from "../../models/User";

export const findAllUsers = () => {
  return User.find();
};