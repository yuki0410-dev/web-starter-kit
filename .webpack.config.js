const isProd   = (process.env.NODE_ENV === 'production');

module.exports = {
  mode  : process.env.NODE_ENV,
  devtool: !isProd ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
};
