import axios from 'axios';
import prepareDatabase from '../plugins/prepare-database';
import { FlightCategory } from 'src/flights/enum/flight-category.enum';
import { Flight } from 'src/flights/schemas/flight.schema';

const deleteFlight = async (flightCode: string): Promise<void> => {
  try {
    await axios.delete(`http://localhost:3000/flights/${flightCode}`);
  } catch (error) {
    console.error('Error deleting flight:', error);
    throw error;
  }
};

const getFlights = async (): Promise<Flight[]> => {
  try {
    const response = await axios.get('http://localhost:3000/flights');
    return response.data;
  } catch (error) {
    console.error('Error getting flights:', error);
    throw error;
  }
};

describe('DELETE /flights/:flightCode', () => {
  it('should delete a flight', async () => {
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
        {
          flightCode: 'DL202',
          passengers: [
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
    await deleteFlight('AA101');
    const remainingFlights = await getFlights();

    // ASSERT
    expect(remainingFlights).toHaveLength(1);
    expect(remainingFlights[0].flightCode).toBe('DL202');
  });

  it('should return 404 for non-existent flight', async () => {
    // ARRANGE
    await prepareDatabase.run({ flights: [] });

    // ACT & ASSERT
    await expect(deleteFlight('NONEXISTENT')).rejects.toThrow();
  });
});
