const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

const config = {
    name: 'react-base-ts-webpack',
    entry: './src/index.tsx',
    mode: 'development', // or 'production'
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // Clean the output directory before emit.
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif|avif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    optimization: {
        usedExports: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                    reuseExistingChunk: true
                }
            }
        }
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devServer = {
            static: {
                directory: path.join(__dirname, 'build'),
            },
            compress: true,
            port: 3001
        };
        config.devtool = 'source-map';
        config.plugins.push(new BundleAnalyzerPlugin({ analyzerPort: 8889 }));
    }
    return config;
};
