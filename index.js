const { initWorld, getNumberOfNeighbours, calculateNewWorldState } = require('./utils');
const { ON, OFF } = require('./constants');

class ConwaysGameEngine {
  constructor(config={}) {
    this.config = {
      rowSize: config.rowSize || 10,
      colSize: config.colSize || 10,
      rules: config.rules || defaultRules(),
      allowMultipleRuleMatches: config.allowMultipleRuleMatches || false
    }

    this.world = initWorld(OFF, this.config.rowSize, this.config.colSize);
  }

  getState(row, col) {
    return this.world[row][col];
  }

  step() {
    this.world = calculateNewWorldState(this);
    return this.world;
  }

  draw(row, col) {
    this.world[row][col] = ON;
  }

  erase(row, col) {
    this.world[row][col] = OFF;
  }
}

const defaultRules = () => [
  // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  {
    name: "Loneliness",
    matcher: (currState, numberOfNeighbours) => currState === ON && numberOfNeighbours < 2,
    result: OFF
  },
  // 2. Any live cell with two or three live neighbours lives on to the next generation.
  {
    name: "Survival",
    matcher: (currState, numberOfNeighbours) => currState === ON && (numberOfNeighbours === 2 || numberOfNeighbours === 3),
    result: ON
  },
  // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
  {
    name: "Overpopulation",
    matcher: (currState, numberOfNeighbours) => currState === ON && numberOfNeighbours > 3,
    result: OFF
  },
  // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  {
    name: "Reproduction",
    matcher: (currState, numberOfNeighbours) => currState === OFF && numberOfNeighbours === 3,
    result: ON
  }
]

module.exports = {
  ConwaysGameEngine,
  defaultRules
}