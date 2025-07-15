import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { ErrorConstant } from '../constant/error.js';

const generateAuthToken = (payload) => {
  if (!payload) {
    throw new Error(ErrorConstant.ErrorEmptyPayloadJWT);
  }
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
};

export default generateAuthToken;