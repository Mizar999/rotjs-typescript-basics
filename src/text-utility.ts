export function padLeft(text: string, length: number, character?: string): string {
    let char = character || " ";
    while (text.length < length) {
        text = char + text;
    }
    return text;
}

export function padRight(text: string, length: number, character?: string): string {
    let char = character || " ";
    while (text.length < length) {
        text += char;
    }
    return text;
}