module.exports = {
  entry: ['./src/preload'],
  mode: 'none',
  target: 'electron-main',
  output: {
    filename: 'preload.bundle.js',
    path: `${__dirname}/src`
  }
};
