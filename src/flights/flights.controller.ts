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
import {
  UpdateFlightPassengersInputDto,
  AddFlightPassengersInputDto,
  DeleteFlightPassengersInputDto,
} from './dto/update-flight.dto';
import { Flight } from './schemas/flight.schema';
import { FindFlightsQueryDto } from './dto/find-flights-query.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Post()
  async create(@Body() createFlightDto: CreateFlightDto): Promise<Flight> {
    // We are assuming the the client side will use 'flightCode' as the unique identifier, otherwise the request is going to fail
    return this.flightsService.create(createFlightDto);
  }

  // TODO: paginate
  @Get()
  async findFlights(@Query() query: FindFlightsQueryDto): Promise<Flight[]> {
    return this.flightsService.findFlights(query);
  }

  @Get(':flightCode')
  async getFlight(@Param('flightCode') flightCode: string): Promise<Flight> {
    return this.flightsService.getFlight(flightCode);
  }

  @Patch('add-passengers/:flightCode')
  async addPassengers(
    @Param('flightCode') flightCode: string,
    @Body() { passengers }: AddFlightPassengersInputDto,
  ): Promise<Flight> {
    return this.flightsService.addPassengers(flightCode, passengers);
  }

  @Patch('update-passengers/:flightCode')
  async updatePassengers(
    @Param('flightCode') flightCode: string,
    @Body() { passengers }: UpdateFlightPassengersInputDto,
  ): Promise<Flight> {
    return this.flightsService.updatePassengers(flightCode, passengers);
  }

  @Patch('delete-passengers/:flightCode')
  async deletePassengers(
    @Param('flightCode') flightCode: string,
    @Body() { passengerIds }: DeleteFlightPassengersInputDto,
  ): Promise<Flight> {
    return this.flightsService.deletePassengers(flightCode, passengerIds);
  }

  @Delete(':flightCode')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('flightCode') flightCode: string): Promise<void> {
    return this.flightsService.remove(flightCode);
  }
}
