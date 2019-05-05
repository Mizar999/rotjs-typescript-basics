import { GameState } from "./game-state";
import { Point } from "./point";
import { Glyph } from "./glyph";

export interface Actor {
    position: Point;
    glyph: Glyph;
    type: string;

    act(): Promise<GameState>;
}