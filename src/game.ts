import { Display, Map, RNG, Scheduler, KEYS } from "rot-js/lib/index";
import Simple from "rot-js/lib/scheduler/simple";

import { Player } from "./player";
import { Point } from "./point";
import { Glyph } from "./glyph";
import { Actor } from "./actor";
import { Pedro } from "./pedro";
import { GameState } from "./game-state";
import { StatusLine } from "./status-line";
import { MessageLog } from "./message-log";

export class Game {
    private display: Display;
    private scheduler: Simple;
    private map: { [key: string]: Glyph };
    private freeCells: string[];
    private statusLine: StatusLine;
    private messageLog: MessageLog;

    private player: Player;
    private pedro: Pedro;

    private gameSize: { width: number, height: number };
    private mapSize: { width: number, height: number };
    private statusLinePosition: Point;
    private actionLogPosition: Point;
    private processInputCallback: (event: KeyboardEvent) => Promise<any>;

    private pineappleKey: string;
    private foregroundColor = "white";
    private backgroundColor = "black";
    private floor = new Glyph(".");
    private box = new Glyph("*");
    private maximumBoxes = 10;

    constructor() {
        this.gameSize = { width: 75, height: 25 };
        this.mapSize = { width: this.gameSize.width, height: this.gameSize.height - 4 };
        this.statusLinePosition = new Point(0, this.gameSize.height - 4);
        this.actionLogPosition = new Point(0, this.gameSize.height - 3);

        this.display = new Display({
            width: this.gameSize.width,
            height: this.gameSize.height,
            fontSize: 20
        });
        document.body.appendChild(this.display.getContainer());

        this.startNewGame();
        this.mainLoop();
    }

    draw(position: Point, glyph: Glyph): void {
        let foreground = glyph.foregroundColor || this.foregroundColor;
        let background = glyph.backgroundColor || this.backgroundColor;
        this.display.draw(position.x, position.y, glyph.character, foreground, background);
    }

    drawText(position: Point, text: string, maxWidth?: number): void {
        this.display.drawText(position.x, position.y, text, maxWidth);
    }

    appendText(text: string): void {
        this.messageLog.appendText(text);
    }

    mapIsPassable(x: number, y: number): boolean {
        return (x + "," + y) in this.map;
    }

    getGlyphAt(key: string): Glyph {
        return this.map[key];
    }

    getPlayerPosition(): Point {
        return this.player.position;
    }

    checkBox(key: string): boolean {
        if (this.map[key] !== this.box) {
            this.messageLog.appendText("There is no box here!");
            return;
        }

        // TODO update status line

        if (key === this.pineappleKey) {
            this.messageLog.appendText("Hooray! You found a pineapple.");
            return true;
        } else {
            this.messageLog.appendText("This box is empty.");
        }
    }

    private startNewGame(): void {
        this.map = {};
        this.freeCells = [];

        this.display.clear();
        this.generateMap();
        this.generateBoxes();

        this.player = this.createBeing(Player);
        this.pedro = this.createBeing(Pedro);
        this.scheduler = new Scheduler.Simple();
        this.scheduler.add(this.player, true);
        this.scheduler.add(this.pedro, true);

        this.createStatusLine();
        this.createActionLog();

        this.drawPanel();
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
            }

            this.drawPanel();

            if (gameState) {
                if (gameState.isGameOver) {
                    await this.waitForInput();
                    this.startNewGame();
                }
            }
        }
    }

    private drawPanel(): void {
        this.display.clear();
        this.drawMap();
        this.statusLine.draw();
        this.messageLog.draw();
        this.draw(this.player.position, this.player.glyph);
        this.draw(this.pedro.position, this.pedro.glyph);
    }

    private waitForInput(): Promise<any> {
        return new Promise(resolve => {
            this.processInputCallback = (event: KeyboardEvent) => this.processInput(event, resolve);
            window.addEventListener("keydown", this.processInputCallback);
        });
    }

    private processInput(event: KeyboardEvent, resolve: (value?: any) => void): Promise<any> {
        let code = event.keyCode;
        if (code === KEYS.VK_SPACE || code === KEYS.VK_RETURN) {
            window.removeEventListener("keydown", this.processInputCallback);
            resolve();
        }
        return;
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
        this.statusLine = new StatusLine(this, this.statusLinePosition, this.gameSize.width, { maxBoxes: this.maximumBoxes });
    }

    private createActionLog(): void {
        this.messageLog = new MessageLog(this, this.actionLogPosition, this.gameSize.width, 3);
    }

    private drawMap(): void {
        let point: Point;
        for (let key in this.map) {
            point = this.mapKeyToPoint(key);
            this.draw(point, this.getGlyphAt(key));
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