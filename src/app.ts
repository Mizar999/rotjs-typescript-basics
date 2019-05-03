/*
import { Display } from "rot-js/lib/index";

let options = {
    width: 75,
    height: 30,
    fontSize: 16,
    spacing: 1.0
};
let display = new Display(options);
document.body.appendChild(display.getContainer());

for (let x = 0; x < options.width; ++x) {
    for (let y = 0; y < options.height; ++y) {
        if (!x || !y || x + 1 == options.width || y + 1 == options.height) {
            display.draw(x, y, "#", "lightgray", "black");
        } else {
            display.draw(x, y, ".", "lightgray", "black");
        }
    }
}

display.draw(options.width >> 1, options.height >> 1, "@", "goldenrod", "black");
*/
import { Game } from "./game";

document.body.onload = () => {
    var game = new Game();
}