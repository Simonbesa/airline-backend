import { IsString, IsNotEmpty } from 'class-validator';
import type { Passenger } from '../schemas/flight.schema';

export class CreateFlightDto {
  @IsString()
  @IsNotEmpty()
  flightCode: string;

  passengers: Passenger[] = [];
}
