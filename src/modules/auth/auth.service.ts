import { Injectable, HttpStatus, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { RegistrationData } from './index.interface';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<any>) {}
  async register(registrationData: RegistrationData): Promise<any> {
    const cursor = await this.userModel.countDocuments({
      email: registrationData.email,
    });
    if (cursor) throw new ConflictException('User already exist');
    else {
      const hashPassword = await bcrypt.hash(registrationData.password, 10);
      const createdUser = await new this.userModel({
        ...registrationData,
        password: hashPassword,
      });
      createdUser.save();
      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'User Created Successfully',
      };
    }
  }
}
