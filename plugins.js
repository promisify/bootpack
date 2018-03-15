const { join } = require('path')
const dist = join(__dirname, 'dist/')
const src = join(__dirname, 'src/')
const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const DashboardPlugin = require('webpack-dashboard/plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin');
//const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const renameOutputPlugin = require('rename-output-webpack-plugin');

let pathsToClean = [
'dist',
'build'
];

let cleanOptions = {
	root:     'C:/go/bootpack/',
	exclude:  ['shared.js'],
	verbose:  true,
	dry:      false
}


module.exports = (isProd, options = {}) => {
	let plugins = [
		// Currently not working with WP2
		// new BundleAnalyzerPlugin({
		// 	analyzerMode: 'server'
		// }),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': isProd ? JSON.stringify('production') : JSON.stringify('development')
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				babel: {
					presets: [
					['es2015', { modules: false }]
					]
				},
				postcss: [
				require('autoprefixer')({
					browsers: isProd ? ['last 5 version', 'ie 9'] : ['last 1 version']
				})
				]
			}
		}),
		new HtmlPlugin({
			title: 'Bootpack',

			template: join(src,'index.html')
		}),
		/*new ManifestPlugin({
			fileName: 'asset_manifest.json',
			basePath: 'src/',
			seed: {
				name: 'My Manifest'
			}
		}),*/
		new WebpackPwaManifest({
		    name: 'Bootpack',
		    short_name: 'Bootpack',
		    filename: "manifest.json",
		    description: 'Boilerplate for landing page',
		    background_color: '#eeeeee',
		    inject: true,
  fingerprints: true,
		    icons: [
		      {
		        src: join(__dirname, 'src/static/favicon.png'),
		        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
		      }
		    ]
		  }),
		
		new HtmlWebpackInlineSVGPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendors',
			minChunks: function (module) {
         // this assumes your vendor imports exist in the node_modules directory
         return module.context && module.context.indexOf('node_modules') !== -1;
     }
 })
		];
		if (isProd) {
			plugins.push(
				new CleanPlugin(pathsToClean, cleanOptions),
				new CopyPlugin([{ context: 'src/static', from: '**/*.*', to: dist }]),
				/*new renameOutputPlugin({
		            'style.scss': 'style.css',
		            
		        }),*/
				new webpack.LoaderOptionsPlugin({ minimize: true, debug: true }),
				new webpack.optimize.UglifyJsPlugin({
					output: {
						comments: 0
					},
					compress: {
						unused: 1,
						warnings: 0,
						comparisons: 1,
						conditionals: 1,
					negate_iife: 0, // <- for `LazyParseWebpackPlugin()`
					dead_code: 1,
					if_return: 1,
					join_vars: 1,
					evaluate: 1
				}
			}),
				options.extractTextPlugin.main,
				options.extractTextPlugin.vendors
				);
		}else{
		// dev only
		plugins.push(
			new webpack.HotModuleReplacementPlugin(),
			new DashboardPlugin()
			)
	}
	return plugins;
}
