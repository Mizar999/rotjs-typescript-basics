# rot.js TypeScript basics

A basic roguelike example built with rot.js and TypeScript. Playable at [https://mizar999.github.io/rotjs-typescript-basics/](https://mizar999.github.io/rotjs-typescript-basics/)

## Resources

- [rot.js - Roguelike Toolkit](https://github.com/ondras/rot.js)
- [RogueBasin - rot.js Tutorial](http://www.roguebasin.roguelikedevelopment.org/index.php?title=Rot.js_tutorial)
- [Frostlike - 7 Day Roguelike Challenge 2017 entry](https://github.com/maqqr/7drl2017)

## Project setup

After cloning the repository:

- Install necessary packages

    ```powershell
    npm install
    ```

- To build the application run:

    ```powershell
    npm run build
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
