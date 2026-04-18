module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["babel-jest", { presets: ["@babel/preset-env", "@babel/preset-typescript"] }]
  },
};