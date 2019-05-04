import { Display, Map, RNG, Scheduler } from "rot-js/lib/index";
import Simple from "rot-js/lib/scheduler/simple";

import { Player } from "./player";
import { Point } from "./point";
import { Symbol } from "./symbol";
import { Actor } from "./actor";
import { Pedro } from "./pedro";
import { GameState } from "./game-state";
import { StatusLine } from "./status-line";

export class Game {
    private display: Display;
    private scheduler: Simple;
    private map: { [key: string]: Symbol };
    private freeCells: string[];
    private statusLine: StatusLine;

    private player: Player;
    private pedro: Pedro;

    private gameSize: { width: number, height: number };
    private mapSize: { width: number, height: number };
    private statusLinePosition: Point;
    private pineappleKey: string;

    private foregroundColor = "white";
    private backgroundColor = "black";
    private floor = new Symbol(".");
    private box = new Symbol("*");
    private maximumBoxes = 10;

    constructor() {
        this.gameSize = { width: 75, height: 25 };
        this.mapSize = { width: this.gameSize.width, height: this.gameSize.height - 3 };
        this.statusLinePosition = new Point(0, this.gameSize.height - 3);

        this.display = new Display({
            width: this.gameSize.width,
            height: this.gameSize.height,
            fontSize: 20
        });
        document.body.appendChild(this.display.getContainer());

        this.startNewGame();
        this.mainLoop();
    }

    draw(position: Point, symbol: Symbol): void {
        let foreground = symbol.foregroundColor || this.foregroundColor;
        let background = symbol.backgroundColor || this.backgroundColor;
        this.display.draw(position.x, position.y, symbol.character, foreground, background);
    }

    drawText(x: number, y: number, text: string, maxWidth?: number) {
        this.display.drawText(x, y, text, maxWidth);
    }

    mapIsPassable(x: number, y: number): boolean {
        return (x + "," + y) in this.map;
    }

    getCharacterAt(key: string): Symbol {
        return this.map[key];
    }

    getPlayerPosition(): Point {
        return this.player.position;
    }

    checkBox(key: string): boolean {
        if (this.map[key] !== this.box) {
            alert("There is no box here!");
            return;
        }

        // TODO update status line

        if (key === this.pineappleKey) {
            alert("Hooray! You found a pineapple.");
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

        this.createStatusLine();
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
            if (actor.isPlayer) {
                this.statusLine.turns += 1;
                this.statusLine.draw();
            }

            if (gameState) {
                if (gameState.isGameOver) {
                    this.startNewGame();
                }
            }
        }
    }

    private generateMap(): void {
        let digger = new Map.Digger(this.mapSize.width, this.mapSize.height);
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
                this.pineappleKey = key;
            }
        }
    }

    private createBeing(what: any): any {
        let key = this.getRandomFreeCell();
        let point = this.mapKeyToPoint(key);
        return new what(this, point);
    }

    private createStatusLine(): void {
        this.statusLine = new StatusLine(this, this.statusLinePosition.x, this.statusLinePosition.y, this.gameSize.width, { maxBoxes: this.maximumBoxes });
        this.statusLine.draw();
    }

    private drawMap(): void {
        let point: Point;
        for (let key in this.map) {
            point = this.mapKeyToPoint(key);
            this.draw(point, this.getCharacterAt(key));
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