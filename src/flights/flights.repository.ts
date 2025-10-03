import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Flight, FlightDocument, Passenger } from './schemas/flight.schema';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FindFlightsQueryDto } from './dto/find-flights-query.dto';

@Injectable()
export class FlightsRepository {
  constructor(
    @InjectModel(Flight.name) private flightModel: Model<FlightDocument>,
  ) {}

  async createFlight(flight: CreateFlightDto): Promise<FlightDocument> {
    const newFlight = new this.flightModel(flight);
    return newFlight.save();
  }

  async findFlights({
    flightCode,
    id,
    name,
    hasConnections,
    age,
    flightCategory,
    reservationId,
    hasCheckedBaggage,
  }: FindFlightsQueryDto): Promise<Flight[]> {
    const orConditions: RootFilterQuery<Flight>[] = [];

    // Flight-level filters
    if (flightCode && flightCode.length > 0) {
      orConditions.push({ flightCode: { $in: flightCode } });
    }

    // Passenger-level filters using $elemMatch
    const passengerConditions: RootFilterQuery<Flight>[] = [];

    if (id && id.length > 0) {
      passengerConditions.push({
        passengers: { $elemMatch: { id: { $in: id } } },
      });
    }

    if (name && name.length > 0) {
      passengerConditions.push({
        passengers: { $elemMatch: { name: { $in: name } } },
      });
    }

    if (hasConnections !== undefined) {
      passengerConditions.push({
        passengers: { $elemMatch: { hasConnections } },
      });
    }

    if (age && age.length > 0) {
      passengerConditions.push({
        passengers: { $elemMatch: { age: { $in: age } } },
      });
    }

    if (flightCategory && flightCategory.length > 0) {
      passengerConditions.push({
        passengers: {
          $elemMatch: { flightCategory: { $in: flightCategory } },
        },
      });
    }

    if (reservationId && reservationId.length > 0) {
      passengerConditions.push({
        passengers: {
          $elemMatch: { reservationId: { $in: reservationId } },
        },
      });
    }

    if (hasCheckedBaggage !== undefined) {
      passengerConditions.push({
        passengers: {
          $elemMatch: { hasCheckedBaggage },
        },
      });
    }

    // Add passenger conditions to orConditions
    orConditions.push(...passengerConditions);

    // If no conditions, return all flights
    if (orConditions.length === 0) {
      return this.flightModel.find();
    }

    return this.flightModel.find({ $or: orConditions });
  }

  async getFlight(flightCode: string): Promise<Flight | null> {
    return this.flightModel.findOne({ flightCode }).exec();
  }

  async deleteFlightPassengers(
    flightCode: string,
    passengerIds: number[],
  ): Promise<Flight | null> {
    await this.flightModel.updateOne(
      { flightCode },
      {
        $pull: {
          passengers: {
            id: { $in: passengerIds },
          },
        },
      },
    );
    return this.flightModel.findOne({ flightCode }).exec();
  }

  async addFlightPassengers(
    flightCode: string,
    passengers: Passenger[],
  ): Promise<Flight | null> {
    await this.flightModel.updateOne(
      { flightCode },
      {
        $push: {
          passengers: { $each: passengers },
        },
      },
    );
    return this.flightModel.findOne({ flightCode }).exec();
  }

  async updateFlightPassengers(
    flightCode: string,
    updatePassengers: Partial<Passenger>[],
  ): Promise<Flight | null> {
    // Build array filters for each passenger to update
    const arrayFilters = updatePassengers.map((passenger, index) => ({
      [`elem${index}.id`]: passenger.id,
    }));

    // Build the update object
    const updates = updatePassengers.reduce<Record<string, unknown>>(
      (acc, passenger, index) => {
        Object.keys(passenger).forEach((key) => {
          if (key !== 'id' && passenger[key] !== undefined) {
            acc[`passengers.$[elem${index}].${key}`] = passenger[key];
          }
        });
        return acc;
      },
      {},
    );

    if (!(Object.keys(updates).length > 0)) {
      return null;
    }

    await this.flightModel.updateOne(
      {
        flightCode,
        'passengers.id': { $in: updatePassengers.map((p) => p.id) },
      },
      { $set: updates },
      { arrayFilters },
    );
    return this.flightModel.findOne({ flightCode }).exec();
  }

  async remove(flightCode: string): Promise<Flight | null> {
    return this.flightModel.findOneAndDelete({ flightCode }).exec();
  }
}
