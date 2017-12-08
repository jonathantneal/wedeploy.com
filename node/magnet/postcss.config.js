// tooling
const path = require('path');
const postcss = require('postcss');
const postcssSass = require('@csstools/postcss-sass');

// postcss configuration
module.exports = (ctx) => ({
  map: ctx.options.map,
  plugins: [
    // sass compatibility
    postcssSass({
      includePaths: [ 'node_modules' ]
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
