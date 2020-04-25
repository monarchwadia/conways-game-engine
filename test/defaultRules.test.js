const { ConwaysGameEngine } = require('../index');

let engine;

beforeEach(() => {
  engine = new ConwaysGameEngine();
})

test('Simple glider', () => {
  /*
  Glider steps
  . . . . . . . . . . . . . . . . . . . . . . . . . . .
  . . . . . . . . . . . . . . . . . . . . . . . . . . .
  . . . . . . . . . . . . . . . . . . . . . . . . . . .
  . . . # . . . . . . . . . . . . . . . . . . . . . . .
  . . . . # . . # . # . . . . # . . # . . . . . # . . .
  . . # # # . . . # # . . # . # . . . # # . . . . # . .
  . . . . . . . . # . . . . # # . . # # . . . # # # . .
  . . . . . . . . . . . . . . . . . . . . . . . . . . .
  . . Step 1    Step 2    Step 3    Step 4    Step 5
*/

  // draw step 1
  engine.draw(3, 4);
  engine.draw(4, 5);
  engine.draw(5, 5);
  engine.draw(5, 4);
  engine.draw(5, 3);

  // step 1
  testConfiguration([
    [0,1,0,0],
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0]
  ], engine, 3, 3)

  // step 2
  engine.step();
  testConfiguration([
    [0,0,0,0],
    [1,0,1,0],
    [0,1,1,0],
    [0,1,0,0],
  ], engine, 3, 3)

  // step 3
  engine.step();
  testConfiguration([
    [0,0,0,0],
    [0,0,1,0],
    [1,0,1,0],
    [0,1,1,0],
  ], engine, 3, 3)

  // step 4
  engine.step();
  testConfiguration([
    [0,0,0,0],
    [0,1,0,0],
    [0,0,1,1],
    [0,1,1,0],
  ], engine, 3, 3)

  // step 5
  engine.step();
  testConfiguration([
    [0,0,0,0],
    [0,0,1,0],
    [0,0,0,1],
    [0,1,1,1],
  ], engine, 3, 3)


})

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