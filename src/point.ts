export class Point {
    constructor(public x: number, public y: number) { }

    toKey(): string {
        return this.x + "," + this.y;
    }
}