import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';
import { Flight } from './schemas/flight.schema';
import { FindFlightsQueryDto } from './dto/find-flights-query.dto';
import { FlightsRepository } from './flights.repository';

@Injectable()
export class FlightsService {
  constructor(private flightsRepository: FlightsRepository) {}

  async create(createFlightDto: CreateFlightDto): Promise<Flight> {
    return this.flightsRepository.createFlight(createFlightDto);
  }

  async findFlights(query: FindFlightsQueryDto): Promise<Flight[]> {
    return this.flightsRepository.findFlights(query);
  }

  async getFlight(id: string): Promise<Flight> {
    const flight = await this.flightsRepository.getFlight(id);
    if (!flight) {
      throw new NotFoundException(`Flight with id ${id} not found`);
    }
    return flight;
  }

  async update(id: string, updateFlightDto: UpdateFlightDto): Promise<Flight> {
    const flight = await this.flightsRepository.update(id, updateFlightDto);

    if (!flight) {
      throw new NotFoundException(`Flight with id ${id} not found`);
    }

    return flight;
  }

  async remove(id: string): Promise<void> {
    const result = await this.flightsRepository.remove(id);
    if (!result) {
      throw new NotFoundException(`Flight with id ${id} not found`);
    }
  }
}
