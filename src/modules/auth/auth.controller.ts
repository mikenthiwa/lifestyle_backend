import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { AuthService } from './auth.service';
import { Roles } from './decorators/roles.decorator';

import { Role } from './schema/user.schema';
import {
  RegistrationBody,
  PartnerLoginBody,
  TokenVerificationDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guard/JwtAuthGuard.guard';
import JwtRefreshGuard from './guard/jwtRefresh.guard';
import { RolesGuard } from './guard/role.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @Post('register')
  async create(
    @Body() registrationBody: RegistrationBody,
  ): Promise<RegistrationBody> {
    return this.authService.registerPartner(registrationBody);
  }

  @HttpCode(200)
  @Roles(Role.Admin)
  @UseGuards(LocalAuthGuard, RolesGuard)
  @Post('login/partner')
  async loginPartner(
    @Body() partnerLoginBody: PartnerLoginBody,
    @Req() request: any,
    @Res() response: any,
  ): Promise<any> {
    const {
      user: { accessTokenCookie, refreshTokenCookie },
    } = request;
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return response.send({
      success: true,
      statusCode: HttpStatus.OK,
      accessToken: accessTokenCookie,
      refreshToken: refreshTokenCookie,
    });
  }

  @HttpCode(200)
  @Post('login/google')
  async loginWithGoogle(
    @Body() tokenData: TokenVerificationDto,
    @Req() request: any,
    @Res() response: any,
  ): Promise<any> {
    const { accessTokenCookie, refreshTokenCookie } =
      await this.authService.googleLogin(tokenData.token);
    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    return response.send({
      success: true,
      statusCode: HttpStatus.OK,
      isAuthenticated: true,
      accessToken: accessTokenCookie,
      refreshToken: refreshTokenCookie,
      accessTokenExpiry: Date.now() / 1000 / 60 + 24 * 60,
    });
  }

  @UseGuards(JwtRefreshGuard)
  @Get('/refreshToken')
  refresh(@Req() request: any, @Res() response: any) {
    const accessTokenCookie = this.authService.generateCookieWithAccessToken(
      request.user._id,
      request.user.email,
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return response.send({
      success: true,
      statusCode: HttpStatus.OK,
      accessToken: accessTokenCookie,
      accessTokenExpiry: (Date.now() / 1000 / 60) * (24 * 60),
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logoutPartner(@Req() request: any, @Res() response: any) {
    await this.userService.removeRefreshToken(request.user._id);
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.send({
      success: true,
      statusCode: HttpStatus.OK,
      message: 'User logged out successfully',
    });
  }
}
