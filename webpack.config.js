const ExtractText = require('extract-text-webpack-plugin');
//process.env.IP = '192.168.0.16'; 
//comment or replace this line for deploy


const extractTextMain = new ExtractText({
	filename: 'style.css',
	allChunks: true
});
const extractTextVendors = new ExtractText({
	filename: './styles/vendors.css',
	allChunks: true
});
const { join } = require('path');
const dist = join(__dirname, 'dist'); //.tmp
const plugins = require('./plugins.js');
const exclude = /node_modules/;

module.exports = env => {
	const isProd = env && env.production;
	return {
		entry: {
			main: './src/scripts/index.js',
			/*fa: './src/css/font-awesome/fontawesome.scss',*/
			vendors: ['jquery']
		},
		output: {
			path: dist,
			filename: 'scripts/[name].js',
			publicPath: ''
		},
		module: {
			rules: [
			/*{
				test: /font-awesome\.config\.js/,
				use: [
				{ loader: 'style-loader' },
				{ loader: 'font-awesome-loader' }
				]
			},*/
			{
				test: /\.js$/,
				exclude: exclude,
				use: 'babel-loader'
			},
			{
				test: /\.(sass|scss|css)$/,
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
				test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'fonts/'
					}
				}]
			},
			{
				test: /\.(gif|png|jpg|jpeg)$/,
				use: isProd
				? 'file-loader?context=src/static/&name=[path][name].[ext]&outputPath=dist/'
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
			contentBase: 'src/static/',
			port: process.env.PORT || 8080,
			historyApiFallback: true,
			compress: isProd,
			inline: !isProd,
			hot: true,
			open: true,
			disableHostCheck: true,
			host: process.env.host || '0.0.0.0',
			/*host: process.env.IP || '192.168.0.16',*/
			/*hot: !isProd,*/
			stats: {
				// Hide all chunks logs
				chunks: false
			}
		}
	};
};
