---
title: Middlewares
slug: middlewares
description: Learn about the purpose of middlewares by adding a logger to an Express backend.
lastUpdate: September 20th, 2022
sectionIndex: 0
groupIndex: 1
---

One core aspect of Express is the concept of **middleware**. A **middleware** is a piece of code _in the middle_ - between the **request** and the **response**.

It's not absolutely required to use middleware. So it's not the most important topic to learn early. But almost all Express projects make use of middleware, and the general concept doesn't take too long to explain. It's also a useful feature to know for upcoming lessons. 

## What is a middleware

Middlewares are JavaScript functions that run on the server **whenever a request comes in** but **before the route function** is executed. You generally use them for things that affect multiple or all routes of your platform. 

![illustrating middlewares](/assets/content/express-tutorial/v1/1-2-3-middlewares/middlewares.png)

### Building a logger middleware

To best understand how middleware works, let's build our own basic middleware. One of the most common middleware in applications is a **logger**. A logger is used to print in the console or write to so-called **logfiles** any activity on the server you'd like to keep track of. 

Usually, at the bare minimum, people will log whenever a request comes in, paired with some information about it. So we'll do exactly that. 

In the root folder of your project, create a new folder called **middleware**. In it, add a file called **logger.js**. 

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
        📁 middlewares
        <ul>
          <li>📄 logger.js</li>
        </ul>
      </li>
      <li>📁 node_modules</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

>💡 There are varying standards for how to organize the code of your project. You don't **have to** use a folder called "middlewares". You can even write your middlware code write in the **app.js** file. 
>Using a separate folder is generally a good idea, though, to keep your code more readable. Calling that folder "middlewares" is one common way to do it. So that's why it's suggested here.

A middleware function looks very much like a route function with one addition. Here is our logger function that you can add to the **middlewares/logger.js** file:

```js
export const logger = (request, response, next) => {
  console.log(
    new Date().toUTCString(), 
    'Request from', 
    request.ip, 
    request.method,
    request.originalUrl
  )
  next()
}
```

If you didn't know yet: You can add multiple parameters to the same `console.log()` and they will all be printed out within the same line and separated by spaces. 

In our example, I print the current date and time with `new Date().toUTCString()` (a built-in JavaScript function to get the current time and date in a human-readable format). Then, I print the string `Request from`, followed by the IP address of the client (one of the many useful properties of the `request` object), and lastly, the **HTTP** method** (`request.method`) and the path that the client has requested with `request.originalUrl`. 

As you can see, you have access to the same `request` and `response` objects that you also have in route functions. But there is one more parameter that you may not know yet: `next`. 

The `next` parameter is a **function**. So it has to be called with parentheses like this: `next()`. The `next()` function represents all the functions that will be executed **after** this middleware. It tells Express to move on either to the next middleware (if there are multiple) or to move on to execute the route function now. 

>💡 It's important to keep in mind, though: `next()` is not the same as a `return` statement. So it does **not stop the function**. So you could even put it **before** the `console.log()` and the `console.log()` would still be executed - just **after** the followup code (such as other middlewares or route functions) are executed. 
>
>This functionality can be useful whenever you want to have a middleware perform some code that is **not needed for the response** and can just run in parallel to the rest of the application and in the background. 

To actually use the middleware, you need to first import it into your **app.js** file: 

```js
import { logger } from './middlewares/logger.js'
```

Then, before the route functions but somewhere **below** the `const app`, add the following line: 

```js
app.use(logger)
```

That's it. That's all it takes to add the middleware to your application. If you now make requests to your server, you should start seeing in the Terminal lines pop up that looks like this: 

```
Thu, 11 Aug 2022 07:37:16 GMT Request from ::1 GET /
Thu, 11 Aug 2022 07:37:17 GMT Request from ::1 GET /cookies
Thu, 11 Aug 2022 07:37:20 GMT Request from ::1 GET /cookies/chocolate-chip
```

>💡 The IP address just says `::1` because I access the server from the same computer. If you were to access the server from another computer, it would show another IP address.

## Third-Party Middleware

In addition to writing your own middleware, there is a multitude of middleware written by others that you can use in your project. Express has various middlewares, including one that handles logging in a more comprehensive way - called [morgan](http://expressjs.com/en/resources/middleware/morgan.html).

Another very popular middleware can be used for error handling, called [errorhandler](http://expressjs.com/en/resources/middleware/errorhandler.html)

You can find a complete list of Express middlewares plus some additional third-party middlewares in the [official documentation](https://expressjs.com/en/resources/middleware.html). How you use each one of them should usually be documented in the middleware's documentation. 

## Recap

That's already it. Middlewares don't do much other than adding some code logic in the middle between the **request** and the route functions. You can insert as many middlewares as you like. But the most common ones are probably related to **logging** and **authentication**. 

## 🛠 How to practice

If you haven't already, as part of the lesson, add a logger middleware to the cookie shop. 

To further practice the concept of middlewares, try to also add a logger to a separate project. 
