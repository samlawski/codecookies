---
title: HTML Forms and HTTP Methods
videoId:
slug: "html-forms-and-http-methods"
description: Learn how to create HTML templates and how they make different types of HTTP requests.
lastUpdate: March 10th, 2023
templateEngineOverride: md
---

So far, you've only learned to render content on your website. But to make it a web _application_, you probably need some way for users to submit data to your backend. Maybe you need authors to create blog posts, clients to fill out a contact form, users to add to-do list items, or customers to purchase items.

In this exercise, we'll create an HTML form that allows users to purchase items from our cookie shop.

In the previous exercises, you learned to set up your database models and relationships. You've learned how to create an `Order` model. So at this point, your database is ready to receive orders. 

You also learned to work with cookies to create a shopping cart and allow users to temporarily store information about the items they'd like to purchase later. 

Now we'll put all of that together. 

## HTTP Methods

As you probably know, when making HTTP requests, there are different **verbs** available. For example, if you type in [127.0.0.1:5000](http://127.0.0.1:5000) in your web browser, you make an **HTTP GET request** to the Flask application server running on your local machine. This is the case because web browsers are programmed by default to do exactly that and follow the Hyper-Text-Transfer-Protocol (HTTP) standard.

There are more verbs than **GET**, though, such as **PUT**, **PATH**, **POST**, and **DELETE**. Those are all verbs defined in the HTTP standard, and you can set up your backend to listen to different verbs on the same route. But more on that later.

Browsers make **GET** requests by default whenever you type in a URL and hit Enter. When you create HTML forms, you can define which type of HTTP request you want to make. Usually, you'd choose something like **POST** for forms. How that works, we'll look at further down.

## HTML Forms

HTML has several elements to build forms. But HTML by itself is just a markup language. It can add form elements to a page. But by themselves, they don't actually do anything. You need a backend to handle whatever data was submitted via the form.

Let me show you what I mean by adding a checkout page to our cookie shop. Create a new HTML template at the following path: 

**/app/templates/orders/new.html**

The page will render a form allowing users to **create** a new **order**. It's common to call templates for these kinds of pages "new.html". However, you're free to name it whatever you like.

The page's main content is an HTML `<form>`. If you aren't familiar with HTML forms and input fields, take a moment to [learn about forms on w3schools](https://www.w3schools.com/html/html_forms.asp) (or any other resource you prefer.)

Our form should allow users to put in their delivery address. To know which specific input fields we need, we can follow the `Address` model we previously created.

Here is an example of what the form could look like: 

```html
{% extends 'base.html' %}

{% block title %}Cookieshop | Checkout{% endblock %}

{% block body %}
  <h1>Checkout</h1>

  <form>
    <h2>Your Address:</h2>
    <div>
      <label for="name">Full Name</label>
      <input type="text" name="name" id="name" placeholder="Jane Cookielover">
    </div>
    <div>
      <label for="street">Street and Number:</label>
      <input type="text" name="street" id="street" placeholder="Sample Street 24">
    </div>
    <div>
      <label for="city">City:</label>
      <input type="text" name="city" id="city" placeholder="Best Town">
    </div>
    <div>
      <label for="state">State:</label>
      <input type="text" name="state" id="state" placeholder="Bakerstate">
    </div>
    <div>
      <label for="zip">Zip:</label>
      <input type="text" name="zip" id="zip" placeholder="12345">
    </div>
    <div>
      <label for="country">Country:</label>
      <input type="text" name="country" id="country" placeholder="Cookieland">
    </div>
    <input type="submit" value="Submit Order">

  </form>
  
{% endblock %}
```

We use `<div>` elements to ensure each `input` field has its own line. And we use the `id` attribute in combination with the `for` attribute so that users can click on the label to move the focus to the input element. 

Before you can try it out, you need to add the route to your Flask application. So let's do that next.

## Recap: Adding a New Blueprint

If you haven't already, create a new **routes.py** file in **/app/orders/**. For now, let's keep the file simple and just add a single route to render the HTML template we just created: 

```py
from flask import Blueprint, render_template

blueprint = Blueprint('orders', __name__)

@blueprint.route('/checkout')
def checkout():
  return render_template('orders/new.html')
```

This shouldn't include anything that's new to you. For practicing purposes, make sure to write the code by hand and not just copy and paste. 

Next, change the **/app/orders/\_\_init\_\_.py** file to include the `routes`:

```py
from . import models, routes
```

Finally, you need to add the blueprint to our Flask app. So back in **/app/app.py**, make sure the `orders` are imported at the top: 

```py
from . import cookies, simple_pages, orders
```

Then, add a function to register the new blueprint below your other blueprint registrations:

```py
def register_blueprints(app: Flask):
  app.register_blueprint(cookies.routes.blueprint)
  app.register_blueprint(simple_pages.routes.blueprint)
  app.register_blueprint(orders.routes.blueprint)
```

Now, you should be able to access the new page you just created at the URL [http://127.0.0.1:5000/checkout](http://127.0.0.1:5000/checkout).

## Dynamically Generate Forms

An important element is still missing from our checkout form. Users can pick a delivery address but they can't pick which cookies they'd like to order. 

Let's create a list of cookies available for order. Next to each cookie name, we display an input field allowing users to enter how many they'd like to order.

In order to do that, we first need to **query all cookies** from the database. We do that in the controller. First, import the `Cookie` model:

```py
from app.cookies.models import Cookie
```

Next, adjust the `checkout()` route to query the cookies and pass them to the view **template**:

```py
@blueprint.route('/checkout')
def checkout():
  cookies = Cookie.query.all()

  return render_template('orders/new.html', cookies=cookies)
```

Within the template, we can now add a loop, that loops over each cookie and creates an `input` field for it: 

```py
<form method="POST">
    <h2>Your Order:</h2>
    <ul>
      {% for cookie in cookies %}
        <li>
          <label for="cookie_{{ cookie.id }}">{{ cookie.name }}</label>
          <input type="number" name="{{ cookie.slug }}" id="cookie_{{ cookie.id }}" min="0" value="0">
        </li>
      {% endfor %}
    </ul>

    <h2>Your Address:</h2>
    ...
```

There are a few things you need to keep in mind when dynamically generating `input` fields. The `id` always must be unique. To accomplish that, we use `cookie_{{ cookie.id }}` here. This will end up with strings like `cookie_1` or `cookie_2`, where the number represents the `id` of the given cookie.

For the label to be clickable, remember that the `for` attribute must match the `id` of the related `input` field. 

We use a `number` input field here with a `min` (minimum) value of `0` and a starting value of `0`. Users can but don't have to go above it.

A **very important** thing to note is the `name` attribute. This attribute will be used to map the number of cookies ordered to the specific cookie in our database. We could use the `cookie.id` to do that. But then, the input field would result in `name='1'`, `name='2'`, and so on. Using just numbers as `input` `name` is not ideal as it could easily cause confusion and issues later on. Instead, we'll use the `slug` as the unique identifier of each cookie.

After adding this to your HTML take a moment to inspect the result in the developer tools ([http://127.0.0.1:5000/checkout](http://127.0.0.1:5000/checkout).)

```html
<label for="cookie_3">Peanut Butter</label>
<input type="number" name="peanut-butter" id="cookie_3" min="0" value="0">
```

Above, you see one example of what a single cookie input field could look like after it has been generated with jinja.

## Different HTTP Verbs in Flask Routes

Now you have a form, but where does the data get sent to on the backend? To decide that we need to come back to what we learned about HTTP methods before.

As mentioned above, there are different HTTP methods to choose from. You can even define different types of methods for the same URL. 

Take a look at the command line where your Flask server is running. You'll notice that whenever you load a page, the logs show something that says `GET` and then the name of the route you accessed. 

Try out submitting the form you just created (it doesn't matter if you fill it out). Just hit the "Submit Order" button. You should notice that the page actually reloaded and the command line should show something like this:

```
"GET /checkout?oatmeal-raisin=3&sugar=2&peanut+Butter=0&oatmeal=0&salted-caramel=0&name=Jane&street=Main+St&city=Sample+Town&state=&zip=&country= HTTP/1.1" 200 -
```

Ignore the parameters in the route for now. What I wanted to point out is that by clicking the button of the form, the browser actually made a **GET request** to your backend and reloaded the page. 

You can customize what type of HTTP method you want to use in a form. Just adjust the opening `<form>` tag to this, for example: 

```html
<form method="POST">
```

Now, refresh the page and hit the submit button again. Technically, you should now see an error in your browser saying "Method Not Allowed". And if you take a look at your command line, you should see that instead of `GET /checkout`, it shows `POST /checkout` now.

You see, the URL stayed the same, but the method is a different one. And all of a sudden, the route function doesn't work anymore. 

By default, the `@blueprint.route()` method is configured only to accept **GET** requests. But you can tell it also to accept other types of requests. Change the decorator to this: 

```py
@blueprint.route('/checkout', methods=['GET', 'POST'])
```

If you now reload the **/checkout** page and hit the "Submit Order" button, the page should reload just fine. Yet, the command line should still show the request to `POST /checkout`.

There is an issue with this approach, though. Now, the same route function is targeted for two different types of actions. It's loaded when you load the page (GET), and it's loaded when a form is submitted (POST). That's technically ok but not best practice. 

When the user makes a POST request, we want to store some data in the database. But we don't want to do that if a GET request comes in. Some tutorials suggest using the `request` object to determine the HTTP method. `request.method` will represent a string that's either `GET` or `POST` (or whichever method.) So you could write something like `if request.method == 'POST'` and only make a database entry within that condition. That works, but it's not clean.

A cleaner approach is to use separate controller actions, and since Flask version 2, that has become a little easier. Instead of writing `@blueprint.route()`, you can use `@blueprint.get()` and `@blueprint.post()` to specifically target only those HTTP methods. Let's make use of that and refactor our `@blueprint.route('/checkout')` function. Turn that single function into two functions using the new `get()` and `post()` methods: 

```py
@blueprint.get('/checkout')
def get_checkout():
  cookies = Cookie.query.all()
  return render_template('orders/new.html', cookies=cookies)

@blueprint.post('/checkout')
def post_checkout():
  cookies = Cookie.query.all()
  return render_template('orders/new.html', cookies=cookies)
```

Keep in mind that the function names need to be different from each other while the route can be the same. 

If you now reload the page and submit a form, everything should still work. Technically, both functions still do the same thing. But we will change that in the upcoming exercises.

## 🛠  Practice 

In this exercise, you've mostly worked with the frontend. You learned to create an HTML form and set up the routes on the backend to make sure every request goes to a separate function.

1. Create an HTML form and define the proper HTTP method. 
2. Create separate routes for **GET** and **POST** requests in the backend. Make sure the form points to the correct route. _(You can use the `action` attribute on the `<form>` element to change the route of the HTML form. Otherwise, it just submits to the same route as the page it's currently on.)_
3. Add some form fields. If they are generated dynamically, make sure to keep the `id`, `name`, and `for` attributes unique.
