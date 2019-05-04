import { Path } from "rot-js";
import { Game } from "./game";
import { Actor } from "./actor";
import { Point } from "./point";
import { GameState } from "./game-state";

export class Pedro implements Actor {
    private character: string;
    private color: string;
    private path: Point[];

    constructor(private game: Game, private x: number, private y: number) {
        this.character = "P";
        this.color = "#f00";
        this.draw();
    }

    act(): Promise<GameState> {
        let gameState = new GameState();
        let playerPosition = this.game.getPlayerPosition();
        let astar = new Path.AStar(playerPosition.x, playerPosition.y, this.game.mapIsPassable.bind(this.game), { topology: 4 });

        this.path = [];
        astar.compute(this.x, this.y, this.pathCallback.bind(this));
        this.path.shift(); // remove Pedros position
        if (this.path.length <= 1) {
            alert("Game over - you were captured by Pedro!");
            gameState.isGameOver = true;
        }

        if (this.path.length > 0) {
            this.game.draw(this.x, this.y, this.game.getCharacterAt(this.x + "," + this.y))
            this.x = this.path[0].x;
            this.y = this.path[0].y;
        }
        this.draw();

        return Promise.resolve(gameState);
    }

    private pathCallback(x: number, y: number): void {
        this.path.push(new Point(x, y));
    }

    private draw(): void {
        this.game.draw(this.x, this.y, this.character, this.color);
    }
}