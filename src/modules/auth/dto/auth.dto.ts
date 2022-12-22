import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegistrationBody {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Role is required' })
  role: string;
}

export class PartnerLoginBody {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class TokenVerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
