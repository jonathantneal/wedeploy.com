// tooling
const merge = require('merge-source-map');
const path  = require('path');
const sass  = require('node-sass');

// postcss configuration
module.exports = (ctx) => ({
	map: ctx.options.map,
	plugins: [
		// sass compatibility
		postcssNodeSass(),

		// future compatibility
		require('postcss-selector-matches')(),
		require('postcss-selector-not')(),
		require('postcss-replace-overflow-wrap')(),

		// backward compatibility
		require('postcss-svg')({
			dirs: [ path.join(process.cwd(), 'static/images')  ],
			svgo: true
		}),

		// backward compatibility
		require('autoprefixer')(),

		// compression
		require('postcss-discard-comments')(),
		require('cssnano')({
			preset: ['default', {
				discardComments: true,
				normalizeUrl: false,
				svgo: false
			}]
		}),
		compress()
	]
});

// tooling
const postcss = require('postcss');

// plugin
const compress = postcss.plugin('postcss-discard-tested-duplicate-declarations', (opts) => (root) => {
	const testProp  = opts && 'testProp' in opts ? opts.testProp : (prop) => !/^:*-/.test(prop);
	const testValue = opts && 'testValue' in opts ? opts.testValue : (value) => !/(^var|^\s*-|\s+-\w+-)/.test(value);

	root.walkRules((rule) => {
		var propsMap = {};

		rule.nodes.slice(0).forEach((decl) => {
			if (testProp(decl.prop) && testValue(decl.value)) {
				const prevDecl = propsMap[decl.prop];

				if (prevDecl) {
					if (testValue(prevDecl.value)) {
						if (decl.import || !prevDecl.import) {
							prevDecl.remove();

							propsMap[decl.prop] = decl;
						} else {
							decl.remove();
						}
					}
				} else {
					propsMap[decl.prop] = decl;
				}
			}
		})
	});
});

// transform css with sass
const postcssNodeSass = postcss.plugin('postcss-node-sass', opts => (root, result) => {
	// postcss options
	const postOpts = Object.assign({}, result.opts, requiredPostOpts);

	// postcss results
	const { css: postCSS, map: postMap } = root.toResult(postOpts);

	// sass options
	const sassOpts = Object.assign({}, opts, requiredSassOpts, {
		file: postOpts.from,
		outFile: postOpts.to,
		data: postCSS
	});

	return new Promise(
		// promise sass results
		(resolve, reject) => sass.render(
			sassOpts,
			(error, sassResult) => error ? reject(error) : resolve(sassResult)
		)
	).then(
		// promise sass to postcss ast
		({ css: sassCSS, map: sassMap }) => new Promise(
			resolve => {
				resolve(
					merge(
						postMap.toJSON(),
						JSON.parse(sassMap)
					)
				);
			}
		).catch(
			() => JSON.parse(sassMap)
		).then(
			map => postcss.parse(
				sassCSS.toString(),
				{
					from: postOpts.from,
					map
				}
			)
		)
	).then(
		// promise root as postcss ast
		newroot => {
			result.root = newroot;
		}
	);
});

const requiredPostOpts = {
	map: {
		annotation: false,
		inline: false,
		sourcesContent: true
	}
};

const requiredSassOpts = {
	omitSourceMapUrl: true,
	sourceMap: true,
	sourceMapContents: true
};

