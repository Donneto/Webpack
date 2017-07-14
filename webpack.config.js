const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const uglifyPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const argv = require('yargs').argv

const views = glob.sync('./src/js/views/**/*.js');

const config = {
	devtool: 'source-map',
	watch: true,
	entry : {
		vendor: './src/js/vendor.js'
	},
	output: {
		filename: '[name]',
    	path: path.resolve(`${__dirname}/build`, 'js'),
    	publicPath:  path.resolve(`${__dirname}/build`, 'js')
	},
	resolveLoader: {
		modules: ["node_modules"]
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['es2015','react','stage-3'],
							comments: false
						}
					}
				]
			},
			{
				enforce: "pre",
				test: /\.js|jsx$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'eslint-loader'
			},
			{
				test: /\.(sass|scss)$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract(['css-loader?minimize=true', 'sass-loader'])
			}
		]
	},
	plugins: [
		// new webpack.DefinePlugin({
  //     		'process.env': {
		// 		'NODE_ENV': JSON.stringify('production')
		// 	}
		// }),
		new webpack.ProvidePlugin({
      		React: 'react',
      		ReactDom: 'react-dom',
      		moment: 'moment'
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new ExtractTextPlugin({
			filename: '../css/master.css',
			allChunks: false,
    	}),
    	new webpack.optimize.CommonsChunkPlugin({
    		name: 'vendor',
    		filename: 'vendor.js'
    	})
	]
};

if (views.length) {
	for (var i = 0; i < views.length; i++) {
		config.entry[views[i].replace('./src/js/','./')] = views[i];
	}
}


module.exports = config;