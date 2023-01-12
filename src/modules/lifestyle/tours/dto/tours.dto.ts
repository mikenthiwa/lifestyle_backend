import { IsNotEmpty, IsOptional, IsArray, IsString } from 'class-validator';

export class TripBodyDTO {
  @IsNotEmpty()
  tripName: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  slots: number;

  @IsNotEmpty()
  departureDate: Date;

  @IsOptional()
  returnDate: Date;

  @IsNotEmpty()
  departureArea: string;

  @IsNotEmpty()
  arrivalArea: string;

  @IsNotEmpty()
  departureTime: string;

  @IsNotEmpty()
  arrivalTime: string;

  @IsNotEmpty()
  tillNumber: number;

  @IsNotEmpty()
  @IsArray()
  inclusive: Array<string>;
}

export class SelectedTripBody {
  @IsNotEmpty()
  slug: string;
}

export class UpdateTripBody {
  @IsNotEmpty()
  tripId: string;

  @IsOptional()
  tripName: string;

  @IsOptional()
  price: number;

  @IsOptional()
  slots: number;

  @IsOptional()
  departureDate: Date;

  @IsOptional()
  returnDate: Date;

  @IsOptional()
  departureArea: string;

  @IsOptional()
  arrivalArea: string;

  @IsOptional()
  departureTime: string;

  @IsOptional()
  arrivalTime: string;

  @IsOptional()
  @IsArray()
  inclusive: Array<string>;
}

export class DeleteTripBody {
  @IsNotEmpty()
  @IsString()
  tripId: string;
}
