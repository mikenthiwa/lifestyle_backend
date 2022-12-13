import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class RegistrationBody {
  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  username: string;

  @IsNotEmpty({ each: undefined, message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email' })
  email: string;

  @IsNotEmpty({ each: undefined, message: 'Password is required' })
  password: string;

  @IsNotEmpty({ each: undefined, message: 'Role is required' })
  role: string;
}
