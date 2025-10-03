import { IsString, IsNotEmpty, IsArray, IsOptional } from 'class-validator';
import type { Passenger } from '../schemas/flight.schema';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flightCode: string;

  @IsArray()
  @IsOptional()
  passengers?: Passenger[];
}
