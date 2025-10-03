import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateFlightDto } from './dto/create-flight.dto';
import { Flight, Passenger } from './schemas/flight.schema';
import { FindFlightsQueryDto } from './dto/find-flights-query.dto';
import { FlightsRepository } from './flights.repository';

@Injectable()
export class FlightsService {
  constructor(private flightsRepository: FlightsRepository) {}

  async create(createFlightDto: CreateFlightDto): Promise<Flight> {
    // Validate passenger ID uniqueness within the flight
    const existingFlight = await this.flightsRepository.getFlight(
      createFlightDto.flightCode,
    );
    if (existingFlight) {
      throw new BadRequestException(
        `Flight with flightCode ${createFlightDto.flightCode} already exists`,
      );
    }

    const duplicateIds = (createFlightDto.passengers || [])
      .map((p) => p.id)
      .filter(
        (id, index, arr) => arr.indexOf(id) !== index, // Find duplicates
      );

    if (duplicateIds.length > 0) {
      throw new BadRequestException(
        `Passenger IDs must be unique within the flight. Duplicate IDs: ${duplicateIds.join(', ')}`,
      );
    }
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
    const existingFlight = await this.flightsRepository.getFlight(flightCode);
    if (!existingFlight) {
      throw new NotFoundException(
        `Flight with flightCode ${flightCode} not found`,
      );
    }

    // Check if all passengers being updated exist in the flight
    const existingPassengerIds = existingFlight.passengers.map((p) => p.id);
    const updatingIds = passengers
      .filter((p) => p.id !== undefined)
      .map((p) => p.id as number);
    const nonExistentPassengers = updatingIds.filter(
      (id) => !existingPassengerIds.includes(id),
    );

    if (nonExistentPassengers.length > 0) {
      throw new NotFoundException(
        `Passengers with IDs ${nonExistentPassengers.join(', ')} not found in flight ${flightCode}`,
      );
    }

    const uniqueUpdatingIds = new Set(updatingIds);
    if (uniqueUpdatingIds.size !== updatingIds.length) {
      throw new BadRequestException(
        'Cannot update multiple passengers with the same ID',
      );
    }

    const flight = await this.flightsRepository.updateFlightPassengers(
      flightCode,
      passengers,
    );

    return flight!;
  }

  async deletePassengers(
    flightCode: string,
    passengerIds: number[],
  ): Promise<Flight> {
    // First check if the flight exists
    const existingFlight = await this.flightsRepository.getFlight(flightCode);
    if (!existingFlight) {
      throw new NotFoundException(
        `Flight with flightCode ${flightCode} not found`,
      );
    }

    // Check if all passengers exist in the flight
    const existingPassengerIds = existingFlight.passengers.map((p) => p.id);
    const nonExistentPassengers = passengerIds.filter(
      (id) => !existingPassengerIds.includes(id),
    );

    if (nonExistentPassengers.length > 0) {
      throw new NotFoundException(
        `Passengers with IDs ${nonExistentPassengers.join(', ')} not found in flight ${flightCode}`,
      );
    }

    const flight = await this.flightsRepository.deleteFlightPassengers(
      flightCode,
      passengerIds,
    );

    return flight!;
  }

  async addPassengers(
    flightCode: string,
    passengers: Passenger[],
  ): Promise<Flight> {
    const existingFlight = await this.flightsRepository.getFlight(flightCode);
    if (existingFlight) {
      const existingIds = new Set(existingFlight.passengers.map((p) => p.id));
      const duplicateIds = passengers
        .filter((p) => existingIds.has(p.id))
        .map((p) => p.id);

      if (duplicateIds.length > 0) {
        throw new BadRequestException(
          `Passenger IDs must be unique within the flight. Duplicate IDs: ${duplicateIds.join(', ')}`,
        );
      }
    }

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
