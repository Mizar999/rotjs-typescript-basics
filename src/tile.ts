import { Glyph } from "./glyph";

export const enum TileType {
    Floor,
    Box,
    SearchedBox,
    DestroyedBox
}

export class Tile {
    static readonly floor = new Tile(TileType.Floor, new Glyph("."));
    static readonly box = new Tile(TileType.Box, new Glyph("#", "#654321"));
    static readonly searchedBox = new Tile(TileType.SearchedBox, new Glyph("#", "#666"));
    static readonly destroyedBox = new Tile(TileType.DestroyedBox, new Glyph("x", "#555"));

    constructor(public readonly type: TileType, public readonly glyph: Glyph) { }
}