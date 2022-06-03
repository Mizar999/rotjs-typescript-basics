# rot.js TypeScript basics

A basic roguelike example built with rot.js and TypeScript. Playable at [https://mizar999.github.io/rotjs-typescript-basics/](https://mizar999.github.io/rotjs-typescript-basics/)

## Resources

- [rot.js - Roguelike Toolkit](https://github.com/ondras/rot.js)
- [RogueBasin - rot.js Tutorial](http://www.roguebasin.roguelikedevelopment.org/index.php?title=Rot.js_tutorial)
- [Frostlike - 7 Day Roguelike Challenge 2017 entry](https://github.com/maqqr/7drl2017)

## How to run

After cloning the repository:

- Install necessary packages

    ```powershell
    npm install
    ```

- To build the application run:

    ```powershell
    npm run build
    ```

- To run multiple npm scripts cross platform in parallel run the following command:

    ```powershell
    # if globally installed
    concurrently npm:watch npm:serve

    # if locally installed
    npx concurrently npm:watch npm:serve
    ```

## Initial Project setup

If you're interested here is my initial project setup:

- Init npm and install necessary packages

    ```powershell
    npm init -y
    npm install --save-dev typescript@4.6.4 ts-loader@9.3.0 rot-js@2.0.3 webpack@5.72.1 webpack-cli@4.9.2 http-server@14.1.0 concurrently@7.2.1
    ```

- Create **Webpack** configuration `webpack.config.js`:

    ```javascript
    const path = require('path');

    module.exports = {
    entry: './src/app.ts',
    module: {
        rules:[{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
    };
    ```

- Webpack will get the sources from `src/app.ts` and collect everything in `dist/app.js` file
- Create **TypeScript** configuration `tsconfig.json`:

    ```json
    {
        "compilerOptions": {
            "target": "es5"
        },
        "include": [
            "src/*"
        ]
    }
    ```

- Update the **scripts**-section of the `package.json` file:

    ```json
    "scripts": {
        "build": "webpack",
        "watch": "webpack --watch",
        "serve": "http-server --port=8085 -c-1"
    }
    ```
