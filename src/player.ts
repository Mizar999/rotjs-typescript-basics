import { KEYS, DIRS } from "rot-js";
import { Game } from "./game";
import { Actor } from "./actor";
import { Point } from "./point";
import { GameState } from "./game-state";
import { Glyph } from "./glyph";

export class Player implements Actor {
    glyph: Glyph;
    type: string;
    private keyMap: { [key: number]: number }
    private processInputCallback: (event: KeyboardEvent) => any;

    constructor(private game: Game, public position: Point) {
        this.glyph = new Glyph("@", "#ff0");
        this.type = "player";

        this.keyMap = {};
        this.keyMap[KEYS.VK_NUMPAD8] = 0; // up
        this.keyMap[KEYS.VK_NUMPAD9] = 1;
        this.keyMap[KEYS.VK_NUMPAD6] = 2; // right
        this.keyMap[KEYS.VK_NUMPAD3] = 3;
        this.keyMap[KEYS.VK_NUMPAD2] = 4; // down
        this.keyMap[KEYS.VK_NUMPAD1] = 5;
        this.keyMap[KEYS.VK_NUMPAD4] = 6; // left
        this.keyMap[KEYS.VK_NUMPAD7] = 7;
    }

    act(): Promise<GameState> {
        return new Promise(resolve => {
            this.processInputCallback = (event: KeyboardEvent) => this.processInput(event, resolve);
            window.addEventListener("keydown", this.processInputCallback);
        });
    }

    private processInput(event: KeyboardEvent, resolve: (value?: any) => void): Promise<GameState> {
        let gameState = new GameState();
        let validInput = false;
        let currentKey = this.position.toKey();
        let code = event.keyCode;
        if (code in this.keyMap) {
            let diff = DIRS[8][this.keyMap[code]];
            let newPoint = new Point(this.position.x + diff[0], this.position.y + diff[1]);
            if (!this.game.mapIsPassable(newPoint.x, newPoint.y)) {
                return;
            }
            this.position = newPoint;
            validInput = true;
        } else if(code === KEYS.VK_RETURN || code === KEYS.VK_SPACE) {
            gameState.foundPineapple = this.game.checkBox(currentKey);
            validInput = true;
        } else {
            validInput = code === KEYS.VK_NUMPAD5; // Wait a turn
        }

        if (validInput) {
            window.removeEventListener("keydown", this.processInputCallback);
            resolve(gameState);
        }
    }
}