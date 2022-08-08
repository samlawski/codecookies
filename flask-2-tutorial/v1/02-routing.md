---
title: Routing
videoId:
slug: "routing"
lastUpdate: April 8th, 2022
---

Routing is one of the core features of any web application. Routes define how clients can access an application. 

## Root

The most common route, referred to as "root" route is usually defined with a single forward-slash `/`. This is the home page of most websites. If you think of a static website of just HTML files, the root would be defined by an `index.html` file. 

This website's **root** is `https://codecookies.xyz`. The trailing slash is optional but could also be added: `https://codecookies.xyz/`.

In Flask, you create a root route using a decorator method `@app.route('/')` combined with a function that _you define_. This is what it could look like:

```py
@app.route('/')
def index():
  return 'Hello World!'
```

Whenever a person navigates to the **root** of your website, the function `index()` is executed. And whatever that function `return`s will also be returned to the user. In this case, the route just returns text. So the user will see just that text in the web browser.

## More Routes

Other routes are usually defined by different strings following after the slash `/`. For example, the route of this page is `/flask-2-tutorial/routing/`. You can see it in your web browser.

To define more routes in Flask, you can just add more functions and decorator methods and change the parameter of the `.route('/')` method to whatever route you would like to define. 
It's **important**, though, that the function name is different for each route!

Let's try it out. Add another route to your **app.py** file below the existing route but _above_ the `app.run()` and its condition.

```py
@app.route('/about')
def about():
  return 'I like cookies'
```

Now, try to navigate to [127.0.0.1:5000/about](http://127.0.0.1:5000/about) in your web browser. You should now see the text "I like cookies". 

That's how you create multiple pages! You can add a few more routes just to try it out. You may notice now why it might make sense to use multiple files in larger projects. For websites with a lot of pages, a single app.py file might get a little full. But you'll learn more about that later.

One more thing that is quite nifty about decorators is that you can add multiple of them to the same route function. So let's say you want users to be able to access the `about` page both from the route `/about` and `/about-me`, you could just add an additional decorator to the same function like this: 

```py
@app.route('/about')
@app.route('/about-me')
def about():
  return 'I like cookies'
```

It's not necessarily best practice to have multiple routes for the same page. But sometimes, it's unavoidable. If you try accessing the page in your browser, you'll notice that it'll show the URL `/about-me` at the top as it shows the content of the `about` route. 

Another option could be to use a `redirect`. Maybe you want users to be able to use the `about-me` route to get to the about page. But you don't want that route to show up in the URL. Maybe for SEO reasons, you want to make sure only to have a single route for your page.

To do that, you need to `import` two functions from the Flask package, just like we did with the `Flask` class. You need to import `redirect` and `url_for` and can just add it to the existing `import` statement. Here is what it'll look like: 

```py
from flask import Flask, redirect, url_for
```

We'll look at what each function does individually. First, remove the `@app.route('/about-me')` decorator again from the `about` function and use it to create a new route (and don't forget that it needs to have a different name than the `about` route). Next, let's see how `redirect` works. Just add it with a random URL. For example like this:

```py
@app.route('/about-me')
def about_me():
  return redirect('https://codecookies.xyz')
```

Try accessing the page in your web browser. You'll see that you will just be redirected to that URL. Now, try changing it to this: 

```py
@app.route('/about-me')
def about_me():
  return redirect('/about')
```

You'll see that you can also use this to redirect to local routes. This is an ok solution. But a better solution is to use the `url_for` function we imported earlier. Imagine you want to change routes later on and move things around. In that case, it might be better if you could just say you want to link to whatever the `def about():` function returns - unrelated to its route. For that, you can use the `url_for` function. `url_for('about')` will return the URL of the route to your `about()` route regardless of what's defined in the `@app.route()` decorator. So to combine the two, change the code to this: 

```py
@app.route('/about-me')
def about_me():
  return redirect(url_for('about'))
```

Without `url_for` you'd redirect to a page based on what's defined using `@app.route()`. With `url_for` you can redirect to a route based on the name of the function you defined. Both approaches are valid and good to know about.

## HTTP methods

So far, we have defined only routes for the HTTP GET method. HTTP is a standard to help servers and clients communicate uniformly. There are [many different HTTP methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods). The most common ones are `GET` and `POST` (closely followed by `PUT`, `PATCH`, and `DELETE`). 

You will learn more about the different types of HTTP methods later on when we talk about forms. But so you have already seen it, Flask let's you define which HTTP methods you allow for every route. By default, web browsers send GET requests to servers whenever you enter a URL and hit Enter. HTML forms make POST requests by default.

In Flask, you can specify the type of allowed methods per route by adding it as an additional parameter to your `route` decorator. You can, for example, add the parameter `methods=['GET', 'POST']` to allow both `GET` and `POST`. But you could also only allow `POST` or only allow `DELETE`.

This would, for example, look like this:

```py
@app.route('/', methods=['GET', 'POST'])
def index():
  return 'Hello World!'
```

Since Flask 2 it's possible to also define routes and methods at the same time with a shorter way of writing it: 

```py
@app.get('/')
def index():
  return 'Hello World'
```

This will only allow GET requests, while the following code will only allow POST requests:

```py
@app.post('/contact')
def contact_form()
  return 'Submission received'
```

But you'll learn more about how to use different methods later. 

## Return HTML

So far, we've only returned text from our routes. But web browsers understand HTML. So instead of just text, I could also return HTML. In fact, my routes can return anything I like. They could return files (to download) or other formats like JSON. You learn about some of those alternatives later on. For now, we want our backend to return HTML as we're right now building a backend that's accessed via the web browser. 

To return HTML, I would simply add it to the string I'm returning. Try adding some HTML to the existing routes of your application. 

For example: 

```py
@app.route('/')
def index():
  return '<h1>Hello World!</h1>'
```

This way, you can also add pictures or links. Let's try linking to the about-page we previously created: 

```py
@app.route('/')
def index():
  return '''<h1>Hello World!</h1>
  <a href="/about">About Page</a>'''
```

Notice two things in the example above:

1. As you use quotes in HTML, make sure you use different ones than the ones you used to define the Python string. If you for example did this `return "<a href="/about">About Page</a>"`, you'd use double quotes both to define the Python code and the attribute value in HTML. This would break your Python code. There are two ways to solve this: Either you use different types of quotes `return '<a href="/about">About Page</a>'` or you **escape** the quotes inside the HTML with backslashes like so: `return "<a href=\"/about\">About Page</a>"`.
2. I used three single quotes to define the beginning and end of the string (this would also work with three double quotes). This is a standard way in Python to allow defining strings with multiple lines. This allows me to split the HTML into two lines and keep my code more readable.

Try out different HTML tags and view the results in the web browser.

## Executing Backend Code

Up until now everything we've done was just return some text and HTML. You may wonder what we even need a web server for. Everything we've built would have been done much easier with a static website built of simple HTML files. No need to have Python or Flask involved. And you would be right! So far, we have not done anything you'd need server code for. As you plan your web project, this is important to keep in mind. 

The power of having a backend is that you can execute code on the server **after the user has entered the URL** but **before the page is returned to the user**. This is different from, for example, JavaScript or React. JavaScript code is always first downloaded to the user's browser and then executed in the browser after the page was already loaded. Backend code, on the other hand, (such as Python, PHP, Ruby, or JavaScript in Node.js) is executed on the server. The code will remain only on the server, and the user only receives whatever you `return` to them. 

Have a look at your routes. They are just Python functions. Within those functions and **before** the `return` statement, you can execute any Python code you like. 

For example, you could build a website that randomly generates a number on the backend and returns it to the user. Maybe not the most useful - but then again, random.org is quite popular. Here is a simple version of random.org built-in Flask: 

```py
from flask import Flask
from random import randint

app = Flask(__name__)
app.config.from_object('config')

@app.route('/')
def index():
  random_number = randint(1, 100)

  return '<p>A random number between 1 and 100 is <b>' + str(random_number) + '</b></p>'

if __name__ == '__main__':
  app.run()
```

The code example above is very much like our very first, simple Flask application. Additionally, we import the function `randint` from Python's standard library `random`. Then, in our `index()` function, we have an extra line to use `randint()` to generate a random number between 1 and 100 and store that in the variable `random_number`.

The `return` statement includes some HTML to display the result as a paragraph and the random number in **bold**. Notice, how in `randint()` will return a `number` type. That's why in Python, we need to use `str()` to convert that number to a string before we can _add_ it to the rest of our return string. 

The _adding_ is just standard Python syntax to add multiple strings together and generate a single one. 

If you test that page and look at the page source in your web browser, you'll see something like this: 

```
<p>A random number between 1 and 100 is <b>83</b></p>
```

You'll see that all that the client receives is just the returned HTML string. Nothing else from the code is visible.

## Dynamic Routes

Sometimes, you want to define dynamic routes. Maybe you want to allow users to define routes for some pages of your app. Or maybe you have a blog with many articles. Imagine you have a blog with a thousand articles and have to define every article route by hand using a decorator method and function. 

That's what you need dynamic routes for. Dynamic routes let you add _variables_ to routes that can be defined programmatically. 

Let's say I want to have a cookies webshop. Users should be able to see an overview page with all cookies available on my website. Additionally, I want to have an individual page for each type of cookie. This is what I imagine in terms of routes:

```
mycookieshop.com/cookies/ 

mycookieshop.com/cookies/chocolate-chip
mycookieshop.com/cookies/oatmeal-raisin
mycookieshop.com/cookies/sugar
mycookieshop.com/cookies/peanut-butter
mycookieshop.com/cookies/oatmeal
mycookieshop.com/cookies/salted-caramel
```

The first route would list all the cookies. The following routes are examples of different types of cookies I want to sell individually. Each cookie should have its own page. 

Of course, these are only four cookies. So I could define a route in Flask for each of the routes easily. But I want to scale my shop later on. So I want to set it up dynamically. 

We're going to worry about the index route to show all cookies (/cookies) in the next exercise. For now, we're going to focus on the dynamic routes for our cookies. 

To define a variable in a route, you just write it within `<>` angle brackets and add it as a parameter to your function. Let's define a cookie route:

```py
@app.route('/cookies/<slug>')
def cookie(slug):
  return slug
```

Try adding this route to your project. Then, try accessing a few different routes like [127.0.0.1:5000/cookies/chocolate-chip](http://127.0.0.1:5000/cookies/chocolate-chip), [127.0.0.1:5000/cookies/bananas](http://127.0.0.1:5000/cookies/bananas), or anything you can come up with. 

Notice the `/cookies/` part of the URL is still a set string. The only thing dynamic is whatever follows after in the place where you wrote `<slug>`. It's important that whatever you write in the angle brackets `<>` you also add as a parameter to the route function below. 

"slug" is usually referred to as a string identifier of a page that is formatted in a URL-friendly way. So, for example, "chocolate-chip" is URL friendly because it doesn't contain special characters or spaces and is all lower case. `mycoocieshop.com/cookies/Chocolate Chip` would **not** be URL-friendly. Therefore it's not considered a "slug". You can name the variable whatever you want. I just chose "slug" because it describes what I expect the user to type in here. 

Right now, the route only returns the slug itself. That's not very useful. Let's add some functionality. I prepared a dictionary where each key is a unique _slug_ for my cookie. The value is another dictionary with details about each cookie: 

```py
cookies_data = {
  'chocolate-chip' : {'name': 'Chocolate Chip', 'price': '$1.50'},
  'oatmeal-raisin' : {'name': 'Oatmeal Raisin', 'price': '$1.00'},
  'sugar' : {'name': 'Sugar', 'price': '$0.75'},
  'peanut-butter' : {'name': 'Peanut Butter', 'price': '$0.50'},
  'oatmeal' : {'name': 'Oatmeal', 'price': '$0.25'},
  'salted-caramel' : {'name': 'Salted Caramel', 'price': '$1.00'},
}
```

You can add that somewhere above the routes of your project. 

I picked this structure because now I can just easily grab any cookie's information with the slug. For example, `cookies_data['chocolate-chip']` will return this dictionary `{'name': 'Chocolate Chip', 'price': '$1.50'}`. And `cookies_data['chocolate-chip']['price']` would return the price as a string: `'$1.50'`.

We can make use of that in our route by changing a tiny piece of it: 

```py
@app.route('/cookies/<slug>')
def cookie(slug):
  return cookies_data[slug]
```

Now, save everything and try accessing [127.0.0.1:5000/cookies/chocolate-chip](http://127.0.0.1:5000/cookies/chocolate-chip). Your web browser should return the Python dictionary as is. That's not very pretty. So let's adjust that a little bit. Maybe display the name and price: 

```py
@app.route('/cookies/<slug>')
def cookie(slug):
  return '<h1>' + cookies_data[slug]['name'] + '</h1><p>' + cookies_data[slug]['price'] + '</p>'

```

With that, try again and maybe try some different routes as well: [127.0.0.1:5000/cookies/salted-caramel](http://127.0.0.1:5000/cookies/salted-caramel).

To improve our program and avoid errors, we could even add some logic that checks whether a cookie with the given slug exists. If it doesn't, we should return an error message instead: 

```py
@app.route('/cookies/<slug>')
def cookie(slug):
  if slug in cookies_data:
    return '<h1>' + cookies_data[slug]['name'] + '</h1>' + '<p>' + cookies_data[slug]['price'] + '</p>'
  else:
    return 'Sorry we could not find that cookie.' 
```

Alright! You build some dynamic routes now. Work on this a little more. Try out different routes, add more cookies and see what happens. 

## Typing of Dynamic Routes

Sometimes, instead of text, you'd like to use different types of data in your routes. Maybe, instead of using the slug to find a cookie, you actually want to use a number ID. 

Let's say our list of cookies is a _list_ and not a _dictionary_:

```py
cookies_data = [
  {'name': 'Chocolate Chip', 'price': '$1.50'},
  {'name': 'Oatmeal Raisin', 'price': '$1.00'},
  {'name': 'Sugar', 'price': '$0.75'},
  {'name': 'Peanut Butter', 'price': '$0.50'},
  {'name': 'Oatmeal', 'price': '$0.25'},
  {'name': 'Salted Caramel', 'price': '$1.00'},
]
```

Now, to access an individual cookie dictionary, you'd write something like this: `cookies_data[0]`. To access the price of the first cookie, you'd write `cookies_data[0]['price']`. Notice how you need an integer (instead of a string) to access the item in a list. 

Flask gives you extra tools to work with other types of data such as integers. All you need to do is to define the variable type in the route using a colon: `@app.route('/cookies/<int:id>')`. In this example, you define the variable called `id` to be of the type `int` - which stands for integer. 

To use that variable, your route could look like this: 

```py
@app.route('/cookies/<int:id>')
def cookie(id):
  return '<h1>' + cookies_data[id]['name'] + '</h1>' + '<p>' + cookies_data[id]['price'] + '</p>'
```

In the example above, the _type_ of the variable `id` is "integer". In the example with the "slug", the `slug` variable was the type of "string". Keep the difference in mind, as it might be helpful later on whenever you want to work with numbers in URLs. 

## 🛠  Practice 

What you have learned in this exercise gives you many tools and power to build a full website with different pages. You can even build a website with different routes. 

Try out what you have learned in a **completely separate** project from the tutorial project. Only then you really get practice with the material. 

Here are some things you could try to implement: 

1. Come up with a data collection of your choice. It could be cookies, meals, todos, blog posts, whatever you can think of. 
2. Think about the URL you want users to type in to access each individual data element. Based on that, choose a data structure. Maybe a dictionary? Maybe a list? 
3. Define a new route to allow users to dynamically access all the elements of your data collection. It's up to you if you want to use a number or string in the URL. Remember, though, that URLs work best without special characters or spaces. 
4. For each item in your data collection, make sure you render some data using HTML that is specific to only that one data point. (like we did with the name and price of the individual cookie above)
5. Show an error message to the user if an item couldn't be found based on the URL.