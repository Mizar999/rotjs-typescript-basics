export class GameState {
    foundPineapple: boolean;
    playerWasCaught: boolean;

    constructor() {
        this.reset();
    }

    reset(): void {
        this.foundPineapple = false;
        this.playerWasCaught = false;
    }

    isGameOver(): boolean {
        return this.foundPineapple || this.playerWasCaught;
    }
}