import { Glyph } from "./glyph";

export class Tile {
    static readonly floor = new Tile("floor", new Glyph("."));
    static readonly box = new Tile("box", new Glyph("#", "#654321"));
    static readonly searchedBox = new Tile("searchedBox", new Glyph("#", "#666"));
    static readonly destroyedBox = new Tile("destroyedBox", new Glyph("x", "#555"));

    constructor(public readonly type: string, public readonly glyph: Glyph) { }
}