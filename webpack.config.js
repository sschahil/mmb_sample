var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/main/js/app.js',
	devtool: 'source-map',
	cache: true,
	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: true
		})
	],
	output: {
		path: __dirname,
		filename: './src/main/resources/static/built/bundle.js'
	},
	module: {
		rules: [
			{
				test: path.join(__dirname, '.'),
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						cacheDirectory: true,
						presets: ['env', 'react']
					}
				}
			}
		]
	}
};