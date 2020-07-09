// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      nodeResolve({jsnext: true, module: true}),
      commonjs({
        include: [
        ...
        'node_modules/@cloudinary/angular/**',
        'node_modules/cloudinary-core/**',
        ],
        namedExports: {
          'cloudinary-core/cloudinary-core-shrinkwrap': [ 'Cloudinary' ],
          '@cloudinary/angular': [ 'CloudinaryModule', 'Cloudinary' ],
        }
      }),
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/ngr1d3rs'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
    map: {
      // Cloudinary lib
      '@cloudinary/angular': 'npm:@cloudinary/angular-5.x',
      'cloudinary-core': 'npm:cloudinary-core',

    },
    packages: {
      ...
      "@cloudinary/angular": {
        main: 'index.js',
        defaultExtension: 'js'
      },
      "cloudinary-core": {
        main: 'cloudinary-jquery-file-upload.js',
        defaultExtension: 'js'
      }

    }
  });
};
