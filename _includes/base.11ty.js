exports.data = {}

exports.render = data => (/*html*/`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Code Cookies ${data.title ? `| ${data.title}` : ''}</title>
  <meta name="description" content="Short and friendly tutorials attempting to explain development topics in simple terms and with beginenrs in mind.">

  <link rel="apple-touch-icon-precomposed" sizes="57x57" href="/assets/favicons/apple-touch-icon-57x57.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/assets/favicons/apple-touch-icon-114x114.png" />
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/assets/favicons/apple-touch-icon-72x72.png" />
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/assets/favicons/apple-touch-icon-144x144.png" />
  <link rel="apple-touch-icon-precomposed" sizes="60x60" href="/assets/favicons/apple-touch-icon-60x60.png" />
  <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/assets/favicons/apple-touch-icon-120x120.png" />
  <link rel="apple-touch-icon-precomposed" sizes="76x76" href="/assets/favicons/apple-touch-icon-76x76.png" />
  <link rel="apple-touch-icon-precomposed" sizes="152x152" href="/assets/favicons/apple-touch-icon-152x152.png" />
  <link rel="icon" type="image/png" href="/assets/favicons/favicon-196x196.png" sizes="196x196" />
  <link rel="icon" type="image/png" href="/assets/favicons/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/png" href="/assets/favicons/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="/assets/favicons/favicon-16x16.png" sizes="16x16" />
  <link rel="icon" type="image/png" href="/assets/favicons/favicon-128.png" sizes="128x128" />
  <meta name="application-name" content="Code Cookies"/>
  <meta name="msapplication-TileColor" content="#FFFFFF" />
  <meta name="msapplication-TileImage" content="/assets/favicons/mstile-144x144.png" />
  <meta name="msapplication-square70x70logo" content="/assets/favicons/mstile-70x70.png" />
  <meta name="msapplication-square150x150logo" content="/assets/favicons/mstile-150x150.png" />
  <meta name="msapplication-wide310x150logo" content="/assets/favicons/mstile-310x150.png" />
  <meta name="msapplication-square310x310logo" content="/assets/favicons/mstile-310x310.png" />

  <style>
    /* Reseter.css */
    *,::after,::before{box-sizing:inherit;padding:0;margin:0}html{line-height:1.15;box-sizing:border-box;font-family:sans-serif}main{display:block}h1{font-size:2em;margin:.67em 0}a{background-color:transparent}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}button,input,optgroup,select,textarea{line-height:inherit;border:1px solid currentColor}button{overflow:visible;text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;padding:1px 6px}input{overflow:visible}input,textarea{padding:1px}fieldset{border:1px solid currentColor;margin:0 2px}legend{color:inherit;display:table;max-width:100%;white-space:normal}progress{display:inline-block;vertical-align:baseline}select{text-transform:none}textarea{overflow:auto;vertical-align:top}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}[type=color]{background:inherit}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-input-placeholder{color:inherit;opacity:.5}::-webkit-file-upload-button,::-webkit-search-decoration{-webkit-appearance:button;font:inherit}::-moz-focus-inner{border:0}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}hr{box-sizing:content-box;height:0;color:inherit;overflow:visible}dl,ol,ul{margin:1em 0}dl dl,dl ol,dl ul,ol dl,ol ol,ol ul,ul dl,ul ol,ul ul{margin:0}b,strong{font-weight:bolder}audio,video{display:inline-block}audio:not([controls]){display:none;height:0}img{border:0}svg:not(:root){overflow:hidden}table{text-indent:0;border-color:inherit}details{display:block}dialog{background-color:inherit;border:solid;color:inherit;display:block;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;left:0;margin:auto;padding:1em;position:absolute;right:0;width:-webkit-fit-content;width:-moz-fit-content;width:fit-content}dialog:not([open]){display:none}summary{display:list-item}canvas{display:inline-block}template{display:none}[hidden]{display:none}

    /* Global */
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
    p {
      line-height: 1.5;
      margin-bottom: 5px;
    }
    li {
      line-height: 1.5;
    }
    a {
      color: #0066A8;
    }
    code {
      background-color: #f5f5f5;
      color: #333;
      padding: 3px 5px;
      border-radius: 3px;
      font-size: .9em;
      font-weight: bold;
    }
    pre {
      background-color: #f5f5f5;
      color: #333;
      padding: 3px 5px;
      border-radius: 3px;
      font-size: .9em;
      font-weight: bold;
      overflow-x: auto;
      margin-top: 10px;
      margin-bottom: 10px;

      border: 1px solid #ccc;
      box-shadow: inset 0 0 3px #ccc;
      
    }
    pre code {
      padding: 0;
      background-color: transparent;
    }

    /* Layout */
    body > header,
    body > main,
    body > nav,
    body > footer {
      margin: auto;
      width: 100%;
      max-width: 640px;

      padding: 10px;
    }

    /* Nav */
    body > nav {
      font-size: .8rem;
      line-height: 1.5;
      color: rgba(0, 0, 0, .7);
      
    }

    /* Header */
    body > header > h1 {
      font-weight: 900;
    }

    /* Footer */
    body > footer {
      font-size: .8rem;
      line-height: 1.5;
      color: rgba(0, 0, 0, .7);
      margin: 20px auto;
      text-align: center;
    }

    /* Reusable */
    .button {
      border: 2px solid black;
      padding: 5px 10px;
      border-radius: 3px;
      transition: all .2s ease-in-out;
      cursor: pointer;
      text-decoration: none;
      color: black;
      font-weight: bold;
      display: inline-block;
    }
    .button:hover {
      background-color: #0066A8;
      color: white;
      border-color: #0066A8;
    }

    /* Cookie Animation */
    #jsCookie {
      cursor: pointer;
      display: inline-block;
    }
    .cookie--animated {
      animation-name: cookieAnimation;
      animation-duration: 1.5s;
      animation-iteration-count: 1;
      animation-fill-mode: forwards;
      animation-timing-function: ease-in-out;
    }
    @keyframes cookieAnimation {
      0% {
        transform: scale(1) translateY(0px);
        opacity: 1;
      }
      50% {
        transform: scale(5) translateY(0px);
        opacity: 1;
      }
      100% {
        transform: scale(5) translateY(-300px);
        opacity: 0;
      }
    }

    ${data.htmlStyles || ''}
  </style>
</head>
<body>
  ${data.content || ''}

  <script>
    // Cookie Animation
    document.getElementById('jsCookie') && document.getElementById('jsCookie').addEventListener('click', function(e){
      console.info('🍪 Cookie was added. Enjoy!')
      document.cookie += '🍪'
      e.target.classList.add('cookie--animated')
    })
  </script>
  ${data.htmlScripts || ''}
</body>
</html>
`)

/*
Colors: 

Dark blue: 0066A8
Medium blue (fade): 0094E8
light blue: 4DD0E1
neon green (fade): 00FFAF
light green: BBF3E3
gray green: 78909C

*/