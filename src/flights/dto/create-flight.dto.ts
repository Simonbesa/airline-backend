import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import type { Passenger } from '../schemas/flight.schema';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flightCode: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }): Passenger[] => value || [])
  passengers?: Passenger[];
}
