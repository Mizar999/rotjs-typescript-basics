import { Path } from "rot-js";
import { Game } from "./game";
import { Actor } from "./actor";
import { Point } from "./point";
import { Symbol } from "./symbol";
import { GameState } from "./game-state";

export class Pedro implements Actor {
    symbol: Symbol;
    isPlayer: boolean;
    private path: Point[];

    constructor(private game: Game, public position: Point) {
        this.symbol = new Symbol("P", "#f00", "");
        this.isPlayer = false;

        this.draw();
    }

    act(): Promise<GameState> {
        let gameState = new GameState();
        let playerPosition = this.game.getPlayerPosition();
        let astar = new Path.AStar(playerPosition.x, playerPosition.y, this.game.mapIsPassable.bind(this.game), { topology: 4 });

        this.path = [];
        astar.compute(this.position.x, this.position.y, this.pathCallback.bind(this));
        this.path.shift(); // remove Pedros position
        if (this.path.length <= 1) {
            alert("Game over - you were captured by Pedro!");
            gameState.isGameOver = true;
        }

        if (this.path.length > 0) {
            this.game.draw(this.position, this.game.getCharacterAt(this.position.toKey()))
            this.position = new Point(this.path[0].x, this.path[0].y);
        }
        this.draw();

        return Promise.resolve(gameState);
    }

    private pathCallback(x: number, y: number): void {
        this.path.push(new Point(x, y));
    }

    private draw(): void {
        this.game.draw(this.position, this.symbol);
    }
}