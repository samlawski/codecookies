---
title: Response Types
slug: response-types
lastUpdate: August 22nd, 2022
sectionIndex: 0
groupIndex: 2
---

Most web backends work based on a **request-response** cycle. This means the backend will be idle and not do anything until it receives a request from a client. A request could be a user typing the URL to your website in the web browser and the browser sending an **HTTP GET request** to your backend for the specified path. The browser then will wait and show a loading animation until the backend has run some code on the server and finally returns a **response** to the client. After that, the server goes back to being idle and waiting for the next request. 

In reality, this process takes milliseconds and servers get thousands or millions of requests. But the general process remains the same. _(There are exceptions such as push notifications and web sockets. But those are advanced concepts relevant much later.)_

In this lesson, we're going to look at the **response** part of the cycle and what kind of responses you can return to the client. 

There are a wide variety of options to respond with. Which one to choose depends on your app and the client consuming the response. 

## The Client

Express runs on a web server. Therefore it's considered the **backend**. A **client** is called the software that makes a request to a server. 

A common type of client is a web browser. But a client can also be a mobile app, a web frontend application, a game, a robot, or a fridge. A client can be anything that is able to send a **request** to a web server. Even web servers can act as a client while making requests to other servers. 

When building a web backend (e.g., with Express), you have to consider what kind of client will use the backend. Because different clients also expect different **responses**. 

For example, a web browser most likely expects a **response** containing some **HTML** code. A mobile or web frontend application, however, may expect a **response** formatted as **JSON** (more on that below).

## The Response Object

This is a typical, simple Express route function:

```js
app.get('/cookies', (request, response) => {
  response.send('Here you find all the cookies.')
})
```

Express provides both a `request` and `response` parameter in each route function. Just like the `request` object, the `response` object comes with a bunch of methods and properties predefined by Express. You can get an overview [in the official documentation](http://expressjs.com/en/5x/api.html#res).

In the example above, you already see one method `response.send()`. This is a generic function that returns any kind of data as a response back to the client. In this case, it's just text. No HTML, no JSON, no file, just text. And you can open it in the web browser to see the response.

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
    Here you find all the cookies.
  </main>
</div>

## HTTP response status codes

The nice thing about response methods is that they can be **chained**. That means you can use multiple functions with the same `response` object. 

One common use case for this is to add **status codes** to your response. And this is what it looks like: 

```js
app.get('/cookies', (request, response) => {
  response.status(200).send('Here you find all the cookies.')
})
```

Or for better readability: 

```js
app.get('/cookies', (request, response) => {
  response
    .status(200)
    .send('Here you find all the cookies.')
})
```

Both the `status()` and the `send()` function are **chained**. 

But what is this **status code**? Status codes are a way to quickly signal to the client if the request was successful or if there was some issue with it. By default, and if you don't specify a status code, the response status code will be `200`. That number stands for "Everything is ok." 

You likely have already come across the famous status code `404`. That's an error status code representing that no content was found at the requested URL. 

A full list of all status codes can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

You don't need to know them all. And for successful routes, you don't need to specify them. They do become important whenever you want to signal to the client that there was an error on the backend. But you'll learn more about that in a later lesson.

## Responding with JSON data

If the client is a web frontend built with React or a mobile app, a common response type is **JSON**. 

JSON is a popular language to represent **structured data**. It's so popular because it essentially just looks like a standard JavaScript object. The main difference is that the **keys** all have to be **strings**. 

For example, this is a JavaScript object: 

```js
{
  name: "Chocolate Chip",
  price: 3.50
}
```

And this is the same object formatted as JSON: 

```json
{
  "name": "Chocolate Chip",
  "price": 3.50
}
```

You can see it looks very similar. Just the keys `name` and `price` are strings with quotes around them. 

This kind of format is useful if the user interface (UI) is all handled separately - for example, in the mobile app code or frontend code. It's common to then just send back and forth the data that you need. 

To define a JSON respnse instead of `response.send()` we'll use `response.json()`. And instead of adding a string as a function parameter, we add a **JavaScript object**.

```js
app.get('/api/v1/cookies', (request, response) => {
  response.json({
    cookies: [
      { name: 'Chocolate Chip', price: 3.50 },
      { name: 'Banana', price: 3.00 }
    ]
  })
})
```

Express is smart enough to convert that to the correct JSON format. 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/api/v1/cookies" target="blank">
        localhost:3000/api/v1/cookies
      </a>
    </div>
  </header>
  <main>
    {
      "cookies": [
        { "name": "Chocolate Chip", "price": 3.50 },
        { "name": "Banana", "price": 3.00 }
      ]
    }
  </main>
</div>

Technically, instead of `response.json()` you can still just use `response.send()`. Express is still smart enough to recognize that you want to respond with JSON. Nonetheless, it's often good to be more specific in your code.

>💡 In the example, we defined the route as `/api/v1/cookies`. That's not required but a common practice. When you build a backend that (partially) responds with raw data (e.g., as JSON) that's called an **API**. That's why it's a common practice to signal the fact that this is an API response in the URL. 
>The `/v1` is another common practice people use with APIs. Imagine, people are using your API but you want to make changes to it later. If you removed anything or changed the name of any of the keys, the API will most likely break for the clients using it. For that reason, people started using version numbers in the URL. This way, when they make changes, they give those changes a newer version and clients can continue using the old API until they are ready to transition to the newer version.
>Don't worry, if this does not make too much sense right now. APIs will be covered separately later. 

## Responding with HTML

One of the most common clients accessing web backends is the **web browser**. Web browsers are built to understand and render **HTML** code. So one of the most common response types is HTML code. 

From the server's perspective, HTML is just text. Express doesn't need to interpret HTML. So it just treats it like any other text. Only once the HTML arrives at the client the web browser will interpret it and render a website based on the HTML code. 

That means you can just write HTML in your response text, and the web browser will recognize and do something with it. 

Let's try it out and change our cookies overview page: 

```js
app.get('/cookies', (request, response) => {
  response.send('<h1>Cookies</h1><p>Here, you will find all the cookies!</p>')
})
```

Your web browser should now automatically render the different parts of the text response formatted according to the HTML. 

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
    <h1>Cookies</h1>
    <p>Here, you will find all the cookies!</p>
  </main>
</div>

The web browser can do that because the **response** sent back to the browser is just a string, just text, containing the HTML code. If you were to use a different client other than a web browser to make the request, you would just see the HTML code. 

You can try it out using **cURL**. While the web server is running, open another Terminal window and type in 

```
curl localhost:3000/cookies
```

`curl` is a command that makes an HTTP request to a URL that you specify. You can learn more about it [in this short tutorial](/development-basics/curl).

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
    > curl localhost:3000/cookies<br>
    <br>
    &lt;h1&gt;Cookies&lt;/h1&gt;<br>
    &lt;p&gt;Here, you will find all the cookies!&lt;/p&gt;
  </main>
</div>


If you use JavaScript's template literals, you can even spread the HTML response code onto multiple lines for better readability: 

```js
app.get('/cookies', (request, response) => {
  response.send(`
    <h1>Cookies</h1>
    <p>Here, you will find all the cookies!</p>
    <ul>
      <li>Chocolate Chip</li>
      <li>Banana</li>
    </ul>
  `)
})
```

You can see in the example that it was much easier for me to add some additional HTML code and still keep it readable. 

But still, you may know that this is incomplete HTML code. Usually, HTML contains a lot more code and includes, for example, a `<header>` element. Also, for larger pages, this approach might get quite verbose quite quickly. That's why Express comes with even more convenient ways to respond with HTML, and you'll learn about it in a future lesson. 

## Responding with files

Sometimes you want Express to respond with files. Those can be images or videos, but also code such as CSS, JavaScript, and even HTML. Because this is such a core concept, you'll also learn about that in its own lesson.

But there is also another type of file response. That's for when you want to trigger a file download in the client browser. For that, you can use the `response.sendFile()` function. You can learn more about it in the [documentation](http://expressjs.com/en/5x/api.html#res.sendFile).

## Recap

In this lesson, we looked at everything related to **responses**. A response is just raw data and you can define what this data should be. Should it be structured data like **JSON**? Or should it be **HTML** that can be interpreted and rendered by a web browser? What kind of response you need is often determined by the type of client making the request. 

Express offers a variety of ways to respond and lets you set custom status codes. If you get stuck or try to remember how something works, don't forget to check the [documentation](http://expressjs.com/en/5x/api.html#res).

## 🛠 How to practice

* Update the cookie shop and make sure it has the following routes
  * `/`
  * `/about`
  * `/contact`
  * `/cookies`
  * `/cookies/:slug`
* Update the `response` of each of the above routes to include some HTML code. 
* Add two API routes to your cookie chop: 
  * `/api/v1/cookies`
  * `/api/v1/cookies/:slug`
* Each API route should respond with JSON

>**Advanced Task**
>If you haven't already, in your **app.js** create a variable containing a list of cookie objects. Each cookie object should have at least a `name`, `description`, and a `price` property. Also, each object needs to be identifyable by a `slug` (either by adding it as a property or setting the list to be an object where each key is the slug.)
>Set both HTML responding routes `/cookies` and `/cookies/:slug` to respond with some details about the cookies. 
>Set the two API routes to respond with the raw data about the cookies. `/api/v1/cookies` should return a full list of all cookies. `/api/v1/cookies/:slug` should provide only the data from an individual cookie as JSON - based on whatever slug was provided. 
>If `/api/v1/cookies/:slug` is accessed and the slug provided as `:slug` is not a slug matching any of the cookies in the backend, return an error status code `404` and error message to the client.

To practice what you have learned, try to add a few new endpoints to your second application - or update the existing ones. Set some routes to responding with HTML code and see what it looks like in the browser. Set at least one route to respond with structured JSON data. 
