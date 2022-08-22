---
title: Control flow in EJS Templates
slug: control-flow-in-ejs-templates
lastUpdate: August 22nd, 2022
sectionIndex: 0
groupIndex: 2
---

In this lesson, we are going to look at some more advanced ways of how to use the templating language EJS. Particularly, we're going to look at using control flow concepts such as **functions**, **conditions**, and **loops**. 

>💡 **Control flow** is a programming term referring to any kind of programming logic that changes when, if, or how often code is executed - therefore "controlling the flow."
>This refers generally refers to conditions (aka **if-statements**) and **loops** but can also include **functions**.

We are also going to look into using more complex data types such as **arrays** and **objects**. 

Most of the things we will be looking at in this lesson are just regular JavaScript. So technically speaking, it shouldn't include anything entirely new to you. But what might be new is understanding how to transfer that knowledge to use it in EJS. 

## Rendering items from an array

Most web applications render lists of items. This might be a list of shop items, a list of blog articles, a list of tasks, a list of chat messages, etc. Therefore, knowing how to display a list in your templates is a crucial skill. 

The nice thing about the templating language EJS is that it's "just JavaScript" wrapped inside some custom EJS tags such as `<% %>`, `<%= %>`, or `<%- %>`. That means we can use regular **loops** when working with **arrays** (aka lists).

Let's put a very simple array in our backend code (probably your **app.js** file). It should be somewhere close to the top and before the various route functions. For example, you can put it right below the `import` statement at the top. 

```js
const cookies = [
  "Chocolate Chip",
  "Banana"
]
```

>🤔 If you have been following the advanced tasks from the previous lessons, you may already have a more advanced array containing objects. Later, in this lesson, we'll use an array exactly like that. But we'll start with a little simpler version. 
>If you still want to be able to follow along, you could pick a different name for the variable above - e.g., `cookieStrings`.

Now, I'd like to render the list of cookies on the `/cookies` page. To do that, I can pass the `cookies` variable to the corresponding template. So first, I have to update my route function: 

```js
app.get('/cookies', (request, response) => {
  response.render('cookies/index', { cookies: cookies })
})
```

With this, I have access to the `cookies` variable in the template. 

The route function renders a template found in the following path: **views/cookies/index.ejs**. Somewhere in `<body>` of your HTML add the `<%= cookies %>`. Remember, the `<%= %>` will put the output of your JavaScript code in the HTML. In this case, it'll be the value of the `cookies` variable. 

In my example, I put it in the `<main>` element of my page: 

```html
<main>
  <p>Our current offering:</p>
  <ul>
    <%= cookies %>
  </ul>
</main>
```

If you now access the cookies page [localhost:3000/cookies](http://localhost:3000/cookies) you should see the array rendered as a simple list on the page. 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/" target="blank">
        localhost:3000/cookies/
      </a>
    </div>
  </header>
  <main>
    <p>Our current offering:</p>
    <ul>Chocolate Chip,Banana</ul>
  </main>
</div>

That sort of works. But we would like each item in the list to have its own line and look like a regular HTML list. What we want to end up with is something like this: 

```html
<main>
  <p>Our current offering:</p>
  <ul>
    <li>Chocolate Chip</li>
    <li>Banana</li>
  </ul>
</main>
```

So what we need to do is alter each element in the array and add a `<li>` in front of the string and a `</li>` behind the string. 

For that, we can use a regular [JavaScript `forEach()` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). In a JavaScript file, we could use a `forEach()` look, for example, like this: 

```js
cookies.forEach(cookie => {
  '<li>' + cookie + '</li>'
})
```

The loop above iterates over every single cookie in the `cookies` array. Each item in the array represents a string. So the `cookie` variable on the first iteration will represent "Chocolate Chip", and on the second iteration, it will represent "Banana". 

>💡 If this sounds foreign or new to you, I suggest to review how loops work in JavaScript and specifically learn about the [forEach](https://www.w3schools.com/jsref/jsref_foreach.asp) loop.

You can put multiple lines of JavaScript code in EJS templates using multiple EJS tags. Look at the code below carefully and write it by hand in your own code. (Don't copy and paste!) 

```html
<main>
  <p>Our current offering:</p>
  <ul>
    <% cookies.forEach(cookie => { %>
      <li><%= cookie %></li>
    <% }) %>
  </ul>
</main>
```

The result should look like this: 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/" target="blank">
        localhost:3000/cookies/
      </a>
    </div>
  </header>
  <main>
    <p>Our current offering:</p>
    <ul>
      <li>Chocolate Chip</li>
      <li>Banana</li>
    </ul>
  </main>
</div>

If this is hard to understand to you, spend some time comparing the three recent code snippets. 

The first and the last line of the loop use regular `<% %>` tags because they just contain JavaScript code that should not show up in the HTML code. 

The contents of the `forEach` loop will be inserted into the HTML as often as the loop code between the `{` and `}` runs. In each iteration, you have access to the variable `cookie` representing a single item in the array. 

And we can use a `<%= %>` tag to print out the contents of the variable `cookie`. 

If this still seems a little strange to you, keep practicing with different kinds of arrays. Change the HTML code within the for loop and see what happens. Try to get a feel for what's happening, and don't shy away from breaking stuff. 

## Rendering objects

Now, we have a list of cookie names. But I'd like to be able to link to each of them. So, in addition to their name, I need to know a `slug` for each one of them. 

>💡 Remember, a `slug` is a unique identifyer that can be used as part of a URL. So it should be all lowercase without any special character or spaces. Usually slugs look like this: `i-am-a-slug`, `chocolate-chip`.

Right now, each list item looks like this: 

```html
<li>Chocolate Chip</li>
```

But I would like it to look like this: 

```html
<li>
  <a href="/cookies/chocolate-chip">Chocolate Chip</a>
</li>
```

That means I need two pieces of data: A name ("Chocolate Chip") and a slug ("chocolate-chip"). But my array of `cookies` currently only contains a list of strings where each string is just the name of the cookie. So let's update the array in the **app.js** to use objects instead. Objects allow us to provide many data points to a single item. 

```js
const cookies = [
  { name: 'Chocolate Chip', slug: 'chocolate-chip' },
  { name: 'Banana', slug: 'banana' }
]
```

If you now refresh the page, though, you'll see this in the web browser. 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/" target="blank">
        localhost:3000/cookies/
      </a>
    </div>
  </header>
  <main>
    <p>Our current offering:</p>
    <ul>
      <li>[object Object]</li>
      <li>[object Object]</li>
    </ul>
  </main>
</div>

The individual `cookie` in each iteration of the `forEach()` loop now represents an object and not a string. Therefore, `<%= cookie %>` will output `[object Object]`. To read the `name` property of the object, just change it to `cookie.name`:

```html
<main>
  <p>Our current offering:</p>
  <ul>
    <% cookies.forEach(cookie => { %>
      <li><%= cookie.name %></li>
    <% }) %>
  </ul>
</main>
```

And with the same method, we can now add the HTML anchor tag and use the `<%= cookie.clug %>` to define the `href` attribute: 

```html
<main>
  <p>Our current offering:</p>
  <ul>
    <% cookies.forEach(cookie => { %>
      <li>
        <a href="/cookies/<%= cookie.slug %>"><%= cookie.name %></a>
      </li>
    <% }) %>
  </ul>
</main>
```

If you now access [localhost:3000/cookies](http://localhost:3000/cookies) you'll see a list of links where each link leads to one of the following pages: [localhost:3000/cookies/chocolate-chip](http://localhost:3000/cookies/chocolate-chip), [localhost:3000/cookies/banana](http://localhost:3000/cookies/banana).

## Conditional rendering

Using the same method as with the loop, we can use EJS tags to also add JavaScript `if`-conditions to the template. 

Let's say we want to signal to users whether a particular type of cookie is sold out. As a first step, we need to add that piece of information to the list of cookies signaling whether or not this particular type of cookie is sold out. So Let's add a `boolean` property for that to our list: 

```js
const cookies = [
  { name: 'Chocolate Chip', slug: 'chocolate-chip', isInStock: true },
  { name: 'Banana', slug: 'banana', isInStock: false }
]
```

We set one of the cookies to not be in stock anymore. 

Now, we can use this new property (`isInStock`) and a [regular JavaScript condition](https://www.w3schools.com/js/js_if_else.asp) to display a warning if the item is sold out. Back in the **views/cookies/index.ejs** change the code inside the existing **loop** like this: 

```html
<% cookies.forEach(cookie => { %>
  <li>
    <a href="/cookies/<%= cookie.slug %>"><%= cookie.name %></a>
    <% if(!cookie.isInStock) { %> [SOLD OUT] <% } %>
  </li>
<% }) %>
```

You can see that the entire condition fits in a single line. The opening tag ends with a `{`, followed by some plain text saying `[SOLD OUT]`. Then we signal the end of the condition with a tag that only includes the `}` closing braces. 

The condition itself uses the bang operator `!`, and says: if the cookie is **not** (`!`) in stock, then show the message `[SOLD OUT]`.

You can also spread the condition onto multiple lines and turn it into a **if-else** block like this: 

```html
<% cookies.forEach(cookie => { %>
  <li>
    <% if(cookie.isInStock) { %> 
      <a href="/cookies/<%= cookie.slug %>"><%= cookie.name %></a>
    <% } else { %>
      <%= cookie.name %> [SOLD OUT] 
    <% } %>
  </li>
<% }) %>
```

This condition will only display a link to the cookie page if it is in stock. Otherwise, it'll just list the name of the cookie in plain text. 

You can use the same logic to write more complicated code, such as `if-else` if-else` blocks or combine multiple nested **loops** and **conditions**. You have endless options. 

## Helper functions

The last concept we will look at is passing functions to templates. 

You already know that you can pass simple and complex data to the templates by adding them to an object as the second parameter of the `response.render()` function. Using the same method, you can also pass entire functions to the template. This might be helpful if you want to perform smaller kinds of logic - like converting a number to a currency or formatting a date. You can also hide more complex condition logic in functions. 

Let's add a price to each of our cookies. When working with currencies in applications, a common practice is to work with integers and store all prices in the smallest possible currency unit. In the case of Euros or US dollars, those would be called "cents". Developers do that to maintain the highest possible level of accuracy and avoid issues with [floating point numbers](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) (an issue that we won't be able to go into detail about here.)

So let's add prices in cents to the list of cookies: 

```js
const cookies = [
  { name: 'Chocolate Chip', slug: 'chocolate-chip', priceInCents: 350, isInStock: true },
  { name: 'Banana', slug: 'banana', priceInCents: 300, isInStock: false }
]
```

We could display those prices directly to the user. But a much more user-friendly approach would be to convert the `350` to something like `$3.50`.

There are different ways to do that - and arguably, the best way to do that is to pass the conversion on the backend and pass only the `$3.50` to the template. But we're here to practice using functions in templates. So we're going to do it that way for now. 

It's always a good idea not to put too much business logic in the same file. So we'll put our function for converting the cents to a readable price in its own file. 

In the root of your project, create a new folder called **helpers** _(a common place for general purpose helper functions. Folder names with similar concepts are **util** utility functions, **services**, or **lib**.)_ 

In that folder, create a new file called **cookie-views.js**. 

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop</div>
  </header>
  <main>
    <ul>
      <li>
        📁 helpers
        <ul>
          <li>📄 cookie-views.js</li>
        </ul>
      </li>
      <li>📁 middlewares</li>
      <li>📁 node_modules</li>
      <li>📁 public</li>
      <li>📁 views</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

Next, add a function, that converts our `priceInCents` to a decimal number and adds a currency symbol to it. 

```js
export const readablePrice = (priceInCents) => {
  return '$' + (priceInCents / 100 )
}
```

>💡 An interesting alternative function is also `.toLocalString()`. You can find more information about it [on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#see_also). Particularly, if you want to display pricing in different currencies, this could be a quite useful function. 

We `export` the function to make it available in other JavaScript files of our project. This allows us to go back to the **app.js** file and use `import` to import the function at the top of the file: 

```js
import { readablePrice } from './helpers/cookie-views.js'
```

To pass the function to the `/cookies` route, we add it as an additional parameter to the object that already contains the `cookies` variable: 

```js
app.get('/cookies', (request, response) => {
  response.render('cookies/index', { 
    cookies: cookies,
    readablePrice: readablePrice
  })
})
```

Note that we **don't execute the function** here (using parenthesis and writing `readablePrice()`)! We just pass the function variable to the template and want to execute it only in the template.

Back in the **/views/cookies/index.ejs** file, we can now call the function and pass as a parameter the `priceInCents` of each cookie: 

```html
<li>
  <% if(cookie.isInStock) { %> 
    <a href="/cookies/<%= cookie.slug %>"><%= cookie.name %>: <%= readablePrice(cookie.priceInCents) %></a>
  <% } else { %>
    <%= cookie.name %> [SOLD OUT] 
  <% } %>
</li>
```

With the code above, your page should now look something like this:

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies" target="blank">
        localhost:3000/cookies
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
      <p>Our current offering:</p>
      <ul>
        <li><a>Chocolate Chip: $3.5</a></li>
        <li>Banana [SOLD OUT]</li>
      </ul>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>

You can see that the function can be passed to the template just like any other variable. 

>💡 As mentioned before, using helper functions like this is a little bit of a controverse topic. A lot of developers will argue that the views (aka templates) should contain as little logic as possible. Instead, the logic should be handled in a separate place of the code. 
>A very common **advanced approach** to handle this is the concept of **View Models** or **Presenter** functions. Using that method, you'd have one larger class or function perform all the necessary logic on the backend and then pass the ready-to-use object to the template.
>For example, you could keep a function called `cookiesView()` in a separate file in your project. The `return` of the function is an object that may look like this:
>`{ cookies: [ ... ], pageTitle: "Cookieshop" }`
>And instead of writing the object directly in the `render()` function, you pass this **view model function** instead (which will return the entire object).
>`render('/cookies/index', cookiesView())`


## Recap

This was a very full lesson. However, most of what we used was just plain JavaScript wrapped in EJS tags. You learned to render items from arrays using `forEach()`, as well as applying `if-else` conditions. Lastly, we looked into passing functions to the template to add some business logic. 

## 🛠 How to practice

If you haven't done it yet through the advanced tasks of the previous lessons, now is a good time to update the `/cookies/:slug` route of your application and use everything that you have learned in this lesson. 

* Users should be able to navigate to each individual cookie page using the `:slug` in the URL. (e.g., `/cookies/chocolate-chip`)
* The individual cookie page should render a `name` and `price` to the user.
* If you haven't already, add a new `description` field to the list of `cookies` and show the description text on the cookie page. 

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

To practice what you have learned in an additional, separate project, include an array of object in it and try to list different items using **EJS** and `forEach`. Additionally, add some `if-else` conditions to have different HTML show up based on various conditions being true. 