const path = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
	mode: "development",
	entry: "./src/app.ts",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "build"),
		library: {
			type: "module",
		},
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-typescript"],
					},
				},
			},
		],
	},
	resolve: {
		plugins: [new TsconfigPathsPlugin()],
		extensions: [".tsx", ".ts", ".js"],
		alias: {
			"@config": path.resolve(__dirname, "src/config/index"),
			"@config/*": path.resolve(__dirname, "src/config/*"),
			"@context": path.resolve(__dirname, "src/context/index"),
			"@commands": path.resolve(__dirname, "src/commands/index"),
			"@constants": path.resolve(__dirname, "src/constants/index"),
			"@constants/*": path.resolve(__dirname, "src/constants/*"),
			"@helpers": path.resolve(__dirname, "src/helpers/index"),
			"@helpers/*": path.resolve(__dirname, "src/helpers/*"),
			"@services": path.resolve(__dirname, "src/services/index"),
			"@services/*": path.resolve(__dirname, "src/services/*"),
			"@scenes": path.resolve(__dirname, "src/scenes/index"),
			"@buttons": path.resolve(__dirname, "src/buttons/index"),
		},
		fallback: {
			fs: false,
		},
	},
	experiments: {
		outputModule: true,
	},
	externals: [nodeExternals()],
};
