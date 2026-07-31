const ReactCompilerConfig = {};

module.exports = {
  presets: ["@babel/preset-typescript"],
  plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
};
