const { ON, INHERIT } = require('./constants');
const { ConwaysGameEngine } = require('./index');

function times(iterations, callback) {
  for (let i = 0; i < iterations; i++) {
    callback(i);
  }
}

/**
 * 
 * @param {ConwaysGameEngine} engine 
 * @param {*} homeRow 
 * @param {*} homeCol 
 */
function getNumberOfNeighbours(engine, homeRow, homeCol) {
  const world = engine.world;
  const { rowSize, colSize } = engine.config;

  // scan the neighbourhood
  const startingRow = homeRow - 1;
  const endingRow = homeRow + 1;

  const startingCol = homeCol - 1;
  const endingCol = homeCol + 1; // R.I.P. Bug, you were called cellRow once. goddammit.

  let numberOfNeighbours = 0;

  for (var currentRow = startingRow; currentRow <= endingRow; currentRow++) {
    // EDGE CASE 1: don't work with out-of-bound rows
    if (currentRow < 0 || currentRow > (rowSize - 1)) {
      continue;
    }

    for (var currentCol = startingCol; currentCol <= endingCol; currentCol++) {
      // EDGE CASE 2: don't work with out-of-bound cols
      if (currentCol < 0 || currentCol > (colSize - 1)) {
        continue;
      }

      // EDGE CASE 3: don't scan yourself!
      if (currentRow === homeRow && currentCol === homeCol) {
        continue;
      }

      // scanning the neighbour now
      if (world[currentRow][currentCol] === ON) {
        numberOfNeighbours++;
      }
    }
  }

  return numberOfNeighbours;
}

function initWorld(valueToSet, rowSize, colSize) {
  const world = [];

  times(rowSize, row => {
    world[row] = [];

    times(colSize, col => {
      world[row][col] = valueToSet;
    })
  });

  return world;
}

function draw(world, row, col) {
  world[row][col] = ON;
}

/**
 * 
 * @param {ConwaysGameEngine} engine 
 */
function calculateNewWorldState(engine) {
  const { world: oldWorld, config } = engine;
  const { rules, rowSize, colSize, allowMultipleRuleMatches } = config;

  const newWorld = initWorld(INHERIT, rowSize, colSize);

  // process the rules
  times(engine.config.rowSize, row => {
    times(engine.config.colSize, col => {
      const currState = engine.getState(row, col);
      const numberOfNeighbours = getNumberOfNeighbours(engine, row, col);

      let rulesAlreadyMatched = [];
      rules.forEach(rule => {
        const isMatch = rule.matcher(currState, numberOfNeighbours);

        if (isMatch) {
          rulesAlreadyMatched.push(rule.name);

          // error check
          if (!allowMultipleRuleMatches && rulesAlreadyMatched.length > 1) {
            console.error("RULES ALREADY MATCHED", rulesAlreadyMatched)
            throw new Error('Multiple rulematches detected. This is an illegal state. Game will abort.')
          }

          newWorld[row][col] = rule.result;
        }
      });
    });
  });

  // collapse the worlds
  times(rowSize, row => {
    times(colSize, col => {
      if (newWorld[row][col] === INHERIT) {
        newWorld[row][col] = oldWorld[row][col];
      }
    })
  })

  return newWorld;
}

module.exports = {
  times,
  getNumberOfNeighbours,
  initWorld,
  draw,
  calculateNewWorldState
}

