// Approximate flight costs from major North American cities (USD)
const FLIGHT_COSTS = {
  'New York':      { Toronto: 180, Vancouver: 380, 'Mexico City': 320, Dallas: 220, 'Los Angeles': 280, Miami: 160, Seattle: 350, Boston: 120, Houston: 240, default: 260 },
  Toronto:         { 'New York': 180, Vancouver: 420, 'Mexico City': 380, Dallas: 300, 'Los Angeles': 380, Miami: 280, Seattle: 380, Boston: 200, Houston: 320, default: 300 },
  Vancouver:       { 'New York': 380, Toronto: 420, 'Mexico City': 420, Dallas: 320, 'Los Angeles': 160, Miami: 420, Seattle: 80, Boston: 400, Houston: 340, default: 340 },
  London:          { 'New York': 520, Toronto: 580, 'Mexico City': 680, Dallas: 620, 'Los Angeles': 680, Miami: 580, Seattle: 680, Boston: 500, Houston: 640, default: 600 },
  default:         { default: 450 },
};

// Per-city hotel/food costs per night/day (USD)
const CITY_COSTS = {
  'New York':      { hotel_budget: 120, hotel_mid: 220, hotel_luxury: 420, food: 70 },
  'Los Angeles':   { hotel_budget: 110, hotel_mid: 200, hotel_luxury: 380, food: 65 },
  Dallas:          { hotel_budget: 85,  hotel_mid: 150, hotel_luxury: 280, food: 55 },
  Miami:           { hotel_budget: 100, hotel_mid: 180, hotel_luxury: 350, food: 65 },
  'San Francisco': { hotel_budget: 130, hotel_mid: 240, hotel_luxury: 450, food: 80 },
  Seattle:         { hotel_budget: 100, hotel_mid: 180, hotel_luxury: 340, food: 60 },
  Boston:          { hotel_budget: 110, hotel_mid: 200, hotel_luxury: 380, food: 65 },
  Houston:         { hotel_budget: 80,  hotel_mid: 140, hotel_luxury: 260, food: 55 },
  'Kansas City':   { hotel_budget: 75,  hotel_mid: 130, hotel_luxury: 240, food: 50 },
  Philadelphia:    { hotel_budget: 95,  hotel_mid: 170, hotel_luxury: 320, food: 60 },
  Atlanta:         { hotel_budget: 90,  hotel_mid: 160, hotel_luxury: 300, food: 58 },
  Toronto:         { hotel_budget: 95,  hotel_mid: 175, hotel_luxury: 330, food: 60 },
  Vancouver:       { hotel_budget: 90,  hotel_mid: 165, hotel_luxury: 310, food: 58 },
  'Mexico City':   { hotel_budget: 60,  hotel_mid: 110, hotel_luxury: 210, food: 35 },
  Guadalajara:     { hotel_budget: 50,  hotel_mid: 90,  hotel_luxury: 180, food: 30 },
  Monterrey:       { hotel_budget: 55,  hotel_mid: 100, hotel_luxury: 200, food: 32 },
};

// Average ticket prices by stage (USD)
const TICKET_PRICES = {
  group:       { low: 80,  high: 250 },
  round_of_32: { low: 150, high: 400 },
  round_of_16: { low: 200, high: 600 },
  quarter:     { low: 300, high: 900 },
  semi:        { low: 500, high: 1500 },
  final:       { low: 800, high: 3000 },
};

function getFlightCost(origin, destination) {
  const originCosts = FLIGHT_COSTS[origin] || FLIGHT_COSTS.default;
  return originCosts[destination] || originCosts.default || FLIGHT_COSTS.default.default;
}

function getCityCosts(city) {
  for (const [key, val] of Object.entries(CITY_COSTS)) {
    if (city.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(city.toLowerCase())) {
      return val;
    }
  }
  return { hotel_budget: 100, hotel_mid: 180, hotel_luxury: 340, food: 60 };
}

export function calculateBudget({ city, nights, num_matches, origin = 'Toronto', budget_tier = 'mid' }) {
  const cityCosts = getCityCosts(city);
  const tier = ['budget', 'mid', 'luxury'].includes(budget_tier) ? budget_tier : 'mid';

  const flightCost = getFlightCost(origin, city);
  const hotelPerNight = cityCosts[`hotel_${tier}`];
  const hotelTotal = hotelPerNight * nights;
  const foodTotal = cityCosts.food * nights;
  const ticketCost = (TICKET_PRICES.group.low + TICKET_PRICES.group.high) / 2 * num_matches;
  const miscCost = Math.round((hotelTotal + foodTotal) * 0.15); // transport/souvenirs
  const totalLow = Math.round(flightCost * 0.85 + hotelTotal * 0.9 + foodTotal * 0.9 + ticketCost * 0.8 + miscCost);
  const totalHigh = Math.round(flightCost * 1.15 + hotelTotal * 1.1 + foodTotal * 1.1 + ticketCost * 1.2 + miscCost * 1.2);

  return {
    city,
    origin,
    nights,
    num_matches,
    budget_tier: tier,
    breakdown: {
      flights_usd: { estimated: flightCost, note: 'Round trip, estimated' },
      hotel_usd: { per_night: hotelPerNight, total: hotelTotal, nights },
      food_usd: { per_day: cityCosts.food, total: foodTotal },
      match_tickets_usd: { per_match_avg: Math.round(ticketCost / num_matches), total: ticketCost, matches: num_matches },
      misc_transport_usd: miscCost,
    },
    total_estimate_usd: { low: totalLow, high: totalHigh },
    total_estimate_cad: { low: Math.round(totalLow * 1.36), high: Math.round(totalHigh * 1.36) },
    tips: [
      `Book flights 3–4 months in advance to save up to 30%.`,
      `Hostels and Airbnb can cut hotel costs by 40% vs hotels.`,
      `Buy group-stage tickets early — they sell out months ahead.`,
      tier === 'budget' ? 'Street food near stadiums is authentic and cheap.' : 'Consider a hotel near the stadium to avoid transport hassle.',
    ],
  };
}
