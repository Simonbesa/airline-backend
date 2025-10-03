import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './schemas/flight.schema';
import { FindFlightsQueryDto } from './dto/find-flights-query.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  async create(@Body() createFlightDto: CreateFlightDto): Promise<Flight> {
    return this.flightsService.create(createFlightDto);
  }

  @Get()
  async findFlights(@Query() query: FindFlightsQueryDto): Promise<Flight[]> {
    return this.flightsService.findFlights(query);
  }

  @Get(':flightCode')
  async getFlight(@Param('flightCode') flightCode: string): Promise<Flight> {
    return this.flightsService.getFlight(flightCode);
  }

  @Patch(':flightCode')
  async update(
    @Param('flightCode') flightCode: string,
    @Body() updateFlightDto: UpdateFlightDto,
  ): Promise<Flight> {
    return this.flightsService.update(flightCode, updateFlightDto);
  }

  @Delete(':flightCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('flightCode') flightCode: string): Promise<void> {
    return this.flightsService.remove(flightCode);
  }
}
