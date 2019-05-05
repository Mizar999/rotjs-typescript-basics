import { Path } from "rot-js";
import { Game } from "./game";
import { Actor } from "./actor";
import { Point } from "./point";
import { Glyph } from "./glyph";
import { GameState } from "./game-state";

export class Pedro implements Actor {
    glyph: Glyph;
    type: string;
    private path: Point[];

    constructor(private game: Game, public position: Point) {
        this.glyph = new Glyph("P", "#f00", "");
        this.type = "pedro";
    }

    act(): Promise<any> {
        let playerPosition = this.game.getPlayerPosition();
        let astar = new Path.AStar(playerPosition.x, playerPosition.y, this.game.mapIsPassable.bind(this.game), { topology: 4 });

        this.path = [];
        astar.compute(this.position.x, this.position.y, this.pathCallback.bind(this));
        this.path.shift(); // remove Pedros position
        if (this.path.length <= 1) {
            this.game.catchPlayer();
        }

        if (this.path.length > 0) {
            this.position = new Point(this.path[0].x, this.path[0].y);
        }

        return Promise.resolve();
    }

    private pathCallback(x: number, y: number): void {
        this.path.push(new Point(x, y));
    }
}