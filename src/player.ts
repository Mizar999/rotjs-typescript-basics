import { KEYS, DIRS } from "rot-js";
import { Game } from "./game";
import { Actor, ActorType } from "./actor";
import { Point } from "./point";
import { Glyph } from "./glyph";
import { InputUtility } from "./input-utility";

export class Player implements Actor {
    glyph: Glyph;
    type: ActorType;
    private keyMap: { [key: number]: number }

    constructor(private game: Game, public position: Point) {
        this.glyph = new Glyph("@", "#ff0");
        this.type = ActorType.Player;

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

    act(): Promise<any> {
        return InputUtility.waitForInput(this.handleInput.bind(this));
    }

    private handleInput(event: KeyboardEvent): boolean {
        let validInput = false;
        let code = event.keyCode;
        if (code in this.keyMap) {
            let diff = DIRS[8][this.keyMap[code]];
            let newPoint = new Point(this.position.x + diff[0], this.position.y + diff[1]);
            if (!this.game.mapIsPassable(newPoint.x, newPoint.y)) {
                return;
            }
            this.position = newPoint;
            validInput = true;
        } else if (code === KEYS.VK_RETURN || code === KEYS.VK_SPACE) {
            this.game.checkBox(this.position.x, this.position.y);
            validInput = true;
        } else {
            validInput = code === KEYS.VK_NUMPAD5; // Wait a turn
        }
        return validInput;
    }
}