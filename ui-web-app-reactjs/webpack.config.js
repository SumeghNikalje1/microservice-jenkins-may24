require('dotenv').config({ path: `${__dirname}/.env` })

const path = require('path')
const webpack = require('webpack')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const AfterCompilePlugin = require('./after-compile-plugin')

const { NODE_ENV, DEV_SERVER_PORT, API, API_PORT, API_WEBPACK } = process.env

console.log(`
  +-----------------------------------+
  |                                   |
      NODE ENVIRONMENT: ${NODE_ENV}
  |                                   |
  +-----------------------------------+
`)

module.exports = (env) => ({
  mode: env.prod ? 'production' : 'development',

  bail: !!env.prod,

  context: path.resolve(__dirname, 'src'),

  entry: [path.resolve(__dirname, 'src/entry.jsx')],

  output: {
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[hash].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    pathinfo: !env.prod,
    globalObject: 'this'
  },

  module: {
    rules: [
      // ================= JS / JSX =================
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  useBuiltIns: 'entry',
                  corejs: 3
                }
              ],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-proposal-object-rest-spread',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator'
            ]
          }
        }
      },

      // ================= CSS / SCSS =================
      {
        test: /\.(scss|css)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },

      // ================= FONTS =================
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      },

      // ================= IMAGES =================
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        include: path.resolve(__dirname, 'src/assets'),
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },

  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'),
      hooks: path.resolve(__dirname, 'src/hooks'),
      helpers: path.resolve(__dirname, 'src/helpers')
    },
    extensions: ['.js', '.jsx', '.json', '.scss']
  },

  optimization: {
    minimize: !!env.prod,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          compress: {
            ecma: 5,
            comparisons: false,
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      __DEV__: !env.prod,
      __PROD__: env.prod,
      'process.env': {
        NODE_ENV: JSON.stringify(env.prod ? 'production' : 'development')
      }
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].css'
    }),

    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['*.js', '*.css', '*.html']
    }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),

    !env.prod &&
      new AfterCompilePlugin({
        run: () => {
          console.log('\n')
          API && console.log(`🌎 API listening on port ${API_PORT}`)
          console.log(
            `💻 Application running at http://localhost:${DEV_SERVER_PORT}\n\n`
          )
        }
      })
  ].filter(Boolean),

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    open: true,
    port: DEV_SERVER_PORT,
    public: `http://localhost:${DEV_SERVER_PORT}`,

    proxy: API_WEBPACK
      ? {
          [API_WEBPACK]: {
            target: `http://localhost:${API_PORT}`,
            bypass(req) {
              if (req.method !== 'GET') return
              if ((req.headers.accept || '').includes('html')) return '/'
            }
          }
        }
      : {}
  },

  devtool: !env.prod && 'cheap-module-eval-source-map',

  target: 'web'
})
