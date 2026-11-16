import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';
import pkg from './package.json';
import OpenBrowserWebpackPlugin from 'open-browser-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
    
const { enableMock, mock, proxy } = pkg.config;
const env = process.env;
const HOST = env.HOST || env.npm_package_config_host;
const PORT = env.POST || env.npm_package_config_port;
const openUrl = 'http://localhost:' + PORT;

export default webpackMerge(baseConfig, {
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [{
            /**
             * eslint代码规范校验
             */
            test: /\.(js|jsx)$/,
            enforce: 'pre',
            include: path.join(__dirname, 'src'),
            exclude: path.join(__dirname, 'src/components/common/indexComponent/IndexComponent'), // 可以不用定义这个字段的属性值，eslint会自动忽略node_modules和bower_
            use: [{
                loader: 'eslint-loader',
                options: {
                    fix: true,
                    configFile: '.eslintrc.json'
                }
            }]
        }]
    },
    plugins: [
        // 出错不终止插件
        new webpack.NoEmitOnErrorsPlugin(),
        // 配置全局变量
        new webpack.DefinePlugin({
            __DEV__: true
        }),
        // 检测包大小
        // new BundleAnalyzerPlugin(),      
        new OpenBrowserWebpackPlugin({url: openUrl})
    ],
    devServer: {
        host: HOST,
        port: PORT,
        inline: true,
        disableHostCheck: true,
        compress: true,             // 开起 gzip 压缩
        historyApiFallback: true,   // browserHistory路由
        contentBase: path.join(__dirname, 'build'),
        proxy: {
            '*': {
                target: enableMock ? mock : proxy,
                changeOrigin: true,
                logLevel: 'debug',
                // 解决broswerHistory问题
                bypass: function (req, res, proxyOptions) {
                    if (req.headers.accept.indexOf('html') !== -1) {
                        return '/index.html';
                    }
                }
            }
        }
    }
});
