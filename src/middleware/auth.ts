const jwt = require('jsonwebtoken');
import { User } from "../models/User";

const auth = async (req: any, res: any, next: any) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const data = jwt.verify(token, process.env.JWT_KEY);

  if (!data) {
    res.status(401).send({
      error: 'Not authorized to access this resource'
    })
  }
  req.userId = data._id;
  next();

};
export default auth;