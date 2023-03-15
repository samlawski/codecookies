---
title: REST & Dynamic Routing
slug: rest-and-dynamic-routing
description: Learn handle multiple pages with the same layout but different content and URL - such as blogs or shops.
lastUpdate: September 20th, 2022
sectionIndex: 0
groupIndex: 1
---

Imagine you want to build a backend for a blog. Over time, a blog will accumulate many articles, and each article should be available with its own URL. So you might end up with a backend that needs many different routes like those: 

```
mygreatblog.com/articles/the-first-article
mygreatblog.com/articles/a-topic-i-find-interesting
mygreatblog.com/articles/a-crazy-story
mygreatblog.com/articles/you-wont-believe-what-happened-then
```

You get the idea. 

Now, imagine you had to define a new route in Express every single time you wanted to publish a new blog article.

```js
app.get('/articles/another-grat-article', (request, response) => {
  response.send('The article text [...]')
})
```

This would turn into a lot of code very quickly. And additionally, it would be quite the effort to update the code and deploy the entire application every time a new article should be published. 

For that purpose, Express supports so-called **route parameters**. How they work and how they can simplify defining routes for large sets of data we're going to look at in this lesson. 

## RESTful API design

Before we define the routes of our application _(meaning, the URL paths that clients use to access the backend)_ we need to know what those routes should even look like. 

>⏭ You may skip to the next section ["Route parameters in Express"](#route-parameters-in-express) if you're already familiar with the topic of RESTful API design. It's intended for complete beginners.

Who says my blog article URL should be `mygreatblog.com/articles/some-article-title`. Since I can put anything in the string of the `app.get()` method I want, I have a whole variety of options: 

```
mygreatblog.com/articles/some-article-title
mygreatblog.com/article/some-article-title
mygreatblog.com/blog/some-article-title
mygreatblog.com/category-name/some-article-title
mygreatblog.com/2022/09/some-article-title
mygreatblog.com/some-article-title
```

These and many more formats are used by different websites all over the web. So who says which one I should use? 

One pattern that has become a standard across many different web backends is called **REST (Representational State Transfer)**.

**REST** is a convention. Like with many other things in programming, it's not a hard technical requirement. You have all the freedom to design your software differently. But patterns like these have proven to be effective, and they make your code or application more understandable to other developers because you use a pattern that others most likely know as well. Even more importantly, if you write software that's being used by another software (like a backend to a game or mobile app), chances are, the client relies on you (the backend) using the **REST**ful standard. 

We won't go into all aspects of **REST** here. But I mention it because **REST** also helps you define URLs. Following **RESTful** principles, you'd define routes based on the main data resource or **collection** that is being interacted with. 

A page that shows an overview of all the articles would have the route `/articles`. Since a single article is part of the **collection** of articles, an individual article route is represented as a sub-path of `/articles` like this: 

`/articles/some-article-title`

You can think of it as the folder structure on your computer. You may have a folder called "articles". In that folder, you have several document files where each file name is the name of the article. So the path to each of those files would be `/articles/some-article-title`. Note that `articles` are plural as that's the name of the collection (or _folder_ in our example). So the path is **not** `/article/some-article-title`. 

Combining **REST** with [what you have learned about **HTTP methods** before](/express-tutorial/v1/basic-routing#http-methods), let's look at an example of **REST**ful routes in a task-list application: 

```
GET    mytasks.app/
GET    mytasks.app/tasks
POST   mytasks.app/tasks
GET    mytasks.app/tasks/task-1
PATCH  mytasks.app/tasks/task-1
DELETE mytasks.app/tasks/task-1
```

In the list above, we see three different paths. But some of them show up multiple times. That's because each path can have different functionality based on the **HTTP method** used.

You see here a very small **RESTful** example of the routing for a task-list application. The first path is a landing page. With the browser, you make a `GET` request to that page by default. You can also `GET` the full list of all the tasks. On that page, you maybe have an **HTML form** with which users can create new tasks to be stored in the database. According to **REST**, you'll represent that route with a `POST` method but use the same path to the entire collection - because you intend to **POST** a new task to the entire collection of tasks.

Finally, I can click on a task to see a detailed view of just a single task. So I can `GET` an individual task with the ID of `task-1` from the `tasks` collection. But I can also edit the task with `PATCH` or delete it with `DELETE`, all with the same URL.

And that's it. With that basic rule, most applications can be represented as URLs. 

Of course, there are exceptions. And, of course, in larger applications, you'll run into situations when **REST** doesn't fit any more perfectly. But as you're learning, it's important to get the basics down of how **REST** works before you move on to bending the rules. 

## Route parameters in Express

The examples we looked at above, both have a **dynamic** component in the URL. 

Express uses a common pattern to let you define dynamic routes.

Here is an example: 

```js
app.get('/cookies/:id', (request, response) => {
  const cookieId = request.params.id

  response.send(`You chose the cookie with the ID of ${cookieId}`)
})
```

Add this function to your own Express app and then access the following few routes in the web browser: 

* [localhost:3000/cookies/1](http://localhost:3000/cookies/1)
* [localhost:3000/cookies/42](http://localhost:3000/cookies/42)
* [localhost:3000/cookies/banana](http://localhost:3000/cookies/banana)
* [localhost:3000/cookies/chocolate-chip](http://localhost:3000/cookies/chocolate-chip)

Try out a few more. Just change whatever comes after the `/cookies/` part of the URL.

With the colon `:` we are signaling to Express that a dynamic **parameter** is coming. This parameter effectively works like a variable. But instead of you as the developer defining the variable, the user who sends the request can define it. 

This is a very simple way to use URLs to allow users to pass information to the backend. 

To then access this **parameter** defined in the _request_ (of a user or client), we can use the `request` object. Remember, every time a request is sent to the backend, the route function is executed. And Express provides data about the request through the `request` object (one of the two parameters of the function). That object contains a lot of useful information. And the first one we are using now: `params`. 

`request.params` represents an object with all the parameters of the URL. We write `request.params.id` because we called the parameter `:id` in the path. But we are in control of calling it whatever we like. We could also change the parameter name to something completely random like this: 

```js
app.get('/cookies/:shazam', (request, response) => {
  const cookieId = request.params.shazam

  response.send(`You chose the cookie with the ID of ${cookieId}`)
})
```

Remember, parameters are like variables or like parameters in functions. _You_, as the developer, define what they are called. 

>💡 **Importantt**: The order at which you write your dynamic functions matters! Express will try to interpret routes in the order you wrote them. 
>Sometimes you want all routes that start with `/cookies/` to go to dynamic pages **except for some specific ones**. For example, maybe you want to allow users to access a page called `/cookies/how-they-are-made`.
>
>If, in your code, you wrote `app.get('/cookies/:slug'` first and further below you have a function `app.get('/cookies/how-they-are-made'`, that second function will actually never be called. Because if a user types `/cookies/how-they-are-made` in the web browser, it'll be matched by the function that you wrote targeting `/cookies/:slug`. `'how-they-are-made'` will represent the `slug`.
>But if you write the `app.get('/cookies/how-they-are-made'` function **above** the `app.get('/cookies/:slug'` function in your code, this route will be interpreted first and therefore take priority over `/cookies/:slug`. 
>Keep that in mind whenever you use parameters and dynamic URLs. The order matters. 

## Types of route parameters

In most cases, when dealing with **route parameters**, you deal with a collection of data such as tasks, blog articles, users, bank accounts, etc.

To represent a single item of a **collection** in route, you need a **unique identifier** that can be used as part of a **URL**. There are a few different types: 

### A unique numeric ID

This is the most common approach and a standard in many frameworks. Using this method, each item in a data collection is represented by a **unique integer**. So, in our task-list example, each newly created task will automatically get a new number as its **unique ID****. So the URLs to view the details of each individual task would be:

```
/tasks/1
/tasks/2
/tasks/3
```

This is a common method for non-sensitive data such as tasks in a task list. It's very easy to integrate because many databases apply incrementing numbers as unique IDs to database records by default. 

### A unique alpha-numeric string (uuid)

In some situations, you don't want people to be able to guess the ID of other database records. This could be the case for sensitive information such as _user data_. In that case, a common practice is to use a so-called **uuid** as an ID for each record. This is what they could look like: 

```
/users/8166b0f3-d8a2-4599-9c6c-e56c3eb32cd8
/users/adafa78d-a49e-4acc-b77a-b41fb5e5e3f2
```

They are unique but not incrementing and make it near impossible to guess the ID of other records. Therefore, they are considered more secure. 

### A "slug"

The final very common method is to use **slugs** 🐌. A slug is a string that is readable and understandable to humans but still formatted in a way that it's compatible with the required formatting of a URL: 

```
/articles/how-long-slugs-live
/articles/the-anatomy-of-snails
```

Slugs are often used in contexts where the URL should give some information about what to expect on a particular page. Therefore, they are particularly useful in the context of newspaper websites or blogs. 

One general rule of thumb on **how to format slugs** is: to use **only english** numbers, letters, and dashes**.

Don't use spaces or special characters besides dashes and underscores (although underscores are generally avoided in URLs as well). And keep everything lowercase (this is not necessary but helpful as URLs are not case sensitive anyway).

As you may have guessed, it's much more difficult to make sure slugs are unique. If you have a blog with thousands of articles, it's always possible that someday you will release an article that happens to have the same name as another article. For that reason, when using slugs in a large-scale application, it's a good idea to use a **library** that automatically generates the slugs for you and checks the database for entries with the same name. Most libraries will then just add some random string to the URL, such as `/article-name--4uh9t3u`.

## Nested Routes

There is one more concept to learn about before we complete this lesson. 

Sometimes you want your URL to represent a collection that is part of another collection. For example, each user should have their own task list. So you want your URL of an individual task to look like this: 

```
mytasks.app/users/adaf-a4-b41e/tasks/1
```

This is a **RESTful** representation of a collection that is part of a particular item of another collection.

You can see the URL now has **two parameters**. The first parameter is the **uuid** of the `user`. The second parameter is a unique numeric **id** of a `task`. 

In Express, you define multiple parameters the same way as shown above by just continuing the path:

```js
app.get('/users/:userId/tasks/:taskId', (request, response) => {
  const userId = request.params.userId
  const taskId = request.params.taskId

  response.send(`The user ID is ${userId} and the task ID is ${taskId}`)
})
```

The results should look something like this: 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/users/adaf-a4-b41e/tasks/1" target="blank">
        localhost:3000/users/adaf-a4-b41e/tasks/1
      </a>
    </div>
  </header>
  <main>
    The user ID is adaf-a4-b41e and the task ID is 1
  </main>
</div>

Based on the forward slashes, Express automatically detects where a parameter ends. 

Since these parameters are defined by you and within Express, they are also **case-sensitive** (as you can see in the example). 

>💡 Within the JavaScript world, it's common practice to use [camel case](https://en.wikipedia.org/wiki/Camel_case) when defining variables or parameters that have multiple words in them. Different programming languages have different best practices on this. 

Using nested routes, you can make URLs infinitely long. However, while it's very often quite tempting to use nested routes, in many situations, it's actually better practice to avoid them. URLs are quite permanent. Once you have clients or users use them, you can't easily change them anymore without potentially breaking a link in a client application. Or maybe a user bookmarked the link they were using. So in many cases, it's a good idea to not limit yourself too much with nested routes and instead to keep them generic. 

## Advanced dynamic routes

There are more concepts we haven't discussed here. But Express gives you a few more advanced tools to specify routes. For example, you can use regex and pattern matching to define rules for different routes. Most applications, however, will not need this feature. So if your project happens to be one of the few, you can learn about it in the [official documentation](http://expressjs.com/en/guide/routing.html).

Another topic we haven't talked about is **query strings**. Strictly speaking, query strings don't belong into the category of routing. But they are another way for clients to provide data in URLs to the backend. You'll learn more about them in a later lesson when we discuss forms and APIs. 

## Recap

This lesson was heavy on theory. In terms of coding, you just learned one additional aspect of defining routes. We spent much more time understanding the concept of **REST**, **dynamic parameters**, and **unique identifiers** in this lesson. Those can be hard to understand. So makes sure to practice them in your own code. And don't worry about breaking anything! Nothing bad will happen if it actually breaks. If things do break, read the error message or Google it and try to make sense of it. 

## 🛠 How to practice

If you haven't already throughout this lesson, add two routes to the cookieshop: 

* `/cookies`
* `/cookies/:slug`

Notice that we set the second route to use `:slug` instead of ID. Throughout this project, we're going to use the cookie slug for the URL because it's more human-readable. So if you already created this route earlier in this lesson using the `:id`, I suggest switching to `:slug` instead.

>**Advanced Task**
>In a real application, the route `/cookies/chocolate-chip` would use the **slug** `chocolate-chip` to look up whether a cookie with that **slug** exists in the backend (e.g., in a database or JavaScript object). If it exists, the route would return information about the cookie, such as a description and the price. If no cookie with the provided slug can be found in the backend, the user should receive an error.
>You technically already know all the tools relevant to complete this task. 
>Create a variable containing a list of objects in the **app.js** file. It should be somewhere close to the top and before the routes are defined. Each object should represent a cookie and have the properties `name`, `description`, and `price`. Depending on your data structure, each cookie also needs to be identifyable by a `slug`. 
>
>Next, you need to add some logic to the route function for the `/cookies/:slug` route. The `:slug` should represent the `slug` property of a cookie.
>When a user accesses the page (e.g., `/cookies/chocolate-chip`), inside the route function check if you find a cookie with that slug in the list you created before. 
>If a cookie object exists, return a string with the `name`, `description`, and `price`.
>If a cookie with the provided slug (e.g., `/cookies/cheese`) could not be found, return a string saying that no such cookie could be found.
>
>Here are some examples of what it could look like: 

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
    Chocolate Chip. A tasty, sugary cookie filled with chocolate chips. It costs $3.50
  </main>
</div>

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/cheese" target="blank">
        localhost:3000/cookies/cheese
      </a>
    </div>
  </header>
  <main>
    A cookie with the name "cheese" could not be found.
  </main>
</div>

To further practice what you have learned in this lesson, proceed to your separate project:

* Define a RESTful URL structure for your second project. Try not to use any of the examples from this lesson but come up with your own. It might be helpful to try and limit yourself to just one or two collections for now. 
* Create routes for the structure you defined and use route parameters to make the URLs dynamic
* Add the route parameter to the response of the request to confirm they are working

>**Bonus Task**
>As a bonus, here is a little coding challenge. With some knowledge of basic math and everything you've learned so far you should be able to solve it. 
>As a user, I want to access `localhost:3000/average-of/10/and/5` in the web browser. As a **response**, I want to receive the correctly calculated average of the two numbers `10` and `5`. This same URL should also work with changing numbers. 
>
>Tip: By default, parameters are strings. So you need to find out how to convert strings to numbers in JavaScript for the task to work.)

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/average-of/5/and/10" target="blank">
        localhost:3000/average-of/5/and/10
      </a>
    </div>
  </header>
  <main>
    7.5
  </main>
</div>

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/average-of/1/and/3" target="blank">
        localhost:3000/average-of/1/and/3
      </a>
    </div>
  </header>
  <main>
    2
  </main>
</div>

