/**
 * MongoDB Seed Script — World Cup 2026 Data
 * Run: npm run seed
 * Seeds: matches + venues collections in 'worldcup2026' database
 */
import 'dotenv/config';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

// ─── VENUES ──────────────────────────────────────────────────────────────────
const VENUES = [
  {
    city: 'New York',
    country: 'USA',
    stadium: 'MetLife Stadium',
    capacity: 82500,
    timezone: 'America/New_York',
    airport_code: 'JFK',
    avg_hotel_per_night_usd: { budget: 120, mid: 220, luxury: 420 },
    avg_daily_food_usd: 70,
    matches_hosted: 8,
    notes: 'Hosting the final. Best transit via NJ Transit train from Penn Station.',
  },
  {
    city: 'Los Angeles',
    country: 'USA',
    stadium: 'SoFi Stadium',
    capacity: 70240,
    timezone: 'America/Los_Angeles',
    airport_code: 'LAX',
    avg_hotel_per_night_usd: { budget: 110, mid: 200, luxury: 380 },
    avg_daily_food_usd: 65,
    matches_hosted: 7,
    notes: 'Warm weather, beach nearby. Rent a car — public transit limited.',
  },
  {
    city: 'Dallas',
    country: 'USA',
    stadium: "AT&T Stadium",
    capacity: 80000,
    timezone: 'America/Chicago',
    airport_code: 'DFW',
    avg_hotel_per_night_usd: { budget: 85, mid: 150, luxury: 280 },
    avg_daily_food_usd: 55,
    matches_hosted: 7,
    notes: 'Most affordable US host city. Great BBQ food scene.',
  },
  {
    city: 'Miami',
    country: 'USA',
    stadium: 'Hard Rock Stadium',
    capacity: 65326,
    timezone: 'America/New_York',
    airport_code: 'MIA',
    avg_hotel_per_night_usd: { budget: 100, mid: 180, luxury: 350 },
    avg_daily_food_usd: 65,
    matches_hosted: 6,
    notes: 'Hot and humid in June. Book hotels early — high demand destination.',
  },
  {
    city: 'San Francisco',
    country: 'USA',
    stadium: "Levi's Stadium",
    capacity: 68500,
    timezone: 'America/Los_Angeles',
    airport_code: 'SFO',
    avg_hotel_per_night_usd: { budget: 130, mid: 240, luxury: 450 },
    avg_daily_food_usd: 80,
    matches_hosted: 6,
    notes: 'Most expensive US city. Great food/culture. Foggy summer mornings.',
  },
  {
    city: 'Seattle',
    country: 'USA',
    stadium: 'Lumen Field',
    capacity: 68740,
    timezone: 'America/Los_Angeles',
    airport_code: 'SEA',
    avg_hotel_per_night_usd: { budget: 100, mid: 180, luxury: 340 },
    avg_daily_food_usd: 60,
    matches_hosted: 5,
    notes: 'Close to Vancouver. Football-crazy city. Great seafood.',
  },
  {
    city: 'Boston',
    country: 'USA',
    stadium: 'Gillette Stadium',
    capacity: 65878,
    timezone: 'America/New_York',
    airport_code: 'BOS',
    avg_hotel_per_night_usd: { budget: 110, mid: 200, luxury: 380 },
    avg_daily_food_usd: 65,
    matches_hosted: 6,
    notes: 'Stadium is 45 min from city by commuter rail.',
  },
  {
    city: 'Houston',
    country: 'USA',
    stadium: 'NRG Stadium',
    capacity: 72220,
    timezone: 'America/Chicago',
    airport_code: 'IAH',
    avg_hotel_per_night_usd: { budget: 80, mid: 140, luxury: 260 },
    avg_daily_food_usd: 55,
    matches_hosted: 6,
    notes: 'Large Latin American diaspora — great atmosphere for CONCACAF teams.',
  },
  {
    city: 'Kansas City',
    country: 'USA',
    stadium: 'Arrowhead Stadium',
    capacity: 76416,
    timezone: 'America/Chicago',
    airport_code: 'MCI',
    avg_hotel_per_night_usd: { budget: 75, mid: 130, luxury: 240 },
    avg_daily_food_usd: 50,
    matches_hosted: 5,
    notes: 'Cheapest US host city. Famous for BBQ.',
  },
  {
    city: 'Philadelphia',
    country: 'USA',
    stadium: 'Lincoln Financial Field',
    capacity: 69176,
    timezone: 'America/New_York',
    airport_code: 'PHL',
    avg_hotel_per_night_usd: { budget: 95, mid: 170, luxury: 320 },
    avg_daily_food_usd: 60,
    matches_hosted: 6,
    notes: 'Easy Amtrak connections to NYC. Great cheesesteaks.',
  },
  {
    city: 'Atlanta',
    country: 'USA',
    stadium: 'Mercedes-Benz Stadium',
    capacity: 71000,
    timezone: 'America/New_York',
    airport_code: 'ATL',
    avg_hotel_per_night_usd: { budget: 90, mid: 160, luxury: 300 },
    avg_daily_food_usd: 58,
    matches_hosted: 6,
    notes: 'Major international hub. Hot in June.',
  },
  {
    city: 'Toronto',
    country: 'Canada',
    stadium: 'BMO Field',
    capacity: 45736,
    timezone: 'America/Toronto',
    airport_code: 'YYZ',
    avg_hotel_per_night_usd: { budget: 95, mid: 175, luxury: 330 },
    avg_daily_food_usd: 60,
    matches_hosted: 6,
    notes: 'Canada\'s biggest city. Excellent public transit. CN Tower nearby.',
  },
  {
    city: 'Vancouver',
    country: 'Canada',
    stadium: 'BC Place',
    capacity: 54500,
    timezone: 'America/Vancouver',
    airport_code: 'YVR',
    avg_hotel_per_night_usd: { budget: 90, mid: 165, luxury: 310 },
    avg_daily_food_usd: 58,
    matches_hosted: 6,
    notes: 'Beautiful mountain backdrop. Only 3h from Seattle by bus.',
  },
  {
    city: 'Mexico City',
    country: 'Mexico',
    stadium: 'Estadio Azteca',
    capacity: 87523,
    timezone: 'America/Mexico_City',
    airport_code: 'MEX',
    avg_hotel_per_night_usd: { budget: 60, mid: 110, luxury: 210 },
    avg_daily_food_usd: 35,
    matches_hosted: 7,
    notes: 'Most iconic stadium in the world. High altitude (2,240m). Cheapest host city.',
  },
  {
    city: 'Guadalajara',
    country: 'Mexico',
    stadium: 'Estadio Akron',
    capacity: 49850,
    timezone: 'America/Mexico_City',
    airport_code: 'GDL',
    avg_hotel_per_night_usd: { budget: 50, mid: 90, luxury: 180 },
    avg_daily_food_usd: 30,
    matches_hosted: 5,
    notes: 'Tequila capital of the world. Warm and welcoming fan culture.',
  },
  {
    city: 'Monterrey',
    country: 'Mexico',
    stadium: 'Estadio BBVA',
    capacity: 53500,
    timezone: 'America/Monterrey',
    airport_code: 'MTY',
    avg_hotel_per_night_usd: { budget: 55, mid: 100, luxury: 200 },
    avg_daily_food_usd: 32,
    matches_hosted: 5,
    notes: 'Close to US border. Hot in June (40°C+). Modern, fan-friendly stadium.',
  },
];

// ─── MATCHES ─────────────────────────────────────────────────────────────────
// Group stage: 12 groups (A–L), 4 teams each, 3 matches per group = 36 group matches
// Below is a representative sample of key matches with major teams
const MATCHES = [
  // Group A
  { date: '2026-06-11', time_local: '18:00', home_team: 'Mexico', away_team: 'Poland', stage: 'group', group: 'A', venue: { city: 'Mexico City', stadium: 'Estadio Azteca' }, ticket_price_range: { low: 120, high: 350 } },
  { date: '2026-06-11', time_local: '21:00', home_team: 'Saudi Arabia', away_team: 'Ecuador', stage: 'group', group: 'A', venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 80, high: 250 } },
  { date: '2026-06-15', time_local: '18:00', home_team: 'Mexico', away_team: 'Ecuador', stage: 'group', group: 'A', venue: { city: 'Guadalajara', stadium: 'Estadio Akron' }, ticket_price_range: { low: 100, high: 300 } },
  { date: '2026-06-15', time_local: '21:00', home_team: 'Poland', away_team: 'Saudi Arabia', stage: 'group', group: 'A', venue: { city: 'Houston', stadium: 'NRG Stadium' }, ticket_price_range: { low: 80, high: 220 } },
  { date: '2026-06-19', time_local: '21:00', home_team: 'Mexico', away_team: 'Saudi Arabia', stage: 'group', group: 'A', venue: { city: 'Monterrey', stadium: 'Estadio BBVA' }, ticket_price_range: { low: 100, high: 300 } },
  { date: '2026-06-19', time_local: '21:00', home_team: 'Ecuador', away_team: 'Poland', stage: 'group', group: 'A', venue: { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium' }, ticket_price_range: { low: 80, high: 220 } },

  // Group B
  { date: '2026-06-12', time_local: '15:00', home_team: 'Argentina', away_team: 'Iceland', stage: 'group', group: 'B', venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 150, high: 450 } },
  { date: '2026-06-12', time_local: '21:00', home_team: 'Australia', away_team: 'Nigeria', stage: 'group', group: 'B', venue: { city: 'Los Angeles', stadium: 'SoFi Stadium' }, ticket_price_range: { low: 80, high: 250 } },
  { date: '2026-06-16', time_local: '18:00', home_team: 'Argentina', away_team: 'Nigeria', stage: 'group', group: 'B', venue: { city: 'Miami', stadium: 'Hard Rock Stadium' }, ticket_price_range: { low: 120, high: 400 } },
  { date: '2026-06-16', time_local: '21:00', home_team: 'Iceland', away_team: 'Australia', stage: 'group', group: 'B', venue: { city: 'Houston', stadium: 'NRG Stadium' }, ticket_price_range: { low: 80, high: 230 } },
  { date: '2026-06-20', time_local: '21:00', home_team: 'Argentina', away_team: 'Australia', stage: 'group', group: 'B', venue: { city: 'Los Angeles', stadium: 'SoFi Stadium' }, ticket_price_range: { low: 140, high: 420 } },
  { date: '2026-06-20', time_local: '21:00', home_team: 'Nigeria', away_team: 'Iceland', stage: 'group', group: 'B', venue: { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium' }, ticket_price_range: { low: 80, high: 230 } },

  // Group C
  { date: '2026-06-12', time_local: '18:00', home_team: 'USA', away_team: 'Panama', stage: 'group', group: 'C', venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 200, high: 600 } },
  { date: '2026-06-12', time_local: '15:00', home_team: 'Uruguay', away_team: 'Senegal', stage: 'group', group: 'C', venue: { city: 'Kansas City', stadium: 'Arrowhead Stadium' }, ticket_price_range: { low: 80, high: 250 } },
  { date: '2026-06-16', time_local: '15:00', home_team: 'USA', away_team: 'Senegal', stage: 'group', group: 'C', venue: { city: 'Seattle', stadium: 'Lumen Field' }, ticket_price_range: { low: 180, high: 550 } },
  { date: '2026-06-16', time_local: '21:00', home_team: 'Panama', away_team: 'Uruguay', stage: 'group', group: 'C', venue: { city: 'Miami', stadium: 'Hard Rock Stadium' }, ticket_price_range: { low: 80, high: 230 } },
  { date: '2026-06-20', time_local: '21:00', home_team: 'USA', away_team: 'Uruguay', stage: 'group', group: 'C', venue: { city: 'New York', stadium: 'MetLife Stadium' }, ticket_price_range: { low: 200, high: 600 } },
  { date: '2026-06-20', time_local: '21:00', home_team: 'Senegal', away_team: 'Panama', stage: 'group', group: 'C', venue: { city: 'Philadelphia', stadium: 'Lincoln Financial Field' }, ticket_price_range: { low: 80, high: 230 } },

  // Group D
  { date: '2026-06-13', time_local: '15:00', home_team: 'Canada', away_team: 'Morocco', stage: 'group', group: 'D', venue: { city: 'Toronto', stadium: 'BMO Field' }, ticket_price_range: { low: 150, high: 420 } },
  { date: '2026-06-13', time_local: '21:00', home_team: 'Belgium', away_team: 'Croatia', stage: 'group', group: 'D', venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 80, high: 260 } },
  { date: '2026-06-17', time_local: '18:00', home_team: 'Canada', away_team: 'Croatia', stage: 'group', group: 'D', venue: { city: 'Vancouver', stadium: 'BC Place' }, ticket_price_range: { low: 130, high: 380 } },
  { date: '2026-06-17', time_local: '21:00', home_team: 'Morocco', away_team: 'Belgium', stage: 'group', group: 'D', venue: { city: 'Boston', stadium: 'Gillette Stadium' }, ticket_price_range: { low: 80, high: 250 } },
  { date: '2026-06-21', time_local: '21:00', home_team: 'Canada', away_team: 'Belgium', stage: 'group', group: 'D', venue: { city: 'Toronto', stadium: 'BMO Field' }, ticket_price_range: { low: 150, high: 420 } },
  { date: '2026-06-21', time_local: '21:00', home_team: 'Croatia', away_team: 'Morocco', stage: 'group', group: 'D', venue: { city: 'San Francisco', stadium: "Levi's Stadium" }, ticket_price_range: { low: 80, high: 260 } },

  // Group E — Brazil
  { date: '2026-06-13', time_local: '18:00', home_team: 'Brazil', away_team: 'Algeria', stage: 'group', group: 'E', venue: { city: 'San Francisco', stadium: "Levi's Stadium" }, ticket_price_range: { low: 150, high: 480 } },
  { date: '2026-06-13', time_local: '15:00', home_team: 'Japan', away_team: 'South Korea', stage: 'group', group: 'E', venue: { city: 'Los Angeles', stadium: 'SoFi Stadium' }, ticket_price_range: { low: 100, high: 300 } },
  { date: '2026-06-17', time_local: '15:00', home_team: 'Brazil', away_team: 'South Korea', stage: 'group', group: 'E', venue: { city: 'Los Angeles', stadium: 'SoFi Stadium' }, ticket_price_range: { low: 130, high: 400 } },
  { date: '2026-06-17', time_local: '21:00', home_team: 'Algeria', away_team: 'Japan', stage: 'group', group: 'E', venue: { city: 'Seattle', stadium: 'Lumen Field' }, ticket_price_range: { low: 80, high: 240 } },
  { date: '2026-06-21', time_local: '21:00', home_team: 'Brazil', away_team: 'Japan', stage: 'group', group: 'E', venue: { city: 'Vancouver', stadium: 'BC Place' }, ticket_price_range: { low: 130, high: 400 } },

  // Group F — England
  { date: '2026-06-14', time_local: '18:00', home_team: 'England', away_team: 'Iran', stage: 'group', group: 'F', venue: { city: 'New York', stadium: 'MetLife Stadium' }, ticket_price_range: { low: 150, high: 450 } },
  { date: '2026-06-14', time_local: '21:00', home_team: 'Denmark', away_team: 'Cameroon', stage: 'group', group: 'F', venue: { city: 'Philadelphia', stadium: 'Lincoln Financial Field' }, ticket_price_range: { low: 80, high: 240 } },
  { date: '2026-06-18', time_local: '18:00', home_team: 'England', away_team: 'Cameroon', stage: 'group', group: 'F', venue: { city: 'Boston', stadium: 'Gillette Stadium' }, ticket_price_range: { low: 130, high: 380 } },
  { date: '2026-06-22', time_local: '21:00', home_team: 'England', away_team: 'Denmark', stage: 'group', group: 'F', venue: { city: 'New York', stadium: 'MetLife Stadium' }, ticket_price_range: { low: 150, high: 450 } },

  // Group G — France
  { date: '2026-06-14', time_local: '15:00', home_team: 'France', away_team: 'Mexico', stage: 'group', group: 'G', venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 180, high: 550 } },
  { date: '2026-06-14', time_local: '21:00', home_team: 'Peru', away_team: 'Ivory Coast', stage: 'group', group: 'G', venue: { city: 'Miami', stadium: 'Hard Rock Stadium' }, ticket_price_range: { low: 80, high: 240 } },
  { date: '2026-06-18', time_local: '21:00', home_team: 'France', away_team: 'Ivory Coast', stage: 'group', group: 'G', venue: { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium' }, ticket_price_range: { low: 150, high: 460 } },
  { date: '2026-06-22', time_local: '21:00', home_team: 'France', away_team: 'Peru', stage: 'group', group: 'G', venue: { city: 'Houston', stadium: 'NRG Stadium' }, ticket_price_range: { low: 150, high: 450 } },

  // Group H — Germany
  { date: '2026-06-15', time_local: '15:00', home_team: 'Germany', away_team: 'Scotland', stage: 'group', group: 'H', venue: { city: 'Philadelphia', stadium: 'Lincoln Financial Field' }, ticket_price_range: { low: 130, high: 380 } },
  { date: '2026-06-15', time_local: '18:00', home_team: 'Colombia', away_team: 'Egypt', stage: 'group', group: 'H', venue: { city: 'Miami', stadium: 'Hard Rock Stadium' }, ticket_price_range: { low: 80, high: 240 } },
  { date: '2026-06-19', time_local: '18:00', home_team: 'Germany', away_team: 'Egypt', stage: 'group', group: 'H', venue: { city: 'Boston', stadium: 'Gillette Stadium' }, ticket_price_range: { low: 120, high: 360 } },
  { date: '2026-06-23', time_local: '21:00', home_team: 'Germany', away_team: 'Colombia', stage: 'group', group: 'H', venue: { city: 'New York', stadium: 'MetLife Stadium' }, ticket_price_range: { low: 130, high: 400 } },

  // Group I — Spain & Portugal
  { date: '2026-06-15', time_local: '21:00', home_team: 'Spain', away_team: 'Tunisia', stage: 'group', group: 'I', venue: { city: 'Kansas City', stadium: 'Arrowhead Stadium' }, ticket_price_range: { low: 100, high: 300 } },
  { date: '2026-06-15', time_local: '18:00', home_team: 'Portugal', away_team: 'Ghana', stage: 'group', group: 'I', venue: { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium' }, ticket_price_range: { low: 100, high: 300 } },
  { date: '2026-06-19', time_local: '21:00', home_team: 'Spain', away_team: 'Ghana', stage: 'group', group: 'I', venue: { city: 'Seattle', stadium: 'Lumen Field' }, ticket_price_range: { low: 100, high: 320 } },
  { date: '2026-06-19', time_local: '18:00', home_team: 'Portugal', away_team: 'Tunisia', stage: 'group', group: 'I', venue: { city: 'Kansas City', stadium: 'Arrowhead Stadium' }, ticket_price_range: { low: 100, high: 320 } },
  { date: '2026-06-23', time_local: '21:00', home_team: 'Spain', away_team: 'Portugal', stage: 'group', group: 'I', venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 200, high: 600 } },

  // Knockout placeholder rounds (representative)
  { date: '2026-07-02', time_local: '16:00', home_team: 'TBD', away_team: 'TBD', stage: 'round_of_32', group: null, venue: { city: 'Los Angeles', stadium: 'SoFi Stadium' }, ticket_price_range: { low: 150, high: 400 } },
  { date: '2026-07-02', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'round_of_32', group: null, venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 150, high: 400 } },
  { date: '2026-07-03', time_local: '16:00', home_team: 'TBD', away_team: 'TBD', stage: 'round_of_32', group: null, venue: { city: 'New York', stadium: 'MetLife Stadium' }, ticket_price_range: { low: 150, high: 400 } },
  { date: '2026-07-03', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'round_of_32', group: null, venue: { city: 'Toronto', stadium: 'BMO Field' }, ticket_price_range: { low: 150, high: 400 } },
  { date: '2026-07-04', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'round_of_32', group: null, venue: { city: 'Mexico City', stadium: 'Estadio Azteca' }, ticket_price_range: { low: 150, high: 400 } },
  { date: '2026-07-10', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'quarter', group: null, venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 300, high: 900 } },
  { date: '2026-07-11', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'quarter', group: null, venue: { city: 'Los Angeles', stadium: 'SoFi Stadium' }, ticket_price_range: { low: 300, high: 900 } },
  { date: '2026-07-14', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'semi', group: null, venue: { city: 'New York', stadium: 'MetLife Stadium' }, ticket_price_range: { low: 500, high: 1500 } },
  { date: '2026-07-15', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'semi', group: null, venue: { city: 'Dallas', stadium: "AT&T Stadium" }, ticket_price_range: { low: 500, high: 1500 } },
  { date: '2026-07-19', time_local: '18:00', home_team: 'TBD', away_team: 'TBD', stage: 'third_place', group: null, venue: { city: 'Miami', stadium: 'Hard Rock Stadium' }, ticket_price_range: { low: 300, high: 800 } },
  { date: '2026-07-19', time_local: '20:00', home_team: 'TBD', away_team: 'TBD', stage: 'final', group: null, venue: { city: 'New York', stadium: 'MetLife Stadium' }, ticket_price_range: { low: 800, high: 3000 } },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db('worldcup2026');
    console.log('Connected to MongoDB Atlas');

    // Drop and recreate collections
    await db.collection('venues').drop().catch(() => {});
    await db.collection('matches').drop().catch(() => {});

    // Insert venues
    const vResult = await db.collection('venues').insertMany(VENUES);
    console.log(`✅ Inserted ${vResult.insertedCount} venues`);

    // Insert matches
    const mResult = await db.collection('matches').insertMany(MATCHES);
    console.log(`✅ Inserted ${mResult.insertedCount} matches`);

    // Create indexes for fast querying
    await db.collection('matches').createIndex({ 'home_team': 1 });
    await db.collection('matches').createIndex({ 'away_team': 1 });
    await db.collection('matches').createIndex({ 'venue.city': 1 });
    await db.collection('matches').createIndex({ 'stage': 1 });
    await db.collection('matches').createIndex({ 'date': 1 });
    await db.collection('venues').createIndex({ 'city': 1 });
    console.log('✅ Indexes created');

    console.log('\n🎉 Seed complete! Database worldcup2026 is ready.');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await client.close();
  }
}

seed();
