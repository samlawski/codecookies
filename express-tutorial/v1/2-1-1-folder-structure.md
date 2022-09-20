---
title: Express Folder Structure
slug: folder-structure
lastUpdate: September 20th, 2022
sectionIndex: 1
groupIndex: 0
---

At one point or another, most applications grow to a size that makes the code hard to manage within a single file. Maybe the application uses multiple routes, some models, and some business logic. To find things easily and keep working efficiently, developers organize code in various files and folders. Larger frameworks such as Nest.js or Django are very opinionated in telling you (the developer) how to organize your code. Microframeworks (like Express) are **not opinionated**. That means you are free to structure your code in any way you like. This can be a good thing. But it also makes it very easy to write messy and hard-to-maintain code. 

Luckily, you're not the first person to encounter this question. In fact, during the decades software development has been around, common **code design patterns** have emerged that most developers consider **best pracitce** these days. 

## MVC - Model View Controller

One of the most common code design patterns is called the **Model View Controller (MVC)** pattern. Following this pattern, you write functions and organize your files in a way that they fall into one of the three categories: **models**, **views**, or **controllers**. 

### Model

**Models** are often **classes** representing a particular data structure, such as a **database collection** or **database table**. For example, if you work with MongoDB and mongoose, you'd create a **schema** for a database collection like this: 

```js
const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true }
})
```

And you'd add this schema to a **model** like this: 

```js
const Cookie = mongoose.model('Cookie', cookieSchema)
```

It's common practice to name models in a **singular** form of the collection or table name. It's also common practice to start the model name with a **capital letter** and proceed in camel case. 

Some examples are: `Cookie`, `User`, `BlogArticle`.

Whenever you need to write code that performs **CRUD** operations on a database collection, you'd add those as functions to the model (or use the functions that are already provided by the **ODM** or **ORM** - like mongoose).

Some examples could be: Getting all blog articles, creating a blog article, filtering blog articles by category, and sorting blog articles by age.

### View

Views are responsible for rendering what the user sees. This would most commonly refer to HTML code mixed in with a **templating language** like EJS. Naturally, views will automatically be organized in separate files because you'll usually keep them in their own HTML or EJS files. 

If you're building a backend API without HTML templating, you'll not have views in the strict sense. However, you'll still probably have some sort of **response** that's sent back to a client. For example, you may have a **JSON** response. In that case, the concept of **MVC** can still be applied. Just instead of a **view**, you may have something called a **serializer**. The serializer's job is usually to generate a structured JSON response. It might be as simple as doing something like this: 

```js
response.json({
  title: blotArticle.title,
  body: blogArticle.body,
  authorName: blogArticle.author.name
})
```

### Controller

It's usually the controller's job to handle the incoming request and outgoing response and connect all the different parts of your application. It's in charge of executing whatever needs to be executed between request and response. 

However, the **controller does not contain any business logic on its own**.

The core purpose of the controller is to connect code. Business logic should always be in its own functions. 

Controller functions are also referred to as **actions**. They are usually directly executed by the **route handlers** of your application. In Express, people sometimes don't differentiate between **route functions** and **controller functions**. Sometimes, however, people keep routes in separate files calling controller functions in their own files. 

A very simple and common example of a controller function is to get a single record from a database and return it to the user: 

```js
app.get('/cookies/:slug', async (request, response) => {
  try {
    const slug = request.params.slug
    const cookie = await Cookie.findOne({ slug: slug }).exec()
    if(!cookie) throw new Error('Cookie not found')

    response.render('cookies/show', { 
      cookie: cookie
    })
  }catch(error) {
    console.error(error)
    response.status(404).send('Could not find the cookie you\'re looking for.')
  }
})
```

In this example, the route and controller are within the same function (instead of two separate places). The **controller** calls the **model** to find a particular `Cookie` record. If it finds it, it returns the rendered **view**. If it doesn't find the `Cookie`, it returns an error.

That's all that the controller does. If you were to have some functions that add additional logic (like processing data before it's displayed in the views), you should keep that in a separate function.

### Beyond MVC

Sometimes you want to add business logic to your application that doesn't neatly fit into any of the three categories **Model**, **View**, or **Controller**. There are a few additional categories that have become popular, and without going into too much detail, I want to mention a few: 

- **Services**: Services are often used for business logic or if you need to run multiple operations within a single controller action. Let's say, for example, whenever a user purchases a product from a website, you want create an order record in the databases, as well as an invoice, and send a payment API request to an external service. Those are quite a few operations to run. You could do all of that in a controller. But a general rule of thumb is to keep the controller slim. It should be very quickly obvious what the controller does and which functions it calls. Therefore, you could put all those separate calls and interactions into a separate service function in a separate folder of your project.
- **Utility**: Sometimes, you need basic functions in different parts of your application. Maybe you want to sort an array in a particular way. Or you want to generate a random number within a certain range. In those cases, utility functions might make sense. They are, in a way, your own personal library of reusable functions.
- **Helpers**: Helper functions are usually functions used in the **views**. They can be pulled in as needed. Let's say, for example, you have a price of an item stored in the database. Maybe you store the price in cents to keep calculations you have to run with the price more reliable and consistent. Users, however, shouldn't see the price in cents. Instead, they want to see the price may even be localized in their own currency. In a situation like this one, you may want to use a helper function. The only purpose of the price conversion is for the **view** - to display it to the user. So you could do the conversion with a helper function in the **view**.
- **ViewModel / Presenter**: Some people would argue that using helper functions is still not an ideal solution because you'd have to call functions containing business logic from the view. Therefore, they've come up with a concept called **ViewModels** (also known as **Presenter** functions). The purpose is similar to helpers. You use them for any logic that needs to be executed exclusively for the **view**. But instead of writing individual functions that can be called in the view, you have a single function or class **per view**. Look at the examples below:

This is what a helper function might look like in Express:

**/helpers/cookie.js**
```js
export const readablePrice = (priceInCents) => {
  return '$' + (priceInCents / 100 )
}
```

**/controllers/cookies.js**
```js
import { readablePrice } from './helpers/cookie.js'

router.get('/cookies/:slug', async (request, response) => {
  const slug = request.params.slug
  const cookie = await Cookie.findOne({ slug: slug }).exec()

  response.render('cookies/show', { 
    cookie: cookie,
    readablePrice: readablePrice
  })
})
```

With helpers, we need to pull in the specific helpers in the views (although there are ways to make this simpler with some templating engines).

A little bit of a nicer approach is to use a **ViewModel**. Here is what that could look like: 

**/view-models/cookie.js**
```js
export const cookieView = (cookie) => {
  title: cookie.title,
  description: cookie.description,
  readablePrice: '$' + (cookie.priceInCents / 100 )
}
```

**/controllers/cookies.js**
```js
import { cookieView } from './view-models/cookie.js'

router.get('/cookies/:slug', async (request, response) => {
  const slug = request.params.slug
  const cookie = await Cookie.findOne({ slug: slug }).exec()

  response.render('cookies/show', cookieView(cookie))
})
```

In this example, you can see how it's the **controller's** job to pull in all the information and combine it together. You import and find the `Cookie` **model** in the controller. But it's not the model's job to convert the price to `readablePrice`. But it's also not the controller's job. Instead, we have a separate **cookieView** object for that. However, it's not the **ViewModel's** job to query data from the database. That's supposed to be done by the model. And it's the controller's job to put it all together. So in the controller function, first, the model is called to get the data. Then, that data is passed as a parameter to the **ViewModel**. There, the data is processed and turned into a structure needed by the **view**. And finally, the controller passes the **ViewModel** to the view and returns the response. 

## Organizing files in Express

While **MVC** is a very popular concept used by the majority of applications, there is a little more variety in how people organize the specific files in Express projects. 

There are various philosophies. But I want to point out two major approaches: 

The first approach was strongly influenced by the popular framework **Ruby on Rails**. Following this approach, you follow the **MVC** pattern very strictly with the overall project structure. You have one folder with all your **models**, one with all your **controllers**, one for all the **helpers**, and so on. 

The second approach developed out of the observation that large-scale applications can contain quite a lot of controllers, models, and other files. Thus, people structured their code around domains or isolated features of the application. This approach has become particularly popular with Python's **Django** framework and is generally quite popular in the Python community. 

When it comes to code organization, there will always be trade-offs. And it's your job as a developer to weigh the different options and pick an approach that works for your code. 

For the sake of this tutorial, we're going to stick to the first approach, as it is a solid way to keep your code clean in small to medium-sized applications. It's also faster and easier to plan than the second approach.

We're now going to go through the complete folder structure and what it could look like. If you've followed the previous tutorials, you can follow the explanations and, in the end, refactor your code to match what you have learned.

### Starting files

Starting out, your project probably needs a **package.json** (the corresponding **package-lock.json** file and **node_modules** folder is going to be created automatically). Furthermore, you'll likely need a **.gitignore** file and a **.env** file. What those are for, we've covered in a different tutorial. 

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop</div>
  </header>
  <main>
    <ul>
      <li>📁 node_modules</li>
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

## Organizing server & config

The name of your application's entry file is up to you. It can be **app.js**, but **index.js** or **server.js** are also common alternatives.

It's generally a good idea to keep thinking about ways to isolate different parts of your code and separate them into different files so that each part only has a **single responsibility**. This can be a challenging task. And always keep in mind: The purpose of these rules is to make you (the developer) more efficient! The rules have no value in themselves.

In the **app.js** file, we `import` `express` and assign it to a variable `app`. We also import all the configuration, middleware, routes, and other functions and connect them to the Express `app`. 

Finally, we start the server with `app.listen()`. _Although, this step could also be extracted into as a separate file if your project grows and needs a more customized server configuration._

It's a good idea to keep a separate folder for various configurations. Your application probably needs some **environment variables**. Those could be initialized there and exported into the rest of your application. This way, you have a single place to keep track of all the **environment variables** and not forget about which one you need. 

Here is an example of a new config file with the path **/config/app.js**:

```js
import 'dotenv/config'

const PORT = process.env.PORT

export {
  PORT
}
```

Back in the **app.js** file, you should **remove** the `dotenv/config` import function. Instead, however, you now need to `import` the new config:

```js
import { PORT } from './config/app.js'
```

Now, find every place where you previously used the variable `process.env.PORT` and **replace** it with simply `PORT` - because that's the variable we now imported from our new config. 

The file looks quite small, now. But it'll grow over time.

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
        📁 config
        <ul>
          <li>📄 app.js</li>
        </ul>
      </li>
      <li>📁 node_modules</li>
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

### Database config

If you have a database set up, you already have another configuration you could extract into a separate config file. First, if you have a `MONGODB_URI` environment variable update the **/config/app.js** accordingly:

```js
import 'dotenv/config'

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

export {
  PORT,
  MONGODB_URI
}
```

Now add a new file: **/config/database.js**

```js
import mongoose from 'mongoose'
import { MONGODB_URI } from './app.js'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('💽 Database connected'))
  .catch(error => console.error(error))

export const db = mongoose.connection
```

Notice, how we import the `MONGODB_URI` file again from the other config. It might seem a little redundant. But in growing projects, having a central file managing all your environment variables will help keep track of all of them. 

Finally, remove the code we added to the **/config/database.js** file from the **app.js** file. Instead, import the database configuration like this: 

```js
import './config/database.js'
```

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
        📁 config
        <ul>
          <li>📄 app.js</li>
          <li>📄 database.js</li>
        </ul>
      </li>
      <li>📁 node_modules</li>
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

## Organizing Models

Models are usually organized to have one model (and schema) per file. You can keep them in a designated **/models** folder. If you, e.g., have a `User`, `Cookie`, and `Article` model, you'd have three files: **user.js**, **cookie.js**, and **article.js**.

If you, for example, have a `Cookie` model, create a new file **/models/cookie.js**:

```js
import mongoose from 'mongoose'

const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true }
})

export const Cookie = mongoose.model('Cookie', cookieSchema)
```

Back in the **app.js**, remove model code. You can also remove the `import mongoose`. Instead, import the model: 

```js
import { Cookie } from './models/cookie.js'
```

Keep in mind that you only need to import what you need. Once you move the route functions into separate files, you'll not need to `import` the `Cookie` model here anymore. 

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
        📁 config
        <ul>
          <li>📄 app.js</li>
          <li>📄 database.js</li>
        </ul>
      </li>
      <li>
        📁 models
        <ul>
          <li>📄 cookie.js</li>
        </ul>
      </li>
      <li>📁 node_modules</li>
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

## Organizing Controllers

Controllers are usually organized in a way that multiple routes related to a single collection are combined into a file together. Here is an example of how the routes of this tutorial's cookie shop could be split up:

* **/controllers/cookies.js**:
  * GET `/cookies`
  * POST `/cookies`
  * GET `/cookies/:slug`
  * POST `/cookies/:slug`
  * GET `/cookies/:slug/new`
  * GET `/cookies/:slug/edit`
  * GET `/cookies/:slug/delete`
* **/controllers/simple-pages.js**:
  * GET `/`
  * GET `/about`
  * GET `/contact`
  * POST `/contact`
* **/controllers/api/cookies.js**:
  * GET `/api/v1/cookies`

If, in addition, you have some specific **API** routes (e.g., `/api/v1/cookies`), you could keep those in a sub-folder called **/controllers/api/cookies.js**. However, there are multiple possible approaches to this. And if your entire application is just an API and you don't have separate routes that render HTML templates, then it wouldn't make sense to create a separate **api** folder. In that case, the API routes could just be the regular controller files. 

Moving route functions into their own files is slightly more complex than moving models or other functions. That's because they use the `app` variable. (E.g., `app.get()` or `app.post()`)

If you were to move the route functions as they are now into separate files, you'd need to somehow get access to the `app` variable. This could get very messy very quickly with [circular imports](https://nodejs.org/api/modules.html#modules_cycles). It's best to avoid those. And luckily, Express offers a simple way to solve it. 

Instead of using the `app` variable, we can also define routes using Express' `Router()` function. To create a controller file for all our routes related to `/cookies`, create a file **/controllers/cookies.js**.

### Using Router()

Remove all the functions related to cookies (see a list above) from the **app.js** file and insert them in the new file. 

Now, at the top of the tile, import `Router` from Express like this: 

```js
import { Router } from 'express'
```

>💡 You'll probably also have to add a couple more `import` statements, depending on which additional dependencies your routes have.
> `import { Cookie } from '../models/cookie.js'`
> `import { readablePrice } from '../helpers/cookie-views.js'`

Below the `import` statements, declare a new variable that initializes the `Router()` function: 

```js
const router = Router()
```

And now, replace all the places where your routes use the `app` variable with `router`. So for example: 

Turn this:

```js
app.get('/cookies', async (request, response) => {
```

into this: 

```js
router.get('/cookies', async (request, response) => {
```

Repeat this process for all controller actions. Do the same thing by creating a **/controllers/simple-pages.js** file. This controller will hold all the general pages of our website. 

>💡 **Importantt**: The order at which you write your dynamic functions matters! Express will try to interpret routes in the order you wrote them. 
>So for example, if higher up in your code file you have a route like this: `/cookies/:slug`, `:slug` will be a dynamic parameter. That means **any** URL with a string following `/cookies` will be matched to **this route function**. This includes `/cookies/chocolate-chip`, `/cookies/hello`, but also `/cookies/new`. 
>If you want to match **all** URLs **except** for `/cookies/new`, you have to make sure to write that route function **above** `/cookies/:slug` in your code.
>
>Having `router.get('/cookies/:slug'` before `router.get('/cookies/new'` will cause `/cookies/new` to throw an error as long as there is no cookie with the `slug` `'new'`. 
>But if you swap the route functions, `/cookies/new` will be interpreted before `/cookies/:slug`, allowing you to show a custom page and only matching all other routes of `/cookies/:slug`.

In the end, make sure to `export` the `router` function! Add the following line at the end of the new controller files: 

```js
export default router
```

### Connecting the router as middleware

After you've done all this, your **app.js** shouldn't contain any more route functions. So we now need to connect the router to the Express app. Express uses the same format as you've seen for [middlewares](/express-tutorial/v1/middlewares/) for that.

First, import your new controller files: 

```js
import simpleRoutes from './controllers/simple-pages.js'
import cookiesRoutes from './controllers/cookies.js'
```

Now, you can add them to the application using `app.use()`:

```js
app.use(simpleRoutes)
app.use(cookiesRoutes)
```

If you restart the server now, your pages should still show up as they did before. But your code looks much more organized. Particularly the **app.js** is much smaller now.

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
        📁 config
        <ul>
          <li>📄 app.js</li>
          <li>📄 database.js</li>
        </ul>
      </li>
      <li>
        📁 controllers
        <ul>
          <li>📄 cookies.js</li>
          <li>📄 simple-pages.js</li>
        </ul>
      </li>
      <li>
        📁 models
        <ul>
          <li>📄 cookie.js</li>
        </ul>
      </li>
      <li>📁 node_modules</li>
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

### Grouping routes

There is one more thing you can do, though. If you have done the [tutorial on serving static files](/express-tutorial/v1/serving-static-files/) you may remember that you can define middlewares for specific routes only. We can use this here to simplify our code a bit more. Right now, every route in **/controllers/cookies.js** starts with `/cookies`. Since that's the case for every single route, we can also group them all together. 

In the **app.js** file, adjust the line using `cookiesRoutes` to this: 

```js
app.use('/cookies', cookiesRoutes)
```

Now, go back to the **/controllers/cookies.js** file. And **change all the strings** defining the routes and remove the `cookies/`. 

So,

* `router.get('/cookies'` becomes `router.get('/'`
* `'/cookies/:slug'` becomes `'/cookies/:slug'`
* etc.

Do that for all the routes in that file. 

## Organizing views, helpers, and middleware

View templates are in separate files by default. So there is nothing new to worry about in regards to views here. 

Other functions like **helpers**, **middlewares**, **services**, or **view-models** all go into their own folders following the same principles as discussed above. 

In the end, your project folder may look like this: 

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
        📁 config
        <ul>
          <li>📄 app.js</li>
          <li>📄 database.js</li>
        </ul>
      </li>
      <li>
        📁 controllers
        <ul>
          <li>📄 cookies.js</li>
          <li>📄 simple-pages.js</li>
        </ul>
      </li>
      <li>
        📁 helpers
        <ul>
          <li>📄 cookie-views.js</li>
        </ul>
      </li>
      <li>
        📁 middlewares
        <ul>
          <li>📄 logger.js</li>
        </ul>
      </li>
      <li>
        📁 models
        <ul>
          <li>📄 cookie.js</li>
        </ul>
      </li>
      <li>
        📁 public
      </li>
      <li>
        📁 views
        <ul>
          <li>📁 cookies</li>
          <li>📁 includes</li>
          <li>📄 about.ejs</li>
          <li>📄 contact.ejs</li>
          <li>📄 index.ejs</li>
        </ul>
      </li>
      <li>📁 node_modules</li>
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

## Recap

In this lesson, we talked about **MVC** as the most common pattern used in most web applications. Following those principles, we refactored the cookie shop project to separate the various parts of our code into their own files. 

## 🛠 How to practice

Refactoring is a complicated task, and sometimes it can take a while. Refactor the project and make sure to have all code functions in their corresponding correct files and folders. 

>**Advanced Task**
>If you have some longer logic in different places, try to make use of **services**, or **view-models** to improve your code further. 