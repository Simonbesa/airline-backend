import axios from 'axios';
import prepareDatabase from '../plugins/prepare-database';
import { FlightCategory } from 'src/flights/enum/flight-category.enum';
import { Flight } from 'src/flights/schemas/flight.schema';

const getFlights = async (query?: Record<string, any>): Promise<Flight[]> => {
  try {
    const queryString = query
      ? `?${new URLSearchParams(query).toString()}`
      : '';
    const response = await axios.get(
      `http://localhost:3000/flights${queryString}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error getting flights:', error);
    throw error;
  }
};

const getFlight = async (flightCode: string): Promise<Flight> => {
  try {
    const response = await axios.get(
      `http://localhost:3000/flights/${flightCode}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error getting flight:', error);
    throw error;
  }
};

describe('GET /flights', () => {
  it('should return all flights when no query provided', async () => {
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
    const result = await getFlights();

    // ASSERT
    expect(result).toHaveLength(2);
    expect(result[0].flightCode).toBe('AA101');
    expect(result[1].flightCode).toBe('DL202');
  });

  it('should filter flights by flightCode', async () => {
    // ARRANGE
    await prepareDatabase.run({
      flights: [
        {
          flightCode: 'AA101',
          passengers: [
            {
              id: 3,
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
              id: 4,
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
    const result = await getFlights({ flightCode: 'AA101' });

    // ASSERT
    expect(result).toHaveLength(1);
    expect(result[0].flightCode).toBe('AA101');
  });

  it('should filter flights by passenger name', async () => {
    // ARRANGE
    await prepareDatabase.run({
      flights: [
        {
          flightCode: 'AA101',
          passengers: [
            {
              id: 5,
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
              id: 6,
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
    const result = await getFlights({ name: 'John' });

    // ASSERT
    expect(result).toHaveLength(1);
    expect(result[0].flightCode).toBe('AA101');
  });
});

describe('GET /flights/:flightCode', () => {
  it('should return a specific flight', async () => {
    // ARRANGE
    await prepareDatabase.run({
      flights: [
        {
          flightCode: 'AA101',
          passengers: [
            {
              id: 7,
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

    // ACT
    const result = await getFlight('AA101');

    // ASSERT
    expect(result.flightCode).toBe('AA101');
    expect(result.passengers).toHaveLength(1);
    expect(result.passengers[0].name).toBe('John');
  });

  it('should return 404 for non-existent flight', async () => {
    // ARRANGE
    await prepareDatabase.run({ flights: [] });

    // ACT & ASSERT
    await expect(getFlight('NONEXISTENT')).rejects.toThrow();
  });
});
