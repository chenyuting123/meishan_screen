import path from 'path';
import webpack from 'webpack';
import webpackMerge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default webpackMerge(baseConfig, {
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
                    configFile: '.eslintrc.prod.json'
                }
            }]
        }]
    },
    plugins: [
        new webpack.DefinePlugin({               // 配置全局变量
            'process.env.NODE_ENV': JSON.stringify('production'),
            __DEV__: false
        }),
        new webpack.optimize.UglifyJsPlugin({    // 压缩混淆js文件
            sourceMap: false,
            output: {
                comments: false  // remove all comments
            },
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: false,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true
            },
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: true
        })
    ]
});
