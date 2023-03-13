import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../auth/schema/user.schema';
import * as bcrypt from 'bcrypt';
import { RegistrationData } from '../auth/index.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<any>) {}

  async findUserByEmail(email: any): Promise<User | any> {
    return this.userModel.findOne({ email }).lean();
  }

  async findUserById(id: number) {
    const user = await this.userModel.findOne({ _id: id });
    if (user) return user._doc;
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUserLocal(registrationData: RegistrationData) {
    const cursor = await this.userModel.countDocuments({
      email: registrationData.email,
    });
    if (cursor) throw new ConflictException('User already exist');
    else {
      const hashPassword = await bcrypt.hash(registrationData.password, 10);
      const createdUser = await new this.userModel({
        ...registrationData,
        password: hashPassword,
        isRegisteredWithGoogle: false,
      });
      createdUser.save();
      return {
        status: HttpStatus.CREATED,
        success: true,
        message: 'User Created Successfully',
      };
    }
  }

  async createUserWithGoogle(email: string, name: string | any) {
    const createdUser = await new this.userModel({
      email,
      username: name,
      role: 'user',
      isRegisteredWithGoogle: true,
    });
    createdUser.save();
    return createdUser;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { currentHashedRefreshToken: currentHashedRefreshToken } },
    );
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.findUserById(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(id: number) {
    await this.userModel.updateOne(
      { _id: id },
      { $set: { currentHashedRefreshToken: null } },
    );
  }
}
