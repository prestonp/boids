module.exports = {
  entry: './main.js',
  output: {
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
