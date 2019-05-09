export class Point {
    constructor(public x: number, public y: number) { }

    equals(point: Point): boolean {
        return this.x == point.x && this.y == point.y;
    }

    toKey(): string {
        return this.x + "," + this.y;
    }
}