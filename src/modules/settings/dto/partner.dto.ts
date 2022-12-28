import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';

export class PartnerFormDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsNotEmpty()
  @IsString()
  instagram: string;

  @IsNotEmpty()
  @IsString()
  facebook: string;

  @IsNotEmpty()
  @IsString()
  twitter: string;
}

export class UpdateFormDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  readonly logo?: string;

  @IsOptional()
  instagram?: string;

  @IsOptional()
  facebook?: string;

  @IsOptional()
  twitter?: string;
}
