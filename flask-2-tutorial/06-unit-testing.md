---
title: Unit Testing
videoId:
slug: "unit-testing"
---

When it comes to clean code and scalable applications, **testing** is an important topic. When people talk about testing they usually refer to **automated tests**, so pieces of code that you write to automatically execute your main application code and see if it really does what it's supposed to do.

If you're not familiar with testing it might seem like a lot of extra work. But the main point of testing is to have a little more work in the beginning so that you have a lot less work later on. Especially with growing applications, tests will help you avoid bugs and issues because they tell you if new code you wrote broke the old code that already existed. 

We're not going to go into the exact benefits of testing in this exercise. We're just going to learn about writing them - whether you want it or not. 

## pytest

As a testing library we're going to use [pytest](https://docs.pytest.org/). It's not exclusively for Flask but provides some nice functionality to get started testing quickly. 

While having your virtual environment active, install it with: 

```
pip install pytest
pip freeze > requirements.txt
```

With pytest we can write **unit tests**. **Unit tests** are the most basic version of tests. As the name suggests, they are meant to test individual units of your code. 

In Flask that means, you'll use **unit tests** to test specific functions, such as routes or other business logic. 

In away, tests are just like a bot that you programmed to execute another program automatically. In this case the program that's executed is your own application. Each test is a little script with instructions on what to do and what you expect the outcome to be. 

Here is a simple example: 

```py
def addition(a, b):
  return a + b

def test_addition():
  result = addition(4,2)

  assert result == 6
```

In the example above, `addition(a, b)` is our application code and `test_addition()` is the test script that is supposed to test that our application code actually works. You can see that the `test_addition()` function first executes the `addition()` function. The `assert` keyword is used in `pytest` to say "Make sure the following statement is `true`". The following statement, in this case, checks that the `result` of the `addition()` function is `6` in case we pass `4` and `2` as parameters. 

That's it. That is what tests do. They execute our code and make sure the result is what we expect it to be. 

One file note: When you run tests, pytest will create a temporary cache folder we don't want to be part of our repository. So in your **.gitignore** file, add `.pytest_cache` on a new line.

## Initial Setup

When writing tests within a Flask application there are a couple more steps before you can get started. That's because our application technically needs a **server** to be running. So some parts (such as our routes) needs some additional set up. 

First, create a new folder in the **/app** directory called **tests**. In that folder add an empty **__init__.py** file. This file will turn the **tests** folder into a module and allow for easier importing. 

Next, add another **__init__.py** file to the **/app** folder. This will turn your entire application into a module and allow us to easily import our blueprint folders and other files from our project in the tests. If you're a little confused about what's happening, I suggest to read up a on Python modules and imports a little bit. 

The new paths of your project should be now: 

* **/app/__init__.py**
* **/app/tests/__init__.py**

Now we add a configuration file to the **/app/tests** folder. Call the file **conftest.py**. It's important that it has that exact name to be recognized by `pytest`. 

In that new file we add a `fixture`. Fixtures allow us to define functions that get executed every time an individual test runs. They can be accessed in an individual test function as an argument (more on that later).

For now, add the following code to your new **conftest.py** file: 

```py
import pytest
from app.app import create_app

@pytest.fixture
def client():
  app = create_app()

  with app.app_context():
    yield app.test_client()
```

First we import `pytest`, the package we installed earlier. Then, we import the `create_app` function from our **/app/app.py** file. This is where the **Factory Pattern** we mentioned previously becomes useful. It allows us to start up our application by just calling the `create_app()` function. 

Now, we define the fixture function using a decorator provided by the `pytest` library. The **fixture** is going to be executed every time the test runs. Whatever the function returns is going to be available through the first argument of our test. (You'll see that in just a minute.)

As first step in the function, we're going to run `create_app()` to have access to the Flask app as if it would be running on a server. 

Flask provides a specific version of itself along with lots of useful helper methods through the `test_client()` method. And we could now just write `return app.test_client()` and it would work for what we have so far. But that wouldn't be enough later on. 

Instead, we use `with app.app_context():`. What this does is saying "within the context of my application do the following". `with` is just regular Python code. If you're not familiar with it you may find [this post helpful](https://stackoverflow.com/questions/1369526/what-is-the-python-keyword-with-used-for).

Within the context we use another uncommon keyword: `yield`. In a way it functions very similar to `return` but would technically allow us to still run some code before **and after** the function is done running (while a `return` statement is always the last thing executed in a function.) A lengthier explanation of [`yield` you find here](https://stackoverflow.com/questions/231767/what-does-the-yield-keyword-do).

## Writing Unit Tests

How do you actually write tests. 

I recommend following the [Arrange-Act-Assess Pattern](http://wiki.c2.com/?ArrangeActAssert). Following this pattern a single test function should always test **a single specific scenario** and have the three elements: Arrange, Act, and Assess (with the first two elements being optional).

During the **arrangement**, you may set up any fake data you need for the test or execute any functions that need to be executed **before** the actually tested code. 

**"Acting"** refers to actually executing the function that you want to test. So for example, if you're testing a route, in this phase you'd execute a function that makes a request to the route that you want to test. 

The final part of a test function is **assert**. Asserting means to check if the result of whatever happened during the **acting** is what you expect it to be. Our test example, above, didn't need any **arrangement**. It started with the **acting**:

```py
def test_addition():
  # no arrangement needed
  result = addition(4,2)  # act
  assert result == 6      # assert
```

## Testing Flask Routes

Let's apply what we just learned and write a first test for the index route of our application.

In your **/app/tests** folder create a new folder called **simple_pages**. In it, create a file called **test_routes.py**. The final path should be: **/app/tests/simple_pages/test_routes.py**.

The name actually matters here. Pytest will automatically look for files prefixed with `test_` and execute those. So technically anything that comes after the `test_` does not matter anymore (except for the `.py`). But it's good practice to use the file name of the file we want to test. And in our example, we want to test functions inside the **/app/simple_pages/routes.py** file. 

In that file, for now, we don't need to import anything. Write the following code (and again don't just copy and paste): 

```py
def test_index_success(client):
  # Page loads
  response = client.get('/')
  assert response.status_code == 200
```

Save the file and now execute `pytest` in the command line (while being in the active virtual environment). If everything went well you should now see something like this: 

```
================= test session starts ===============
platform darwin -- Python 3.9.7, pytest-7.0.0, pluggy-1.0.0
rootdir: /Users/username/projects/cookieshop
collected 1 item                                                                                            

app/tests/simple_pages/test_routes.py .              [100%]

================== 1 passed in 0.07s ================
```

Congratulations! You wrote and executed your first test! 

_Side note: I like to use `pytest -v` when I run my tests because it outputs a full list of all the tests that were executed and helps me visualize the different tests._

Now, let's look at what the test did. 

First we define a function. The function follows the naming convention of starting with `test_` followed by the name of the function from the **routes.py** file we're testing. In this case that's the `index()` function. Only the `test_` prefix is required. Everything else is up to you. You'll see that the name I chose also has a `_success` in the name. This is a very opinionated approach that you may not see other people doing. I did it here because I may want to write multiple tests for the `index` function. So I made a name that includes what I expect the outcome of the test to be. 

Notice the `client` argument of the function. That represents whatever our fixture returns. Remember, earlier we defined a fixture and told it to `return app.test_client()`. So the `client` variable here represents `app.test_client()`, a Flask object that gives us access to some useful test functions. 

The first line contains a comment just describing what I expect the outcome of the test to be. This is entirely optional. But one of the purposes of tests is to help document the behavior of your code. So this is a great place to add your expected test outcome or even a user story. 

On the next line, you see us already using one of those test functions. We call `client.get()` and you probably have already guessed, `get()` makes a request to whatever route we define as argument. In this case, we define the route `'/'` but it also could have been `'/about'` or `'/cookies'`. Those other routes, we want to test separately though and this particular test is for our `index()` function. That's why we `get` `'/'`, which is the root route of our website. 

The response of whatever the `get()` function returns we store in the variable `response`. The response is another object [defined by Flask](https://flask.palletsprojects.com/en/2.0.x/api/#flask.Response) with a number of useful parameters. Check out [the documentation](https://flask.palletsprojects.com/en/2.0.x/api/#flask.Response) to get an idea of the different parameters and methods you have access to with `response`. 

In our test, we access the `.status_code`. That code tells us the HTTP response code. You may know the famous 404 error. That would be the status code in case the page doesn't exist. In fact, just try it: Change the route in the `.get()` method to something that doesn't exist - e.g.: `response = client.get('/asdfasdf')`. Now, run `pytest` again. You should get an error that says something like this: 

```
E     assert 404 == 200
E      +  where 404 = <WrapperTestResponse streamed [404 NOT FOUND]>.status_code
```

That's good! One of the most important things to learn when writing tests is that failing tests are **not bad**. In fact, failing tests are the whole reason we write tests. They help us identify issues with our code.

So this failed test told us that we expected the status code `200` but got `404`. You can see that the failure message of the test replaced the `response.status_code` automatically with the value it represented when the test ran. Remember this! That's super important when debugging your code and understanding what went wrong. 

Now, fix the test by defining the correct route again. You also know enough to go back and add tests for all the other routes in your **/app/simple_pages/routes.py** file. Create a new test function for each route - making sure to adjust the name of the test function and the route of `get()` every time.

When you run the test, you may get failures. Make sure to only add one test at a time so that you're not hit with multiple errors. Read the failure message and try to understand what the issue is. Maybe you just found a bug in your code that needs fixing?

If you have  used the `redirect` method from the previous exercises, you'll likely run into an error `assert 302 == 200`. That's because redirects have a different status code (302) than just regular responses. Since we expect the function to return a redirect, it would be correct to change the test to this: 

```py
def test_about_me_redirects(client):
  # Page redirects
  response = client.get('/about-me')
  assert response.status_code == 302
```

Notice that I also adjusted the name and comment accordingly.

## Testing Page Content

Testing for status code is all fine but not totally useful yet. To have a good test coverage you want to write test that cover the most important aspects of your application. 

When it comes to testing routes, your tests should make sure that users sees what you want them to see. So it makes sense to test whether the returned content is what you expect it to be. 

One way to test the content would be to test if a specific sample subset of content exists. Ideally that's something that only exists on that page.

On our index page, I have the phrase "Welcome to my cookie shop" in my HTML. I know that phrase will only show on that page. So I can use it for my test. 

Let's start by writing a failing test. Then, we change it to passing. It's always a good idea to start with a failing test to avoid any issues with accidental false passes. 

Let's create a new test:

```py
def test_index_content(client):
  # Returns welcome text
  response = client.get('/')
  assert b'this text does not exist' in response.data
```

Here we use the [`data` parameter of the response object](https://flask.palletsprojects.com/en/2.0.x/api/#flask.Response.data). `response.data` represents the contents of whatever the response returns. For an HTML response that would be the entire HTML code of the requested page for example. 

The `assert` statement checks if the string `'this text does not exist'` is part of the HTML code that is represented by `response.data`. The `b` in front of the string makes sure the string is formatted correctly.

## Testing Headers

The [official documentation](https://flask.palletsprojects.com/en/2.0.x/testing/#the-first-test) includes a lot more examples and I recommend scrolling through them. 

If you have a route that returns a file download (like the `legal` page example from a previous exercise) the `response.data` would be the actual file. A good way to test that kind of response is to test the **response header** (this may also be helpful later on when you learn about authentication).

You can test response headers with `response.headers['Header-Key']` and replace the `Header-Key` with whatever header key you're trying to access. Here is an example to test the `legal` route: 

```py
def test_legal_download(client):
  # Returns legal.txt file
  response = client.get('/legal')
  assert response.headers['Content-Disposition'] == 'attachment; filename=legal.txt'
```

## Conclusion

Now you know how to write unit tests. It's good practice to keep your entire code base well tested at all times. That means, whenever you make changes to existing code you'll also have to change tests. At first this may feel like an extra step. But you'll soon realize that this way you actually catch issues you'd otherwise maybe wouldn't have caught.


## 🛠  Practice 

Now you know how to write unit tests for Flask routes. It's time to add test coverage to your application. 

1. Install `pytest`, create a **/app/tests** folder, and add a `conftest.py` file.
2. Add `__init__.py` files whenever necessary. 
3. Create folders for different blueprints and add tests for your **routes**.