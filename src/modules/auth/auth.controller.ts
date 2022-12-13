import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationBody } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async create(
    @Body() registrationBody: RegistrationBody,
  ): Promise<RegistrationBody> {
    return this.authService.register(registrationBody);
  }
}
