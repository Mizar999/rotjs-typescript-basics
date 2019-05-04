import { Display, Map, RNG, Engine, Scheduler } from "rot-js/lib/index";
import { Player } from "./player";
import { Point } from "./point";
import { Actor } from "./actor";
import Simple from "rot-js/lib/scheduler/simple";

export class Game {
    private display: Display;
    private scheduler: Simple;
    private map: { [key: string]: string };
    private freeCells: string[];
    private player: Player;

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

    draw(x: number, y: number, character: string, color?: string, backgroundColor?: string): void {
        let foreground = color || this.foregroundColor;
        let background = backgroundColor || this.backgroundColor;
        this.display.draw(x, y, character, foreground, background);
    }

    mapKeyExists(key: string): boolean {
        return key in this.map;
    }

    getCharacterAt(key: string): string {
        return this.map[key];
    }

    private startNewGame(): void {
        this.map = {};
        this.freeCells = [];

        this.generateMap();
        this.generateBoxes();
        this.drawMap();

        this.createPlayer();
        this.scheduler = new Scheduler.Simple();
        this.scheduler.add(this.player, true);
        this.mainLoop();
    }

    private async mainLoop(): Promise<any> {
        let actor: Actor;
        while (true) {
            actor = this.scheduler.next();
            if (!actor) {
                break;
            }
            await actor.act();
        }
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
        for (let boxes = 0; boxes < this.maximumBoxes; ++boxes) {
            key = this.getRandomFreeCell();
            this.map[key] = this.box;
        }
    }

    private createPlayer(): void {
        let key = this.getRandomFreeCell();
        let point = this.mapKeyToPoint(key);
        this.player = new Player(this, point.x, point.y);
    }

    private drawMap(): void {
        let point: Point;
        for (let key in this.map) {
            point = this.mapKeyToPoint(key);
            this.draw(point.x, point.y, this.getCharacterAt(key));
        }
    }

    private getRandomFreeCell(): string {
        if (this.freeCells.length == 0) {
            return;
        }
        let index = Math.floor(RNG.getUniform() * this.freeCells.length);
        return this.freeCells.splice(index, 1)[0];
    }

    private mapKeyToPoint(key: string): Point {
        let parts = key.split(",");
        return new Point(parseInt(parts[0]), parseInt(parts[1]));
    }
}