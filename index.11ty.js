const htmlStyles = /*css*/`
/* Main */
body > main > ul {
  list-style: none;
}

body > main a {
  padding: 10px;
  display: block;
  margin-bottom: 10px;

  text-decoration: none;
  background-image: linear-gradient(black, black);
  color: white;
}

body > main a:hover {
  background-color: #0094E8;
  background-image: linear-gradient(to right, #0094E8, #00FFAF);
}

/* Hand Animation */
#jsHand {
  cursor: pointer;
  display: inline-block;
}

.hand--animated {
  animation-name: handAnimation;
  animation-duration: 0.2s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
}
@keyframes handAnimation {
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(15deg);
  }
  50% {
    transform: rotate(0deg);
  }
  75% {
    transform: rotate(-15deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
`


const htmlScripts = /*html*/`
<script>
  // Hand Animation
  document.getElementById('jsHand').addEventListener('click', function(e){
    e.target.classList.add('hand--animated')
    setTimeout(function(){
      e.target.classList.remove('hand--animated')
    }, 250)
  })
</script>
`


/*
  MAIN CONTENT
*/

exports.render = data => (/*html*/`
<header>
  <h1>Welcome to Code Cookies. <span id="jsHand">👋</span></h1>
  <p>I create short and <strong>friendly tutorials</strong> attempting to explain development topics in simple terms and with beginenrs in mind.</p>
  <p>Come in, have a cookie <span id="jsCookie">🍪 </span> , and click on any of the categories below.</p>
</header>

<main>
  <ul role="list">
    <li>
      <a href="/command-line-basics">
        <h2>Command Line Basics</h2>
      </a>
    </li>
    <li>
      <a href="/flask-2-tutorial">
        <h2>Flask 2 Tutorials</h2>
      </a>
    </li>
  </ul>
</main>
`)

/*
  PAGE DATA
*/

exports.data = {
  layout: 'base.11ty.js',
  title: '🍪',
  htmlStyles,
  htmlScripts
}