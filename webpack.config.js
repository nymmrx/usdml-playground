const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const buildPath = path.resolve(__dirname, "dist");

const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = (env, argv) => ({
  // https://webpack.js.org/configuration/devtool/
  devtool: "source-map",

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: ["@babel/polyfill", "./src/index.js"],
  },

  // how to write the compiled files to disk
  // https://webpack.js.org/concepts/output/
  output: {
    filename: "[name].[fullhash:20].js",
    path: buildPath,
  },

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    contentBase: path.join(__dirname, "public"),
    compress: true,
    port: 3000,
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          argv.mode === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new CleanWebpackPlugin({ dry: argv.mode !== "production" }),
    new MonacoWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new CopyWebpackPlugin({ patterns: [{ from: "./public" }] }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
    }),
  ],

  // https://webpack.js.org/configuration/optimization/
  optimization: {
    minimize: argv.mode === "production",
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
    ],
  },
});
