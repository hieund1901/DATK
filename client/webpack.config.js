const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const Dotenv = require("dotenv-webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const BundleAnalyzerPlugin =
	require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const fs = require("fs")
const directoryPath = path.resolve("public")
const handleDir = () => {
	return new Promise((resolve, reject) => {
		fs.readdir(directoryPath, (err, files) => {
			if (err) {
				reject("Unable to scan directory: " + err)
			}
			resolve(files)
		})
	})
}
module.exports = async (env, agrv) => {
	const isDev = agrv.mode === "development";
	const isAnalyze = env && env.analyze
	const dirs = await handleDir()
	// const copyPluginPatterns = dirs
	//     .filter(dir => dir !== "index.html")
	//     .map(dir => {
	//         return {
	//             from: dir,
	//             to: "",
	//             context: path.resolve("public")
	//         }
	//     })
	const basePlugins = [
		new Dotenv({
			path: path.resolve(__dirname, "./.env.development.local"),
			safe: true
		}),
		// new HtmlWebpackPlugin({
		//     template: "public/index.html"
		// }),
		// new CopyPlugin({
		//     patterns: copyPluginPatterns
		// }),
		new MiniCssExtractPlugin({
			filename: isDev ? "css/site.css" : "static/css/site.min.css"
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "public", "index.html"),
			favicon: "./public/favicon.ico",
			filename: "index.html",
			manifest: "./public/manifest.json"
		}),
		new webpack.ProgressPlugin()
	]
	let prodPlugins = [
		new Dotenv({
			path: path.resolve(__dirname, "./.env.production.local"),
			safe: true
		}),
		new MiniCssExtractPlugin({
			filename: isDev ? "css/site.css" : "static/css/site.min.css"
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "public", "index.html"),
			favicon: "./public/favicon.ico",
			filename: "index.html",
			manifest: "./public/manifest.json"
		}),
		new webpack.ProgressPlugin(),
		new CleanWebpackPlugin(),
		new CompressionPlugin({
			test: /\.(css|js|html|svg)$/
		})
	]
	if (isAnalyze) {
		prodPlugins = [...prodPlugins, new BundleAnalyzerPlugin()]
	}
	return {
		entry: [
			"./src/index.tsx"
			// "./src/index.scss"
		],
		output: {
			// path: path.resolve("build"),
			publicPath: "/",
			filename: "index.bundle.js",
			path: path.resolve(__dirname, "dist"),
			// filename: "static/js/main.[contenthash:6].js",
			library: "Simple_Auth_Project"
			// libraryTarget: 'umd',
			// environment: {
			//     arrowFunction: false,
			//     bigIntLiteral: false,
			//     const: false,
			//     destructuring: false,
			//     dynamicImport: false,
			//     forOf: false,
			//     module: false
			// }
		},
		module: {
			rules: [
				{
					test: /\.(ts|tsx|js|jsx)$/,
					use: ["ts-loader"],
					exclude: /node_modules/
				},
				{
					test: /\.(s[ac]ss|css)$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader"
					]
				},
				{
					test: /\.(eot|ttf|woff|woff2)$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: isDev
									? "[path][name].[ext]"
									: "static/fonts/[name].[ext]"
							}
						}
					]
				},
				{
					test: /\.(png|svg|jpg|gif)$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: isDev
									? "[path][name].[ext]"
									: "static/media/[name].[contenthash:6].[ext]"
							}
						}
					]
				},
				{
					test: /\.svg$/,
					use: [
						{
							loader: "svg-url-loader",
							options: {
								limit: 10000
							}
						}
					]
				},
				{
					test: /\.mp3$/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "static/media/[name].[hash:8].[ext]"
							}
						}
					]
				}
			]
		},
		resolve: {
			extensions: [".tsx", ".ts", ".jsx", ".js"],
			alias: {
				"@": path.resolve("src"),
				"@@": path.resolve()
			},
			fallback: { crypto: false }
		},
		devtool: isDev ? "source-map" : false,
		devServer: {
			static: {
				directory: path.join(__dirname, "public/")
			},
			allowedHosts: [
				'.vaipe.io'
			],
			port: 3000,
			compress: true,
			historyApiFallback: true

			// devMiddleware: {
			//     publicPath: "https://localhost:3000/dist/",
			// },
			// hot: "only",
		},
		plugins: isDev ? basePlugins : prodPlugins,
		performance: {
			hints: false
		  }
	}
}
