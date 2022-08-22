---
title: Serving Static Files
slug: serving-static-files
lastUpdate: August 22nd, 2022
sectionIndex: 0
groupIndex: 1
---

Sometimes you need your website to render static files such as images or offer file downloads. Almost all websites make use of external CSS files to style the page's layout and JavaScript files to make the pages more dynamic. And sometimes, the web pages themselves are simply **static HTML** files.

In all these situations and more, you need a way for your web server to respond with **static files**. 

## Static vs Dynamic content

The way you have built routes so far was using **dynamic** backend code. It's called "**dynamic**" because between the client sending a **request** and receiving a **response**, you run some dynamic backend code. Even if it's just the function `response.render()`, the request first gets handled by some dynamic JavaScript code before a **response** is generated and sent back to the client. 

But sometimes, we don't need to run any code before returning a response. Maybe a user wants to download a file or simply display an image within the web browser. In those cases, all we want to do is send a file back to the user without running any business logic beforehand. The same can even be true for HTML files. Maybe we have an entirely static website that does not need to render any data from a database. In those cases, we could technically also just return a plain HTML file without running any backend code. 

![illustrating dynamic vs. static requests](/assets/content/express-tutorial/v1/1-2-4-serving-static-files/static-dynamic.png)

Returning static files can be extremely performant. That's because you don't run any JavaScript code before the file is returned. The request comes in, and immediately the response is sent out containing the file. 

Express comes with a built-in feature for **serving static assets** (a smart way of saying "sending files back to the client as a response".) Express uses its own [middleware](/express-tutorial/v1/middlewares/) for that. 

## Using the static files middleware

Express' middleware function to serve static assets can be called with `express.static()`. The first parameter of that function is a string with the folder name. Express will then automatically make all files that you keep within that folder publicly available. 

Let's try it out. In your **app.js** file, somewhere below the `const app = express()` but above the routes, add the following line: 

```js
app.use(express.static('public'))
```

With `app.use()` you tell Express that you want to use a middleware. The parameter of that function is the middleware function. In this case, the middleware function is `express.static()`. The parameter for that function is the string `'public'`. That's a name that we picked. You could have used any name like "files," "static," or "banana." It doesn't matter. "public" is a common folder name for static files, and it makes it completely clear to other developers that any files in that folder are public to the internet. 

So all we're missing now is the actual folder. So, add the folder now, and in it, add some files. It can be an image, text, or audio file. It can even be an HTML file. 

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop</div>
  </header>
  <main>
    <ul>
      <li>📁 middlewares</li>
      <li>📁 node_modules</li>
      <li>
        📁 public
        <ul>
          <li>📄 cat.png</li>
          <li>📄 landing.html</li>
        </ul>
      </li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

You can, for example, put in there an image of [a cat](/assets/content/express-tutorial/v1/1-2-4-serving-static-files/cat.png) and a basic HTML file and call it **landing.html**: 

```html
<html>
  <head>
    <title>Landing Page</title>
  </head>
  <body>
    <h1>Welcome!</h1>
    <p>This is a static page 🤷‍♀️</p>
  </body>
</html>
```

After adding those files and the middleware to your code, you can now access the files by adding their names to the root path of your website. 

For example: 
* [localhost:3000/cat.png](http://localhost:3000/cat.png)
* [localhost:3000/landing.html](http://localhost:3000/landing.html)

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cat.png" target="blank">
        localhost:3000/cat.png
      </a>
    </div>
  </header>
  <main>
    <img src="/assets/content/express-tutorial/v1/1-2-4-serving-static-files/cat.png" />
  </main>
</div>

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/landing.html" target="blank">
        localhost:3000/landing.html
      </a>
    </div>
  </header>
  <main>
    <h1>Welcome!</h1>
    <p>This is a static page 🤷‍♀️</p>
  </main>
</div>

>**How does this HTML page relate to my routes?**
>You may have already created a few routes using `app.get()` in the **app.js** file of your project. Those routes co-exist with the static files but are **entirely separate** from them. 
>To avoid problems, you should avoid naming paths to static files the same way as paths to existing routes in your Express application.
>When it comes to serving HTML file to the user, there are multiple ways. One way is to use static files as described above. In a [later part of this tutorial](/express-tutorial/v1/html-response-and-templating/) you're going to learn about another way to render HTML to the client. In that other way, you **will** use the Express routes.
>There are always many ways to solve a problem. Express gives you a lot of freedom. Using static HTML pages like above might be the way to go. In many cases, however, you'll probably use a feature called **templating**. You'll learn about it [later]
(/express-tutorial/v1/html-response-and-templating/).

## Adding a virtual path

Having all your public assets just available at the root path of your website is usually not a good idea. It can easily lead to naming conflicts and just generally be a little confusing. 

A better idea would be to have your static assets (such as images) under their own general path. So instead of using `localhost:3000/cat.png`, it would be better to have, e.g., a path like this: 

`localhost:3000/assets/cat.png`

In order to put all your public assets under a particular sub-path in the routing, you can use a so-called **virtual path**. You define it when setting the **middleware** with `app.use` like this: 

```js
app.use('/assets', express.static('public'))
```

You can see we changed the `app.use()` function and added a parameter **before** the middleware function. The first parameter specifies the path we want to use for the given middleware. So here we say, whenever the path of the URL starts with `/assets`, use the static files middleware. 

By changing your middleware, as shown above, the previous URLs to **cat.png** and **landing.html** will not work anymore. Now, they changed to: 

* [localhost:3000/assets/cat.png](http://localhost:3000/assets/cat.png)
* [localhost:3000/assets/landing.html](http://localhost:3000/assets/landing.html)

>💡 You can also use various folders and use the line `app.use()` multiple times if you want to define different paths. 
>For example, maybe you want to use a different path for your images than for static HTML pages. How you use this feature is completely up to you.

## Recap

You are now able to use Express' middleware to **serve static files** from a server. Those files can be **CSS** or **JavaScript** files. They can be videos or images displayed on a website. Or they may be files downloadable by users. Finally, however, they can also be static HTML files in case you build a static website that doesn't require any data dynamically loaded on the backend - or the page is a **Single-Page-Application** (SPA) getting its data dynamically with JavaScript. 

## 🛠 How to practice

One core use case of serving static files is to include CSS files in your project. 

As part of this lesson, you added a static HTML file called **landing.html** to your project. Eventually, you'll probably have many pages. But for now, let's practice adding some styles to the page.

* To add CSS files, create a new folder in the **public** folder and call it **css**. 
* In there, you can add CSS files and write some layout styles for the landing page.
* You can [include the CSS](https://www.w3schools.com/css/css_howto.asp) file using the `<link>` tag in your HTML and the path to your static folders followed by `/css/` and the file name of your CSS file. 

>**Server-side vs Client-side JavaScript (intermediate)**
>Many websites these days rely heavily on JavaScript code on the **client-side**. For beginners this part can be tricky but **but very important** to differentiate.
>The JavaScript you've written so far is all executed on the server and stays on the server. The client (e.g. a web browser) **never gets to see that code**! That's because we use Node.js to run the JavaScript code on the server. 
>Originally, however, JavaScript was invented and built to be run on the **client-side**, in the web browser. In order to run JavaScript on the client-side, you need to first **send it to the client**. You can do that by adding `<script>` tags in the HTML or EJS files. 
>Another way send JavaScript to the client is to include it very similarly to how you included the CSS. Create a JavaScript file in the **public** folder (for example, inside its own **/js** folder). Then, you can [reference it](https://www.w3schools.com/js/js_whereto.asp) in the HTML template using `<script>` tags. 
>
>As an advanced task, try adding some dynamic JavaScript to the landing page. To keep it simple, you can just add a `console.log()` and see if you get it to show up in the developer tools of the web browser. 

