const htmlStyles = /*css*/`
body > header > h1 {
  color: white;
  background-color: #0066A8;
  font-weight: 800;
  padding: 10px 20px;
  margin: 0;
}

body > main ol {
  list-style: none;
}

body > main ol a {
  padding: 10px;
  display: block;
  margin-bottom: 10px;
  font-weight: 700;

  text-decoration: none;
  background-color: #BBF3E3;
  color: black;
}

body > main ol a:hover {
  background-color: #0094E8;
  background-image: linear-gradient(to left, #0094E8, #00FFAF);
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
  ${data.content}

  <ol>
    ${data.collections[data.tag]
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