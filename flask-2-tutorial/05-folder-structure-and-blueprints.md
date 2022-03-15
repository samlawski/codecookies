---
title: Folder Structures & Blueprints
videoId:
slug: "folder-structure-and-blueprints"
---

In this exercise, we'll do some refactoring. Previously, you've put all your Flask code in a single **app.py** file. That was fine as long as you were learning. But it's really not a good idea for most applications that have more than one or two routes. Additionally, you'll start working with database records soon, and as your codebase grows, it's a good idea to structure it nicely. 

In this exercise, you learn about **blueprints** as a way to structure your app's code. They were introduced in Flask 2 and have made organizing your code a lot easier. 

## Separating App and Server

Before we get started with blueprints, let's reorganize some of our code. It's a good idea to move all your application code inside its own folder and keep everything that's not directly related to the application logic outside of it. 

Create a new folder called **app**. Then, move the following folders in there:

* **static**
* **templates**

Additionally, move the following files in there: 

* **app.py**
* **config.py**

We purposely keep the **venv** folder separate. We also keep some general configuration files separate (such as **.env**, **.gitignore**, and **requirements.txt**). 
ry
Finally, create a new file in the root of our project and call it **run.py**. This file will be in charge of running our server. If we ever need to add configuration or parameters to the server, we can add them here. 

This is what my folder structure now looks like: 

![folder structure with a new app and scripts folder](/assets/content/flask-2-tutorial/09-blueprints/folder-screenshot-3.png)

We also need to make some adjustments to our code. Because we moved some files around, some imports will no longer point to the right place. Also, the **run.py** file should now have some of our server logic. 

Let's start with the imports. 

Inside that **/app/app.py** file, change the config line from `app.config.from_object('config')` to

```py
app.config.from_object('app.config')
```

That's because the config file is now in the designated **app** folder, and when the app is executed, it'll be executed from the **run.py** file in our root folder. 

Remember, in Python, folders act kind of like modules in themselves. `app` of `app.config` refers to the **/app** folder. `config` refers to the **config.py** file inside the **/app** folder.

Let's address the **run.py** file we just created. At the bottom of the **/app/app.py** file, we have this code: 

```py
if __name__ == '__main__':
  app.run()
```

Remove it entirely and paste it into the newly created **run.py** file. You see that in that file, we access the `app` variable. So we need to import it. At the top of the file, add: 

```py
from app.app import app
```

Again, the `app.app` refers to the path **/app/app.py**. The `import app` refers to the variable `app` inside that file that's defined with `app = Flask(__name__)`. 

Yes, it's many `app`s and can be a little confusing. But it helps to name these things in a consistent way to know where to find them later on. 

Alright. With all those changes done, you should be able to run

```
python run.py
```

This should start up your Flask server as before, and everything should still work. Make sure that's the case before you move on to the next step!

## Blueprints

Now, it's time for the blueprints. Think of blueprints like sub-applications within our main Flask app. There are different ways to structure them. But a good approach is to build them around the main features of your application. 

I will start by setting up a blueprint for our cookies pages for our app. 

Create a new folder inside the **app** folder and call it **cookies**. In there, create a new file called **routes.py**. This is going to act as the **controller** (from the MVC pattern). So the final path will be: 

* **app/cookies/routes.py**

Now, we're going to do some copy-and-pasting. 

Copy the `cookies_data` dictionary (or list) and paste it in the **/app/cookies/routes.py** file. This is just some temporary data that we will replace in the upcoming exercises. But for now, let's move it so that our code doesn't break. Once it's copied, you can delete it from the **app.py** file. 

Next, take the two routes `cookie(slug)` and `cookies()` **including the decorators and all function content** and copy them over to the **/app/cookies/routes.py** file (below the `cookies_data`). Remove them from the **app.py** file.

There are a few things we have to fix in here. 

First, we need to import a few things from `flask`:

```py
from flask import Blueprint, render_template
```

Notice how instead of `Flask` we import `Blueprint`.

As I mentioned before, `Blueprint` works like a mini sub-application of our main Flask app. To use it, we initialize it similarly as we initialize our `Flask` app. Below the import statements write: 

```py
blueprint = Blueprint('cookies', __name__)
```

As opposed to the `Flask` class, with `Blueprint` we added an extra parameter to specify the name of the blueprint. We need that if we want to load the specific blueprint later on. This should be **unique**, and you shouldn't have multiple blueprints with the same name. 

Finally, we need to adjust the decorator methods to use `@blueprint` instead of `@app`. 

The final **/app/cookies/route.py** could look something like this now:

```py
from flask import Blueprint, render_template

cookies_data = {
  'chocolate-chip' : {'name': 'Chocolate Chip', 'price': '$1.50'},
  'oatmeal-raisin' : {'name': 'Oatmeal Raisin', 'price': '$1.00'},
  'sugar' : {'name': 'Sugar', 'price': '$0.75'},
  'peanut-butter' : {'name': 'Peanut Butter', 'price': '$0.50'},
  'oatmeal' : {'name': 'Oatmeal', 'price': '$0.25'},
  'salted-caramel' : {'name': 'Salted Caramel', 'price': '$1.00'},
}

blueprint = Blueprint('cookies', __name__)

@blueprint.route('/cookies/<slug>')
def cookie(slug):
  if slug in cookies_data:
    return '<h1>' + cookies_data[slug]['name'] + '</h1>' + '<p>' + cookies_data[slug]['name'] + '</p>'
  else:
    return 'Sorry we could not find that cookie.' 

@blueprint.route('/cookies')
def cookies():
  return render_template('cookies.html', cookies=cookies_data)
```

As the last step, we want to be able to import the blueprint in our main **app.py** file. __

We could do that like this: `from .cookies.routes import blueprint`. But that would cause issues later on if we add more blueprints. Because the `blueprint` variable is already imported from the `cookies` folder, we can't import it from other folders. We could solve that by just naming it more explicitly - for example: `cookies_blueprint`. That's a valid approach. But there is another more popular way. __

Create a new file called **\_\_init\_\_.py** in the **app/cookies** folder. (Note there are **two** underscore before and after `init` - that's important).

In that file, add just this one line: 

```py
from . import routes
```

This is standard Python code. If you're not familiar with it, I recommend learning about Python **modules** and **imports**. But in short, Python treats folders like modules. Whenever you import a folder such as the **cookies** folder, if that folder contains an **\_\_init\_\_.py** file, that file is executed as the folder is imported. 

In our case, we use that to be able to just import the `cookies` folder and not `routes` or `blueprint` specifically. 

Let's do that now. Back in our **/app/app.py** file, at the top add this import statement:

```py
from . import cookies
```

Now, somewhere below our `app` definition (maybe right above the remaining routes) add this line: 

```py
app.register_blueprint(cookies.routes.blueprint)
```

As you may have guessed, the `.register_blueprint()` function registers the blueprint, meaning it connects it with our main application. `cookies` is what we just imported, and we're accessing the **routes.py** file in that folder and get the `blueprint` variable from it. 

## Blueprints and Templates

One last thing about creating blueprints. It may make sense to also organize your views (aka _templates_) by blueprints to keep things organized. 

In your **/app/templates** folder, create a new folder called **cookies**. Now, move your **cookies.html** file into that folder and rename it to **index.html**. The last step is optional. But since this page's purpose is to display all our cookies, it acts as _index_ of our cookies collection, and it's considered best practice to name that view **index**.

You now need to also adjust the `render_template` functions in your blueprint's **route.py** file accordingly to: 

* `return render_template('cookies/index.html', cookies=cookies_data)`

You successfully created blueprints and refactored major parts of your application. Your **app.py** feels already much lighter. 

As a next step, you should do the same thing with the `index()`, `about()`, and `legal()` routes. Those could have their own blueprint called **simple_pages** for example. That blueprint could contain all the landing and legal pages for your website. Keep in mind that you may need to `import` additional functions from `flask`.

If you still have a `url_for` function (for example because you used it with a `redirect`), you need to make sure to adjust it from e.g. `url_for('about')` to `url_for('simple_pages.about')`. Our `about` route is now part of the sub-module `simple_pages`. Therefore, you need to prefix it with the module name. 

In the end, the **app.py** should only import and initialize the different parts of your application. All of the business logic should live within the blueprints.

Here is what the final **app.py** looks like when it was made much smaller: 

```py
from flask import Flask
from . import cookies, simple_pages

app = Flask(__name__)
app.config.from_object('app.config')

# Blueprints
app.register_blueprint(cookies.routes.blueprint)
app.register_blueprint(simple_pages.routes.blueprint)
```

This is the **/app/simple_pages/routes.py** file: 

```py
from flask import Blueprint, render_template, redirect, url_for, send_file

blueprint = Blueprint('simple_pages', __name__)

@blueprint.route('/')
def index():
  return render_template('simple_pages/index.html')

@blueprint.route('/about')
def about():
  return 'I like cookies'

@blueprint.route('/about-me')
def about_me():
  return redirect(url_for('simple_pages.about'))

@blueprint.route('/legal')
def legal():
  return send_file('static/downloads/legal.txt', as_attachment=True)
```

(Note the changes of `url_for` and the different `import`s)

## Factory Pattern

As the final step, we will apply something called the **Factory Pattern**. You can read [more about it here](https://flask.palletsprojects.com/en/2.0.x/patterns/appfactories/).

The idea is to wrap the different parts of our **app.py** file in functions that can be called and tested (more on that later) individually. 

Start with the blueprints. Let's wrap those inside their own function. 

```py
def register_blueprints(app: Flask):
  app.register_blueprint(cookies.routes.blueprint)
  app.register_blueprint(simple_pages.routes.blueprint)
```

_Side note on parameter typing: `app` is defined as a parameter of the `registr_blueprints` function. But you may notice the `: Flask`. This is a **type definition**. It tells Python that the `app` variable should be an instance of the `Flask` class. It's a pattern that helps keep code clean and avoid mistakes of accidentally passing a parameter we wouldn't want to pass._

Since the registration code is now within a function, it needs to be called explicitly. Additionally, we'll also wrap the `app` initialization inside a new `create_app()` function. Within that function, we can also call the other function we just created. Here is the full **app.py** file: 

```py
from flask import Flask
from . import cookies, simple_pages

def create_app():
  app = Flask(__name__)
  app.config.from_object('app.config')

  register_blueprints(app)

  return app

# Blueprints
def register_blueprints(app: Flask):
  app.register_blueprint(cookies.routes.blueprint)
  app.register_blueprint(simple_pages.routes.blueprint)
```

Note the `return app` statement. That's important so that we can access the `app` variable when we call `create_app()`. So we can see the `register_blueprints` functions being called. But where do we run the `create_app()`?

We'll do that in the **run.py** file. Change it to look like this: 

```py
from app.app import create_app

app = create_app()

if __name__ == '__main__':
  app.run()
```

## Conclusion

In this exercise, we didn't add any logic. In fact, your app should function the exact same way it did before you did all the refactoring in this exercise.

Your code is now much cleaner, much better organized, and ready to be extended with new features in the future. We did this step so late in the tutorial because it becomes much harder to comprehend how it all is connected whenever you abstract code into different files. So I hope by adding everything in a single file at first and only later refactoring it, you could get a solid understanding of how all the different parts of your app work. 

Now you have a good foundation, we will add a few more features to our application. 

## 🛠  Practice 

But first, it's time to practice refactoring with your second project!

1. Move your app logic inside its own **app** folder within your project but keep the logic for the server within the root. Create a new **run.py** file to handle the server logic.
2. Create blueprints for the different features of your app. Try to do it one by one and not everything at once and always test in between. This way, you catch whenever you make a mistake. 
3. Apply the factory pattern to your **app.py** and adjust the **run.py** file accordingly. 
