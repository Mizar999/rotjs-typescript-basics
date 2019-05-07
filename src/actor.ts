import { GameState } from "./game-state";
import { Point } from "./point";
import { Glyph } from "./glyph";

export class ActorType {
    static readonly player = "player";
    static readonly pedro = "pedro";
    static readonly tinyPedro = "tinyPedro";
}

export interface Actor {
    position: Point;
    glyph: Glyph;
    type: string;

    act(): Promise<any>;
}