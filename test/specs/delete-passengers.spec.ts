import axios from 'axios';
import prepareDatabase from '../plugins/prepare-database';
import { FlightCategory } from 'src/flights/enum/flight-category.enum';
import { Flight } from 'src/flights/schemas/flight.schema';

const deletePassengers = async (
  flightCode: string,
  passengerIds: number[],
): Promise<Flight> => {
  try {
    const response = await axios.patch(
      `http://localhost:3000/flights/delete-passengers/${flightCode}`,
      { passengerIds },
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting passengers:', error);
    throw error;
  }
};

describe('PATCH /flights/delete-passengers/:flightCode', () => {
  it('should delete passengers from a flight', async () => {
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
            {
              id: 2,
              name: 'Jane',
              hasConnections: true,
              age: 25,
              flightCategory: FlightCategory.Gold,
              reservationId: 'DEF456',
              hasCheckedBaggage: false,
            },
          ],
        },
      ],
    });

    // ACT
    const result = await deletePassengers('AA101', [1]);

    // ASSERT
    expect(result.flightCode).toBe('AA101');
    expect(result.passengers).toHaveLength(1);
    expect(result.passengers[0].name).toBe('Jane');
    expect(result.passengers[0].id).toBe(2);
  });

  it('should return 404 for non-existent flight', async () => {
    // ARRANGE
    await prepareDatabase.run({ flights: [] });

    // ACT & ASSERT
    await expect(deletePassengers('NONEXISTENT', [1])).rejects.toThrow();
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

    // ACT & ASSERT
    await expect(deletePassengers('AA101', [999])).rejects.toThrow();
  });
});
