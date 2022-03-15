---
title: Forms and Parameters
videoId:
slug: "forms-and-parameters"
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

You can design and set up the file in any way you like. But the important part is that you include an HTML `<form>` element so users can put it in their delivery address. If you're not familiar with HTML forms and input fields, you may find more details [on w3schools](https://www.w3schools.com/html/html_forms.asp).

To know which fields to add to the form, you can just follow the `Address` **model** we created a few exercises ago. 

Here is an example of what it could look like: 

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

Next, change the **/app/orders/__init__.py** file to include the `routes`:

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

## Recap: Cookies and Helpers

Users can now put in their address, but how do we know which cookies they want to order? For that, we need to get the data from our `shoppingCart` cookie (that we set up in the [exercise on cookies](/flask-2-tutorial/cookies-in-flask/)).

As you learned in that exercise, there are multiple ways to do that. You can either use JavaScript to read the cookie or you can read the cookie in the backend and include the relevant information in the HTML on the backend. 

We'll use the second approach because it's going to help us with the checkout functionality later. As a reminder: In a previous exercise, we created a cookie with the name `shoppingCart`. Its content is a string in **JSON** format - which is a format that very much looks like a Python dictionary. Here is an example of what the value of the `shoppingCart` cookie could look like after adding a few items to the shopping cart: 

```json
'{"Oatmeal Raisin":"1", "Peanut Butter":"3"}'
```

It's very important to remember that this **looks like** dictionary but it **is** a string. So we first need to convert the string into an actual dictionary with `json.loads`. Let's create a quick helper method for that. 

Add a new file with this path: 

**/app/orders/helpers.py**

Add the following code to it: 

```py
from flask import request
import json

def get_shopping_cart_cookies():
  shopping_cart_string = request.cookies.get('shoppingCart', '{}')
  return json.loads(shopping_cart_string)
```

Remember, the backend code of your routes only gets executed the moment a user makes a request to your website. Whenever that happens, Flask provides you with a `request` object. That object contains all sorts of useful information about the client that's making the request. We'll use that more in just a second. It also includes the cookies that were previously set. 

This function above looks very similar to the one you've used in a previous exercise. Just in this case, it returns the entire dictionary stored in the given cookie.

In case no cookie has been set yet, the function `request.cookies.get('shoppingCart', '{}')` uses the fallback `'{}'`. Without it `json.loads()` would break if no cookie is set.

We can now import this function in **/app/orders/routes.py**:

```py
from .helpers import get_shopping_cart_cookies
```

We can now use this function and pass whatever it returns to the frontend as a parameter of the `render_template()` function: 

```py
@blueprint.route('/checkout')
def checkout():
  return render_template('orders/new.html',
    shopping_cart_cookies=get_shopping_cart_cookies()
  )
```

We now have access to the `shopping_cart_cookies` variable in the HTML that we wrote before using **jinja** code. 

`shopping_cart_cookies` represents a dictionary where each key is a cookie name and the value of the key is the number of cookies in the shopping cart. We can use a basic Python for-loop within our jinja code to loop over all of those shopping cart entries in our frontend. _(Note: If you want to test this, make sure to first increase the number of cookies in your shopping cart by going to pages such as [http://127.0.0.1:5000/cookies/oatmeal-raisin](http://127.0.0.1:5000/cookies/oatmeal-raisin) and clicking the `+` button a few times.)_

A loop could look like this: 

```html
<form>
  <h2>Your Shopping Cart:</h2>
  <ul>
    {% for cookie_name, number_of_cookies in shopping_cart_cookies.items() %}
      <li>{{cookie_name}}: {{number_of_cookies}}</li>
    {% endfor %}
  </ul>

  <h2>Your Address:</h2>
```

We can iterate over the keys and values in a dictionary by adding `.items()` to the dictionary and using **two variables** per iteration (in this case: `cookie_name` and `number_of_cookies`.)

If you want to make sure the shopping cart is not displayed, you can wrap the entire form in a conditional. For example: 

```py
{% extends 'base.html' %}

{% block title %}Cookieshop | Checkout{% endblock %}

{% block body %}
  <h1>Checkout</h1>

  {% if shopping_cart_cookies %}
    <form>
      ...
    </form>
  {% else %}
    <p>Your shopping cart is empty.</p>
  {% endif %}
  
{% endblock %}
```

_(Note that in the code example above, the contents of the `form` element have been removed for better clarity.)_

Don't forget to try it out! Try adding or removing cookies and then testing what the page [http://127.0.0.1:5000/checkout](http://127.0.0.1:5000/checkout) looks like.

## Different HTTP Verbs in Flask Routes

As mentioned above, there are different HTTP methods to choose from. You can even define different types of methods for the same URL. 

Take a look at the command line where your Flask server is running. You'll notice that whenever you load a page, the logs show something that says `GET` and then the name of the route you accessed. 

Try out submitting the form you just created (it doesn't matter if you fill it out). Just hit the "Submit Order" button. You should notice that the page actually reloaded and the command line should show something like this:

```
"GET /checkout?name=Jane&street=1234+Sample+St+&city=Cool+City&state=None&zip=12345&country=Cookieland HTTP/1.1" 200 -
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
  return render_template('orders/new.html',
    shopping_cart_cookies=get_shopping_cart_cookies()
  )

@blueprint.post('/checkout')
def post_checkout():
  return render_template('orders/new.html',
    shopping_cart_cookies=get_shopping_cart_cookies()
  )
```

Keep in mind that the function names need to be different from each other while the route can be the same. 

If you now reload the page and submit a form, everything should still work. Technically, both functions still do the same thing. But in a minute, we will start adding more logic to the **POST** function.

## Request Parameters

You probably already noticed it, but if you haven't, let's try it again. Fill out the form you created and hit "Submit Order". If you take a look at the command line where the server is running, you should see something like this: 

```
"POST /checkout?name=Jane&street=1234+Sample+St+&city=Cool+City&state=None&zip=12345&country=Cookieland HTTP/1.1" 200 -
```

If you look closely, you'll see that the `/checkout` route just got all the form field values attached to it. This is called a **query string** or **query parameters**. Whenever you submit an HTML form, the browser will automatically add all the values that were added to the form fields as **query string** to the URL. So in order to read the form values on the backend, all we have to do is grab the **query string**. 

You've actually done this before in the [exercise on pagination](/flask-2-tutorial/pagination-and-query-parameters). You can access the query string using the **request** object. There are various methods that help you get data from the `request` object. One useful method is specifically designed to get **form data**. That's `request.form`.

If you add `print(request.form)` somewhere in the `@blueprint.post()` function and submit a form through the browser, you should see the form data show up in the command line. You could get the data of a specific form field by writing, for example, `request.form['name']`.

But we want to use that data to create a new database record. 

## Testing Form Data

You may have heard about **TDD** or **Test-Driven Development**. The idea of this concept is to write a failing test first. Only afterward do you write the actual code and try to get the test to pass. This kind of approach can help to focus your development process on one problem at a time.

Create the files we need for testing the **order routes**: 

* **/app/tests/orders/__init__.py** (this file will stay empty for now)
* **/app/tests/orders/test_routes.py** (this file will contain our tests)

Let's make sure our new test file works by adding a quick test that tests the `get_checkout` function: 

```py
def test_get_checkout_renders(client):
  # Page loads and renders checkout
  response = client.get('/checkout')
  assert b'Checkout' in response.data
```

Run `pytest -v` and you should see only passing tests if everything went well. Now, we'll add our first failing test as a new function: 

```py
def test_post_checkout_creates_order(client):
  # Creates an order record
  response = client.post('/checkout', data={
    'name': 'Jane',
    'street': '123 Main St',
    'city': 'Anytown',
    'state': 'CA',
    'zip': '12345',
    'country': 'Candyland'
  })
  assert Order.query.first() is not None
```

Be aware that we are using the `Order` model here. So you'll have to import it at the top of the file: 

```py
from app.orders.models import Order
```

When looking at the test function, you will notice a couple of new things. First of `client.post()` will make a **POST** request as opposed to a **GET** request. But then you can see that we added a second parameter called `data`.

Remember, when you make a **POST** request with a form, we actually send all the form fields as data to the backend. The backend then accesses this data through the `request.form` object. 

If you were to just write `client.post('/checkout')` your test function would make a **POST** request without any data. But we need that data in the backend. Therefore, we can use the built-in `data` feature. By defining the `data` parameters as a dictionary, **pytest** will automatically convert that into the same format as if the data was submitted through an HTML form. 

On the last line, we `assert` (i.e., we check) that querying an `Order` record from the database will **not** be `None` but actually return an order record.

If you run `pytest -v` now, one of your tests should be failing. That's good. Now we can build the logic to get it to pass. 

## Recap: Creating Database Entries

The function we're testing is the `post_checkout()` function. The test checks if, after calling that function, an `Order` record is created in the database. 

Before we can create records using out `Order` model, we first need to add the corresponding methods.

Remember, we created the models `CookieOrder`, `Order`, and `Address`? If you haven't already, make sure they inherit from the `CRUDMixin` class we created. This will give us some methods to easily create and update records. 

In **/app/orders/models.py**, make to have `CRUDMixin` imported

```py
from app.extensions.database import db, CRUDMixin
```

Then, it should be one of the inherited classes for `CookieOrder`, `Order`, and `Address`:

```py
class CookieOrder(db.Model, CRUDMixin):
```

```py
class Order(db.Model, CRUDMixin):
```

and

```py
class Address(db.Model, CRUDMixin):
```

Back in **/app/orders/routes.py**, in the `post_checkout()` function we can now instantiate a new `Order` and call `save()` on it to store it to the database. This is what it could look like: 

```py
@blueprint.post('/checkout')
def post_checkout():
  # Create an order
  order = Order()
  order.save()

  return render_template('orders/new.html',
    shopping_cart_cookies=get_shopping_cart_cookies()
  )
```

Since we're using `Order` here, you need to make sure to `import` it at the top:

```py
from .models import Order
```

If you run `pytest -v` now again, the test should pass now. Congratulations! You've done **TDD** in Flask. 

## Creating Database Entries From Form Data

On top of the `Order` object, we also want to create an `Address` record based on the data submitted by your users. Let's write another failing test for that feature (in **test_routes.py**): 

```py
def test_post_checkout_creates_address(client):
  # Creates an address related to the order
  response = client.post('/checkout', data={
    'name': 'Jane',
    'street': '123 Main St',
    'city': 'Anytown',
    'state': 'CA',
    'zip': '12345',
    'country': 'Candyland'
  })
  assert Address.query.first().order_id is 1
```

_(Remember to `import` `Address` at the top.)_

There are many different ways to test the same thing. Whenever you write a test, consider what you want to `assert` that will make sure that my code worked. 

`assert Address.query.first().order_id is 1` implies and automatically tests multiple things. We make sure that an `Address` was created in the first place. Otherwise, `Address.query.first()` would return `None`. But by adding `.order_id is 1`, we additionally make sure that the created address has an `order_id` that is set to the integer `1`. Therefore, our test implies that an address always needs to be connected to an `Order` record. This means we **cannot** just write this: 

```py
address = Address()
address.save()
```

This would create an address but without a connected `order_id`. Instead, in the `post_checkout()` function of **/app/orders/routes.py** we could add a new address like this: 

```py
address = Address(
  order=order
)
address.save()
```

Make sure to write this **below** the `order.save()` in that same function. The `order` needs to be created before it can be associated with the `address`. _(Again, don't forget to `import` `Address` at the top of the file.)_

Because of the relationship we have defined in our models, we can just define `order=order`, and Flask will handle the rest automatically. It would also work just to write `order_id=order.id`.

This would get the test passing, but it doesn't add the form data yet. Technically it would be good practice to add an extra test now to verify the addition of all the form data. In fact, it might make sense to add a few more tests for different edge cases here. 

For the sake of simplicity, I'll skip those steps for now and just show you how to add the form data as fields when creating an `Address`. It's actually quite straightforward. You just have to extend the function from before with the relevant data:

```py
address = Address(
  name=request.form['name'],
  street=request.form['street'],
  city=request.form['city'],
  state=request.form['state'],
  zip=request.form['zip'],
  country=request.form['country'],
  order=order
)
address.save()
```

## Create Entries For Related Models

As the last step, we want to create a `CookieOrder` record **for each** cookie that was set in the `shoppingCart` cookie.

Let's start one last time by writing a failing test: 

```py
def test_post_checkout_creates_cookie_order(client):
  # Creates a cookie order related to the order
  new_cookie = Cookie(slug='chocolate-chip', name='Chocolate Chip', price=1.50)
  new_cookie.save()
  client.set_cookie('localhost', 'shoppingCart', '{"Chocolate Chip": 2}')

  response = client.post('/checkout', data={
    'name': 'Jane',
    'street': '123 Main St',
    'city': 'Anytown',
    'state': 'CA',
    'zip': '12345',
    'country': 'Candyland'
  })

  assert Order.query.first().cookie_orders[0].number_of_cookies == 2
```

This test follows the **Arrange-Act-Assert** pattern. First, we create a `Cookie` so that it can actually be purchased. Then, we use `client.set_cookie` to create a cookie for the domain `localhost` (the default domain for tests). The cookie we create here is just a JSON string that includes the name of the cookie and the number `2`. With those two steps, we **arranged** the data for our test scenario. 

Then, we **act** by making the same **POST** request from before. 

In the **assert** step, we first get the `Order` from a database. Because of the `db.relationship()` setup in our **/app/orders/models.py** file, we are able to just call `.cookie_orders` on the `Order` object itself. We use `[0]` to get the first of all those `cookie_orders` and confirm with `.number_of_cookie == 2` that the specific `CookieOrder` record has been ordered `2` times (as defined in the cookie above.)

This test will fail for now. So let's add some logic to add a `CookieOrder` with the correct `number_of_cookies` value for each item in the `shoppingCart` cookie. 

Remember, we already defined a helper function to get the `shoppingCart` cookie as a **dictionary**. And we also already wrote some logic to loop over it. We can do something very similar in our routes, below `address.save()` but **above** the `return` function: 

```py
cookies = get_shopping_cart_cookies()
  
for cookie_name, number_of_cookies in cookies.items():
```

`cookie_name` is just a string such as "Chocolate Chip". So as a first step, we need to find a cookie record with that name: 

```py
for cookie_name, number_of_cookies in cookies.items():
  cookie = Cookie.query.filter_by(name=cookie_name).first()
```

_(Again, make sure to import `Cookie` at the top.)_

```py
from ..cookies.models import Cookie
```
 
Now, we have all the information we need to create a `CookieOrder` record. `import` `CookieOrder` at the top and then adjust your for-loop with the following code: 

```py
for cookie_name, number_of_cookies in cookies.items():
  cookie = Cookie.query.filter_by(name=cookie_name).first()
  cookie_order = CookieOrder(
    cookie=cookie,
    order=order,
    number_of_cookies=number_of_cookies
  )
  cookie_order.save()
```

This looks pretty much like all the other times we created database records. It only works if we defined the `db.relationship` **including** a `backref` attribute on both the `Order` and the `Cookie` model. If we didn't set those parameters, instead of `cookie=cookie` we'd have to write `cookie_id=cookie.id` and `order_id=order.id`. 

That's it! Filling out and submitting the form will now create an `Order`, an `Address`, and one or more `CookieOrder` records. You can try out yourself under [http://127.0.0.1:5000/checkout](http://127.0.0.1:5000/checkout) - although right now, there is no designated place to view the orders yet. We'll learn about that in the next exercise. 

## Refactoring & Improving Your Code

One problem with your code, as it is right now, is that it's not particularly clean to keep all that logic in the **controller**. It would go beyond the capacity of this tutorial. But consider creating a new folder under **/app/orders/services** and add a new file in it called `OrderService.py`. You could then move all the business logic for creating all those different records in that separate file and just call it as a single function from the `post_checkout()` function. That would be a much cleaner approach. 

## 🛠  Practice 

In this exercise, you learned to put together a lot of topics you learned about in previous exercises. To practice the new content, try to apply the following steps: 

1. Create an HTML form and define the proper HTTP method. 
2. Create separate routes for **GET** and **POST** requests in the backend. Make sure the form points to the correct route. _(You can use the `action` attribute on the `<form>` element to change the route of the HTML form. Otherwise, it just submits to the same route as the page it's currently on.)_
3. Add some form fields and use `request.form` to read the submitted data on the backend. 
4. Call **models** to create records in your database based on the submitted form data. 
5. Bonus: Write tests for all newly added functionality.