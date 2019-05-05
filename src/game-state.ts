export class GameState {
    foundPineapple: boolean;
    playerWasCaught: boolean;

    isGameOver(): boolean {
        return this.foundPineapple || this.playerWasCaught;
    }
}