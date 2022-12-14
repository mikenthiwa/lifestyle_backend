import {
  Injectable,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { google, Auth } from 'googleapis';
import { ConfigService } from '@nestjs/config';

import { User } from './schema/user.schema';
import { UsersService } from '../users/users.service';
import { RegistrationData } from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    @InjectModel(User.name) private userModel: Model<any>,
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const clientID = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GOOGLE_SECRET_ID');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async registerPartner(registrationData: RegistrationData): Promise<any> {
    return this.userService.createUserLocal(registrationData);
  }

  async validate(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findUserByEmail(email);
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (user && isPasswordMatching) return this.handleRegisteredUser(user);
      else throw new NotFoundException();
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException({
          success: false,
          status: HttpStatus.NOT_FOUND,
          errorMessage:
            "Sorry, these details aren't familiar to us, please take a look and try again",
        });
      }
    }
  }

  async googleLogin(token: string) {
    try {
      const tokenInfo = await this.oauthClient.getTokenInfo(token);
      const email = tokenInfo.email;
      const user = await this.userService.findUserByEmail(email);
      if (user) return this.handleRegisteredUser(user);
      else return this.registerGoogleUser(token, email);
      throw new NotFoundException();
    } catch (err) {}
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.oauthClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }

  async registerGoogleUser(token: string, email: any): Promise<any> {
    const { name } = await this.getUserData(token);
    const user = await this.userService.createUserWithGoogle(email, name);
    return this.handleRegisteredUser(user);
  }

  async handleRegisteredUser(user: any): Promise<any> {
    const { accessTokenCookie, refreshTokenCookie } =
      await this.getCookiesForUser(user);
    return { accessTokenCookie, refreshTokenCookie, user };
  }

  async getCookiesForUser(user: any) {
    const id = user._id;
    const accessTokenCookie = this.generateCookieWithAccessToken(id);
    const { cookie: refreshTokenCookie, token: refreshToken } =
      this.generateCookieWithRefreshToken(id);
    await this.userService.setCurrentRefreshToken(refreshToken, id);

    return { accessTokenCookie, refreshTokenCookie };
  }

  generateCookieWithAccessToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
      expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRY_TIME')}s`,
    });
    return `Authentication=${token};  HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRY_TIME',
    )}`;
  }

  generateCookieWithRefreshToken(userId: number) {
    const payload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET_KEY'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRY_TIME'),
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRY_TIME',
    )}`;
    return { cookie, token };
  }

  getCookieForLogOut() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }
}
