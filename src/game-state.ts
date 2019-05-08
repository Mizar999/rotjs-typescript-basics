export class GameState {
    foundPineapple: boolean;
    pineappleWasDestroyed: boolean;
    playerWasCaught: boolean;

    constructor() {
        this.reset();
    }

    reset(): void {
        this.foundPineapple = false;
        this.pineappleWasDestroyed = false;
        this.playerWasCaught = false;
    }

    doStartNextRound(): boolean {
        return this.foundPineapple;
    }

    doRestartGame(): boolean {
        return this.pineappleWasDestroyed || this.playerWasCaught;
    }

    isGameOver(): boolean {
        return this.foundPineapple || this.pineappleWasDestroyed || this.playerWasCaught;
    }
}