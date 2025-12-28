import {
  MAthGameResponse,
  GameComplete,
  MathGameData,
} from "../../interface/api";

// Mock data generator for math game
export const generateMockMathGameData = (): MathGameData[] => {
  return [
    // Round 1 - Easy (2 equations, 2 characters)
    {
      equations: [
        {
          images: ["dragon1", "dragon1"],
          total: 10,
          characterValues: { dragon1: 5 },
        },
        {
          images: ["dragon2", "dragon2"],
          total: 8,
          characterValues: { dragon2: 4 },
        },
      ],
    },
    // Round 2 - Medium (3 equations, 2 characters)
    {
      equations: [
        {
          images: ["dragon1", "dragon2"],
          total: 12,
          characterValues: { dragon1: 7, dragon2: 5 },
        },
        {
          images: ["dragon2", "dragon2"],
          total: 10,
          characterValues: { dragon2: 5 },
        },
        {
          images: ["dragon1", "dragon1", "dragon2"],
          total: 19,
          characterValues: { dragon1: 7, dragon2: 5 },
        },
      ],
    },
    // Round 3 - Medium-Hard (3 equations, 3 characters)
    {
      equations: [
        {
          images: ["dragon1", "dragon2"],
          total: 15,
          characterValues: { dragon1: 8, dragon2: 7 },
        },
        {
          images: ["dragon2", "dragon3"],
          total: 13,
          characterValues: { dragon2: 7, dragon3: 6 },
        },
        {
          images: ["dragon1", "dragon3"],
          total: 14,
          characterValues: { dragon1: 8, dragon3: 6 },
        },
      ],
    },
    // Round 4 - Hard (4 equations, 3 characters)
    {
      equations: [
        {
          images: ["dragon1", "dragon1", "dragon2"],
          total: 20,
          characterValues: { dragon1: 6, dragon2: 8 },
        },
        {
          images: ["dragon2", "dragon3", "dragon3"],
          total: 22,
          characterValues: { dragon2: 8, dragon3: 7 },
        },
        {
          images: ["dragon1", "dragon2", "dragon3"],
          total: 21,
          characterValues: { dragon1: 6, dragon2: 8, dragon3: 7 },
        },
        {
          images: ["dragon3", "dragon3", "dragon1", "dragon1"],
          total: 26,
          characterValues: { dragon1: 6, dragon3: 7 },
        },
      ],
    },
    // Round 5 - Very Hard (4 equations, 3 characters, complex)
    {
      equations: [
        {
          images: ["dragon1", "dragon2", "dragon3"],
          total: 24,
          characterValues: { dragon1: 9, dragon2: 8, dragon3: 7 },
        },
        {
          images: ["dragon1", "dragon1", "dragon3"],
          total: 25,
          characterValues: { dragon1: 9, dragon3: 7 },
        },
        {
          images: ["dragon2", "dragon2", "dragon1"],
          total: 25,
          characterValues: { dragon1: 9, dragon2: 8 },
        },
        {
          images: ["dragon1", "dragon2", "dragon3", "dragon3"],
          total: 31,
          characterValues: { dragon1: 9, dragon2: 8, dragon3: 7 },
        },
      ],
    },
  ];
};

// Mock API Response for game data - matches BaseResponse structure
export const mockMathGameResponse: MAthGameResponse = {
  statusCode: 200,
  message: "Math game data retrieved successfully",
  data: generateMockMathGameData(),
};

// Mock API Response for answer submission - matches BaseResponse structure
let currentRoundSubmitted = 0;

export const mockMathAnsResponse = (
  roundNumber: number,
  totalRounds: number = 5
): GameComplete => {
  currentRoundSubmitted = roundNumber;

  return {
    statusCode: 200,
    message: "Answer submitted successfully",
    game_complete: roundNumber >= totalRounds ? 1 : 0,
  };
};

// Mock error response
export const mockErrorResponse = (
  message: string = "An error occurred"
): never => {
  throw new Error(message);
};

// Reset mock state
export const resetMockGameState = () => {
  currentRoundSubmitted = 0;
};

// src/mocks/mathGameMockData.ts - Additional helpers

export const mockMathGameResponseWithStatus = (
  statusCode: number
): MAthGameResponse => {
  const messages: Record<number, string> = {
    200: "Math game data retrieved successfully",
    400: "Bad request - Invalid game key",
    401: "Unauthorized - Please login",
    404: "Game not found",
    500: "Internal server error",
  };

  if (statusCode !== 200) {
    return {
      statusCode,
      message: messages[statusCode] || "Unknown error",
      data: [],
    };
  }

  return {
    statusCode: 200,
    message: messages[200],
    data: generateMockMathGameData(),
  };
};

export const mockGameCompleteWithStatus = (
  statusCode: number,
  gameComplete: number = 0
): GameComplete => {
  const messages: Record<number, string> = {
    200: "Answer submitted successfully",
    400: "Invalid answer format",
    401: "Session expired",
    500: "Failed to process answer",
  };

  return {
    statusCode,
    message: messages[statusCode] || "Unknown error",
    game_complete: statusCode === 200 ? gameComplete : 0,
  };
};
