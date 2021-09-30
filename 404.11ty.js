exports.data = {
  layout: 'base.11ty.js',
  permalink: '404.html'
}
exports.render = data => (`
<main>
  <h1>404</h1>
  <p>Hm. This page does not seem to exist (anymore?).</p>
  <p>Have a cookie <span id="jsCookie">🍪 </span> and check out the <a href="/">home page</a>.</p>
</main>
`)