const htmlStyles = /*css*/`
body > header > h1 {
  color: white;
  background-color: #78909C;
  font-weight: 800;
  padding: 10px;
  margin: 0;
}

body > main > header ul {
  padding-left: 20px;
}

body > main > h2 {
  padding-top: 20px;
}

body > main h3 {
  padding: 15px 0;
  font-size: 1rem;
}

body > main > ol {
  list-style: none;
}

body > main > ol a {
  padding: 10px;
  display: block;
  font-weight: 700;
  text-decoration: none;

  transition: all 0.3s ease-in-out;
}

body > main > ol a small {
  font-weight: 300;
  color: #78909C;

  transition: all 0.3s ease-in-out;
}

body > main > ol a:hover {
  background-color: #0066A8;
  color: white;
  box-shadow: 6px 6px 0px #4DD0E1;
}
body > main > ol a:hover small {
  color: white;
}
`

const renderLabel = (article) => {
  if(!article.data.groupIndex) return ''
  const sectionIndex = article.data.sectionIndex
  return `<h3><small>${article.data.sections[sectionIndex].groups[article.data.groupIndex]}:</small></h3> `
}


let prevArticleGroupIndex = -1
const renderArticles = (articles) => articles.map((article, i) => {
  let isArticleGroupIndexDifferent = prevArticleGroupIndex != article.data.groupIndex
  prevArticleGroupIndex = article.data.groupIndex

  return (/*html*/`
    ${isArticleGroupIndexDifferent ? renderLabel(article) : ''}
    <li><a href="${article.url}">${i + 1}. ${article.data.title}</a></li>
  `)
}).join('\n')


const renderSections = data => data.sections.map((section, sectionIndex) => {
  const articlesOfThisSectionSortedByFileName = data.collections[data.tags]
    .filter(article => article.data.sectionIndex === sectionIndex)
    .sort((a, b) => (a.filePathStem > b.filePathStem) ? 1 : -1)

  return (/*html*/`
    <h2>${section.title}</h2>
    <ol>
      ${renderArticles(articlesOfThisSectionSortedByFileName)}
    </ol>
  `)
}).join('')


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

  ${renderSections(data)}

  <ol>
  </ol>
</main>
`)

exports.data = {
  layout: 'base.11ty.js',
  eleventyExcludeFromCollections: true,
  htmlStyles,
}