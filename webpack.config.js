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
		alias: {
			"@interfaces": path.resolve(__dirname, "src/context"),
			"@commands": path.resolve(__dirname, "src/commands"),
			"@api": path.resolve(__dirname, "src/api"),
			"@constants": path.resolve(__dirname, "src/constants"),
			"@constants/*": path.resolve(__dirname, "src/constants/*"),
			"@helpers": path.resolve(__dirname, "src/helpers"),
			"@helpers/*": path.resolve(__dirname, "src/helpers/*"),
			"@services": path.resolve(__dirname, "src/services"),
			"@services/*": path.resolve(__dirname, "src/services/*"),
			"@scenes": path.resolve(__dirname, "src/scenes"),
			"@buttons": path.resolve(__dirname, "src/buttons"),
		},
		extensions: [".ts", ".js"],
		fallback: {
			fs: false,
		},
	},
	experiments: {
		outputModule: true,
	},
	externals: [nodeExternals()],
};
