exports.data = {
  layout: 'base.11ty.js',
  permalink: '404.html'
}
exports.render = data => (`
<main>
  <h1>404</h1>
  <p>Hm. This page does not seem to exist (anymore?). But no need to worry. Just have a cookie <span id="jsCookie">🍪 </span>.</p>
  <p></p>
  <p>Find <a href="/flask-tutorial/v1">the Flask tutorial here</a>.</p>
  <p>Or check out <a href="/express-tutorial/v1">the Express tutorial here</a>.</p>
  <p>Or go back to the <a href="/">home page</a>.</p>
</main>
`)