import { GoogleGenerativeAI } from '@google/generative-ai';
import { queryMatches, getVenueInfo } from './tools/db.js';
import { calculateBudget } from './tools/budget.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are the World Cup 2026 Fan Trip Planner — an AI agent helping football fans plan the perfect trip to the 2026 FIFA World Cup, hosted across USA, Canada, and Mexico (June–July 2026).

You have three tools:
1. queryMatches — fetch real match data from MongoDB (filter by team, city, stage)
2. getVenueInfo — get stadium and city details (hotels, food costs, timezone, airport)
3. calculateBudget — estimate full trip cost (flights, hotel, tickets, food)

When a fan asks for a trip plan:
- ALWAYS call queryMatches first to find relevant matches
- ALWAYS call getVenueInfo for the shortlisted cities
- ALWAYS call calculateBudget with their departure city and budget preference
- Then synthesize everything into a clear, structured trip plan

Structure your final answer with these sections:
📅 Recommended Matches
🏟️ Host City Details  
💰 Budget Estimate
✈️ Trip Plan Summary
💡 Pro Tips

Be warm, specific, and enthusiastic. Use real data from your tools — never make up match dates or venues.
If a fan's budget is tight, suggest the most affordable city combo.
Always mention that group-stage tickets must be booked through FIFA's official site.`;

const TOOLS = [
  {
    functionDeclarations: [
      {
        name: 'queryMatches',
        description: 'Query the World Cup 2026 match schedule from MongoDB. Can filter by team name, host city, or match stage.',
        parameters: {
          type: 'object',
          properties: {
            team: {
              type: 'string',
              description: 'National team name, e.g. "Mexico", "Brazil", "Canada", "Argentina"',
            },
            city: {
              type: 'string',
              description: 'Host city name, e.g. "Dallas", "Toronto", "Los Angeles", "Mexico City"',
            },
            stage: {
              type: 'string',
              description: 'Match stage: "group", "round_of_32", "quarter", "semi", "final"',
            },
          },
        },
      },
      {
        name: 'getVenueInfo',
        description: 'Get detailed info about a World Cup 2026 host city: stadium, capacity, average hotel prices, food costs, airport code, and timezone.',
        parameters: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: 'Name of the host city, e.g. "Dallas", "Toronto", "Vancouver"',
            },
          },
          required: ['city'],
        },
      },
      {
        name: 'calculateBudget',
        description: 'Calculate an estimated trip budget for a fan attending World Cup matches. Returns itemised costs for flights, hotel, food, tickets, and misc.',
        parameters: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: 'The host city the fan will travel to',
            },
            nights: {
              type: 'number',
              description: 'Number of nights staying in that city',
            },
            num_matches: {
              type: 'number',
              description: 'Number of matches the fan plans to attend',
            },
            origin: {
              type: 'string',
              description: 'The fan\'s departure city, e.g. "Toronto", "Vancouver", "New York", "London"',
            },
            budget_tier: {
              type: 'string',
              description: 'Spending level: "budget" (hostels/street food), "mid" (3-star/restaurants), "luxury" (4-5 star)',
            },
          },
          required: ['city', 'nights', 'num_matches'],
        },
      },
    ],
  },
];

async function dispatchTool(name, args) {
  console.log(`[Tool] ${name}(${JSON.stringify(args)})`);
  try {
    switch (name) {
      case 'queryMatches':   return await queryMatches(args);
      case 'getVenueInfo':   return await getVenueInfo(args.city);
      case 'calculateBudget': return calculateBudget(args);
      default:               return { error: `Unknown tool: ${name}` };
    }
  } catch (err) {
    console.error(`[Tool Error] ${name}:`, err.message);
    return { error: err.message };
  }
}

export async function chatWithAgent(userMessage, history = []) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
    systemInstruction: SYSTEM_PROMPT,
    tools: TOOLS,
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  });

  // Convert flat history to Gemini format
  const geminiHistory = history.map((h) => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: h.content }],
  }));

  const chat = model.startChat({ history: geminiHistory });

  let response = await chat.sendMessage(userMessage);
  let iterations = 0;
  const MAX_ITERATIONS = 8; // prevent infinite loops

  // Agentic loop — keep calling tools until the model produces a final text response
  while (iterations < MAX_ITERATIONS) {
    iterations++;
    const candidate = response.response.candidates?.[0];
    if (!candidate) break;

    const parts = candidate.content?.parts || [];
    const toolCalls = parts.filter((p) => p.functionCall);

    if (toolCalls.length === 0) break; // model is done, has a text answer

    // Execute all tool calls in parallel
    const toolResults = await Promise.all(
      toolCalls.map(async (p) => ({
        functionResponse: {
          name: p.functionCall.name,
          response: await dispatchTool(p.functionCall.name, p.functionCall.args),
        },
      }))
    );

    // Feed results back to the model
    response = await chat.sendMessage(toolResults);
  }

  return response.response.text();
}
