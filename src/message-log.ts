import { Game } from "./game";
import { Point } from "./point";

export class MessageLog {
    private lines: string[];

    constructor(private game: Game, private position: Point, private maxWidth: number, private maxLines: number) {
        this.lines = [];
    }

    clear(): void {
        this.lines = [];
    }

    appendText(text: string): void {
        this.lines.splice(0, 0, text);
        if (this.lines.length > this.maxLines) {
            this.lines.splice(this.maxLines, this.lines.length - this.maxLines);
        }
    }

    draw(): void {
        let linePosition = new Point(this.position.x, this.position.y);
        for (let index = 0; index < this.maxLines && index < this.lines.length; ++index) {
            this.game.drawText(linePosition, this.lines[index]);
            ++linePosition.y;
        }
    }
}