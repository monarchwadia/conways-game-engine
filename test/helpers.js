global.buildGridTester = (engine, originRow, originCol) => (expectation) => {
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
