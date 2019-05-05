export class InputUtility {
    private static processInputCallback: (event: KeyboardEvent) => any;
    private static resolve: (value?: any) => void;

    static waitForInput(handleInput: (event: KeyboardEvent) => boolean): Promise<any> {
        return new Promise(resolve => {
            if (InputUtility.processInputCallback !== undefined) {
                InputUtility.stopProcessing();
            }

            InputUtility.resolve = resolve;
            InputUtility.processInputCallback = (event: KeyboardEvent) => InputUtility.processInput(event, handleInput);
            window.addEventListener("keydown", InputUtility.processInputCallback);
        });
    }

    private static processInput(event: KeyboardEvent, handleInput: (event: KeyboardEvent) => boolean): void {
        if (handleInput(event)) {
            InputUtility.stopProcessing();
        }
    }

    private static stopProcessing(): void {
        window.removeEventListener("keydown", InputUtility.processInputCallback);
        InputUtility.processInputCallback = undefined;
        InputUtility.resolve();
    }
}