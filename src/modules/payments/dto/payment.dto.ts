import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class PaymentRequestDto {
  @IsNumber()
  @IsNotEmpty()
  businessShortCode: number;

  @IsNumber()
  @IsNotEmpty()
  phoneNumber: number;

  @IsString()
  @IsNotEmpty()
  accountReference: string;

  @IsString()
  @IsNotEmpty()
  tripId: string;
}

export class QueryTransactionDto {
  @IsNumber()
  @IsNotEmpty()
  businessShortCode: number;

  @IsString()
  @IsNotEmpty()
  checkoutRequestID: string;
}
