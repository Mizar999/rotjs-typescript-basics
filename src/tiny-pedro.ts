import { Path } from "rot-js";
import { Game } from "./game";
import { Actor, ActorType } from "./actor";
import { Point } from "./point";
import { Glyph } from "./glyph";
import { Tile } from "./tile";

export class TinyPedro implements Actor {
    glyph: Glyph;
    type: string;
    private target: Point;
    private path: Point[];

    constructor(private game: Game, public position: Point) {
        this.glyph = new Glyph("p", "#00f", "");
        this.type = ActorType.tinyPedro;
    }

    act(): Promise<any> {
        let playerPosition = this.game.getPlayerPosition();
        if (this.position.x == playerPosition.x && this.position.y == playerPosition.y) {
            this.game.catchPlayer(this);
        }

        if (!this.target || this.game.getTileType(this.target.x, this.target.y) != Tile.box.type) {
            this.target = this.game.getRandomTilePositions(Tile.box.type)[0];
        }
        let astar = new Path.AStar(this.target.x, this.target.y, this.game.mapIsPassable.bind(this.game), { topology: 8 });

        this.path = [];
        astar.compute(this.position.x, this.position.y, this.pathCallback.bind(this));
        this.path.shift(); // remove tiny Pedros position

        if (this.path.length > 0) {
            if (!this.game.occupiedByEnemy(this.path[0].x, this.path[0].y)) {
                this.position = new Point(this.path[0].x, this.path[0].y);
            }
        }

        if (this.position.x == playerPosition.x && this.position.y == playerPosition.y) {
            this.game.catchPlayer(this);
        } else if (this.position.x == this.target.x && this.position.y == this.target.y) {
            this.game.destroyBox(this, this.target.x, this.target.y);
            this.target = undefined;
        }

        return Promise.resolve();
    }

    private pathCallback(x: number, y: number): void {
        this.path.push(new Point(x, y));
    }
}