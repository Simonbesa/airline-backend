import axios from 'axios';
import prepareDatabase from '../plugins/prepare-database';
import { FlightCategory } from 'src/flights/enum/flight-category.enum';
import { Flight } from 'src/flights/schemas/flight.schema';

const addPassengers = async (
  flightCode: string,
  passengers: any[],
): Promise<Flight> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/flights/add-passengers/${flightCode}`,
      { passengers },
    );
    return response.data;
  } catch (error) {
    console.error('Error adding passengers:', error);
    throw error;
  }
};

describe('PATCH /flights/add-passengers/:flightCode', () => {
  it('should add passengers to an existing flight', async () => {
    // ARRANGE
    await prepareDatabase.run({
      flights: [
        {
          flightCode: 'AA102',
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

    const newPassengers = [
      {
        id: 2,
        name: 'Jane',
        hasConnections: true,
        age: 25,
        flightCategory: FlightCategory.Gold,
        reservationId: 'DEF456',
        hasCheckedBaggage: false,
      },
    ];

    // ACT
    const result = await addPassengers('AA102', newPassengers);

    // ASSERT
    expect(result.flightCode).toBe('AA102');
    expect(result.passengers).toHaveLength(2);
    expect(result.passengers[1].name).toBe('Jane');
    expect(result.passengers[1].id).toBe(2);
  });

  it('should return 404 for non-existent flight', async () => {
    // ARRANGE
    await prepareDatabase.run({ flights: [] });

    const newPassengers = [
      {
        id: 1,
        name: 'Jane',
        hasConnections: true,
        age: 25,
        flightCategory: FlightCategory.Gold,
        reservationId: 'DEF456',
        hasCheckedBaggage: false,
      },
    ];

    // ACT & ASSERT
    await expect(addPassengers('NONEXISTENT', newPassengers)).rejects.toThrow();
  });

  it('should return 400 for duplicate passenger ID in same flight', async () => {
    // ARRANGE
    await prepareDatabase.run({
      flights: [
        {
          flightCode: 'AA103',
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

    const newPassengers = [
      {
        id: 1, // Duplicate ID
        name: 'Jane',
        hasConnections: true,
        age: 25,
        flightCategory: FlightCategory.Gold,
        reservationId: 'DEF456',
        hasCheckedBaggage: false,
      },
    ];

    // ACT & ASSERT
    await expect(addPassengers('AA103', newPassengers)).rejects.toThrow();
  });
});
