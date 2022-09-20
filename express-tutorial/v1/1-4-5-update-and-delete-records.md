---
title: "CRUD 3: Update & Delete Records"
slug: update-and-delete-records
description: Learn to update and delete database entries when working with mongoose, MongoDB, and Express.
lastUpdate: September 20th, 2022
sectionIndex: 0
groupIndex: 3
---

The last two parts of **CRUD** are the actions **update** and **delete**. As with many things in programming, there are multiple ways to achieve the same outcome. In this lesson, we're going to focus on a few of those. But generally speaking, you can always consult the [official Mongoose documentation](https://mongoosejs.com/docs/queries.html) to learn about the various options. 

This lesson assumes you have already created a `Cookie` model, have some existing records, and know how to render records from the database. 

## Creating an edit page

How and where records are updated is completely up to you and the UI design of your application. One common place to keep a form for updating records is the route `GET /cookies/:slug/edit`. The route for submitting updates would be `POST /cookies/:slug`.

>💡 You may think, we should use `PUT` or `PATCH` as a route method when updating an existing record. And technically, you'd be correct. However, the official HTML specification for **HTML forms** only allows the two methods `GET` and `POST` as values. No other methods are included in the official HTML form spec. That means that as long as you work with standard HTML forms to make requests to your backend, you need to use either `POST` or `GET` methods. 
>If you were to work with APIs and client-side JavaScript, you'd be more flexible in defining the specific HTTP routes. But for now, we will stick to the HTML standard so that our HTML form works. 

Let's create an HTML for the edit page. It can pretty much look the same as the **new.ejs** template for creating new records with a few slight adjustments. 

**/views/cookies/edit.ejs**

```html
<!DOCTYPE html>
<html lang="en">
<%- include('head', {title: "Edit Cookie | Cookieshop"}) %>
<body>
  <%- include('header') %>

  <main>
    <h2>Edit a cookie</h2>

    <form action="/cookies/<%= cookie.slug %>" method="POST">
      <input type="text" value="<%= cookie.name %>" name="name" placeholder="name" /><br />
      <input type="text" value="<%= cookie.slug %>" name="slug" placeholder="slug" /><br />
      <input type="number" value="<%= cookie.priceInCents %>" name="priceInCents" placeholder="price in cents" /><br />
      <button>Save</button>
    </form>
  </main>

  <%- include('footer') %>
</body>
</html>
```

We adjusted the `title` and the `<h2>` a bit. But more importantly, we added a `value` attribute to each of the `input` fields. As the value of that attribute, we used **EJS** to insert the parameters `name`, `slug`, and `priceInCents` from the `cookie` variable. The `value` attribute allows us to prefill HTML form fields with any values we like. Since we want to let users edit existing records with this form, they should see what the properties look like before they start editing. 

Lastly, we also changed the `form` `action` attribute. The `action` defines the route that the form is being submitted to. When creating a new record, we make a `POST` request to the `/cookies` route. When editing an existing record, we make a `POST` request to the `/cookies/:slug` route. Since the record we want to edit exists already, we use the `slug` to find it before we get to edit it. 

Now, we need a route function to render this template. We can use the `/cookies/:slug` route as a basis since, in both cases, we need to find and load the existing cookie record from the database. 

```js
app.get('/cookies/:slug/edit', async (request, response) => {
  try {
    const slug = request.params.slug
    const cookie = await Cookie.findOne({ slug: slug }).exec()
    if(!cookie) throw new Error('Cookie not found')

    response.render('cookies/edit', { cookie: cookie })
  }catch(error) {
    console.error(error)
    response.status(404).send('Could not find the cookie you\'re looking for.')
  }
})
```

We only needed to change a few details: 

* The route string should be `'/cookies/:slug/edit'`
* The `response.render()` function should render the template `'/cookies/edit'`
* We _don't_ actually need the `readablePrice` function. So we only need to pass the `cookie` as a parameter to the template. 

If you now access [/cookies/chocolate-chip/edit](http://localhost:3000/cookies/chocolate-chip/edit), you should see the contact form already filled out with the values from the `chocolate-chip` cookie. 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/chocolate-chip/edit" target="blank">
        localhost:3000/cookies/chocolate-chip/edit
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
      <h2>Edit a Cookie</h2>
      <input type="text" value="Chocolate Chip" name="name" placeholder="name" /><br />
      <input type="text" value="chocolate-chip" name="slug" placeholder="slug" /><br />
      <input type="number" value="350" name="priceInCents" placeholder="price in cents" /><br />
      <button>Save</button>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>

## Introducing a POST route for editing 

Next, we need to write the route that the form sends its **POST** request to. The URL of the route is simply `/cookies/:slug`. We can reuse the same path because we use a different HTTP method. 

Let's create a new route function with the `app.post()` function. We already know it will have to interact with the database. So we'll make it an `async` function from the beginning and immediately add a `try...catch` block to handle errors. We set the route string to include the `:slug` as we are planning to edit an existing cookie record that we need to find by its `slug`.

You should end up with this: 

```js
app.post('/cookies/:slug', async (request, response) => {
  try {
    // todo
    
  }catch (error) {
    console.error(error)
    response.send('Error: The cookie could not be update.')
  }
})
```

If we want to edit an existing cookie, we could use the `.findOne()` method to find it, then make some changes to it, and finally use the `.save()` method to save our updated version to the database. But Mongoose actually comes with a method to combine all those steps into a single step. It's a single function called `.findOneAndUpdate()`. The name describes exactly how it works, and it does precisely what we need to do. You can look at the details in the [documentation](https://mongoosejs.com/docs/tutorials/findoneandupdate.html). Here is how we can use it in our application: 

```js
app.post('/cookies/:slug', async (request, response) => {
  try {
    const cookie = await Cookie.findOneAndUpdate(
      { slug: request.params.slug }, 
      request.body
    )
    
    // todo
  }catch (error) {
    console.error(error)
    response.send('Error: The cookie could not be created.')
  }
})
```

The first parameter of the `findOneAndUpdate()` function is the filter by which the cookie record should be found. It's the equivalent to what we'd use in the `findOne()` function before. 

The second parameter is just `request.body`. Remember, `request.body` returns an object that contains all the properties of the form. The keys of the object are defined by the `name` attributes of the HTML form. 

The following three input fields: 

```html
<input type="text" value="banana" name="name" />
<input type="text" value="Hello World!" name="expressIsFun" />
<input type="number" value="42" name="someRandomNumber" />
```

will result in the following JavaScript object as `request.body`: 

```js
{
  banana: "name",
  expressIsFun: "Hello World!",
  someRandomNumber: "42"
}
```

So if you pass only the `request.body` as the second parameter of `findOneAndUpdate()` you have to be absolutely certain that the HTML form contains input fields with **exactly** the names that map to the properties of the `Cookie` model. 

Alternatively, you can also map the values manually and write this: 

```js
const cookie = await Cookie.findOneAndUpdate(
  { slug: request.params.slug },
  {
    name: request.body.name,
    slug: request.body.slug,
    priceInCents: request.body.priceInCents
  }
)
```

It's more verbose, but the result is the same in this case. 

>💡 For Security reasons you should always **validate** form values before writing anything in the database. There will be a separate lesson on validations. Just be aware, that in a real-world application you'll probably want to add some conditions at the top of the route to check whether the properties do in fact contain the correct data before handing things over to the database. 

## Find and update a record

As a last step of the **POST** route function, we need to return a **response** to the user. Let's use a **redirect** for that. When a record got updated, the user should be redirected to the **show** page (e.g., [/cookies/chocolate-chip](http://localhost:3000/cookies/chocolate-chip)) of the cookie.

To make sure we redirect to the correct page, we need to get the **current slug** of the cookie record. Technically, we assigned the cookie to the `cookie` variable. But by default `.findOneAndUpdate()` will represent the **old version** of the record. So it'll represent whatever the values were **before** they were updated. But no worries. We can actually change that behavior. For that, we need to pass a **third parameter** to the `.findOneAndUpdate()` function. That third parameter is an **options object** that allows us to specify any extra rules or behavior. By setting its property `new` to `true`, we tell the model that we want the variable `cookie` to please represent the **new** version of the `Cookie` and not the old one. 

Here is the updated variable declaration: 

```js
const cookie = await Cookie.findOneAndUpdate(
  { slug: request.params.slug }, 
  request.body,
  { new: true }
)
```

Now, we can use the `cookie.slug`, and it'll refer to the **new `slug`** even if it was just changed by the user. If we hadn't added the `{ new: true}`, we'd run the risk that the user changed the `slug`, but `cookie.slug` would still refer to the old slug. Therefore, if we used the old slug to redirect the response, the page couldn't find a cookie with the given `slug` anymore.

You can redirect responses using the `response.redirect()` function like this: 

```js
app.post('/cookies/:slug', async (request, response) => {
  try {
    const cookie = await Cookie.findOneAndUpdate(
      { slug: request.params.slug }, 
      request.body,
      { new: true }
    )
    
    response.redirect(`/cookies/${cookie.slug}`)
  }catch (error) {
    console.error(error)
    response.send('Error: The cookie could not be created.')
  }
})
```

You can see the `redirect()` function just takes one parameter, which is a string of the path we want to redirect the user to. We use a [JavaScript template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to dynamically add the **new** `slug` to the URL.

If you now try to access the page [/cookies/chocolate-chip/edit](http://localhost:3000/cookies/chocolate-chip/edit) and submit the form with some changes, you should be redirected to the corresponding **show** page and see the new changes applied. 

And that's it. You created a route to update existing cookie records.

## Find and delete a record

Mongoose provides a similarly simple function for deleting records as for updating records. It's called `findOneAndDelete()` (as usual, you find details in the [documentation](https://mongoosejs.com/docs/api.html#model_Model-findOneAndDelete)). In fact, there are even more functions to allow you to delete records. Even one called `deleteMany()` that lets you delete multiple records in bulk (details in the [documentation](https://mongoosejs.com/docs/queries.html)). But for our purposes, we're going to use the `findOneAndDelete()` function. 

Technically, following the **REST**ful standard, we'd want to set the route function using `app.delete()`. This would be the equivalent to the **HTTP `DELETE` method**. However, HTML forms only support `GET` and `POST` methods, and HTML anchor tags only send `GET` requests. If we were to work with an API, we should use `app.delete()`. But since our simple website just uses basic HTML on the client side, let's build a little workaround and use a `GET` method instead. We do that so that we can make deleting records as simple as **clicking a link**. 

Let's define the route, using what you learned about **async** functions, and `try...catch`: 

```js
app.get('/cookies/:slug/delete', async (request, response) => {
  try {
    // todo
    
  }catch (error) {
    console.error(error)
    response.send('Error: No cookie was deleted.')
  }
})
```

Next, we use the `findOneAndDelete()` function just like before. Except, this time, we don't need extra parameters because all we want to do is delete a record. We don't even need to assign a variable - although we could, in case we want to tell the user in a notification which record was deleted.

```js
app.get('/cookies/:slug/delete', async (request, response) => {
  try {
    await Cookie.findOneAndDelete({ slug: request.params.slug })
    
    response.redirect('/cookies')
  }catch (error) {
    console.error(error)
    response.send('Error: No cookie was deleted.')
  }
})
```

As a `response.redirect()` we use the `/cookies` index page because obviously, there is no more cookie page to render after it was deleted. 

Since we made it a `GET` route, deleting a record from the database is now as simple as clicking the link [/cookies/chocolate-chip/delete](http://localhost:3000/chocolate-chip/delete).

>💡 Most of these methods and routes should not be simply publicly available on the internet. In a real-world application, you'd restrict access to these routes to only allow admins to access them. The concept you need to learn in order to do that is called **authentication** and **authorization**.

## Recap

With this lesson, you now know the entirety of **CRUD** operations. In this lesson, you learned how to update and delete existing records. You got to know some convenient, built-in methods. You also learned how to integrate the update and delete process with your existing HTML and routes. 

## 🛠 How to practice

To practice what you have learned, do the same thing for the news page of the cookie shop. 

* From the previous lessons, you should have a `NewsItem` model, a page for creating those records, and a page that renders them.
* Now, create a new page to show an edit form with values pre-filled from an existing `NewsItem`
* Add a route that lets users update the `NewsItem`. 
* Finally, add a route to also let them **delete** items. 

There are also a few more touch-ups you could do:

* Update all existing forms and use `response.redirect()` where it might be helpful (e.g., with the already existing `/cookies/new` and `news/new` routes)
* In your templates, add links to the `[...]/new`, `[...]/edit`, and `[...]/delete` routes. This way you don't have to put the URLs in the browser every time you try to access them, but you can actually access them from the UI. 

>**Tip:** You may want to create separate `/admin` pages to display those forms that let you create, edit, or delete records in the database. That makes it easier, later, to protect that page with a password. 