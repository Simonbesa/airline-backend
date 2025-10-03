import { Passenger } from '../schemas/flight.schema';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { FlightCategory } from '../enum/flight-category.enum';
import { Type } from 'class-transformer';

export class PassengerInput {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  hasConnections: boolean;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsEnum(FlightCategory)
  flightCategory: FlightCategory;

  @IsNotEmpty()
  @IsString()
  reservationId: string;

  @IsNotEmpty()
  @IsBoolean()
  hasCheckedBaggage: boolean;
}

export class PassengerUpdates implements Partial<Omit<Passenger, 'id'>> {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  hasConnections?: boolean;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsEnum(FlightCategory)
  flightCategory?: FlightCategory;

  @IsOptional()
  @IsString()
  reservationId?: string;

  @IsOptional()
  @IsBoolean()
  hasCheckedBaggage?: boolean;
}

export class UpdateFlightPassengersInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerUpdates)
  passengers: PassengerUpdates[];
}

export class AddFlightPassengersInputDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PassengerInput)
  passengers: PassengerInput[];
}

export class DeleteFlightPassengersInputDto {
  @IsArray()
  @IsNumber({}, { each: true })
  passengerIds: number[];
}
