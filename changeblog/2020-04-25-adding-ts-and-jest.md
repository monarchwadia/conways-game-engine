# First Changeblog entry: adding unit testing (jest), typescript, and browser support (webpack + babel) to an already-published Node package.

## Background about why I'm doing this.
I love simulation games. I grew up playing SimAnt, CimCity, SimTower, Railroad Tycoon, Rollercoaster Tycoon, SimEarth -- bunches and bunches of simulation games made up a large part of my childhood.

And cellular automata are the haiku of simulation games -- they come with tiny rules, which you can tinker with ad-infinitum to create worlds out of thin air. They're really quite elegant and fun to play with.

I wanted to have a way to experiment with cellular automata by tweaking rules and what not. [Conway's Game Engine](https://www.npmjs.com/package/@monarchwadia/conways-game-engine) is an implementation of Conway's Game of Life that lets you configure your own rulesets.

I built this as part of a [Mintbean Hackathon](https://github.com/MintbeanHackathons/2020-04-19-Conways-Game-of-Life-4-day-extended), so it was really a quick and dirty creation. I left it in a working state, but it was going to be difficult to use without static typing.

So I'm writing this document as I go, implementing static typing. I hope it's useful as a case study for people some time in the future.

## Starting point

The game engine as it exists right now is Node-compatible, and can be installed using `npm install @monarch/conways-game-engine`. It totally works and you can read the docs to get an idea for how it works. It is NOT browser-friendly without further modifications, and does not come out-of-the-box with any GUI of any sort (although there are some simple terminal-based examples in the `/examples` folder). It is strictly a game engine.

I started with v1.0.1 of the project: [v1.0.1][starting-commit], and I had a few specific changes I wanted to make.

## Target state

Here are a few modifications that needed to be made:

| Feature | Current state | What I want to do with it | Why |
|---|---|---|---|
| Language | Vanilla JavaScript  | I want to add Typescript | This is intended to be an importable library. Typescript would make code hinting and error detection wayyyy better.   |
| Example projects | Node only  | I want some browser examples | It makes no sense to make a game backend-only. I want to create a frontend game out of this project and then deploy it to a website. |
| Testing | None | I want to use Jest | Adding testing isn't ALWAYS a good idea. For example, in personal projects like this one, they're often unnecessary and can really suck the fun out of development. Testing is just a tool, and I don't buy into the test-driven fetish our industry is plagued with. But when you're expanding an existing backend project that has no GUI, automatic test runners make you go much faster without breaking things. I'm using Jest because it's more fun and less fiddly to use than Mocha/Chai |

## Constraints

Here are the constraints I'm working with:

1. I only have max. 4 hours to spend on this project, and any extra time spent on this project would take away from my business.
1. I am documenting all of my changes, which further eats into those 4 hours.

## Strategy

Typescript works pretty well with plain JavaScript. It is completely possible to gradually port JS over to TS one step at a time, rather than as a whole. So we will start porting JS over one small step at a time.

I decided that I'd first install unit testing and fully test the project in plain Javascript. The little time I have right now to work on a personal project needs to be efficiently used, and any errors would leave an impact on the amount of time I have available to dedicate to my business.

This current commit adds the HOW-I-DID-IT md file to this project.

# Phase 1 -Adding unit tests

## Phase 0 - I started the changeblog

I've never done this before, but `changeblog` sounds like a good name for documenting changes as you go in a project. So I'm committing this file here.

So, here's the [link to the git commit for this section][commit-0] in case you want to follow along. Each section below will have a link to the git commit associated with it.

## Phase 1a - Adding unit tests for drawing and erasing.

I first installed `jest`, then added a `test` script to `package.json`

```
# terminal
yarn add -D jest

# package.json
{
  "scripts": {
    "test": "jest --watchAll"
  }
}
```

( I used `--watchAll` instead of `--watch`. Jest's `--watch` command only runs tests on files that have diffed. For now, we have so few tests, and our project is so lightweight, that a comprehensive test of all files would let me sleep better at night. So, I'm using `--watchAll`).

I added a few simple tests in `/test`, then run `yarn test`, and here is our output:

```
 PASS  test/draw.test.js
  ✓ It can draw and then erase a simple cell (4ms)
  ✓ Drawing multiple times is idempotent (2ms)
  ✓ Erasing multiple times is idempotent (1ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.21s
Ran all test suites.

Watch Usage: Press w to show more.

```

Excellent! Here's the [link to the git commit for this section][commit-1a] in case you want to follow along.

## Phase 1b - Adding a simple test for the engine's default Game of Life ruleset

Now we will actually test the game engine itself, with the default rules. We will test the rules by seeing if a simple glider survives and behaves as expected in the normal rules of the game of life. This will be sufficient to give me enough confidence in the game to start moving to typescript.

Here is an illustration of how the glider works. Note that the 5th step is identical to the 1st step, except moved down and to the right by exactly 1,1. This is pretty fascinating to me.


![5 steps of a glider in Conway's game of life.](./glider-steps.png)
```
Cumming, Graeme. (2011). Introduction to Mechanistic Spatial Models for Social-Ecological Systems. 10.1007/978-94-007-0307-0_4. 
```

Unit tests should ideally be easy to modify once they have been written. They don't have to be as well-written as the actual software itself, but they should be written so that they're easy to reason about when you go back and read them a few weeks/months/years after the fact.

Now, it would be very painful to actually program this test line-by-line, inserting coordinates and on/off expectations in a typical `expect().toBe()` format. So I created a utility function that does that for me.

```javascript
function testConfiguration(expectation, engine, originRow, originCol) {
  for (var row = 0; row < expectation.length; row++) {
    for (var col = 0; col < expectation[row].length; col++) {
      
      // the "origin" here refers to the top-left corner of the metaphorical "viewport"
      const worldRow = originRow + row, // pan the metaphorical "viewport" over to the origin
            worldCol = originCol + col; // pan the metaphorical "viewport" down to the origin
      

      const expectedState = expectation[row][col];
      const worldState = engine.getState(worldRow, worldCol);

      expect(worldState, `Was testing [Row: ${worldRow}][Col: ${worldCol}]`).toBe(expectedState);
    }
  }
}
```

Now, I can test a step like so:

```javascript

  // step 4
  engine.step();
  testConfiguration([
    [0,0,0,0],
    [0,1,0,0],
    [0,0,1,1],
    [0,1,1,0],
  ], engine, 3, 3)

```

I have a glider test fully operational now. Here's the [link to the commit for this section][commit-1b] in case you want to follow along.

## Phase 1c - Adding a simple test for the engine's configurable rules.

The engine is supposed to be able to take various different rulesets, not just Conway's game of life. We'll now add a simple test for the rulesets.

I created `test/customRules.test.js`, and then realized that I would want to share `testConfiguration` across files. I didn't know how to do it, so I googled it and found [this helpful thread](https://stackoverflow.com/questions/50411719/shared-utils-functions-for-testing-with-jest/52910794) that described how to use Jest's `setupFilesAfterEnv` to add a global helper. 

I refactored the [function signature](https://hackernoon.com/function-type-signatures-in-javascript-5c698c1e9801) of the helper a bit, put it into its own file, and exposed it as a global. Now, I can share it between multiple files.

I added a very simple ruleset -- 
 1. OFF cells become ON
 2. ON cells become OFF

So essentially, all cells are blinking lights that go ON-OFF-ON-OFF-ON, etc.

Then I tested it. It worked as expected.

Great! Now I'm confident enough to move on to actual typescript conversion. "Testing" is now done.

Here's the [link to the git commit for this section][commit-1c] in case you want to follow along.

## Minor changes: adding commit hashes, and exposing this on README.md, formatting this README.md

I want people to be able to follow along with my thought process. So I've added links to hashes at the end of each section above. I also added the link to this file on README.md. Also formatted the README so it's easier to read, and changed the title to make it more clear about what I'm doing here.

Copious use of `git commit --amend` and `git push --force` let me keep this commit clean. Thank you, Linus Torvalds, for making a sensible version control system that is easy to work with.

# Phase 2 - Adding Typescript

To start adding Typescript, we must, of course, install Typescript. But we also need to make sure that Jest doesn't freak out about it -- and that TS like show the JS files look, and vice versa. So writing this sentence, I'm expecting a few issues that could possibly make me spend a lot of time in tinkering around with build processes. (I think of that stuff as the "plumbing". Not necessarily fun work, but it is rewarding when you've finished up and built a good, solid build process that really works.)

To avoid unnecessary issues when converting JS files to TS, I usually start with the fringes of my project's dependency tree and work towards the main files. This way, I don't fall into the trap of resolving long chains of TS typechecking errors. Instead, the leaves and branches of my dependency tree -- the files that have the least number of imports -- are converted to TS first. For every file thus converted, Intellisense starts offering much more useful hints, making working with other JS files incrementally easier. Essentially, I'm not going against the grain. Instead, I'm working WITH the toolset, in an incremental way.

This project is super easy. There aren't that many files. I'll start with `constants.js`, then move on to `utils.js`, then convert `index.js`. Then I will convert the `test` files we just made in the previous phase. Finally, I'll modify the examples to use typescript, and we will be done. 

So let's have at it.

## Phase 2a - Installing Typescript 

Installing typescript is pretty easy.

```
yarn add -D typescript
```

But that's just the beginning. According to [Jest's getting started guide](https://jestjs.io/docs/en/getting-started.html), Jest will NOT type-check files as the tests are run. Furthermore, it also relies on Babel presets. I didn't really want to get involved with Babel right away, because I'll be looking that in the next phase anyway to build browser support.

Fortunately, I found an alternative pretty quickly. The same Jest getting started guide references a community package, [ts-jest](https://github.com/kulshekhar/ts-jest), which seems a bit nicer to use with Typescript in the mix. I don't usually like installing community packages, but this seems like the easiest way to get up and running.

```
## I didn't need jest or typescript since I had already installed them by this point.
# yarn add -D jest typescript

## But I still needed ts-jest, and @typefiles for jest.
yarn add -D ts-jest @types/jest

## And I also needed to create the ts-jest config. This overrides my existing jest config. I just copied entries from the old config over after re-initializing the config like so:
npx ts-jest config:init
```

At this point, `yarn test` goes off without a fight, and I'm happily running with a typescript-based Jest config.

Now, we can actually start working with the files themselves.

## Phase 2a - Converting our first file

Thanks to the great interop between Typescript and vanilla Javascript, converting a file to Typescript is a simple 2-step process:

1. Rename the file from `*.js` to `*.ts`
1. Resolve any errors that may have occurred

As soon as I renamed `constants.js`, it was no longer found by `jest`. However, Jest's error messages were super helpful and immediately gave me the solution to the problem:

```
    You might want to include a file extension in your import, or update your 'moduleFileExtensions', which is currently ['js', 'json', 'jsx', 'ts', 'tsx', 'node'].
```

Armed with this info, I added the following line to my `jest.config.js`:

```
{
  // ...
  moduleFileExtensions: ["js", "jsx", "json", "ts", "tsx"]
}
```

This seemed to work, and `constants.ts` was now being recognized correctly.

I was also happy to discover that our static-phase typechecking was working just fine. My CommonJS syntax was now being rejected by typescript:

```
 FAIL  test/defaultRules.test.js
  ● Test suite failed to run

    constants.ts:1:1 - error TS2304: Cannot find name 'exports'.

    1 exports.ON = 1;
      ~~~~~~~
    constants.ts:2:1 - error TS2304: Cannot find name 'exports'.

    2 exports.OFF = 0;
      ~~~~~~~
    constants.ts:3:1 - error TS2304: Cannot find name 'exports'.

    3 exports.INHERIT = undefined;
      ~~~~~~~
```

The solution to this issue is to use ES6 Module syntax (i.e. `export` and `import`). 

Here's what the new file looks like:
```javascript
// OLD constants.js, as it was
exports.ON = 1;
exports.OFF = 0;
exports.INHERIT = undefined;

// RENAMED constants.ts, with the new entries
export const ON = 1;
export const OFF = 0;
export const INHERIT = undefined;
```

I'm expecting this to be an issue with every single file I edit.



[starting-commit]: https://github.com/monarchwadia/conways-game-engine/tree/v1.0.1
[commit-0]: https://github.com/monarchwadia/conways-game-engine/commit/0bb4fc500fd84b4734270a3bb38ab3a115e55819
[commit-1a]: https://github.com/monarchwadia/conways-game-engine/commit/661ab3bb84b3d7af71ebf6a26e77661c1a645949
[commit-1b]: https://github.com/monarchwadia/conways-game-engine/commit/b3596d93916d8a6826b1d1a895660045e89de127
[commit-1c]: https://github.com/monarchwadia/conways-game-engine/commit/fa1229382fcc9e4247d7f120f3c384f7e6ebb1e3