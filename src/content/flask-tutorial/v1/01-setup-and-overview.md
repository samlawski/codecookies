---
title: Overview and Setup
slug: "setup-and-overview"
description: Learn to set up a Python and Flask application from scratch and start a server for the first time.
lastUpdate: March 10th, 2023
---

Welcome to a short series on learning how to build Flask web applications! 👋

Flask is a micro-framework. That means it has a whole bunch of pre-written code ready for you to use to build a web application. It'll handle a lot of the work (like routing templating) for you you'd otherwise have to build from scratch. 

Larger frameworks like Django or Ruby on Rails additionally have very opinionated rules on the folder structure of your project. Flask is less restrictive. But that also means that it requires a little more code you have to write yourself. But that's perfect for beginners as it'll help you better understand the structure of a web backend. 

## Prerequisites

I'll assume you have some previous knowledge to keep this course focused. If any of the following topics seem foreign to you, make sure to catch up on them before continuing with this tutorial. 

* Using the [command line](https://web.mit.edu/mprat/Public/web/Terminus/Web/main.html) (on your operating system)
* [Using git](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/GitHub)
* [How the internet works](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work) ([client-server relationship](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview))
* [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML) ([CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS) and [JavaScript](https://javascript.info/) are optional but helpful)
* [Python](https://www.freecodecamp.org/learn/scientific-computing-with-python/#python-for-everybody) (particularly functions, for-loops, object-oriented programming with classes)

## Setup

Create a virtual environment as [described here](/python/v1/virtual-environment) to get started.

Make sure to create a .gitignore file and include the `venv` folder in it. 

Don't forget to **activate** the environment. Then, install Flask with `pip install flask`.

_Side note: If you're on macOS or work with someone who uses macOS, it's a good idea to also add `.DS_Store` to the **.gitignore** file. That's a file automatically created by macOS containing some meta information. It's annoying and useless in our repository code, though._

## Create a Flask App

A Flask app can be as simple as a single Python file. Most larger projects benefit from multiple files. But as we start learning, it can be helpful to have it all in one place to understand how everything is connected a little better. Later in the course, you'll learn to split your application into multiple files. That's considered best practice and will help you a lot as your project grows. 

But for now, create an **app.py** file. In it import Flask like so: 

```py
from flask import Flask
```

This imports the class `Flask` from the package you just installed called `flask`. (It actually matters whether it's lowercase or uppercase! Usually, in Python, when a variable starts with an uppercase letter, it usually means it's a class.)

Now, we want to create an instance of that `Flask` class. So, below the import add: 

```py
app = Flask(__name__)
```

First, we assign a variable called `app`. Throughout our code, we'll use that variable to interact with the Flask app framework. Then, we create an instance of the `Flask` class with `Flask()`. This means the app will represent all the class methods defined by the framework Flask, and we'll be able to use many features like `routing`. 

`__name__` is a variable provided by Python. It's not related to Flask but is available in all Python programs. It represents a string and tells the Flask framework which file of your code is the main file. Right now, it's not extremely necessary. But it will be as your app grows. So it's best practice to have it in there from the beginning. More details on that you can find [here](https://docs.python.org/3/library/__main__.html?highlight=__name__)

Now, we have Flask initialized. But it doesn't do much yet. 

## Creating the First Route

You'll learn more about routes in the future. But in short, routes define the paths a client can enter, for example, in the web browser to access your backend. Without routes, your backend is not available to the public.

To create a route, we can start by defining a Python function that returns some text. Add: 

```py
def index():
  return 'Hello World!'
```

This function just returns some text "Hello World!". I named the function `index` because, in web development, you usually name the start page of your web application `index`. The name of the function could be anything you like, though. 

Right now, it's just a function, though. To connect it to the Flask app, we need to add a _decorator_. Right above the `index()` function add `@app.route('/')`. This is what it should look like: 

```py
@app.route('/')
def index():
  return 'Hello World!'
```

[Decorators](https://docs.python.org/3/glossary.html#term-decorator) are a feature of the Python language but not always well known. Take a moment to read up on them if you're new to the concept. 
In short, they allow you to chain functions. What will happen here is that whenever a user accesses your web app at the route `/` (which is just the domain name without any path added to it - so, e.g. `codecookies.xyz/`), some magic Flask code will be executed hidden behind the `app.route()` method. But because it's a decorator, the `app.route()` method will execute some code **together with whatever your `index()` function returns**.

## Starting a server

Now that we have a route defined, the last step is actually to run our app as a web server. Flask comes with a simple server pre-installed. To make use of it, add `app.run()` at the end of your Python file. 

Now, you can execute the python file with `python app.py` and should see a server running. It'll tell you that you can now access your server using the link [127.0.0.1:5000](http://127.0.0.1:5000). You can just type in that IP in the browser and should see "Hello World" show up.

Very nice. But this part isn't completely done yet. It's common practice to hide the `app.run()` behind a condition to check if the `__name__` variable is equal to the string `"__main__"` like this: 

```py
if __name__ == '__main__':
  app.run()
```

Remember the `__name__` variable from above? The variable will always equal the string `__main__` in the file that's being executed. For example, if you had a separate file in your project called **test.py** and added to it `print(__name__)`, then you'd import the **test.py** file in your **app.py** file with `import test`. Then, you execute the **app.py** file with `python app.py`. In that case, you'd see the word "test" printed out in the command line. If instead, you add `print(__name__)` now in the **app.py** file, you'll see `"__main__"` printed out. Try it to get a feel for it!

This gives you an idea of why we added the condition above. The condition makes sure the server is only started if the **app.py** file is executed directly and **not** executed whenever we access the file by, e.g., importing it. This will be more relevant later on.

## Config and Environment Variables

Right now, you'd have to restart your server every time you make a change in your code. That's a little tedious. Also, you may have noticed a little warning that tells you not to use the server in production. You see that warning because your Flask app doesn't know yet that it's being executed on a development environment (your local computer).

To fix both those things, we can define an [environment variable](https://en.wikipedia.org/wiki/Environment_variable) that tells our app that we are in a development environment. _(Environment variables are variables defined **outside** of your project code, globally on a machine, your computer, or a server - aka "environment". Because they're not defined in your project but on the environment istself, you can set an environment variable to "Development" on your own computer and define the same variable as "Production" or "live" on a server. This way, your code knows where it's being executed. Environment variables can also be used if you want to have a different key/password or link to a database on your server then you have on your local computer.)_

There are many ways to define environment variables. But one way is to use the `python-dotenv` package.

Install it, running `pip install python-dotenv`. To make use of the package, we're going to create a separate config file. 

(Don't forget to run `pip freeze > requirements.txt` afterward!)

Create a file called **config.py**. In it, import `load_dotenv` from `dotenv` and execute that function. It should look like this: 

```py
from dotenv import load_dotenv

load_dotenv()
```

We can use this file later on for other configurations if we need it. 

Now, we need to tell Flask how to find the configuration. Flask has a built-in method to do that. Back in your **app.py** file, underneath the line where you instantiate the `Flask()` class, add a new line:

```py
app.config.from_object('config')
```

The code above tells Flask where to find your config file. The `'config'` is the name of the config file. If the file was named `configuration.py` you should pass `'configuration'` as a parameter.

Now, we can actually create a **.env** file in our project folder. In it, add the line: 

```
FLASK_DEBUG=True
```

>💡 If you're using using a version of Flask older than **2.2** you have to either upgrade to the newest version of Flask for this to work or instead use the environment variable `FLASK_ENV=development`. 

`FLASK_DEBUG` is a [predefined variable](https://flask.palletsprojects.com/en/2.2.x/config/#DEBUG) that Flask will automatically look for. If it's set to `True`, Flask knows we're in a development environment. This will tell Flask that it's ok to automatically restart the server whenever changes are made to the code. if you don't set this variable, the server has to be restarted by hand every time you make a change. 

In a later exercise, you'll learn to deploy your application to a server. You should never set this environment variable to `True` on a server where real users interact with your website!

Lastly, it's very important that your **.env** file is not part of your git repository. So make sure to add it in a new line to your **.gitignore** file. Many people store passwords and keys in the .env file later on. Those should never show up in your repository. 

## Side Note: gitignore pycache

As soon as you start importing different files (aka modules), you may see a folder called **__pycache__** show up in your project. That folder contains some caching files (as you might have guessed) and is not relevant to your code. So you should also add a line with `__pycache__` in it to your **.gitignore** file to keep your code clean.

## Restart the server

That's it. You have set up your Flask application. You can now stop the server with the keys Ctrl + C. Then, start it again with `python app.py`. Whenever you make changes, the server will automatically reload from now on. 

## Recap

That's it! You created a brand new **virtual environment** for your project and installed the **Flask** package using **pip**.

You created your first **route** and now know how to start a simple web server that comes with Flask. You also know how to run the web server in debug mode to make sure it restarts automatically whenever you make changes. 

You also set up your project to be used with other developers (or your future self) through **git** by adding `venv`, `__pycache__`, and `.DS_Store` to a **.gitignore** file and created a **requirements.txt** file with the installed packages.

This is what your project folder should look like now:

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop</div>
  </header>
  <main>
    <ul>
      <li>📁 venv</li>
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 app.py</li>
      <li>📄 config.py</li>
      <li>📄 requirements.txt</li>
    </ul>
  </main>
</div>

## 🛠  Practice 

As you go through the tutorials, I recommend you follow along and write the code as you go through the material. Don't copy and paste but type everything by hand. 

Once you have completed an exercise and written the tutorial code, I recommend you spend some time practicing what you have learned.

This section was about setting up a Flask project from scratch. To practice that a little more, set up a couple more projects entirely from scratch (including the virtual environment). 

_Whenever you start a new project, make sure you're not still within the active environment of another project!!_ To deactivate the environment, simply type `deactivate` in your command line and hit "Enter". 


### Cheat Sheet

**Create a new Python virtual enviornment** (Do only once in the beginning)

```
python3 -m venv venv
```

**Activate the virtual environment** (It's active if you see `(venv)` in the terminal)

macOS & linux:
```
source venv/bin/activate
```

Windows:
```
venv\Scripts\activate.bat
```

**Deactivate the virtual environment** (e.g., when switching folders/projects)

```
deactivate
```

**Install pip packages** (e.g., Flask)

```
pip install flask
```

**Update requirements.txt file with installed packages**

```
pip freeze > requirements.txt
```

**Install packages _from_ a requirements.txt** (e.g., after downloading the repo)

```
python -m pip install -r requirements.txt
```

**Run the server** (while the virtual environment is active)

```
python app.py
```