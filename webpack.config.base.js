import path from 'path';
import webpack from 'webpack';
import precss from 'precss';
import autoprefixer from 'autoprefixer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const STATIC_PATH = 'static';
const extractMTUI = new ExtractTextPlugin(`${STATIC_PATH}/css/[contenthash].mtui.css`);
const extractStyle = new ExtractTextPlugin(`${STATIC_PATH}/css/[contenthash].style.css`);

export default {
    entry: {
        main: './src/index.jsx', // 主网站入口
        vendor: ['babel-polyfill', 'react', 'react-dom', 'react-router'],
        d3: ['d3'],
        echarts: ['echarts', 'echarts-liquidfill'],
        main1: ['jquery', 'lodash', 'classnames', 'perfect-scrollbar']
    },
    output: {
        publicPath: '/',
        path: path.join(__dirname, 'build'),
        filename: `${STATIC_PATH}/js/[chunkhash].[name].js`
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.scss'],
        alias: {
            CommonComponents: path.resolve('./src/components/common/index.js'),
            RouterPath: path.resolve('./src/constants/routerPath.js'),
            Utils: path.resolve('./src/utils'),
            Constants: path.resolve('./src/constants'),
            Services: path.resolve('./src/services'),
            Images: path.resolve('./src/images'),
            Libs: path.resolve('./src/libs')
        }
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            include: [
                path.join(__dirname, 'src')
                // path.join(__dirname, 'node_modules/echarts-liquidfill/dist')
            ],
            exclude: path.join(__dirname, 'src/fonts'),
            use: ['babel-loader']
        }, {
            test: /\.css$/,
            include: path.join(__dirname, 'node_modules/antd/lib'),
            use: extractStyle.extract(['css-loader'])
        }, {
            test: /\.(css|scss)$/,
            include: [
                path.join(__dirname, 'src'),
                path.join(__dirname, 'node_modules/mtui'),
                path.join(__dirname, 'node_modules/perfect-scrollbar')
            ],
            use: extractStyle.extract(['css-loader', 'postcss-loader', 'sass-loader'])
        }, {
            /**
             * 处理json
             */
            test: /\.json$/,
            include: [
                path.join(__dirname, 'src')
            ],
            use: [{
                loader: 'json-loader'
            }]
        }, {
            test: /\.(woff|eot|ttf|js|svg)$/,
            include: path.join(__dirname, 'src/fonts'),
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10,
                    name: `${STATIC_PATH}/fonts/[hash].[ext]`
                }
            }]
        }, {
            /**
             * 图片加载器
             */
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            include: path.join(__dirname, 'src/images'),
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10,
                    name: `${STATIC_PATH}/images/[hash].[ext]`
                }
            }]
        }, {
            test: /\.ico$/,
            include: path.join(__dirname, 'src/images'),
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10,
                    name: `${STATIC_PATH}/images/[name].[ext]`
                }
            }]
        }]
    },
    plugins: [
        extractMTUI,
        extractStyle,
        new CleanWebpackPlugin(['build']), // 清除编译目录
        new webpack.optimize.CommonsChunkPlugin({
            name: ['main', 'vendor', 'd3', 'echarts', 'main1'],
            minChunks: 2
        }),
        // 主页面入口index.html
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([{
            from: __dirname + '/src/data',
            to: `${STATIC_PATH}/data/`,
            toType: 'dir'
        }, {
            from: __dirname + '/src/images',
            to: `${STATIC_PATH}/images/`,
            toType: 'dir'
        }]),
        new webpack.ProvidePlugin({
            _: 'lodash',
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true, // 压缩loader读取的文件
            options: {
                postcss: function () {
                    return [precss, autoprefixer];
                }
            }
        }),
        new CaseSensitivePathsPlugin()                      // 文件大小写检测
    ]
};