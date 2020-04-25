# Background

I love simulation games. I grew up playing SimAnt, CimCity, SimTower, Railroad Tycoon, Rollercoaster Tycoon, SimEarth -- bunches and bunches of simulation games made up a large part of my childhood.

And cellular automata are the haiku of simulation games -- they come with tiny rules, which you can tinker with ad-infinitum to create worlds out of thin air. They're really quite elegant and fun to play with.

I wanted to have a way to experiment with cellular automata by tweaking rules and what not. [Conway's Game Engine](TODO) is an implementation of Conway's Game of Life that lets you configure your own rulesets.

I built this as part of a [Mintbean Hackathon](TODO), so it was really a quick and dirty creation. I left it in a working state, but it was going to be difficult to use without static typing.

So I'm writing this document as I go, implementing static typing. I hope it's useful as a case study for people some time in the future.

# Starting point

The game engine as it exists right now is Node-compatible, and can be installed using `npm install @monarch/conways-game-engine`. It totally works and you can read the docs to get an idea for how it works. It is NOT browser-friendly without further modifications, and does not come out-of-the-box with any GUI of any sort (although there are some simple terminal-based examples in the `/examples` folder). It is strictly a game engine.

I started with this hash: [608fe40e08b4f90d41fc60ff8d7929c7ac379ccc]("Todo: Link to the hash on Github"), and I had a few specific changes I wanted to make.

# Target state

Here are a few modifications that needed to be made:

| Feature | Current state | What I want to do with it | Why |
|---|---|---|---|
| Language | Vanilla JavaScript  | I want to add Typescript | This is intended to be an importable library. Typescript would make code hinting and error detection wayyyy better.   |
| Example projects | Node only  | I want some browser examples | It makes no sense to make a game backend-only. I want to create a frontend game out of this project and then deploy it to a website. |
| Testing | None | I want to use Jest | Adding testing isn't ALWAYS a good idea. For example, in personal projects like this one, they're often unnecessary and can really suck the fun out of development. Testing is just a tool, and I don't buy into the test-driven fetish our industry is plagued with. But when you're expanding an existing backend project that has no GUI, automatic test runners make you go much faster without breaking things. I'm using Jest because it's more fun and less fiddly to use than Mocha/Chai |

# Constraints

Here are the constraints I'm working with:

1. I only have max. 4 hours to spend on this project, and any extra time spent on this project would take away from my business.
1. I am documenting all of my changes, which further eats into those 4 hours.

# Strategy

I decided that I'd first install unit testing and fully test the project in plain Javascript. The little time I have right now to work on a personal project needs to be efficiently used, and any errors would leave an impact on the amount of time I have available to dedicate to my business.

This current commit adds the HOW-I-DID-IT md file to this project.

# Step 0 - I started the changeblog

I've never done this before, but `changeblog` sounds like a good name for documenting changes as you go in a project. So I'm committing this file here.
