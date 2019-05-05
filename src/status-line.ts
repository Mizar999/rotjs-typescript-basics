import { Game } from "./game";
import { Point } from "./point";
import { padRight, padLeft } from "./text-utility";

export class StatusLine {
    turns: number;
    pineapples: number;
    boxes: number;
    maxBoxes: number;

    constructor(private game: Game, private position: Point, private maxWidth: number, params?: any) {
        if (!params) {
            params = {};
        }
        this.turns = params.turns || 0;
        this.pineapples = params.ananas || 0;
        this.boxes = params.boxes || 0;
        this.maxBoxes = params.maxBoxes || 0;
    }

    draw(): void {
        let text = `turns: ${padRight(this.turns.toString(), 6)} pineapples: ${padRight(this.pineapples.toString(), 6)} boxes: ${padLeft(this.boxes.toString(), 2)} / ${padLeft(this.maxBoxes.toString(), 2)}`;
        this.game.drawText(this.position, text, this.maxWidth);
    }
}