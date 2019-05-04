import { Game } from "./game";
import { Actor } from "./actor";
import { KEYS, DIRS } from "rot-js";
import { Point } from "./point";
import { GameState } from "./game-state";

export class Player implements Actor {
    private character: string;
    private color: string;
    private keyMap: { [key: number]: number }
    private callback: (event: KeyboardEvent) => any;

    constructor(private game: Game, private x: number, private y: number) {
        this.character = "@";
        this.color = "#ff0";

        this.keyMap = {};
        this.keyMap[KEYS.VK_NUMPAD8] = 0; // up
        this.keyMap[KEYS.VK_NUMPAD9] = 1;
        this.keyMap[KEYS.VK_NUMPAD6] = 2; // right
        this.keyMap[KEYS.VK_NUMPAD3] = 3;
        this.keyMap[KEYS.VK_NUMPAD2] = 4; // down
        this.keyMap[KEYS.VK_NUMPAD1] = 5;
        this.keyMap[KEYS.VK_NUMPAD4] = 6; // left
        this.keyMap[KEYS.VK_NUMPAD7] = 7;

        this.draw();
    }

    act(): Promise<GameState> {
        return new Promise(resolve => {
            this.callback = (event: KeyboardEvent) => this.processInput(event, resolve);
            window.addEventListener("keydown", this.callback);
        });
    }

    getPosition(): Point {
        return new Point(this.x, this.y);
    }

    private processInput(event: KeyboardEvent, resolve: (value?: any) => void): Promise<GameState> {
        let gameState = new GameState();
        let validInput = false;
        let currentKey = this.x + "," + this.y;
        let code = event.keyCode;
        if (code in this.keyMap) {
            let diff = DIRS[8][this.keyMap[code]];
            let newPoint = new Point(this.x + diff[0], this.y + diff[1]);
            if (!this.game.mapIsPassable(newPoint.x, newPoint.y)) {
                return;
            }

            this.game.draw(this.x, this.y, this.game.getCharacterAt(currentKey))
            this.x = newPoint.x;
            this.y = newPoint.y;
            this.draw();
            validInput = true;
        } else if(code === KEYS.VK_RETURN || code === KEYS.VK_SPACE) {
            gameState.isGameOver = this.game.checkBox(currentKey);
            validInput = true;
        }

        if (validInput) {
            window.removeEventListener("keydown", this.callback);
            resolve(gameState);
        }
    }

    private draw(): void {
        this.game.draw(this.x, this.y, this.character, this.color);
    }
}