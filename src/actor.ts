import { GameState } from "./game-state";

export interface Actor {
    act(): Promise<GameState>;
}