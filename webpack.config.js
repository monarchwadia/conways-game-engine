const path = require('path');

module.exports = {
  entry: './src/index.ts',
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".jsx", ".json", ".tsx"],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: "umd",
    library: "@monarchwadia/conways-game-engine"
  },
};
