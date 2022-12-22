import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: { _id: any; email: string; password: string; role: string };
}

export interface RegistrationData {
  username: string;
  email: string;
  password: string;
  role: string;
}
