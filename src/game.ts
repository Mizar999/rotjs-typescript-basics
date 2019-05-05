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
import { InputUtility } from "./input-utility";

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
    private gameState: GameState;

    private pineappleKey: string;
    private foregroundColor = "white";
    private backgroundColor = "black";
    private floor = new Glyph(".");
    private newBox = new Glyph("#", "#654321");
    private searchedBox = new Glyph("#", "#666");
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

        this.gameState = new GameState();
        this.statusLine = new StatusLine(this, this.statusLinePosition, this.gameSize.width, { maxBoxes: this.maximumBoxes });
        this.messageLog = new MessageLog(this, this.actionLogPosition, this.gameSize.width, 3);

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

    mapIsPassable(x: number, y: number): boolean {
        return (x + "," + y) in this.map;
    }

    getGlyphAt(key: string): Glyph {
        return this.map[key];
    }

    getPlayerPosition(): Point {
        return this.player.position;
    }

    checkBox(key: string): void {
        if (this.map[key] !== this.newBox) {
            if (this.map[key] === this.searchedBox) {
                this.messageLog.appendText("This box is still empty.");
            } else {
                this.messageLog.appendText("There is no box here!");
            }
            return;
        }

        this.statusLine.boxes += 1;
        this.map[key] = this.searchedBox;

        if (key === this.pineappleKey) {
            this.messageLog.appendText("Hooray! You found a pineapple.");
            this.gameState.foundPineapple = true;
        } else {
            this.messageLog.appendText("This box is empty.");
        }
    }

    catchPlayer(): void {
        this.messageLog.appendText("Game over - you were captured by Pedro!");
        this.gameState.playerWasCaught = true;
    }

    updateGameState(stateUpdate: any): void {
        this.gameState = stateUpdate.foundPineapple || this.gameState.foundPineapple;
        this.gameState = stateUpdate.playerWasCaught || this.gameState.playerWasCaught;
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

        this.gameState.reset();
        this.messageLog.clear();
        this.statusLine.boxes = 0;

        this.drawPanel();
    }

    private async mainLoop(): Promise<any> {
        let actor: Actor;
        while (true) {
            actor = this.scheduler.next();
            if (!actor) {
                break;
            }

            await actor.act();
            if (actor.type === "player") {
                this.statusLine.turns += 1;
            }
            if (this.gameState.foundPineapple) {
                this.statusLine.pineapples += 1;
            }

            this.drawPanel();

            if (this.gameState.isGameOver()) {
                await InputUtility.waitForInput(this.handleInput.bind(this));
                if (this.gameState.playerWasCaught) {
                    this.resetStatusLine();
                }
                this.startNewGame();
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

    private handleInput(event: KeyboardEvent): boolean {
        let code = event.keyCode;
        return code === KEYS.VK_SPACE || code === KEYS.VK_RETURN;
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
        let key: string;
        for (let boxes = 0; boxes < this.maximumBoxes; ++boxes) {
            key = this.getRandomFreeCell();
            this.map[key] = this.newBox;
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

    private resetStatusLine(): void {
        this.statusLine.reset();
        this.statusLine.maxBoxes = this.maximumBoxes;
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