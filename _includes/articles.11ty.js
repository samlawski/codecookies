const htmlStyles = /*css*/`
body > header > h1 {
  color: white;
  background-color: #78909C;
  font-weight: 800;
  padding: 10px 20px;
  margin: 0;
}

body > main ul {
  padding-left: 20px;
}

body > main > ol {
  list-style: none;
}

body > main > ol a {
  padding: 10px;
  display: block;
  margin-bottom: 10px;
  font-weight: 700;

  text-decoration: none;
  background-color: #BBF3E3;
  color: black;

  transition: all 0.3s ease-in-out;
}

body > main > ol a:hover {
  background-color: #0066A8;
  color: white;
  box-shadow: 6px 6px 0px #4DD0E1;
}
`


exports.render = data => (/*html*/`
<nav>
  <a href="/">Code Cookies</a> &gt; ${data.title}
</nav>

<header>
  <h1>${data.title}</h1>
</header>

<main>
  <header>
    ${data.content}
  </header>

  <ol>
    ${data.collections[data.tags]
      .sort((a, b) => (a.filePathStem > b.filePathStem) ? 1 : -1)
      .map((article, i) => `<li><a href="${article.url}">${i + 1}. ${article.data.title}</a></li>`).join("\n")
    }
  </ol>
</main>
`)

exports.data = {
  layout: 'base.11ty.js',
  eleventyExcludeFromCollections: true,
  htmlStyles,
}