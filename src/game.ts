import { Display, Map, RNG } from "rot-js/lib/index";

export class Game {
    private display: Display;
    private map: { [key: string]: string };
    private freeCells: string[];

    private foregroundColor = "white";
    private backgroundColor = "black";
    private floor = ".";
    private box = "*";
    private maximumBoxes = 10;

    constructor(private width: number = 80, private height: number = 25) {
        this.display = new Display({
            width: this.width,
            height: this.height,
            fontSize: 18
        });
        document.body.appendChild(this.display.getContainer());

        this.startNewGame();
    }

    private startNewGame(): void {
        this.map = {};
        this.freeCells = [];

        this.generateMap();
        this.generateBoxes();
        this.drawMap();
    }

    private generateMap(): void {
        let digger = new Map.Digger(this.width, this.height);
        digger.create(this.diggerCallback.bind(this));
    }

    private diggerCallback(x: number, y: number, wall: number): void {
        if (wall) {
            return;
        }
        let key = x + "," + y;
        this.freeCells.push(key);
        this.map[key] = this.floor;
    }

    private generateBoxes(): void {
        let index: number;
        let key: string;
        for (let boxes = 0; boxes < this.maximumBoxes && this.freeCells.length > 0; ++boxes) {
            index = Math.floor(RNG.getUniform() * this.freeCells.length);
            key = this.freeCells.splice(index, 1)[0];
            this.map[key] = this.box;
        }
    }

    private drawMap(): void {
        let x: number;
        let y: number;
        let parts: string[];
        for (let key in this.map) {
            parts = key.split(",");
            x = parseInt(parts[0]);
            y = parseInt(parts[1]);
            this.display.draw(x, y, this.map[key], this.foregroundColor, this.backgroundColor);
        }
    }
}