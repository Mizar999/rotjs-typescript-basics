import { Game } from "./game";
import { Actor } from "./actor";
import { KEYS, DIRS } from "rot-js";
import { Point } from "./point";

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

    act(): Promise<any> {
        return new Promise(resolve => {
            this.callback = (event: KeyboardEvent) => this.processInput(event, resolve);
            window.addEventListener("keydown", this.callback);
        });
    }

    private processInput(event: KeyboardEvent, resolve: (value?: any) => void): any {
        let code = event.keyCode;
        if (!(code in this.keyMap)) {
            return;
        }

        let diff = DIRS[8][this.keyMap[code]];
        let newPoint = new Point(this.x + diff[0], this.y + diff[1]);
        if (!this.game.mapKeyExists(newPoint.toKey())) {
            return;
        }

        this.game.draw(this.x, this.y, this.game.getCharacterAt(this.x + "," + this.y))
        this.x = newPoint.x;
        this.y = newPoint.y;
        this.draw();

        window.removeEventListener("keydown", this.callback);
        resolve();
    }

    private draw(): void {
        this.game.draw(this.x, this.y, this.character, this.color);
    }
}