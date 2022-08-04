const pkgJson = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const importHelper = require('@babel/helper-module-imports');


const createDefinePlugin = (type) => {
  const buildConstants = {
    __VERSION__: JSON.stringify(pkgJson.version),
  };
  return new webpack.DefinePlugin(buildConstants);
};

const basePlugins = [
  new webpack.BannerPlugin({
    entryOnly: true,
    raw: true,
    banner: 'typeof window !== "undefined" &&',
  }),
];
const mainPlugins = [...basePlugins, createDefinePlugin('main')];

const baseConfig = {
  mode: 'development',
  entry: './src/image.manager',
  optimization: {
    splitChunks: false,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(ts|js)$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [
            '@babel/preset-typescript',
            [
              '@babel/preset-env',
              {
                loose: true,
                modules: false,
                targets: {
                  browsers: [
                    'chrome >= 47',
                    'firefox >= 51',
                    'safari >= 8',
                    'ios >= 8',
                    'android >= 4',
                  ],
                },
              },
            ],
          ],
          plugins: [
            [
              '@babel/plugin-proposal-class-properties',
              {
                loose: true,
              },
            ],
            '@babel/plugin-proposal-object-rest-spread',
            {
              visitor: {
                CallExpression: function (espath) {
                  if (espath.get('callee').matchesPattern('Number.isFinite')) {
                    espath.node.callee = importHelper.addNamed(
                      espath,
                      'isFiniteNumber',
                      path.resolve('src/polyfills/number')
                    );
                  } else if (
                    espath
                      .get('callee')
                      .matchesPattern('Number.MAX_SAFE_INTEGER')
                  ) {
                    espath.node.callee = importHelper.addNamed(
                      espath,
                      'MAX_SAFE_INTEGER',
                      path.resolve('src/polyfills/number')
                    );
                  }
                },
              },
            },
            ['@babel/plugin-transform-object-assign'],
            ['@babel/plugin-proposal-optional-chaining'],
          ],
        },
      },
    ],
  },
  node: {
    global: false,
    process: false,
    __filename: false,
    __dirname: false,
    Buffer: false,
    setImmediate: false,
  },
};

const multiConfig = [
  {
    name: 'dist',
    mode: 'production',
    output: {
      filename: 'main.min.js',
      chunkFilename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
      library: 'Image',
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this',
    },
    plugins: mainPlugins,
    // devtool: 'source-map',
  },
].map((config) => {
  const baseClone = merge({}, baseConfig);
  if (config.mode === 'production') {
    baseClone.module.rules
      .find((rule) => rule.loader === 'babel-loader')
      .options.plugins.push([
        'transform-remove-console',
        {
          exclude: ['log', 'warn', 'error'],
        },
      ]);
  }
  return merge(baseClone, config);
});

// webpack matches the --env arguments to a string; for example, --env.debug.min translates to { debug: true, min: true }
module.exports = (envArgs) => {
  const requestedConfigs = Object.keys(envArgs).filter(
    (key) => !/^WEBPACK_/.test(key)
  );
  let configs;
  if (!requestedConfigs.length) {
    // If no arguments are specified, return every configuration
    configs = multiConfig;
  } else {
    // Filter out enabled configs
    const enabledConfigs = multiConfig.filter((config) =>
      requestedConfigs.includes(config.name)
    );
    if (!enabledConfigs.length) {
      throw new Error(
        `Couldn't find a valid config with the names ${JSON.stringify(
          requestedConfigs
        )}. Known configs are: ${multiConfig
          .map((config) => config.name)
          .join(', ')}`
      );
    }

    configs = enabledConfigs;
  }

  console.log(
    `Building configs: ${configs.map((config) => config.name).join(', ')}.\n`
  );
  return configs;
};
