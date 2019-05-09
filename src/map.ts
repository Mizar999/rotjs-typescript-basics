import { Map as RotJsMap } from "rot-js/lib/index";
import { RNG } from "rot-js";
import { Game } from "./game";
import { Tile, TileType } from "./tile";
import { Point } from "./point";

export class Map {
    private map: { [key: string]: Tile };

    constructor(private game: Game) {
        this.map = {};
    }

    generateMap(width: number, height: number): void {
        this.map = {};
        let digger = new RotJsMap.Digger(width, height);
        digger.create(this.diggerCallback.bind(this));
    }

    setTile(x: number, y: number, tile: Tile): void {
        this.map[this.coordinatesToKey(x, y)] = tile;
    }

    getRandomTilePositions(type: TileType, quantity: number = 1): Point[] {
        let buffer: Point[] = [];
        let result: Point[] = [];
        for (let key in this.map) {
            if (this.map[key].type === type) {
                buffer.push(this.keyToPoint(key));
            }
        }

        let index: number;
        while (buffer.length > 0 && result.length < quantity) {
            index = Math.floor(RNG.getUniform() * buffer.length);
            result.push(buffer.splice(index, 1)[0]);
        }
        return result;
    }

    getTileType(x: number, y: number): TileType {
        return this.map[this.coordinatesToKey(x, y)].type;
    }

    isPassable(x: number, y: number): boolean {
        return this.coordinatesToKey(x, y) in this.map;
    }

    draw(): void {
        for (let key in this.map) {
            this.game.draw(this.keyToPoint(key), this.map[key].glyph);
        }
    }

    private coordinatesToKey(x: number, y: number): string {
        return x + "," + y;
    }

    private keyToPoint(key: string): Point {
        let parts = key.split(",");
        return new Point(parseInt(parts[0]), parseInt(parts[1]));
    }

    private diggerCallback(x: number, y: number, wall: number): void {
        if (wall) {
            return;
        }
        this.map[this.coordinatesToKey(x, y)] = Tile.floor;
    }
}