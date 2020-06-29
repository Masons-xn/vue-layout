const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CompressionPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = ['js', 'css']
const webpack = require('webpack')
module.exports = {
  runtimeCompiler: true,
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: 8081,
    https: false,
    hotOnly: false,
    proxy: {
      "/api": {
        target: "http://localhost:4004",
        changeOrigin: true,
        ws: false
      }
    }
  },
  css: {
    loaderOptions: {
      // 设置 scss 公用变量文件
      sass: {
        prependData: "@import 'src/assets/style/public.scss';"
      }
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true)
    // config.plugins.push()
    // 排除掉要使用cdn的包：
    // config.externals = {
    //   vue: "Vue",
    //   axios: 'axios',
    //   // 这个地方如果和mian.js一起改为elementUI这种小写的，就会报错找不到，原因未知
    //   "element-ui": "ELEMENT"
    // }
  },
  productionSourceMap:false,
  configureWebpack:{  // 覆盖webpack默认配置的都在这里
    plugins: [
      // new BundleAnalyzerPlugin(),
      new webpack.SourceMapDevToolPlugin({
        filename: 'js/[name].js.map',
      }),
      // new MiniCssExtractPlugin({
      //   filename: "css/[name].css",
      //   chunkFilename: "css/[id].css"
      // }),
      // new CompressionPlugin({
      //   filename:'[path].gz.[query]',
      //   algorithm:'gzip',
      //   test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      //   threshold: 10240,
      //   deleteOriginalAssets: true,
      //   minRatio: 0.8
      // })
    ],
  }
}
