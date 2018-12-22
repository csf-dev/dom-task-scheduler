module.exports = function(config) {
  const webpackConfig = require('./webpack.config.js');
  const testFilePattern = ['src/**/*.spec.js'];

  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: testFilePattern.map(function(item) { return { pattern: item, watched: true }; }),
    preprocessors: (function(){
      let output = {};
      testFilePattern.forEach(function(item) { output[item] = ['webpack']; });
      return output;
    })(),
    webpack: webpackConfig,
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    phantomjsLauncher: { exitOnResourceError: true },
    singleRun: true,
    concurrency: Infinity,
    specReporter: {
        suppressSkipped: false,
        suppressPassed: true
    },
  });
}