---
title: Query Strings & Form Data
slug: query-strings-and-form-data
description: Learn to send data from any frontend or client to an Express backend via HTML forms or URL parameters.
lastUpdate: September 20th, 2022
sectionIndex: 0
groupIndex: 1
---

**Requests** made to a server usually contain the **URL** (e.g., `/cookies`) and the **HTTP method** (e.g., `GET`). Those are automatically sent to the server and used to determine the route. But requests can contain additional information. 

Imagine, for example, a user types in a search term in the search engine of their choice and then clicks the "Search" button. In that moment, a search **request** is sent to the server. But the server needs to know which term to search for. Sure, you could probably add the search term to the URL (e.g., like `/search/cat-pictures`). But a cleaner approach would be to use the (specifically for this purpose designed) **query strings**. 

**Query strings** are just one example of how you can add data to requests. In this lesson, we'll talk about those and how to send data using **HTML forms** to the server.

## Query strings and how to read them

**Query strings** are pieces of data you can add to URLs in addition to the path. In essence, query strings are **key-value pairs**, similar to **JavaScript objects** or **JSON**. Except, as their name suggests, they are technically just **strings**. That means you cannot create nested structures. But you can add multiple **key-value pairs** to the same string. 

Here is an example of what the `/cookies` path could look like if we added a query string to it: 

```
/cookies?limit=4
```

You add query strings by adding a question mark `?` at the end of the URL followed by the **query string**. Here, the query string contains a single **key** `limit` and the connected value `4`. Each **key** should be followed by an equal sign `=`, followed by the **value**.

You add multiple **key-value pairs** by separating them with the `&` character. Here is an example: 

```
/cookies?limit=4&order=asc
```

To access the query string, you can call `request.query` in your route function. To try it out, add a `console.log()` to any of your route functions (before the response). For example: 

```js
app.get('/cookies', (request, response) => {
  console.log(request.query)

  response.send('Here you soon find all my cookies!')
})
```

If you now access that page (make sure you actually open the route where you put the `console.log()`!) under [localhost:3000/cookies?limit=4&order=asc](http://localhost:3000/cookies?limit=4&order=asc), you should now see a JavaScript object show up in the Terminal that contains the same **key-value pairs** as the query string. 

<div class="demowindow demowindow--cl" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      Command Line
    </div>
  </header>
  <main>
    { limit: '4', order: 'asc' }
  </main>
</div>

Try out a few more different variations. Play around with the query string to get a feel for how it works! Don't worry about breaking anything. Here are some examples of what to try: 

* [localhost:3000/cookies?limit&order](http://localhost:3000/cookies?limit&order)
* [localhost:3000/cookies?hello=world](http://localhost:3000/cookies?hello=world)
* [localhost:3000/cookies?hello==&&test===42](http://localhost:3000/cookies?hello==&&test===42)

## Common use cases for query strings

Query strings can be used for all sorts of things. Go to your favorite search engine website and try searching for something. Then, take a moment to look at the URL in the web browser and see if you can make sense of the query string you find there. Most websites will add all sorts of weird meta data to the query string. But you should be able to find your search term in there as well. 

Here is a totally incomplete list of some examples of query strings and what they would look like: 

* **Search** `/cookies?q=chocolate` (often using the `q` key) 
* **Filter** `/cookies?filter=nonuts` (filter records displayed on a page by some parameter)
* **Limit** `/cookies?limit=10` (limit the number of records shown on a page)
* **Pagination** `/blog?page=1` (often used on pages with lots of content - like blogs - where you don't see a list of all records on a single page but instead, they are split into multiple pages)
* **Order** `/cookies?order=asc` (ordering records, usually using shortened versions of "ascending or "descending") 

Those are just some examples to give you an idea of what query strings are useful for. There are many more examples, and in many cases, they are combined. 

## Adding a form to your HTML

Another common way to send data to backends is through forms. Many websites have contact forms, social media websites let you create posts through forms, or even search engines use forms - even if the form contains only a single field. 

HTML forms let you define various things. The `<form>` tag lets you set an `action` attribute with which you define the URL to which the form is supposed to be sent. It also lets you set a `method`, defining which **HTTP method** should be used for the **request**.

You could, for example, make a **POST** request to the `/contact` route. Another example you can see below:

```html
<form action="/search" method="GET">
  <input type="text" name="search" />
  <button>Search</button>
</form>
```

In a search engine, you may want to specify the **HTTP method** `GET` because your goal is not to _write_ data to the database. Instead, you'd like to _get_ some data from the database given your search term. You see, it's best practice to use URLs and HTTP methods in a meaningful way. 

The example above includes a single `input` field with the name `search`. Another slightly more complex form example you can see here: 

```html
<form action="/contact" method="POST">
  <input type="text" name="name" />
  <input type="email" name="email" />
  <input type="tel" name="phone" />
  <textarea name="message"></textarea>

  <button>Send</button>
</form>
```

In this example, we have multiple fields of varying types and a `textarea` for a longer message.

To try it out, take a moment to add a contact form to a static HTML file. For now, you can just add a **contact.html** file in your static files folder (e.g., **/public**). You can always replace that file later. For now, it allows you to quickly try out how HTML forms work. 

Here is some example code: 

```html
<html>
  <head>
    <title>Contact</title>
  </head>
  <body>
    <h1>Contact</h1>
    
    <form action="/contact" method="POST">
      <input type="text" name="name" placeholder="name" /><br />
      <input type="email" name="email" placeholder="email" /><br />
      <textarea name="message" placeholder="message"></textarea><br />

      <button>Send</button>
    </form>
  </body>
</html>
```

You already know how to define routes in Express to accept those form requests. But how do you now get the data?

## Getting form parameters on the backend

Reading data that was sent to the Express server with an HTML form is similarly straight-forward as using query strings. It's important to note that it works differently depending on the **HTTP method**. 

If you set your HTML form's `method` attribute to `"GET"`, the web browser will automatically add the form data as a **query string** to the URL. For example, the browser will automatically create a URL that looks as follows when submitting the search form from before: 

* `/search?search=mysearchterm`

```html
<form action="/search" method="GET">
  <input type="text" name="search" />
  <button>Search</button>
</form>
```

On the other hand, if you submit the contact form that has a `method` of `"POST"`, the URL will look like this: `/contact`. Instead of adding the form parameters to the URL, the browser will add them to the **request's body**. 

The **body** is a general purpose part of any **request** and **response**. It's specifically there to add any kind of data. **Responses** usually use the **body** to include the HTML code returned to the browser, for example. 

To access the `body` of the **request**, you can use `request.body` in any route function. 

However, if you do that right now, it won't work. For security reasons, Express has deactivated all **body parsing** by default. To activate parsing for form data, you have to activate another built-in **middleware**. Add it anywhere close to where other **middleware is used**:

```js
app.use(express.urlencoded({ extended: true }))
```

`express.urlencoded()` is the specific **middleware** for reading data sent through **HTML forms**. Setting the parameter `{ extended: true}` will give you some [practical extra formatting options](http://expressjs.com/en/5x/api.html#express.urlencoded). It's not necessary but helpful to always set. 

>💡 Express comes with a few more **middlewares** for parsing the `request.body`. For example, when building an API, you may want to accept [JSON data in the body](https://expressjs.com/en/api.html#express.json). You can also accept raw files and more. Take a look at the [documentation](https://expressjs.com/en/api.html#express.raw) to find out more. 

To test it out, let's keep working on our contact form. You already added a contact HTML page. Now, we need to adjust the route in **app.js**. Later, you may want to store the contact form data in a database or send it as an email to you. For now, however, let's just add it to the logs: 

```js
app.post('/contact', (request, response) => {
  console.log('Contact form submission: ', request.body)
  response.send('Thank you for your message. We will be in touch soon.')
})
```

Now, go to the contact page, fill out the form, and hit the "Send" button. If everything went well, you should see the form submission show up in the server logs. 

>💡 Remember, that the route of your contact page depends on how you have set up your static file serving middleware. 
>In the context of this tutorial, we have set the route to `/assets`. So the route to your contact page could be [localhost:3000/assets/contact.html](http://localhost:3000/assets/contact.html). 
>But keep in mind that it depends very much on your setup.

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/assets/contact.html" target="blank">
        localhost:3000/assets/contact.html
      </a>
    </div>
  </header>
  <main>
    <h1>Contact</h1>
    <input type="text" name="name" placeholder="name" value="Sam" /><br />
    <input type="email" name="email" placeholder="email" value="sam@example.com" /><br />
    <textarea name="message" placeholder="message">Hey! I like cookies!</textarea><br />
    <button>Send</button><br /><br />
  </main>
</div>

The logs may show something like this: 

<div class="demowindow demowindow--cl" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      Command Line
    </div>
  </header>
  <main>
    Fri, 12 Aug 2022 14:06:52 GMT Request from ::1 POST /contact<br />
    Contact form submission:  {<br />
    &nbsp;&nbsp;name: 'Sam',<br />
    &nbsp;&nbsp;email: 'sam@example.com',<br />
    &nbsp;&nbsp;message: 'Hey! I like cookies!'<br />
    }<br />
  </main>
</div>

## Recap

You now know two very important ways to send data from the client-side to the backend. You learned about **query strings**, a very common way to pass additional information to **HTTP GET requests**. And you learned how to use **HTML forms** and read their data when send either as an **HTTP GET request** (and turned into a query string automatically) or as an **HTTP POST request** (and added to the **request's body**).

## 🛠 How to practice

To practice what you have learned, let's add a **search route** to the cookie shop. It will not actually search anything just yet because we don't have any database or other type of data storage set up. But that's not a problem as we focus on practicing sending data to a server for now. 

* Create a new `GET` route and call it `"/search"`
* In the route function, read the query string and store it in a variable
* When a user uses a URL with a search query (e.g., http://localhost:3000/search?q=test), return the search query back to the user as part of the response

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/search?q=test" target="blank">
        localhost:3000/search?q=test
      </a>
    </div>
  </header>
  <main>
    You searched for: test
  </main>
</div>

>**Advanced Task**
>To practice building a form, try to add a static HTML page that includes a form for the admin of your website to add new cookies to the shop.
>The form should have several fields: `name` (text), `price` (number), `description` (textarea). 
>
>In a real application, a good **RESTful** route for this would be `GET /cookies/new`. But since we haven't covered how to use HTML in Express routes just yet, you may want to just use a different **temporary** static HTML page. Later, you can transfer the code and fix the route.
>
>As a result of this advanced task, users should be able to access the page and submit a form. You can either print out the contents of the form in the `console` of the server. Or you can add them to the `response` and display them back to the user. 
>Like with the task before, you haven't learned how to use a database yet. So this task is only about sending the data. It won't be saved anywhere just yet. 