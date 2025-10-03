import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { FlightCategory } from '../enum/flight-category.enum';

export class FindFlightsQueryDto {
  @IsOptional()
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim());
    }
    return [];
  })
  flightCode?: string[];

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim());
    }
    return [];
  })
  id?: number[];

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim());
    }
    return [];
  })
  name?: string[];

  @IsOptional()
  @Transform(({ value }): boolean => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return false;
  })
  hasConnections?: boolean;

  @IsOptional()
  @Transform(({ value }): number[] => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .map((s) => parseInt(s, 10))
        .filter((n) => !Number.isNaN(n));
    }
    return [];
  })
  age?: number[];

  @IsOptional()
  @IsEnum(FlightCategory, { each: true })
  @Transform(({ value }): FlightCategory[] => {
    if (typeof value === 'string') {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter((s) =>
          Object.values(FlightCategory).includes(s as FlightCategory),
        )
        .map((s) => s as FlightCategory);
    }
    return [];
  })
  flightCategory?: FlightCategory[];

  @IsOptional()
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim());
    }
    return [];
  })
  reservationId?: string[];

  @IsOptional()
  @Transform(({ value }): boolean => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return false;
  })
  hasCheckedBaggage?: boolean;
}
