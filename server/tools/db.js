import { MongoClient } from 'mongodb';

let client = null;
let db = null;

export async function getDb() {
  if (db) return db;
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('worldcup2026');
  console.log('Connected to MongoDB Atlas');
  return db;
}

export async function closeDb() {
  if (client) await client.close();
}

// ─── Tool: Query matches by team / city / stage ───────────────────────────────
export async function queryMatches({ team, city, stage } = {}) {
  const db = await getDb();
  const filter = {};

  if (team) {
    const regex = new RegExp(team, 'i');
    filter.$or = [{ home_team: regex }, { away_team: regex }];
  }
  if (city) {
    filter['venue.city'] = new RegExp(city, 'i');
  }
  if (stage) {
    filter.stage = new RegExp(stage, 'i');
  }

  const matches = await db
    .collection('matches')
    .find(filter)
    .sort({ date: 1 })
    .limit(20)
    .toArray();

  if (matches.length === 0) {
    return { found: 0, message: 'No matches found for that filter.' };
  }

  return {
    found: matches.length,
    matches: matches.map((m) => ({
      id: m._id.toString(),
      date: m.date,
      time_local: m.time_local,
      home_team: m.home_team,
      away_team: m.away_team,
      stage: m.stage,
      group: m.group || null,
      venue: m.venue,
      ticket_price_range: m.ticket_price_range,
    })),
  };
}

// ─── Tool: Get venue / city info ──────────────────────────────────────────────
export async function getVenueInfo(city) {
  const db = await getDb();
  const venue = await db
    .collection('venues')
    .findOne({ city: new RegExp(city, 'i') });

  if (!venue) {
    return { error: `No venue found for city: ${city}` };
  }

  return {
    city: venue.city,
    country: venue.country,
    stadium: venue.stadium,
    capacity: venue.capacity,
    timezone: venue.timezone,
    airport_code: venue.airport_code,
    avg_hotel_per_night_usd: venue.avg_hotel_per_night_usd,
    avg_daily_food_usd: venue.avg_daily_food_usd,
    notes: venue.notes,
    matches_hosted: venue.matches_hosted,
  };
}
