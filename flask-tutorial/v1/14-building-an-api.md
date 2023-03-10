---
title: Building an API
videoId:
slug: "flask-to-build-an-api"
description: Learn how to use Flask routes as an API that returns structured JSON data. 
lastUpdate: March 10th, 2023
---

## What's An API?

An **API** (Application Programming Interface) is a way to make data or functionality of your application available to other software. 

Imagine the weather app on your phone or any other device. How does it know the weather? It's unlikely that the phone has sensors to determine the surrounding weather conditions. Instead, it needs to get the up-to-date weather date from somewhere else. 

Most likely, the weather app makes a request (such as an **HTTP GET** request) to a server that stores the current weather data in some database. Since the weather app has its own design and many different weather apps have different designs, it probably wouldn't make sense for the server to respond with some HTML code to display the weather. It makes much more sense that the server only returns the weather data, and the app handles how it's supposed to be displayed to the users.

That's an example of a web server with an API specifically made to return weather data. Functionally, it works the same way as a server backend for rendering websites. But instead of returning HTML in a string, they just return data in a string. 

If you're curious, check out how [openweathermap.org structures the weather data](https://openweathermap.org/current#current_JSON). There are a lot of APIs out there. Some are free, and some are paid. Entire businesses have been built around offering APIs.

## JSON

When looking up APIs, you'll likely run into a format called **JSON** (JavaScript Object Notation). Even though it has the word `JavaScript` in its name, it has become a standard format for structuring data on any kind of backend. That's because, in essence, it just looks like structured data in any programming language. In Python, it looks like a **dictionary**. In JavaScript, it's similar to an **object**. The main part to keep in mind is that the **keys** have to be strings. This is a JSON example: 

```json
{
  "name" : "Chocolate Chip",
  "taste_profiles" : [ "sweet", "squishy" ],
  "details" : {
    "color" : "brown",
    "size" : "medium"
  }
}
```

When a server (aka API) returns JSON data, it is still just a string containing text that looks like the above. So to work with the data, it needs to be converted into structured data. Both JavaScript and Python have built-in functions that let you convert strings to JSON and JSON back into dictionaries or objects. 

**JavaScript**:

```js
JSON.stringify({ key: 'value' })
// => '{ "key": "value" }'

JSON.parse('{ "key": "value" }')
// => { key: 'value' }
```

**Python**:

```py
import json

json.dumps({ 'key': 'value' })
# => '{ "key": "value" }'

json.loads('{ "key": "value" }')
# => { 'key': 'value' }
```

**Flask**:

You can also `from Flask import jsonify`. It works similar to `json.dumps` but has some additional functionality such as formatting the response header the right way if you use it in Flask. 

## RESTful API Design

**REST** (Representational State Transfer) is a pattern for setting up the routes of your backend. You have already learned about it a little bit. It becomes particularly important when talking about APIs. 

The idea of **REST** is to give the naming of the URLs for your API a specific meaning and structure. The core concept isn't too complicated. 

When returning a collection of multiple data items in a collection you start the route by naming the collection: 

```
/cookies
```

If you want to return a single item, you make it a sub-path using either a **slug** or an **ID**:

```
/cookies/2
/cookies/chocolate-chip
```

The number `2`, in this example, would be the `id`. Alternatively, we can define a **slug**. Essential to keep in mind that it's best practice to keep everything lower case and not use spaces or special characters. The only special characters you should use are dashes `-`. 

On top of naming the routes and following the REST pattern, you should also consistently use the proper HTTP methods. For Example: 

* Route for listing all cookies: `GET /cookies`
* Route for showing a single cookie: `GET /cookies/2`
* Route for creating a new cookie: `POST /cookies` (plus some data)
* Route for updating a cookie: `PATCH /cookies/2` (plus some data)
* Route for deleting a cookie: `DELETE /cookies/2`

## API Design in Flask

So now you know the two most important aspects of building an API: RESTful routing and JSON data structures.

To put it in practice in our cookie shop, we're going to build an API that's going to return all orders that have been made. Obviously, this is sensitive information. So we'll also have to make sure to secure our API, and you'll learn how to do that at the end of this exercise. 

To start things off, we have to decide what URLs we'd like to have for our API and where to put it in our folder structure.

A common practice is to add a version number to the URL of your API. Because, by nature, an API is something that interacts with other applications, you want to make sure any changes you make in your code don't break the other application. So we're going to use this URL for our API:

* GET `/api/v1/orders`

This will return a specific data structure. If we ever decided to change the data structure, any applications using our API would immediately break. That's what the `/v1` is for. If we want to make changes to the data structure, later on, we can just create a new route `/api/v2/orders` so that other applications have time to implement the changed data structure and switch to the new route. This kind of transitional process is very common when working when APIs. 

Now, we need to think about where to put our API code. We could just add another route in the **orders** blueprint **route.py** file. That would be a fair approach. But another possible approach is to keep the API completely separate from the rest of our application. We'll go with the second option. So let's create a new blueprint. 

Create a new folder **/app/api**. Then create the following two files:

**/app/api/\_\_init\_\_.py**

```py
from . import routes
```

**/app/api/routes.py**

```py
from flask import Blueprint

blueprint = Blueprint('api', __name__)

@blueprint.get('/api/v1/orders')
def orders():
  return {
    "data" : "Hello World"
  }
```

The code above should look mostly familiar. There is one change, however. The route function does not `return` a string. It also doesn't return a `render_template()` function. Instead, it returns a Python dictionary. Flask is smart enough to turn the dictionary into a JSON string automatically. However, Flask would stop being so smart by itself if the value wouldn't be a string. A better way to return JSON in Flask is to write: 

```py
from flask import Blueprint, jsonify

blueprint = Blueprint('api', __name__)

@blueprint.get('/api/v1/orders')
def orders():
  return jsonify({
    "data" : "Hello World"
  })
```

With `jsonify()` other data types are also properly converted.

Register the blueprint in **/app/app.py** by first adding it to the import statement: 

```py
from . import cookies, simple_pages, orders, api
```

Then, register the blueprint with all the other blueprints: 

```py
app.register_blueprint(api.routes.blueprint)
```

If you now access [http://127.0.0.1:5000/api/v1/orders](http://127.0.0.1:5000/api/v1/orders), you should see the JSON data displayed right in the web browser.

That's it. Now, you're technically done building a JSON API in Flask.

## Create a Serializer in Flask From Scratch

APIs oftentimes return data from a database. But in many cases, you don't return the data one-to-one. Instead, you want to structure the data returned by your API in a specific way. Maybe you even want to combine multiple database records into a single data structure. This process is called **serialization**: Taking data from, e.g., a database and turning it into structured data (e.g., JSON).

Since generating this kind of JSON will be slightly more complex, it's a good idea to move that into its own file. Create a new file with the following path: 

**/app/api/services/serialize_orders.py**

You can see that we created with that a new folder called **services**. That's a common name for any business logic files in our code. 

In there, let's create a new function:

```py
def serialize_orders(orders):
  return []
```

We can now import that function in **/app/api/routes.py**:

```py
from .services.serialize_orders import serialize_orders
```

You can see that we already defined the variable `orders` as the argument of the function. That's because we want to **serialize** data coming from the `Order` model. We could technically avoid using an argument and just `import` the model in the serializer file directly. But it's cleaner to use the **controller** (aka **router.py**) to connect all the different parts of our app and keep files such as the serializer independent from other parts of our code.

So in order to serialize the `Order` data, we need first to query it. So import the `Order` model in **/app/api/routes.py**:

```py
from ..orders.models import Order
```

Now you can `query` all orders from within the `order()` function. And while we're at it we'll forward all orders to the `serialie_orders()` function: 

```py
@blueprint.get('/api/v1/orders')
def orders():
  orders = Order.query.all()
  
  return jsonify(
    serialize_orders(orders)
  )
```

We keep the `jsonify` because `serialize_orders()` is just for creating a new data structure that technically doesn't have to be JSON. 

Now, let's build out the `serialize_orders()` function. A good place to start is to look at what data structure you want to have in the end. It can be helpful just to write down a fake version just to visualize what it should look like.

For example: 

```py
[
  {
    "id": 1,
    "date": "2022-03-14 13:27:36",
    "address": {
      "city": "Jane", 
      "country": "123 Main St", 
      "name": "Anytown", 
      "state": "CA", 
      "street": "12345", 
      "zip": "Candyland"
    }, 
    "cookie_orders": [
      {
        "cookie_id": 1, 
        "cookie_name": "Chocolate Chip", 
        "number_of_cookies": 15
      },
      {
        "cookie_id": 2,
        "cookie_name": "Oatmeal Raisin", 
        "number_of_cookies": 3
      }
    ]
  },
  {
    "id": 2,
    ...
  }
]
```

Take a moment to understand the data structure above. You can see it starts off with a list. In that list, each item is a dictionary. Each dictionary represents an order with an `id` and `date`. Then, there is an `address` which is yet another dictionary. It contains all the fields that we have on the `Address` model **except** for the `id`. Finally, there is `cookie_orders`, which is another list of dictionaries. Each dictionary represents a single `CookieOrder` entry. But there is something special with the `CookieOrder`. It also includes a `cookie_name` field. That's not part of the `CookieOrder` model. So we'll have to get that from the related `Cookie` object. 

Alright. That's quite a lot. So let's break it down and go step by step. Let's start by just returning a list of orders with their `id` and `date`: 

```py
[
  {
    "id": 1,
    "date": "2022-03-14 13:27:36",
  },
  {
    "id": 2,
    "date": "2022-03-14 14:12:22",
  }
]
```

Go back to where the `serialize_orders(order)` function is defined. In order to turn `orders` into a list of dictionaries we can just loop over it and `append` the specific properties we want to append: 

```py
def serialize_orders(orders):
  orders_list = []

  for order in orders:
    orders_list.append({
      'id': order.id,
      'date': order.date.strftime('%Y-%m-%d %H:%M:%S'),
    })

  return orders_list
```

This is pretty basic Python code. For each item in `orders`, we `append` a dictionary with the keys `id` and `date`. For the date we added the `strftime()` function to custom format what the date should look like. You could also leave it and write `order.date`. It would still work perfectly fine. [strftime](https://strftime.org/) is a standard that is used in many different programming languages (not just Python). It allows you to define in a string how you want to format your date. 

If you want to test the result, you could write an actual test. For the sake of time, we're going to skip that in this exercise. To test it in the web browser, make sure you have already created a few orders on the checkout page. If you then go to [http://127.0.0.1:5000/api/v1/orders](http://127.0.0.1:5000/api/v1/orders) you should see our JSON structure show up.

Next, let's add the address. That's actually not too difficult either. Because we set up a basic relationship, we can access an order's address with `order.address`. 

```py
def serialize_orders(orders):
  orders_list = []

  for order in orders:
    orders_list.append({
      'id': order.id,
      'date': order.date.strftime('%Y-%m-%d %H:%M:%S'),
      'address': {
        'name': order.address.name,
        'street': order.address.street,
        'city': order.address.city,
        'state': order.address.state,
        'zip': order.address.zip,
        'country': order.address.country
      }
    })

  return orders_list
```

As you can see, we just created a new nested dictionary, and each item in that dictionary is manually assigned using `order.address`. Try it out in the browser!

Finally, we're going to add the related `CookieOrder` records. Mapping the `address` was easy because it's a **one-to-one** relationship. There could be multiple `cookie_orders,` and I don't know ahead of time how many there will be. So I need to use another loop to generate the list of `cookie_orders`. 

To keep my code clean and readable despite the nested loops, let's create a new function that is going to return the list of `cookie_orders`. You can write it above the `serialize_orders()` function. 

```py
def serialize_cookie_orders(cookie_orders):
  cookie_orders_list = []

  for cookie_order in cookie_orders:
    cookie_orders_list.append({
      'cookie_id': cookie_order.cookie_id,
      'number_of_cookies': cookie_order.number_of_cookies,
      'cookie_name': cookie_order.cookie.name
    })

  return cookie_orders_list
```

Take a moment to understand what happens. It works pretty much the same way as the other function. Instead of passing `orders` we're passing `cookie_orders` as an argument. Then, we loop over them, and for each of them, we'll return the `cookie_id` and the `number_of_cookies` properties. But we also add a third property that isn't on `CookieOrder`: `cookie_name`. Because `Cookie` is set up to be related to `CookieOrder`, querying the cookie and getting its `name` is as simple as writing `cookie_order.cookie.name`. 

We can now call this function back in the `serialize_orders` function with `order.cookie_orders` as the argument: 

```py
def serialize_orders(orders):
  orders_list = []

  for order in orders:
    orders_list.append({
      'id': order.id,
      'date': order.date.strftime('%Y-%m-%d %H:%M:%S'),
      'address': {
        'name': order.address.name,
        'street': order.address.street,
        'city': order.address.city,
        'state': order.address.state,
        'zip': order.address.zip,
        'country': order.address.country
      },
      'cookie_orders': serialize_cookie_orders(order.cookie_orders)
    })

  return orders_list
```

If you refresh the page now, it should render the full data structure as we had it defined before. 

In a real-world application, you'd probably want to implement some **pagination** and not just return all orders at once. You can follow the instructions of the [pagination exercise](/flask-tutorial/v1/pagination-and-query-parameters/) and apply the exact same principles here. The difference is that you won't need to add any HTML. But splitting your data into pages is just as possible with JSON as it is with HTML. 

## API Key in The Header to Protect The API

As mentioned before, the data returned by our API is quite sensitive. So we should make sure only the right people can see it.

The best way to do this with APIs is to use token-based authentication with JWT (JSON Web Tokens). There is a [library that makes it relatively straightforward](https://pyjwt.readthedocs.io/en/latest/). 

For the purposes of this exercise, however, let's go with the simplest possible solution. Technically, all we need is a secret **API key** that only you know. Whenever a request is made, this key would have to be part of the request. There are a few ways to solve this. But first, let's define the key in the **.env** file. You can use [this website](https://randomkeygen.com/) to get a random key and set an environment variable called `API_KEY`. For example: 

```
API_KEY=OI2QHUlmiHrJSQWJ14d2xocafGm15QDq
```

It's best practice to keep secret keys always in your environment variables and make sure they are **never** committed to a git repository.

You can access the environment within the **/app/api/routes.py** file by first importing `environ`

```py
from os import environ
```

Now, the first method to require an API key in incoming requests is to require it as part of the query string. For example, you could require the URL request to look like this: 

```
GET /api/v1/orders?key=OI2QHUlmiHrJSQWJ14d2xocafGm15QDq
```

To check for the key, you could adjust your route function accordingly 

```py
@blueprint.get('/api/v1/orders')
def orders():
  if environ.get('API_KEY') == request.args.get('key'):
    orders = Order.query.all()
    return jsonify(
      serialize_orders(orders)
    )
  else:
    return jsonify({'error': 'Invalid API key'}), 401
```

Don't forget that you need to `import` `request` from `flask`. 

In the code above, we use a condition to compare the key from the request parameters with the `API_KEY` environment variable. If it isn't the right key, we return an error message as JSON structure along with the HTTP status code `401`, which stands for "Unauthorized." The last two things are completely optional. But it's good practice to follow common conventions such as the HTTP status codes. It's also good practice to use error messages and tell users what went wrong.

If you now try to access [http://127.0.0.1:5000/api/v1/orders](http://127.0.0.1:5000/api/v1/orders) you should get an error message while accessing [http://127.0.0.1:5000/api/v1/orders?key=OI2QHUlmiHrJSQWJ14d2xocafGm15QDq](http://127.0.0.1:5000/api/v1/orders?key=OI2QHUlmiHrJSQWJ14d2xocafGm15QDq) should give you the proper results. (Keep in mind that your key might look different, of course.)

The second and more common method would be to require the key in the **head** of the request instead of the URL. The head usually contains some meta-information, including information about the data type (such as HTML or JSON).

You can also add custom information to request headers. To read header information, you can use the `request.headers` object. That works very similarly to the `args` object: 


```py
@blueprint.get('/api/v1/orders')
def orders():
  if environ.get('API_KEY') == request.headers.get('X-API-KEY'):
    orders = Order.query.all()
    return jsonify(
      serialize_orders(orders)
    )
  else:
    return jsonify({'error': 'Invalid API key'}), 401
```

The name `X-API-KEY` is again a common way of naming the custom key field in the header. It's not required but always good to follow the standard practices.

_(Side note: You can also add headers on the backend. Find out more about it [in the official documentation](https://flask.palletsprojects.com/en/2.0.x/quickstart/#about-responses).)_

## Aside: Testing Your API

When making requests through the web browser, you can't easily make changes to the header values. Those are set by the browser automatically. That's usually no issue because APIs are usually not accessed by the web browser but instead by other software.

A popular tool for testing APIs is the software [Postman](https://www.postman.com/). A simpler and free way to test it is **cURL**. You can learn the [basics of cURL in this tutorial](/development/basics/curl). Essentially, you can use the command `curl` in the command line to make HTTP requests to any URL.

With `curl 127.0.0.1:5000`, you make a request to the URL `127.0.0.1:5000` - which is your locally running Flask server. 

To add a header, you add the option `-H` or `--header` and then add the header as a string. Try this: 

```sh
curl 127.0.0.1:5000/api/v1/orders -H 'X-API-KEY: OI2QHUlmiHrJSQWJ14d2xocafGm15QDq'
```

This should return the JSON in your command line. 

## What We Didn't Cover 

In this exercise, we focused entirely on the backend. We didn't talk about actually working with an API on the client side. That has to be covered separately. You can access APIs from other backends (including Flask), native applications, or JavaScript frontend applications.

We also didn't write tests this time around. A good next step for you could be to add some tests and make the code more robust this way. 

## 🛠  Practice 

1. Implement specific API endpoints with proper versioning and RESTful naming.
2. Create a serialize and serialize the response data for your API so that it can be turned into JSON. 
3. Optionally, protect your API with an API key. 