import { Passenger } from '../schemas/flight.schema';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FlightCategory } from '../enum/flight-category.enum';
import { Transform } from 'class-transformer';

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
  @Transform(({ value }): PassengerUpdates[] => value || [])
  passengers: PassengerUpdates[];
}

export class AddFlightPassengersInputDto {
  @Transform(({ value }): Passenger[] => value || [])
  passengers: Passenger[];
}

export class DeleteFlightPassengersInputDto {
  @Transform(({ value }): number[] => value || [])
  passengerIds: number[];
}
