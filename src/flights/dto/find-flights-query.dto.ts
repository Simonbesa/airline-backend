import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindFlightsQueryDto {
  @IsOptional()
  @Transform(({ value }): string[] => {
    if (typeof value === 'string') {
      return value.split(',').map((s) => s.trim());
    }
    return [];
  })
  flightCode?: string[];
}
