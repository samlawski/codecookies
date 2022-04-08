---
title: Forms and Request Data
videoId:
slug: "forms-and-request-data"
templateEngineOverride: md
---

Previously, you learned to create an HTML form and make sure it gets submitted to the correct place in the backend. Now, it's time to learn how to read the form data and create database records from that data. 

## Request Parameters

In a previous exercise, you defined the attribute `method='POST'` for the `<form>` element. If you were to change it to `method='GET'` (or simply remove it) and fill out the form, you should see a line like the following in the server logs: 

```
"GET /checkout?oatmeal-raisin=3&sugar=2&peanut+Butter=0&oatmeal=0&salted-caramel=0&name=Jane&street=Main+St&city=Sample+Town&state=&zip=&country= HTTP/1.1" 200 -
```

If you look closely, you'll see that the `/checkout` route just got all the form field values attached to it. This is called a **query string** or **query parameters**. Whenever you submit an HTML form, the browser will automatically add all the values that were added to the form fields as **query string** to the URL. 

You've actually done this before in the [exercise on pagination](/flask-2-tutorial/pagination-and-query-parameters). You can access the query string using the **request** object.

If you set the `method='POST'`, load the page again (**without query parameters in the URL!**) [http://127.0.0.1:5000/checkout](http://127.0.0.1:5000/checkout), and submit the form, you won't see any query string in the logs anymore.

Now, the data will be submitted as **form data**. In Flask, you can access the form data with `request.form`.

If you add `print(request.form)` somewhere in the `@blueprint.post()` function and submit a form through the browser, you should see the form data show up in the command line. You could get the data of a specific form field by writing, for example, `request.form['name']` or `request.form.get('name')`.

Now that we know how to read form data, we want to create new database records from that.

## Testing Form Data

You may have heard about **TDD** or **Test-Driven Development**. The idea of this concept is to write a failing test first. Only afterward do you write the actual code and try to get the test to pass. This kind of approach can help to focus your development process on one problem at a time. We'll use this approach to add our desired functionality.

Create the files we need for testing the **order routes**: 

* **/app/tests/orders/\_\_init\_\_.py** (this file will stay empty for now)
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
    'chocolate-chip': '2',
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

  cookies = Cookie.query.all()
  return render_template('orders/new.html', cookies=cookies)
```

Since we're using `Order` here, you need to make sure to `import` it at the top:

```py
from app.orders.models import Order
```

If you run `pytest -v` now again, the test should pass now. Congratulations! You've done **TDD** in Flask. 

## Creating Database Entries From Form Data

In addition to the `Order` object, we also want to create an `Address` record based on the data submitted by your users. Let's write another failing test for that feature (in **test_routes.py**): 

```py
def test_post_checkout_creates_address(client):
  # Creates an address related to the order
  response = client.post('/checkout', data={
    'chocolate-chip': '2',
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

The code above would get the test passing, but it doesn't add the form data yet. Technically it would be good practice to add an extra test now to verify the addition of all the form data. In fact, it might make sense to add a few more tests for different edge cases here. 

For the sake of simplicity, I'll skip those steps for now and just show you how to add the form data as fields when creating an `Address`. It's actually quite straightforward. You just have to extend the function from before with the relevant data:

```py
address = Address(
  name=request.form.get('name'),
  street=request.form.get('street'),
  city=request.form.get('city'),
  state=request.form.get('state'),
  zip=request.form.get('zip'),
  country=request.form.get('country'),
  order=order
)
address.save()
```

## Create Entries For Related Models

As the last step, we want to create a `CookieOrder` record for each **cookie slug** that has a number value **higher than 0**.

Let's start one last time by writing a failing test: 

```py
def test_post_checkout_creates_cookie_order(client):
  # Creates a cookie order related to the order
  new_cookie = Cookie(slug='chocolate-chip', name='Chocolate Chip', price=1.50)
  new_cookie.save()

  response = client.post('/checkout', data={
    'chocolate-chip': '2',
    'name': 'Jane',
    'street': '123 Main St',
    'city': 'Anytown',
    'state': 'CA',
    'zip': '12345',
    'country': 'Candyland'
  })

  assert Order.query.first().cookie_orders[0].number_of_cookies == 2
```

This test follows the **Arrange-Act-Assert** pattern. First, we create a `Cookie` so that it can actually be purchased.

Then, we **act** by making the same **POST** request from before. Notice that one of the parameters is `chocolate-chip`. That's the `slug` that we set when we created the `Cookie` before.

In the **assert** step, we first get the `Order` from a database. Because of the `db.relationship()` setup in our **/app/orders/models.py** file, we are able to just call `.cookie_orders` on the `Order` object itself. We use `[0]` to get the first of all those `cookie_orders` and confirm with `.number_of_cookie == 2` that the specific `CookieOrder` record has been ordered `2` times (as defined in the cookie above.)

This test will fail for now. So let's add some logic to add a `CookieOrder` with the correct `number_of_cookies`.

We already have `cookies = Cookie.query.all()` in our `post_checkout()` function. We can **loop** over the `cookies` to have access to each individual `cookie.slug`. With that, we can get the amount users have entered into the form for each cookie.

```py
cookies = Cookie.query.all()

for cookie in cookies:
  number_of_cookies = request.form.get(cookie.slug, 0)

return render_template('orders/new.html', cookies=cookies)
```

Notice that we use `.get()` to grab the property from the form. In this case, it's particularly useful because we can set the default value to `0` in case the slug isn't found (for whatever reason).

_(Side note: The code example above included the `return` statement just to give you some context on where to put the code. The `return` should always come as the very last part of the function.)_

Now we can check if the `number_of_cookies` is above `0`. If that's the case, we create a new `CookieOrder` record. Don't forget you'll have to `import` `CookieOrder` at the top of the file again. 

```py
cookies = Cookie.query.all()

for cookie in cookies:
  number_of_cookies = request.form.get(cookie.slug, 0)

  if int(number_of_cookies) > 0:
    cookie_order = CookieOrder(
      cookie=cookie,
      order=order,
      number_of_cookies=number_of_cookies
    )
    cookie_order.save()
```

With `int()` we make sure that the `number_of_cookies` are really an integer. 

This looks pretty much like all the other times we created database records. It only works if we defined the `db.relationship` **including** a `backref` attribute on both the `Order` and the `Cookie` model. If we didn't set those parameters, instead of `cookie=cookie` we'd have to write `cookie_id=cookie.id` and `order_id=order.id`. 

That's it! Filling out and submitting the form will now create an `Order`, an `Address`, and one or more `CookieOrder` records. 

Run `pytest -v` to confirm it works. You can also try it out by going to 

You can try out yourself under [http://127.0.0.1:5000/checkout](http://127.0.0.1:5000/checkout) - although right now, there is no designated place to view the orders yet. We'll learn about that in upcoming exercises.

## Refactoring & Improving Your Code

**TDD** usually follows three steps: red, green, refactor. First, you write a failing test. Then you write code to get it to pass. In the end, you refactor your code to make it look cleaner and more maintainable. 

Right now, we just added a lot of business logic in the **routes.py** file. That's not quite ideal. Usually, you want to keep your controller functions very short. They should call and execute other pieces of code and pull everything together. They themselves shouldn't have much logic in them. 

A common place for all the business logic we just added is a separate **service** file. Let's create that now with this path: 

* **/app/orders/services/create_order.py**

In it, create a new function called `create_order()`. Then copy and paste everything from the `post_checkout()` function into that function except for the `return` statement and `cookies = Cookie.query.all()`.

This is all that should be left in the **routes.py**:

```py
@blueprint.post('/checkout')
def post_checkout():
  cookies = Cookie.query.all()
  return render_template('orders/new.html', cookies=cookies)
```

You can remove the import of the three models `Order`, `Address`, and `CookieOrder`, and instead move it to the newly created **/app/orders/services/create_order.py** file:

```py
from app.orders.models import Order, Address, CookieOrder
```

Your service file should now look like this: 

```py
from app.orders.models import Order, Address, CookieOrder

def create_order():
  # Create an order
  order = Order()
  order.save()

  # Create address
  address = Address(
    name=request.form.get('name'),
    street=request.form.get('street'),
    city=request.form.get('city'),
    state=request.form.get('state'),
    zip=request.form.get('zip'),
    country=request.form.get('country'),
    order=order
  )
  address.save()

  # Create cookie orders
  for cookie in cookies:
    number_of_cookies = request.form.get(cookie.slug, 0)

    if int(number_of_cookies) > 0:
      cookie_order = CookieOrder(
        cookie=cookie,
        order=order,
        number_of_cookies=number_of_cookies
      )
      cookie_order.save()
```

You'll notice that we try to access a few variables we don't have access to. Specifically: `request` and `cookies`. Those two variables were available in the **routes** but aren't here yet. So we need to pass them as arguments to the function.

Instead of passing the entire `request` object, let's just pass the `form` data. Additionally, we'll pass the `cookies`. 

Change `def create_order():` to `def create_order(form_data, cookies):`.

Now, change all the places that say `request.form` to `form_data`. So for example, `request.form.get('name')` becomes `form_data.get('name')`. And `request.form.get(cookie.slug, 0)` becomes `form_data.get(cookie.slug, 0)`.

We can import that function now in our **/app/orders/routes.py** file:

```py
from .services.create_order import create_order
```

Finally, we'll call it in out `post_checkout()` function passing the `request.form` and `cookies` as arguments: 

```py
@blueprint.post('/checkout')
def post_checkout():
  cookies = Cookie.query.all()

  create_order(request.form, cookies)

  return render_template('orders/new.html', cookies=cookies)
```

If you run `pytest -v` again the tests should still pass. That's the beauty of writing tests. We changed a significant portion of our code. But we have the tests giving us peace of mind that nothing broke. 

## 🛠  Practice 

Now you know both the frontend and the backend of form submissions. To practice what you've learned you can: 

1. Write a backend function that receives data from an HTML form and reads the data with `request.form`.
2. Call **models** to create records in your database based on the submitted form data. 
3. Extract more complicated logic into a separate service.
4. Bonus: Write tests for all newly added functionality.