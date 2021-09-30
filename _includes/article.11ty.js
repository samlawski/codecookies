const htmlStyles = /*css*/`
#video {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 0;
  height: 0;
  overflow: hidden;

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

article {
  margin-top: 20px;
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
`

const htmlScripts = /*html*/`
<script>
  function showVideo(videoId){
    document.getElementById('video').innerHTML = '<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
  }
</script>
`


exports.render = data => (/*html*/`
<nav>
  <a href="/">Code Cookies</a> &gt; <a href="/${data.page.url.split('/')[1]}">${data.name}</a> &gt; ${data.title}
</nav>

<header>
  <h1>${data.title}</h1>
</header>

<main>
  <div id="video">
    <p>
      <button onClick="showVideo('${data.videoId}')" name="Play" title="Play YouTube Video">&#9658;</button>
      <small>⚠️ Clicking the <i>Play</i> button above will load a video from YouTube. For playing YouTube videos, <a rel="noreferrer" href="https://policies.google.com/privacy" target="_blank">Google's privacy policy</a> applies.</small>
    </p>
  </div>
  

  <article>
    ${data.content}
  </article>
</main>
`)


exports.data = {
  layout: 'base.11ty.js',
  htmlStyles,
  htmlScripts,
}