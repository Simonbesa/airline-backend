import axios from 'axios';
import prepareDatabase from '../plugins/prepare-database';
import { FlightCategory } from 'src/flights/enum/flight-category.enum';
import { Flight } from 'src/flights/schemas/flight.schema';

const updatePassengers = async (
  flightCode: string,
  passengers: any[],
): Promise<Flight> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/flights/update-passengers/${flightCode}`,
      { passengers },
    );
    return response.data;
  } catch (error) {
    console.error('Error updating passengers:', error);
    throw error;
  }
};

describe('PATCH /flights/update-passengers/:flightCode', () => {
  it('should update existing passengers in a flight', async () => {
    // ARRANGE
    await prepareDatabase.run({
      flights: [
        {
          flightCode: 'AA101',
          passengers: [
            {
              id: 1,
              name: 'John',
              hasConnections: false,
              age: 30,
              flightCategory: FlightCategory.Normal,
              reservationId: 'ABC123',
              hasCheckedBaggage: true,
            },
          ],
        },
      ],
    });

    const updatedPassengers = [
      {
        id: 1,
        name: 'John Updated',
        hasConnections: true,
        age: 31,
        flightCategory: FlightCategory.Gold,
        reservationId: 'ABC123',
        hasCheckedBaggage: false,
      },
    ];

    // ACT
    const result = await updatePassengers('AA101', updatedPassengers);

    // ASSERT
    expect(result.flightCode).toBe('AA101');
    expect(result.passengers).toHaveLength(1);
    expect(result.passengers[0].name).toBe('John Updated');
    expect(result.passengers[0].age).toBe(31);
    expect(result.passengers[0].flightCategory).toBe(FlightCategory.Gold);
  });

  it('should return 404 for non-existent flight', async () => {
    // ARRANGE
    await prepareDatabase.run({ flights: [] });

    const updatedPassengers = [
      {
        id: 1,
        name: 'John Updated',
        hasConnections: true,
        age: 31,
        flightCategory: FlightCategory.Gold,
        reservationId: 'ABC123',
        hasCheckedBaggage: false,
      },
    ];

    // ACT & ASSERT
    await expect(
      updatePassengers('NONEXISTENT', updatedPassengers),
    ).rejects.toThrow();
  });

  it('should return 404 for non-existent passenger', async () => {
    // ARRANGE
    await prepareDatabase.run({
      flights: [
        {
          flightCode: 'AA101',
          passengers: [
            {
              id: 1,
              name: 'John',
              hasConnections: false,
              age: 30,
              flightCategory: FlightCategory.Normal,
              reservationId: 'ABC123',
              hasCheckedBaggage: true,
            },
          ],
        },
      ],
    });

    const updatedPassengers = [
      {
        id: 999, // Non-existent passenger ID
        name: 'John Updated',
        hasConnections: true,
        age: 31,
        flightCategory: FlightCategory.Gold,
        reservationId: 'ABC123',
        hasCheckedBaggage: false,
      },
    ];

    // ACT & ASSERT
    await expect(
      updatePassengers('AA101', updatedPassengers),
    ).rejects.toThrow();
  });
});
