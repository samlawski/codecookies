---
title: "CRUD 2: Read Records"
slug: read-records
description: Learn to find and filter one or more records from the a MongoDB database with mongoose and Express.
lastUpdate: September 20th, 2022
sectionIndex: 0
groupIndex: 3
---

Mongoose comes with many built-in functions to easily query one or more records from a MongoDB database. In this lesson, we're going to look at how you get either one or more records and return it to the client.

Before we get started, let's set the starting point for this lesson. In the context of this lesson, we'll work on two pages for our cookieshop: 

* [/cookies](http://localhost:3000/cookies)
* [/cookies/:slug](http://localhost:3000/cookies/chocolate-chip)

We need templates for both of those. By naming and placing those files, we follow some common conventions: 

**/views/cookies/index.ejs:**

```html
<!DOCTYPE html>
<html lang="en">
<%- include('head', {title: "Shop | Cookieshop"}) %>
<body>
  <%- include('header') %>

  <main>
    <p>Our current offering:</p>
    <ul>
      <% cookies.forEach(cookie => { %>
        <li>
          <% if(cookie.isInStock) { %> 
            <a href="/cookies/<%= cookie.slug %>"><%= cookie.name %>: <%= readablePrice(cookie.priceInCents) %></a>
          <% } else { %>
            <%= cookie.name %> [SOLD OUT] 
          <% } %>
        </li>
      <% }) %>
    </ul>
  </main>

  <%- include('footer') %>
</body>
</html>
```

**/views/cookies/show.ejs:**
```html
<!DOCTYPE html>
<html lang="en">
<%- include('head', {title: `${cookie.name} | Cookieshop`}) %>
<body>
  <%- include('header') %>

  <main>
    <h1><%= cookie.name %></h1>
    <p><%= cookie.description %></p>
    <p>
      <strong>Price: <%= readablePrice(cookie.priceInCents) %></strong>
    </p>
    <% if(cookie.isInStock) { %> 
      <p style="color: green;">In Stock!</p>
    <% } else { %>
      <p style="color: tomato;">Temporarily sold out!</p>
    <% } %>
  </main>

  <%- include('footer') %>
</body>
</html>
```

Both those templates use a helper function that looks like this: 

**/helpers/cookie-views.js:**

```js
export const readablePrice = (priceInCents) => {
  return '$' + (priceInCents / 100 )
}
```

It should be `import`ed into the JavaScript file containing your routes and passed as a parameter to the template using the `response.render()` function.

The actual cookies of the shop could all be stored in an array in the code. A better way, however, is to keep all those cookies in the database. In this lesson, we're going to grab the cookies from the database before passing them to the view templates. 

>💡 Read through the code above thoroughly and make sure you understand every single part of it. If any of it seems confusing, review the lessons on [HTML responses](/express-tutorial/v1/html-response-and-templating/) and [control flow in EJS templates](/express-tutorial/v1/control-flow-in-ejs-templates/).

## Query all

The `/cookies` **index** page should render a list of our various cookie offerings. So we'd like to query all cookies from the database and pass them to the view. 

Let's start with this route function: 

```js
app.get('/cookies', (request, response) => {
  const cookies = []

  response.render('cookies/index', { 
    cookies: cookies,
    readablePrice: readablePrice
  })
})
```

>💡 If you already have a `const cookies` in your **app.js** file, you should remove it from the code entirely, at this point. 
>The point of this lesson is to use the cookies from the database instead of this one.
>If your database doesn't contain any cookies yet, go through the lesson on [creating records](/express-tutorial/v1/create-records) and add a few cookies to the database.

When using Mongoose to define a **model**, Mongoose will automatically add several functions for querying records to the model. We're going to use the `Cookie` model from the ["Schema & Models" lesson](/express-tutorial/v1/schema-and-models-with-mongodb). 

To get all records of a **collection** represented by a **model**, you can use the `.find({})` method. You have to pass an **empty object** if you want to query **all** records. This is what it looks like: 

`const cookies = Cookie.find({})`

But that's not all. Just like when [saving records in the database](/express-tutorial/v1/create-records), using `find()` will just define the query. You can still make changes to it throughout the function and alter it (something we'll look at below). To actually send the request to the database to get all the records, you have to add the `.exec()` function at the end of it. Only once you execute the query with `.exec()`, a request is sent to MongoDB to look for and retrieve the records associated with the `Cookie` model. 

So this is what we have now: 

`const cookies = Cookie.find({}).exec()`

But if we try it out, it'll still break. _(Try it yourself! Don't be afraid of getting errors. They are usually informative in telling you what's wrong.)_

The reason our code still breaks is that `exec()` is an **asynchronous function** returning a **promise**. Remember, usually, whenever you send a request to a service **outside of your own application** (like an API or a database), those requests are **asynchronous**. Whenever you run a function that tells Mongoose to interact with the database (like _"Go create that record!"_, or in this case, _"Go grab all those records for me!"_), Mongoose will do that as an **asynchronous function**. It will return a **promise**, as Mongoose will say _"I **promise** I will return those records for you **later**!"_. 

Since rendering our view template only makes sense once we actually have the entire list of cookies, we should _wait_ for the **promise** to be **resolved** - meaning, we should _wait_ until we get a successful response. 

>💡 Some websites use a concept called **lazy loading**. You may have seen that on social media websites for example. Those websites return an empty shell of the main page and display a loading spinner where records from the database will show up later. In those cases, they don't actually _wait_ until the database returns the records. But instead they will already start rendering parts of the page and fill in the records from the database later. 
>This is a little more complex to implement and involves using client-side JavaScript and API requests. That would be way beyond the scope of this lesson. But in case you were wondering, I wanted to have mentioned it. 

For that purpose, we are going to turn the route function into an **asynchronous function** allowing us to use [the `await` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function):

```js
app.get('/cookies', async (request, response) => {
  const cookies = await Cookie.find({}).exec()

  response.render('cookies/index', { 
    cookies: cookies,
    readablePrice: readablePrice
  })
})
```

This function should work now. If you try it out, your [/cookies](http://localhost:3000/cookies) page should hopefully render the various cookie records from your database. If it doesn't, try scrolling through the error message to see if you find some hint to what went wrong. Usually, the most meaningful part of an error message is either close to the top or close to the bottom. 

>💡 In our small shop, we only have a few cookie records in the database. However, once your shop grows and you have hundreds or thousands of records in the database, it's a bad idea to simply run `find({})` to query literally all records in the database. Instead, people grab subsets of the data and spread them onto multiple pages or use an **infinite scroll** feature to only load more records as the user scrolls to the bottom of the page. 
>This concept is called **pagination** and something that will be covered in a separate lesson. 

## Error handling queries

By default `.find({})` will just return an empty array if the function couldn't find any records. Nonetheless, when dealing with external services, it's always possible for errors to occur. 

Mongoose gives you multiple ways to handle errors. But since we are already using [**async-await**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), the best solution would be to additionally use the [**try...catch**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) feature. 

```js
app.get('/cookies', async (request, response) => {
  try {
    const cookies = await Cookie.find({}).exec()

    response.render('cookies/index', { 
      cookies: cookies,
      readablePrice: readablePrice
    })
  }catch(error) {
    console.error(error)
    response.render('cookies/index', { 
      cookies: [],
      readablePrice: readablePrice
    })
  }
})
```

In this example, we log the error in the console for us (as developers) to see. But the user only receives an empty list of cookies. It might make sense to give the user a little more information here, such as an error message. But that's up to you and goes beyond the scope of this lesson.

## Add filters to queries

There are a whole number of queries offered by Mongoose. You can find a list [in the documentation](https://mongoosejs.com/docs/queries.html). But for now, we're going to have a closer look at `.find()` because in many cases it's actually all you need. 

With `.find()` you can specify parameters to filter the list of records you'd like to query. 

For example, if you wanted to only get records that are still in stock, you could add that property to the object passed in `.find()` like so:

```js
const cookies = await Cookie.find({ isInStock: true }).exec()
```

You could also filter by other parameters. For example, you could only `find` cookies that have a `priceInCents` that's _greater than_ a certain value (e.g., `100`):

```js
const cookies = await Cookie.find({ priceInCents: { $gte: 100 } }).exec()
```

There are a few more examples [in the documentation](https://mongoosejs.com/docs/api.html#model_Model-find).

## Query specific records

On the [/cookies/:slug](http://localhost:3000/chocolate-chip) page, we want to query just one cookie record that matches the `slug` provided in the URL, e.g., `"chocolate-chip"`.

We can achieve that using the filter you have learned about above. But `.find()` always responds with an array, even if you're just looking for a single item. For that reason, there is a more explicit function called `.findOne()`. This function will always return just a single item. If it identifies multiple items matching whatever condition you pass, it'll only return the **first item** it finds. 

Let's look at the [/cookies/:slug](http://localhost:3000/cookies/chocolate-chip) route function: 

```js
app.get('/cookies/:slug', (request, response) => {
  const slug = request.params.slug
  const cookie = {} // todo

  response.render('cookies/show', { 
    cookie: cookie,
    readablePrice: readablePrice
  })
})
```

The route accepts a parameter called `:slug` that's available through the `request.params.slug` property. In the example of [/cookies/chocolate-chip](http://localhost:3000/cookies/chocolate-chip), the variable `slug` would be the string `"chocolate-chip"`. _(So far that's just repeating the contents of the lesson on [dynamic routes](/express-tutorial/v1/rest-and-dynamic-routing).)_

We can follow the exact same steps as above to turn the route function into an **async** function and use the **try...catch** block to handle any errors. 

Instead of using `.find()` we'll use `.findOne()` to grab just one item: 

```js
app.get('/cookies/:slug', async (request, response) => {
  try {
    const slug = request.params.slug
    const cookie = await Cookie.findOne({ slug: slug }).exec()

    response.render('cookies/show', { 
      cookie: cookie,
      readablePrice: readablePrice
    })
  }catch(error) {
    console.error(error)
    response.status(404).send('Could not find the cookie you\'re looking for.')
  }
})
```

Take a close look and make sure to write the code by hand. Don't just copy and paste it. Notice how we're using the `slug` from `request.params.slug` to find a cookie with a matching slug? 

If you now try to access a route with a slug that exists in the database (e.g., [/cookies/chocolate-chip](http://localhost:3000/cookies/chocolate-chip)) you will see the page rendering the details about the cookie. 

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
      <p><strong>Price: $3.50</strong></p>
      <p style="color: green;">In Stock!</p>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>

But if you try to access a URL with a slug that doesn't exist in the database (e.g., [/cookies/rth92734hids](http://localhost:3000/cookies/rth92734hids)), you'll actually see an error - even though we have a `try...catch` block set up. Why is that? 

Well, `.findOne()` will not actually trigger an error if it doesn't find a record in the database. Instead, it'll respond with `null` - which is kind of like an empty value in JavaScript. So where are the errors then? 

Take a close look at the error message. It might look something like this (you may have to scroll up a bit):

```
TypeError: /Users/codecookies/projects/cookieshop/views/cookies/show.ejs:3
    1| <!DOCTYPE html>
    2| <html lang="en">
 >> 3| <%- include('head', {title: `${cookie.name} | Cookieshop`}) %>
    4| <body>
    5|   <%- include('header') %>
    6| 
```

The error shows that it occurred in the **view template**. The `try...catch` didn't catch it because the error didn't happen in the route function but in the template. 

The error says that `cookie.name` doesn't work because `cookie` is `null` (and therefore doesn't have a property `name`).

Since we don't want the page to load at all if no cookie record was found, we can tell our application to **jump to the `catch(){}` block, if no `cookie` was found. 

Within a `try...catch` block, we can manually **trigger an error** to **force JavaScript to jump to the `catch()` block**. We can do that using [JavaScript's `throw new Error()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw). 

```js
app.get('/cookies/:slug', async (request, response) => {
  try {
    const slug = request.params.slug
    const cookie = await Cookie.findOne({ slug: slug }).exec()
    if(!cookie) throw new Error('Cookie not found')

    response.render('cookies/show', { 
      cookie: cookie,
      readablePrice: readablePrice
    })
  }catch(error) {
    console.error(error)
    response.status(404).send('Could not find the cookie you\'re looking for.')
  }
})
```

We added a single-line condition that checks if there is no cookie `!cookie`, and if that's the case, we `throw` a `new Error` with a custom error message. If you now try to access a page that doesn't exist (e.g., [/cookies/rth92734hids](http://localhost:3000/cookies/rth92734hids)), you should see our custom error show up in the console and in the web browser, see the message "Could not find the cookie you're looking for."

## Recap

You now know how to render records from the database. You know how to either get all of them, a filtered subset, or just a single one. On top of that, you have learned some context around how to work with records in routes and how to handle errors might they occur. 

## 🛠 How to practice

To practice this concept a bit more, create a new page to render news about your shop. 

* If you haven't done this already, follow the steps from the previous lessons to create a model `NewsItem` with the properties `title`, `content`, and `date`. You should also have a page (e.g., `/news/new`) to create new records and maybe go ahead and populate the database with a few records.
* Create a new page to render all the news, e.g., `/news`.
* In the route function, grab all the news and display them on the news page

In your separate project, practice more by creating both an **index** page to render all records from a single collection and a **show** page to render just one item queried either by an **id** or a **slug**.