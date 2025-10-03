import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Flight, FlightDocument } from './schemas/flight.schema';
import { CreateFlightDto } from './dto/create-flight.dto';
import { FindFlightsQueryDto } from './dto/find-flights-query.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsRepository {
  constructor(
    @InjectModel(Flight.name) private flightModel: Model<FlightDocument>,
  ) {}

  async createFlight(flight: CreateFlightDto): Promise<FlightDocument> {
    const newFlight = new this.flightModel(flight);
    return newFlight.save();
  }

  async findFlights({ flightCode }: FindFlightsQueryDto): Promise<Flight[]> {
    const query: RootFilterQuery<Flight> = {};
    if (flightCode) {
      query.flightCode = { $in: flightCode };
    }
    return this.flightModel.find(query);
  }

  async getFlight(id: string): Promise<Flight | null> {
    return this.flightModel.findById(id).exec();
  }

  async update(
    id: string,
    updateFlightDto: UpdateFlightDto,
  ): Promise<Flight | null> {
    return this.flightModel
      .findByIdAndUpdate(id, updateFlightDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Flight | null> {
    return this.flightModel.findByIdAndDelete(id).exec();
  }
}
