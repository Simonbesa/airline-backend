import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { Flight, Passenger } from './schemas/flight.schema';
import { FindFlightsQueryDto } from './dto/find-flights-query.dto';
import { FlightsRepository } from './flights.repository';

@Injectable()
export class FlightsService {
  constructor(private flightsRepository: FlightsRepository) {}

  async create(createFlightDto: CreateFlightDto): Promise<Flight> {
    console.log(
      '🚀 ~ FlightsService ~ create ~ createFlightDto:',
      createFlightDto,
    );
    return this.flightsRepository.createFlight(createFlightDto);
  }

  async findFlights(query: FindFlightsQueryDto): Promise<Flight[]> {
    return this.flightsRepository.findFlights(query);
  }

  async getFlight(flightCode: string): Promise<Flight> {
    const flight = await this.flightsRepository.getFlight(flightCode);
    if (!flight) {
      throw new NotFoundException(
        `Flight with flightCode ${flightCode} not found`,
      );
    }
    return flight;
  }

  async updatePassengers(
    flightCode: string,
    passengers: Partial<Passenger>[],
  ): Promise<Flight> {
    const flight = await this.flightsRepository.updateFlightPassengers(
      flightCode,
      passengers,
    );

    if (!flight) {
      throw new NotFoundException(
        `Flight with flightCode ${flightCode} not found`,
      );
    }

    return flight;
  }

  async deletePassengers(
    flightCode: string,
    passengerIds: number[],
  ): Promise<Flight> {
    const flight = await this.flightsRepository.deleteFlightPassengers(
      flightCode,
      passengerIds,
    );

    if (!flight) {
      throw new NotFoundException(
        `Flight with flightCode ${flightCode} not found`,
      );
    }

    return flight;
  }

  async addPassengers(
    flightCode: string,
    passengers: Passenger[],
  ): Promise<Flight> {
    const flight = await this.flightsRepository.addFlightPassengers(
      flightCode,
      passengers,
    );

    if (!flight) {
      throw new NotFoundException(
        `Flight with flightCode ${flightCode} not found`,
      );
    }

    return flight;
  }

  async remove(flightCode: string): Promise<void> {
    const result = await this.flightsRepository.remove(flightCode);
    if (!result) {
      throw new NotFoundException(
        `Flight with flightCode ${flightCode} not found`,
      );
    }
  }
}
