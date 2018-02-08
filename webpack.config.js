const ExtractText = require('extract-text-webpack-plugin');

const extractTextMain = new ExtractText({
	filename: './scss/style.scss',
	allChunks: true
});
const extractTextVendors = new ExtractText({
	filename: './styles/vendors.css',
	allChunks: true
});
const { join } = require('path');
const dist = join(__dirname, '/'); //.tmp
const plugins = require('./config/plugins');
const exclude = /node_modules/;

module.exports = env => {
	const isProd = env && env.production;
	return {
		entry: {
			main: './src/scripts/index.js',
			vendors: ['jquery']
		},
		output: {
			path: dist,
			filename: 'scripts/[name].js',
			publicPath: '/'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: exclude,
					use: 'babel-loader'
				},
				{
					test: /\.(sass|scss)$/,
					exclude: exclude,
					loader: isProd ?  extractTextMain.extract({
						fallback: 'style-loader',
						use: 'css-loader!postcss-loader!sass-loader'
					}) : 'style-loader!css-loader!postcss-loader!sass-loader'
				},
				{
			        test: /\.svg$/,
			        loader: 'svg-inline-loader'
			    },
				{
					test: /\.(ttf|woff|otf|png|svg|jpg)$/,
					use: isProd
					? 'file-loader?context=src/static/&name=[path][name].[ext]&outputPath=../../tmp/'
					: 'file-loader'
				},
				
				{
					test: /\.html$/,
  					loader: "raw-loader"
				}
			]
		},
		plugins:  plugins(isProd, {
			extractTextPlugin: {
				main: extractTextMain,
				vendors: extractTextVendors
			}
		}),
		devtool: isProd ? 'eval' : 'source-map',
		devServer: {
			contentBase: dist,
			port: process.env.PORT || 8080,
			historyApiFallback: true,
			compress: isProd,
			inline: !isProd,
			hot: true,
   			open: true,
   			disableHostCheck: true,
			/*host: process.env.IP || '0.0.0.0',*/
			host: process.env.IP || '192.168.0.16',
			/*hot: !isProd,*/
			stats: {
				// Hide all chunks logs
				chunks: false
			}
		}
	};
};
