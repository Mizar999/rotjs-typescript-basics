import { GameState } from "./game-state";
import { Point } from "./point";
import { Symbol } from "./symbol";

export interface Actor {
    position: Point;
    symbol: Symbol;
    isPlayer: boolean;

    act(): Promise<GameState>;
}