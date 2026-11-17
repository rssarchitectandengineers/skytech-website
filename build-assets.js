const esbuild = require('esbuild');
const fs = require('fs');

console.log('Building minified assets with esbuild...');

// 1. Minify CSS
const cssSource = fs.readFileSync('assets/css/style.css', 'utf8');
const minCss = esbuild.transformSync(cssSource, {
  loader: 'css',
  minify: true,
  legalComments: 'none'
});
fs.writeFileSync('assets/css/style.min.css', minCss.code, 'utf8');
console.log(`CSS: ${(cssSource.length / 1024).toFixed(1)} KB -> ${(minCss.code.length / 1024).toFixed(1)} KB (Saved ${((cssSource.length - minCss.code.length) / 1024).toFixed(1)} KB)`);

// 2. Minify JS
const jsSource = fs.readFileSync('assets/js/main.js', 'utf8');
const minJs = esbuild.transformSync(jsSource, {
  loader: 'js',
  minify: true,
  legalComments: 'none'
});
fs.writeFileSync('assets/js/main.min.js', minJs.code, 'utf8');
console.log(`JS: ${(jsSource.length / 1024).toFixed(1)} KB -> ${(minJs.code.length / 1024).toFixed(1)} KB (Saved ${((jsSource.length - minJs.code.length) / 1024).toFixed(1)} KB)`);

console.log('Build complete!');

