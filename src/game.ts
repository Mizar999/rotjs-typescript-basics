import { Display, Map, RNG, Engine, Scheduler } from "rot-js/lib/index";
import { Player } from "./player";
import { Point } from "./point";
import { Actor } from "./actor";
import Simple from "rot-js/lib/scheduler/simple";
import { Pedro } from "./pedro";
import { GameState } from "./game-state";

export class Game {
    private display: Display;
    private scheduler: Simple;
    private map: { [key: string]: string };
    private freeCells: string[];
    private player: Player;
    private pedro: Pedro;
    private ananasKey: string;

    private foregroundColor = "white";
    private backgroundColor = "black";
    private floor = ".";
    private box = "*";
    private maximumBoxes = 10;

    constructor(private width: number = 80, private height: number = 25) {
        this.display = new Display({
            width: this.width,
            height: this.height,
            fontSize: 20
        });
        document.body.appendChild(this.display.getContainer());

        this.startNewGame();
        this.mainLoop();
    }

    draw(x: number, y: number, character: string, color?: string, backgroundColor?: string): void {
        let foreground = color || this.foregroundColor;
        let background = backgroundColor || this.backgroundColor;
        this.display.draw(x, y, character, foreground, background);
    }

    mapIsPassable(x: number, y: number): boolean {
        return (x + "," + y) in this.map;
    }

    getCharacterAt(key: string): string {
        return this.map[key];
    }

    getPlayerPosition(): Point {
        return this.player.getPosition();
    }

    checkBox(key: string): boolean {
        if (this.map[key] !== this.box) {
            alert("There is no box here!");
        } else if (key === this.ananasKey) {
            alert("Hooray! You found an ananas and won this game.");
            return true;
        } else {
            alert("This box is empty.");
        }
    }

    private startNewGame(): void {
        this.map = {};
        this.freeCells = [];
        this.display.clear();

        this.generateMap();
        this.generateBoxes();
        this.drawMap();

        this.player = this.createBeing(Player);
        this.pedro = this.createBeing(Pedro);
        this.scheduler = new Scheduler.Simple();
        this.scheduler.add(this.player, true);
        this.scheduler.add(this.pedro, true);
    }

    private async mainLoop(): Promise<any> {
        let actor: Actor;
        let gameState: GameState;
        while (true) {
            actor = this.scheduler.next();
            if (!actor) {
                break;
            }
            gameState = await actor.act();
            if (gameState) {
                if (gameState.isGameOver) {
                    this.startNewGame();
                }
            }
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
            if (!boxes) {
                this.ananasKey = key;
            }
        }
    }

    private createBeing(what: any): any {
        let key = this.getRandomFreeCell();
        let point = this.mapKeyToPoint(key);
        return new what(this, point.x, point.y);
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