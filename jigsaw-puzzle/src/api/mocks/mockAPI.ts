import { MAthGameResponse, GameComplete } from "../../interface/api";
import {
  mockMathGameResponse,
  mockMathAnsResponse,
  resetMockGameState,
  generateMockMathGameData,
} from "./mathGameMockData";

// Simulate network delay
const simulateDelay = (ms: number = 800): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock API class
export class MockMathGameAPI {
  private gameData: MAthGameResponse = mockMathGameResponse;

  async magicMathGame(key: string): Promise<MAthGameResponse> {
    console.log(`[MOCK API] Fetching math game data for key: ${key}`);

    await simulateDelay(1000); // Simulate network delay

    // Generate fresh game data each time
    const response: MAthGameResponse = {
      statusCode: 200,
      message: "Math game data retrieved successfully",
      data: generateMockMathGameData(),
    };

    return response;
  }

  async magicMathAns(
    key: string,
    id: number,
    option: any
  ): Promise<GameComplete> {
    console.log(`[MOCK API] Submitting answer for round ${id}:`, {
      key,
      option,
    });

    await simulateDelay(600); // Simulate network delay

    const totalRounds = this.gameData.data.length;
    const response = mockMathAnsResponse(id, totalRounds);

    // Simulate occasional errors (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Network error: Failed to submit answer");
    }

    return response;
  }

  resetGame(): void {
    console.log("[MOCK API] Resetting game state");
    resetMockGameState();
  }
}

export const mockAPI = new MockMathGameAPI();
