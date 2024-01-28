const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "index.js"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "public/index.html"),
            inject: true
        }),
    ],
    devServer: {
        compress: false,
        hot: true,
        port: 5555,
        historyApiFallback: true,
        open: true,
    }
}


// contentBase: path.join(__dirname, "dist"),
//     compress: true,
//     port: 4200,
//     watchContentBase: true,
//     progress: true,
//     hot: true,
//     open: true,
//     historyApiFallback: true,
