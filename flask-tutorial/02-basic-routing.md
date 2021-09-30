---
title: Basic Routing
videoId: DnyukDK3pGA
---

## Import modules

In Python, you can import packages using the `import` keyword. 

If you want to import a specific class or function from a package or file you write `from package_name import function_name` where "package_name" is the name of a package or file in your project and "funciton_name" the name of a function. It can also be the name of a class or variable. 

In the case of Flask, we actually import the class `Flask` from the package `flask`. 

## Initialize Flask application

To initialize your flask application, create a variable and assign it to an instance of the `Flask` class with `__name__` as the parameter:

```py
app = Flask(__name__)
```

`__name__` helps Flask find other files and modules related to your project.

### Aside: Python classes

If you're not too familiar with what classes look like in Python have a quick look at this example: 

```py
class Cookie:
  def __init__(self, type):
    self.type = type

  def description(self):
    return f'This cookie is a {self.type} cookie.'


my_cookie = Cookie('chocolate chip')

print(my_cookie.description())
# > This cookie is a chocolate chip cookie.

another_cookie = Cookie('oatmeal raisin')

print(my_cookie.description())
# > This cookie is a oatmeal raisin cookie.
```

### Aside: \_\_name__

`__name__` is a predefined variable by Python. In the file that's executed with e.g. `python app.py` it returns a string `__main__`. In another modules that's possibly imported into your main file it returns the name of the module. So in a separate `config.py` file, for example, it would return the string "config". 

## Creating routes

In order to create a route in Flask you first define a function that's meant to be executed when a route is accessed. 

For example: 

```py
def index():
  return 'Hello World'
```

Flask provides you with a decorator method you can use to define which route will point to which funciton. If you want to define the root route to point to the `index()` function you write: 


```py
@app.get('/')
def index():
  return 'Hello World'
```

### Aside: decorators

A decorator function let's you pass the result of one function to another and execute some code before and after it. Imagine for example the following situation in Python: 

```py
def prepend_greeting(original_function):
  return f'Hello! {original_function()}'

def say_name():
  return f'My name is Sam.'

print(
  prepend_greeting(say_name)
)
```

To write the same thing with a decorator you could change your code to this: 

```py
def prepend_greeting(original_function):
  def decorator():
    return f'Hello! {original_function()}'
  return decorator

@prepend_greeting
def say_name():
  return f'My name is Sam.'

print(
  say_name()
)
```

This is a common pattern in Python to help you combine functions. 

In Flask, this pattern is used to connect Flask's own function for routing incoming requests with the functions you write in your application code. 

This way, whenever someone accesses a specific route defined with `@app.get()`, the connected function is executed. And whatever your function returns is returned to the users who access the given route. 

## More Routes

To add additional routes, you can just define new functions and attach decorator methods to them: 

```py
@app.get('/about')
def about():
  return 'I am Sam'
```

You can even define two or more routes to point to the same function: 


```py
@app.get('/about-me')
@app.get('/about')
def about():
  return 'I am Sam'
```

As you work with Flask applications you may come accross an old way of defining routes: 

```py
@app.route('/contact', methods = ['GET', 'POST'])
```

That's valid Flask code and still works. But since Flask version 2 it's recommended to use the newer and more descriptive syntax. 

You can easily define alternative HTTP methods as well: 

```py
@app.post('contact')
```

## Flask Server

To run Flask's own built-in server, just run `flask run`. This will allow you to access your website in the web browser under the URL: [http://localhost:5000]()

## Environment variables

Right now your Flask application server has to restart every time you make a change. That's because Flask thinks it's running on a production environment.

To avoid that you can define an environment variable in the command line before you run the server:

```
export FLASK_ENV=development
```

`FLASK_ENV` is a sepcific environment variable expected by Flask. So it has to be written in exactly this way. 

An alternative way to define environment variables is to use a `.env` file. 

You can create that file and add `FLASK_ENV=development` to it. 

To then use this file, you need a specific Python package.

Run `pip install python-dotenv` to install it. 

Run `pip freeze > requirements.txt` to save it to your requirements.txt file.

Setup a separate config.py file (that's optional but keeps your code cleaner) and add the following code to it: 

```py
from dotenv import load_dotenv

load_dotenv()
```

Finally, tell Flask to use the config file we just created to load as Flask configuration and add the following line in the app.py file below the definition of the `app` variable:

```py
app.config.from_object('config')
```

That's it. 

### Aside: .gitignore

Make sure to add `.env` and `__pycache__` to your .gitignore file. Those shouldn't show up in your git repository either.