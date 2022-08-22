---
title: HTML Response & Templating Basics
slug: html-response-and-templating
lastUpdate: August 22nd, 2022
sectionIndex: 0
groupIndex: 2
---

One of the most common use cases for any web backend is to serve websites (like the one you're on right now). Websites are a collection of pages written in HTML. Even the most advanced JavaScript frontend applications get rendered into HTML. 

There are, however, two major approaches to rendering HTML in web apps: 

1. Server-side rendering
2. Client-side rendering

In modern web applications, the line between the two is not so clear anymore, as many apps will use a combination of the two. But before getting into advanced concepts of merging the two, it's good to understand them separately. Also, most websites on the internet today still fully rely on either one or the other. 

In this lesson, we're going to look at **server-rendering** HTML. 

## What is "Server-Side Rendering"?

The term _"rendering"_ is a little misleading in this situation because it's the web browser that will ultimately _render_ all HTML. So don't get those two confused. 

Most web pages display some sort of content or data that is stored separately. For example, a blog page might have a database with all the articles stored in it. Usually, the articles in the database will not include all the HTML and CSS that make up the layout of the web page. But instead, the database only contains the article content. So at some point, the content and the HTML have to be combined. 

Or let's consider the example of our cookie shop. Here is an example of what a page showcasing an individual cookie might look like in HTML: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookie</title>
</head>
<body>
  <header>
    <h1>Cookieshop</h1>

    <nav>
      <a href="/">Home</a>&nbsp;|&nbsp;
      <a href="/about">About</a>&nbsp;|&nbsp;
      <a href="/cookies">Shop</a>&nbsp;|&nbsp;
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main>
    <h2>Chocolate Chip</h2>
    <p>A tasty, sugary cookie filled with chocolate chips.</p>
    <p>Price: $3.50</p>
  </main>

  <footer>
    Made with 🍪 by Codecookies
  </footer>
</body>
</html>
```

If we have a shop with many types of cookies, we will have many pages looking the exact same as the HTML above. The only thing different will be the `<h2>` content, the price, and the description text. All those elements contain the kind of data that usually would be stored in a database. 

So how do I bring data from my database into my HTML? And how do I avoid duplicating the same HTML used on each cookie page? 

The solution is **templating**. Templating languages allow you to use programming logic and variables with your HTML to **dynamically generate static HTML**. That's important to remember: In the end, you always end up with static HTML like the one above. But in many cases, you write code to **generate** that HTML. When people talk about "server-side rendering," they refer to this process of generating static HTML from dynamic code. 

In this process, the client makes a request (such as typing in the URL in the web browser). Then, the server grabs some data from the database and with it **generates** (aka **server-renders**) the **static HTML** on the server and then sends only the HTML back (looking like the example above). 

>🤔 **So what's client-side rendering?**
>Many modern web applications are at least partially client-side rendered. In client-side rendering, when a user types in the URL to your website, the server immediately responds with the HTML file as a response. There is no step in between that runs backend logic. Instead, the client receives the .html-file as it is from the server. 
>Usually, that HTML file contains a link to a static JavaScript file that then is also downloaded and executed on the client side.
>In those applications, the JavaScript file then contains some code logic that makes a separate request **only for the data** from the backend (e.g., as JSON). In this type of web application, the frontend and the backend are separated very strictly. The frontend consists only of static HTML, CSS, and JS files. And the purpose of the backend is to only provide the data but not to _generate_ any HTML.
>This is a very popular approach these days. And if you're planning to build an application using that approach, the contents of this lesson are less relevant to you.

## Choosing a templating engine

Express supports all sorts of [template engines](https://expressjs.com/en/resources/template-engines.html) (aka templating languages). So if you're already familiar with a particular language, you'll likely be able to find it there. 

For this tutorial, we'll be working with [EJS (Embedded JavaScript)](https://github.com/mde/ejs). People have different opinions on different languages. That's why so many exist in the first place. 

The nice thing about EJS is that it is "just JavaScript" embedded in HTML with some custom tags. Other languages, like [pug](https://github.com/pugjs/pug) or [Nunjucks](https://github.com/mozilla/nunjucks), either significantly changes the overall syntax of your HTML or come with their own custom syntax you first have to learn. 

In EJS, you only need to know the different tag types (mostly just 3) and one custom function keyword. 

## Installing EJS

First, we need to install EJS. For that, run the following command while being in the root of your project folder:

```
npm install ejs
```

Now we have the EJS package installed and added to the **package.json** file. Now, we only need to tell Express to use EJS as a **template engine**, and we are good to go. 

In your **app.js** file, _below_ the line where you define `const app = express()`, _but above_ all your route functions, insert the following line: 

```js
app.set('view engine', 'ejs')
```

With `app.set()`, you can change different configurations of your Express server. The string `'view engine'` is a configuration property predefined by Express. The second parameter is the value we're setting the `view engine` to use. In our case, that's `ejs` - the name of the package we just installed. 

## Rendering a page with EJS

The first useful thing the **template engine** does for us is allow us to keep our HTML in separate files instead of writing it in our JavaScript code. Let's try it out by creating a template file for our landing page. 

In your project folder, create a new folder called `views`. By default, Express is configured to look for templates inside that folder. 

>💡 You can change the folder Express uses to look for template files. In the beginning, this will most likely not be necessary. But in case you'd like to do it, you can change the configuration for `'views'` to the new folder path - just like you changed the configuration for `'view engines'`. 
> For example, if you want to change the folder name to "pages", you'd add this to your **app.js**: `app.set('views', './pages')` 

In that folder, create a file and call it `index.ejs`. Technically, it'll be mostly an HTML file. But since we want to be able to use some custom EJS code in it, we need to use the `.ejs` file extension. 

In that file, add some general HTML you want to appear on the landing page. Again, this can be any valid HTML code. Here is one example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookieshop</title>
</head>
<body>
  <header>
    <h1>Cookieshop</h1>

    <nav>
      <a href="/">Home</a>&nbsp;|&nbsp;
      <a href="/about">About</a>&nbsp;|&nbsp;
      <a href="/cookies">Shop</a>&nbsp;|&nbsp;
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main>
    <p>Welcome to my cookieshop. 👋</p>
    <p>We currently have 42 cookies in stock.</p>
  </main>

  <footer>
    Made with 🍪 by Codecookies
  </footer>
</body>
</html>
```

Now, change the route function of the landing page to this: 

```js
app.get('/', (request, response) => {
  response.render('index')
})
```

You can see, instead of `response.send()` we're writing `response.render()`. And the parameter is not anymore a string with the actual contents being displayed. Instead, we're writing the name of the template file (excluding the file extension).

Accessing [localhost:3000/](http://localhost:3000/) should now render the HTML from the new file.

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/" target="blank">
        localhost:3000/
      </a>
    </div>
  </header>
  <main>
    <div>
      <h1>Cookieshop</h1>
      <div>
        <a>Home</a>&nbsp;|&nbsp;
        <a>About</a>&nbsp;|&nbsp;
        <a>Shop</a>&nbsp;|&nbsp;
        <a>Contact</a>
      </div>
    </div>
    <div>
      <br>
      <p>Welcome to my cookieshop. 👋</p>
      <p>We currently have 42 cookies in stock.</p>
      <br>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>

## Using EJS code in templates

The code example consists only of HTML code so far. With EJS, you can _embed_ JavaScript into your template. Any JavaScript code within EJS tags is **executed on the backend** and **before** the generated HTML is sent back to the client. This can be a little confusing, but it is what makes it fundamentally different from including JavaScript within a `<script>` tag.

There are three types of EJS tags you should know about: 

* `<% %>` Execute JavaScript without any output
* `<%= %>` Execute JavaScript and insert the _escaped*_ result into the HTML 
* `<%- %>` Execute JavaScript and insert the _unescaped*_ (aka raw) result into the HTML

_\* we will talk about "escaping" in just a second_

The first tag `<% %>` does not add anything to your HTML. So it's often used for code logic such as defining variables, loops, or conditions. 

On the other hand, `<%= %>` will put the result of the JavaScript code into the HTML. Let's look at an example: 

```html
<p>We currently have <% 42 %> cookies in stock.</p>
```

This code will result in not showing the number `42` because the code is executed but not put into the HTML.

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title"></div>
  </header>
  <main>
    <p>We currently have&nbsp;&nbsp;cookies in stock.</p>
  </main>
</div>

However, this code will put the number 42 in the HTML: 

```html
<p>We currently have <%= 42 %> cookies in stock.</p>
```

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title"></div>
  </header>
  <main>
    <p>We currently have 42 cookies in stock.</p>
  </main>
</div>

And since it's just JavaScript code, you can run any operations in there:

```html
<p>We currently have <%= 42 - 30 %> cookies in stock.</p>
```

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title"></div>
  </header>
  <main>
    <p>We currently have 12 cookies in stock.</p>
  </main>
</div>

Or you can combine it with the first tag: 

```html
<% const stockNumber = 42 %>
<p>We currently have <%= stockNumber %> cookies in stock.</p>
```

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title"></div>
  </header>
  <main>
    <p>We currently have 42 cookies in stock.</p>
  </main>
</div>

The last type of EJS tags is `<%- %>` and it's relevant if you want to generate **unescaped** output. An "escaped" string will **prevent the browser from rendering HTML**. Let's look at another example: 

```html
<%= '<h1>Hello World</h1>' %>
```

will result in this: 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title"></div>
  </header>
  <main>
    &lt;h1&gt;Hello World!&lt;/h1&gt;
  </main>
</div>

But if you don't escape the string, it'll look like this: 

```html
<%- '<h1>Hello World</h1>' %>
```

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title"></div>
  </header>
  <main>
    <h1>Hello World</h1>
  </main>
</div>

You need to be very careful when rendering **unescaped** HTML. This can be a security risk if the content rendered is content that comes from users of your websites. It would be too much to go into that here. But if you're interested, a common type of attack that you have to be careful with is Cross-Site-Scripting. 

## Passing variables to the template

Often, data on your pages come from other sources. Take a look at the example from above. On our landing page, we're informing our users about the number of cookies left in stock. We don't want to manually update the HTML every time we sell a cookie. Instead, we want to insert that number dynamically on the backend. 

In the future, a database might provide this number. But since don't have that set up yet, let's create a fake variable with the number for now. Let's add it to the route function:

```js
app.get('/', (request, response) => {
  const numberOfCookiesInStock = 40
  response.render('index')
})
```

Before we can use values from our route function in the template code, we need to pass it to the template. To do that, we can define an object as second parameter of the `render()` function. This is what it could look like: 

```js
app.get('/', (request, response) => {
  const numberOfCookiesInStock = 40
  response.render('index', {numberOfCookiesInStock: numberOfCookiesInStock})
})
```

The properties of the object defined by you are available as variables in the template. 

In the **views/index.ejs** file, you can now access the property defined by your `numberOfCookiesInStock`.

Change the following line in your HTML. Then look at the page in the browser. You should see the number from your route function show up. 

```html
<p>We currently have <%= numberOfCookiesInStock %> cookies in stock.</p>
```

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title"></div>
  </header>
  <main>
    <div>
      <h1>Cookieshop</h1>
      <div>
        <a>Home</a>&nbsp;|&nbsp;
        <a>About</a>&nbsp;|&nbsp;
        <a>Shop</a>&nbsp;|&nbsp;
        <a>Contact</a>
      </div>
    </div>
    <div>
      <br>
      <p>Welcome to my cookieshop. 👋</p>
      <p>We currently have 40 cookies in stock.</p>
      <br>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>

The object you're passing can have as many properties as you like. Also, the names of the properties can be anything you like (except for reserved keywords such as `'includes'` - more on that later.) So we could also do this: 

```js
app.get('/', (request, response) => {
  const numberOfCookiesInStock = 40
  response.render('index', {
    nameOfThePage: "Cookieshop",
    numberOfCookiesInStock: numberOfCookiesInStock,
    numberOfCookiesSold: 3283
  })
})
```

This would give you access to all three properties in the template: `<%= nameOfThePage %>`, `<%= numberOfCookeisInStock %>`, and `<%= numberOfCookiesSold %>`.

## Including template partials

There is one more very important topic left to be covered: **partials** - also known as **includes**. (Other templating languages use similar concepts such as "blocks" and "layouts.")

So far, you have worked within a single template file. So let's create another one. The new template is going to be for our `/cookies` route. 

A common pattern to set up templates for routes part of a collection (such as `/cookies` and `/cookies/:slug`) is to use a sub-folder and put the corresponding templates in there. To create a new folder in the **views** folder called **cookies**. And in it, create a file called **index.ejs**. 

Naming the file that displays the entire list of a collection **"index"** is another convention. 

>💡 The template file for rendering an individual collection item (such as `/cookies/:slug` or `/cookies/:id`) is often called **show.ejs**. If you have a designated page for creating a new item, it's often under the `/cookies/new` route and called **new.ejs**. 

Add the following contents to the new **views/cookies/index.ejs** file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookies</title>
</head>
<body>
  <header>
    <h1>Cookieshop</h1>

    <nav>
      <a href="/">Home</a>&nbsp;|&nbsp;
      <a href="/about">About</a>&nbsp;|&nbsp;
      <a href="/cookies">Shop</a>&nbsp;|&nbsp;
      <a href="/contact">Contact</a>
    </nav>
  </header>

  <main>
    <p>Our current offering:</p>
    <ul>
      <li><a href="/cookies/chocolate-chip">Chocolate Chip</a></li>
      <li><a href="/cookies/banana">Banana</a></li>
    </ul>
  </main>

  <footer>
    Made with 🍪 by Codecookies
  </footer>
</body>
</html>
```

To render templates from sub-folders, you add the name of the sub-folder to the path in the `render()` function like below:

```js
app.get('/cookies', (request, response) => {
  response.render('cookies/index')
})
```

If you write your code by hand _(which you should!)_ and don't just copy and paste _(which you shouldn't because you won't learn anything this way!)_ you'll probably notice that you're writing a lot of duplicate HTML code. This would be quite tedious on a large website with many pages. And imagine having to make a change that affects all pages. 

That's where the **include** feature of EJS comes in. It allows you to take part of your template code and package it into a separate file. You can then reuse this file in as many templates as you like. Let's do that for the `<head>` of our pages!

Create a new folder called **includes** in your **views** folder, and in it, add a new file called **head.ejs**.

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
      <li>📁 public</li>
      <li>
        📁 views
        <ul>
          <li>
            📁 cookies
            <ul>
              <li>📄 index.ejs</li>
            </ul>
          </li>
          <li>
            📁 includes
            <ul>
              <li>📄 head.ejs</li>
            </ul>
          </li>
          <li>📄 index.ejs</li>
        </ul>
      </li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

In it, copy and paste the entire `<head>` from your other EJS files: 

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cookieshop</title>
</head>
```

You can now insert that _partial_ in any other EJS template file using the **unescaped EJS tag** `<%- %>` (because we want to render HTML tags instead of just displaying the plain code) and the built-in `include()` function that comes with EJS. 

Back in the **views/index.ejs** file, remove the entire `<head>...</head>` section and use the `include()` function instead like this: 

```html
<!DOCTYPE html>
<html lang="en">
<%- include('includes/head') %>
<body>
  ...
```

`/includes/head` is a relative path in relation to the template calling it. In the example above, the **views/index.ejs** file is making the call to the partial. Since the **index.ejs** file and the folder **includes** are both in the same folder (**view**) the relative path is `includes/head`.

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop/views</div>
  </header>
  <main>
    <ul>
      <li>
        📁 cookies
        <ul>
          <li>📄 index.ejs</li>
        </ul>
      </li>
      <li>
        📁 includes
        <ul>
          <li>📄 head.ejs</li>
        </ul>
      </li>
      <li>📄 index.ejs</li>
    </ul>
  </main>
</div>

The situation is a little bit of a different one for the **views/cookies/index.ejs** file. The file is in its own sub-folder.

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop/views/cookies</div>
  </header>
  <main>
    <ul>
      <li>📄 index.ejs</li>
    </ul>
  </main>
</div>

So the relative path to the partial looks slightly different. You have to add `../` to the beginning of the path to travel up a folder (into the views folder). From there, you have access to the `includes` folder and its contents. 

>💡 If this description of paths sounds like magic to you, you may not be too familiar with paths in the command line yet. To understand how paths work, I suggest checking out [MDN's carshcourse on navigation on the command line](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Command_line#navigation_on_the_command_line)

So in the **views/cookies/index.ejs** file you have to add the partial like this: 

```html
<!DOCTYPE html>
<html lang="en">
<%- include('../includes/head') %>
<body>
  ...
```

If you now open either of those pages, they should still work as before. 

>🐛 Got an error? Try to read the error and understand what the problem is. Do you have a typo anywhere? Sometimes it can be as simple as writing `includes()` instead of `include()`. Or maybe the file name is incorrect or the file in the wrong place. Usually, the error message will give you some indication about what went wrong. 

Using the `include()` function, you can insert **any template** file into any other template file. They don't need to be in a specific **includes** folder. You can even include a template inside a template that also includes another template. However, in order to keep things somewhat organized, it's a good idea to differentiate clearly in your folder structure between partials and pages. 

## Passing parameters to partials

Sometimes, you want to reuse most of the content of a partial but only change one little piece of it on every page. Let's take our previous example. I would like to change the `<title>` tag on each page. You can do that in a very similar way as how we used the `response.render()` function. All you have to do is add an object as the second parameter of the `include()` function. 

In your **index.ejs** file, change the `include()` function to this: 

```html
<%- include('includes/head', {title: 'Home | Cookieshop'}) %>
```

And in your **cookies.ejs** file change it to this: 

```html
<%- include('includes/head', {title: 'Shop | Cookieshop'}) %>
```

Now, inside the **views/includes/head.ejs** file, you have access to the `title` variable. And depending on which of the two pages is loaded, the `title` variable will represent a different value. 

Here is what you need to change the **head.ejs** file to: 

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
</head>
```

If you open either of the two pages now, you should notice the title in the tab of your browser window change to either "Home | Cookieshop" or "Shop | Cookieshop". 

## Recap

This was a very long lesson, and we covered a lot of ground. But now you actually know the most important things to know about **templating** and **EJS** with Express. 

We started by looking at the difference between server-side rendering and client-side rendering and how HTML is dynamically generated on the backend. We looked at how to set up EJS with Express and learned the three most important typeps of tags `<% %>`, `<%= %>`, and `<%- %>`. We also covered passing values from the route function to the template. Finally we looked at reusing template code by **including** templates inside each other (and optionally adding parameters).

## 🛠 How to practice

In this lesson, we added two HTML templates (**index.ejs** and **cookies.ejs**) and one partial (**head.ejs**). We covered a lot of content, so before you move on to the next lesson, take some time to work more on our cookie shop.

* Update all pages to use templates. The website should have at least the following pages: `/`, `/about`, `/contact`, `/cookies`, `/cookies/:slug`. A common pattern to setup templates for routes part of a collection (such as `/cookies` and `/cookies/:slug`) is to use a sub-folder and put the corresponding templates in there. To render the template within a sub-folder, you just add the folder name to the path string like this: `response.render('cookies/index.html')`. Another common pattern is to call the template of the overview page (such as `/cookies`) **index.ejs** and the template of the page representing an individual collection item (such as `/cookies/:slug`) **show.ejs**. You don't have to do it that way. But it's a common practice.
* Pass dynamic values, such as the `:slug` or details about the cookie, to the **template**** of the `/cookies/:slug` route. Use those values in the template and display them to the user. The values should be different depending on different cookie pages
* Move the `<header>` (and all its contents) of the different pages into its own partial.
* Move the `<footer>` of the different pages into its own partial.

>💡 This might also be a good time to clean up some of your code. If you have some HTML floating around as strings in your routes, make sure to remove it and use **templates** instead. 
>Also, if you have some static HTML files, you may want to turn those into **templates** now, as well. 
>
>Finally, in case you already added some CSS or client-side JavaScript as static files to your project, you may want to add `<link>` or `<script>` tags to reference those from your **templates** as well.

Here is an example of what your folder structure might look like after making the above changes:

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
      <li>📁 public</li>
      <li>
        📁 views
        <ul>
          <li>
            📁 cookies
            <ul>
              <li>📄 index.ejs</li>
              <li>📄 show.ejs</li>
            </ul>
          </li>
          <li>
            📁 includes
            <ul>
              <li>📄 footer.ejs</li>
              <li>📄 head.ejs</li>
              <li>📄 header.ejs</li>
            </ul>
          </li>
          <li>📄 index.ejs</li>
        </ul>
      </li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>



>**Advanced Task**
>If you haven't already, add a list of cookie objects in your **app.js** file. Each cookie object should have at least a `name`, `description`, and a `price` property. Also, each object needs to be identifyable by a `slug` (either by adding it as a property or setting the list to be an object where each key is the slug.)
>
>If a user accesses `/cookies/:slug` check if any of the cookies in your list has a slug matching the provided `:slug`. If that's the case, pass the cookie's `name`, `description`, and `price` to the EJS template.
>In the EJS template, display those three values to the user.

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/chocolate-chip" target="blank">
        localhost:3000/cookies/chocolate-chip
      </a>
    </div>
  </header>
  <main>
    <div>
      <h1>Cookieshop</h1>
      <div>
        <a>Home</a>&nbsp;|&nbsp;
        <a>About</a>&nbsp;|&nbsp;
        <a>Shop</a>&nbsp;|&nbsp;
        <a>Contact</a>
      </div>
    </div>
    <div>
      <h2>Chocolate Chip</h2>
      <p>A tasty, sugary cookie filled with chocolate chips.</p>
      <p>Price: $3.50</p>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>


Once you are done with your work on the cookie shop, practice some more by working on an entirely separate project applying what you have learned here: 

* Install EJS
* Add page templates to a **views** folder and `render` them from your route functions (passing some values to them)
* Avoid duplicated HTML by using partials and the `include()` function (again, passing parameters where necessary)