const htmlStyles = /*css*/`

#video {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 0;
  height: 0;
  overflow: hidden;
  
  margin-bottom: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0066A8;
}
#video p {
  display: block;
  margin-top: 56.25%;
  text-align: center;
  color: white;
  padding: 10px; 
}
#video a {
  color: #BBF3E3;
}
#video button {
  display: block;
  margin: auto;

  cursor: pointer;
  padding: 20px 50px;
  font-size: 3rem;
  border: 0;
  background-color: rgba(255, 255, 255, 0.5);
}
#video iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

header h1 {
  margin: 4px 0;
}

article h1 a,
article h2 a,
article h3 a,
article h4 a,
article h5 a {
  text-decoration: none;
  opacity: .3;
  transition: opacity .2s ease-in-out;
}
article h1 a:hover,
article h2 a:hover,
article h3 a:hover,
article h4 a:hover,
article h5 a:hover {
  opacity: 1;
}

article ul,
article ol {
  padding-left: 20px;
}
article h2 {
  margin: 30px 0 10px 0;
}
article h3 {
  margin: 20px 0 10px 0;
}
article img {
  max-width: 100%;
  margin: auto;
  display: block;
}

/* Heading */
body > header > a {
  color: #adadad;
  font-size: .7rem;
}
`

const htmlScripts = /*html*/`
<script>
  function showVideo(videoId){
    document.getElementById('video').innerHTML = '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  }
</script>
`

const videoEmbed = videoId => (/*html*/`
<div id="video">
  <p>
    <button onClick="showVideo('${videoId}')" name="Play" title="Play YouTube Video">&#9658;</button>
    <small>Clicking the <i>Play</i> button above will load a video from YouTube. For playing YouTube videos, <a rel="noreferrer" href="https://policies.google.com/privacy" target="_blank">Google's privacy policy</a> applies.</small>
  </p>
</div>
`)

const breadcrumbs = data => (/*html*/`
<nav>
  <a href="/">Code Cookies</a> &gt; <a href="/${data.tags}">${data.name}</a> &gt; ${data.title}
</nav>
`)


const nextPageLink = data => {
  const sortedPages = data.collections[data.tags]
    .filter(article => !article.data.unlisted)
    .sort((a, b) => (a.filePathStem > b.filePathStem) ? 1 : -1)
  const nextPage = sortedPages.find(page => page.filePathStem > data.page.filePathStem)

  if(!nextPage) return ''

  return (/*html*/`
    <a class="button" href="${nextPage.url}">
      Next: ${nextPage.data.title}
    </a>
  `)
}


exports.render = data => (/*html*/`
${breadcrumbs(data)}

<header>
  <h1>${data.title}</h1>
  <a href="https://github.com/samlawski/codecookies/commits/main/${data.page.filePathStem}.md" target="_blank">
    Last content update ${data.lastUpdate || ''}
  </a>
</header>

<main>
  ${data.videoId ? videoEmbed(data.videoId) : ''}

  <article>
    ${data.content}
  </article>
</main>

<footer>
  ${nextPageLink(data)}
</footer>

${breadcrumbs(data)}
`)


exports.data = {
  layout: 'base.11ty.js',
  htmlStyles,
  htmlScripts,
}