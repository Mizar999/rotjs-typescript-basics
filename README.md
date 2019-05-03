# rot.js TypeScript basics

Using the rot.js library with TypeScript in a basic example.

## Resources

- [rot.js - Roguelike Toolkit](https://github.com/ondras/rot.js)
- [Frostlike - 7 Day Roguelike Challenge 2017](https://github.com/maqqr/7drl2017)

## Project setup

- Init npm and install necessary packages

    ```powershell
    npm init -y
    npm install --save-dev typescript rot-js webpack webpack-cli ts-loader live-server npm-run-all
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
        "serve": "live-server --port=8085"
    }
    ```

- To build the application run:

    ```powershell
    npm run-script build
    ```

- To run multiple npm scripts cross platform in parallel run the following command (use the **npx** command if the packages were installed locally):

    ```powershell
    # if globally installed
    npm-run-all --parallel watch serve

    # if locally installed
    npx npm-run-all --parallel watch serve
    ```

- Or use the shorthand command **run-p** for parallel tasks:

    ```powershell
    # if globally installed
    run-p watch serve

    # if locally installed
    npx run-p watch serve
    ```