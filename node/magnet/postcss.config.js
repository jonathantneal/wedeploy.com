// tooling
const path = require('path');
const sass = require('node-sass');

// postcss configuration
module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: [
    // sass compatibility
    postcssSass({
      includePaths: ['node_modules']
    }),

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

// sass
const postcssSass = postcss.plugin('postcss-node-sass', opts => (css, result) => {
  // result options with a forced inline sourcemap
  const resultOpts = Object.assign({}, result.opts, { map: { inline: true } });

  // result-css
  const resultCSS = css.toResult(resultOpts).css;

  // sass options
  const sassOpts = Object.assign({}, opts, { file: resultOpts.from, outFile: resultOpts.from, data: resultCSS, sourceMap: true, sourceMapContents: true });

  // css to sass-object promise
  const sassPromise = new Promise((resolve, reject) => sass.render(sassOpts, (error, result) => error ? reject(error) : resolve(result)));

  // sass-object to postcss-ast promise
  const postcssPromise = sassPromise.then(({ css, map }) => postcss.parse(css.toString(), Object.assign(resultOpts, { map: { prev: map.toString() } })));

  // updated postcss ast promise
  const updatePromise = postcssPromise.then(newcss => result.root.removeAll().append(...newcss.nodes));

  return updatePromise;
});
