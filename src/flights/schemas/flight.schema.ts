import {
  Prop,
  Schema as SchemaDecorator,
  SchemaFactory,
} from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FlightCategory } from '../enum/flight-category.enum';

@SchemaDecorator({ _id: false })
export class Passenger {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  hasConnections: boolean;

  @Prop({ required: true })
  age: number;

  @Prop({ type: String, enum: FlightCategory })
  flightCategory: FlightCategory;

  @Prop({ required: true })
  reservationId: string;

  @Prop({ required: true })
  hasCheckedBaggage: boolean;
}

const PassengerSchema = SchemaFactory.createForClass(Passenger);

@SchemaDecorator({ timestamps: true })
export class Flight extends Document {
  @Prop({ required: true, unique: true })
  flightCode: string;

  @Prop({ type: [PassengerSchema] })
  passengers: Passenger[];
}

export const FlightSchema = SchemaFactory.createForClass(Flight);
export type FlightDocument = Flight & Document;
