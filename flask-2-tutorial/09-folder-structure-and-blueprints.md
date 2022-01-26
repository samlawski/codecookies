---
title: Folder Structures & Blueprints
videoId:
slug: "folder-structure-and-blueprints"
---

With this exercise the second section of the Flask 2 tutorial starts. While the first section focused on all the basics, the second section will teach you to go more in depth on some more advanced topics. You'll learn to combine some of the things you have learned with many new topics. 

In this exercise, we'll do some refactoring. Previously, you've put all your Flask code in a single **app.py** file. That was fine as long as you were learning. But it's really not a good idea for most applications that have more than one or two routes and models. 

In this exercise you learn about **blueprints** as a way to structure your app's code. They were introduced in Flask 2 and have made organizing your code a lot easier. 

## Separating App and Server

Before we get started with blueprints let's reorganize some of our code. It's a good idea to move all your application code inside its own folder and keep everything that's not directly related to the application logic outside of it. 

Create a new folder called **app**. Then, move the following folders in there:

* **static**
* **templates**

Additionally, move the following files in there: 

* **app.py**
* **config.py**
* **database.db**

We purposely keep the **migrations** and **venv** folders separate. We also keep some general configuration files separate (such as **.env**, **.gitignore**, **Procfile**, and **requirements.txt**). 

The **seed.py** file we also keep in the root folder for now. We may want to move it to a different place in the future or just remove it as we don't need it anymore. 

Finally, create a new file in the root of our project and call it **run.py**. This file will be in charge of running our server. If we ever need to add configuration or parameters to the server in the future we can add them in here. 

This is what my folder structure now looks like: 

![folder structure with new app and scripts folder](/assets/content/flask-2-tutorial/09-blueprints/folder-screenshot-3.png)

We also need to make some adjustments to our code. Because we moved some files around, some imports will not point to the right place anymore. Also, the **run.py** file should now have some of our server logic. 

Let's start with the imports. 

In the **seed.py** file, change the import statement at the top to this: 

```py
from app.app import db, Cookie
```

Remember, in Python, folders act kind of like modules in themselves. The first `app` of `app.app` refers to the **/app** folder. The second `app` refers to the **app.py** file inside that folder. So in other words `app.app` refers to the path **/app/app.py**. 

Inside that **/app/app.py** file, we also need to make an adjustment. Change the config line from `app.config.from_object('config')` to

```py
app.config.from_object('app.config')
```

That's because the config file is now in the designated **app** folder and when the app is executed it'll be executed from the **run.py** file in our root folder. Let's do that now. 

At the bottom of the **/app/app.py** file we have this code: 

```py
if __name__ == '__main__':
  app.run()
```

Remove it entirely and paste it into the newly created **run.py** file. You see that in that file we access the `app` variable. So we need to import it. At the top of the file add: 

```py
from app.app import app
```

Again, the `app.app` refers to the path **/app/app.py**. The `import app` refers to the variable `app` inside that file that's defined with `app = Flask(__name__)`. 

Yes, it's a lot of `app`s and can be a little confusing. But it helps to name these things in a consistent way to know where to find them later on. 

Finally, you also need to change the **Procfile** because your server doesn't get executed by the **app.py** file anymore. Just change its content to: 

```
web: gunicorn run:app
```

The `run` refers to the **run.py** file. The `app` refers to the `app` variable imported in there from the **/app/app.py** file. 

Alright. With all those changes done, you should be able to run

```
python run.py
```

This should start up your Flask server as before and everything should still work. Make sure that's the case before you move on to the next step!

You may also want to commit everything at this point to git and deploy it to the server. This way you make sure all your changes also still work on production. 

## Separating Extensions

The next refactoring step is to extract our **extensions** into their own folder. Think of extensions like additions to our app. So far we have a **database** and **migration** extension. In the future, we may add extensions for authentication or other features. 

It's a good idea to have separate configuration files for your extensions. This way all code related to setting up the extensions are in one separate place and you know immediately where to look if you need to change something about them. 

Create a new **extensions** folder in the **app** folder and in it create a new file called **database.py**. The full path should be:

**/app/extensions/database.py**

We're going to set up `flask_sqlalchemy` and `flask_migrate` in here. So remove those two import statements from the **/app/app.py** file and instead add them at the top of the **/app/extensions/database.py** file. 

```py
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
```

Also, remove the two lines from the **app.py** file:

```py
db = SQLAlchemy(app)
migrate = Migrate(app, db)
```

Instead, add these two lines to your **database.py** file: 

```py
db = SQLAlchemy()
migrate = Migrate()
```

We do not pass the `app` and `db` variables here. That's because we don't have access to the `app` variable here. We could `import` it from the **app.py** file but we would run into the problem of **circular imports**. We want to import the `db` and `migrate` variables in **app.py** but we would also want to import the `app` variable in the **database.py** file. That would mean both files would import each other. That can lead to big issues and is one of the problems that people sometimes have to deal with in Flask. To avoid it we just assign those classes here but initialize them later. 

Back in the **app.py** file now import the files from the extension folder: 

```py
from .extensions.database import db, migrate
```

The dot infront of the `extensions` is not a typo. That tells Python to find the `extensions` path relative to the current module. Without it you'd have to write `from app.extensions.database import db, migrate` (which is also fine).

Then, in the place wher eyou previously had `db` and `mgirate` variables defined in the **app.py** file, add: 

```py
db.init_app(app)
migrate.init_app(app, db)
```

The `.init_app()` allows us to initialize the two classes in a separate place from where we imported it. They allow us to first import the two variabels into the **app.py** file and then initialize them **after** we defined the `app` variable. This way we can avoid **circular imports**.

## Blueprints

Now, it's time for the blueprints. Think of blueprints like sub-applications within our main Flask app. There are different ways to structure them. But a good approach is to build them around main features of your application. 

For our app, I wills tart by setting up a blueprint for our cookies pages. 

Additionally, create a file called **models.py** which will represent the **models** within the MVC structure. 
Create a new folder inside the **app** folder and call it **cookies**. In there, create a new file called **routes.py**. This is going to act ase the **controller** (from the MVC pattern). So the final paths will be: 

* **app/cookies/routes.py**
* **app/cookies/models.py**

Now, w e're going to do some copy-and-pasting. 

Take the entire `Cookie` class from the **/app/app.py** file, copy it and paste it into the new **/app/cookies/models.py** file. Then, remove it from the **app.py** file. 

You'll notice that we need the `db` variable now in the **models.py** file. But you may think _"Wait... if we import the `db` variable from the **app.py** file now in the **models.py** file, is that not going to cause **circular import** issues again?"_ Good job if you noticed that! Don't worry if you didn't. It's not an issue, though. That's where the separate **extensions** files become very useful again. We can `import` the `db` variable from our **extensions** folder instead of **app.py** and avoid any circular imports. At the top of the **models.py** file add this line: 

```py
from app.extensions.database import db
```

Next, we copy our routes. Take the two routes `cookie(slug)` and `cookies()` **including the decorators and all function content** and copy them over to the **/app/cookies/routes.py** file. Remove them from the **app.py** file. 

There are a few things we have to fix in here. 

First, import the models with the following line at the top of the file:

```py
from .models import Cookie
```

We can again use a relative path because the **models.py** file is within the same folder. 

Now, we'll import a few things from Flask:

```py
from flask import Blueprint, render_template, request, current_app
```

Notice, how instead of `Flask` we import `Blueprint`. The `current_app` function will get useful in just a second. 

As I mentioned before, `Blueprint` works like a mini sub-application of our main Flask app. To use it we initialize it similarly as we initialized our `Flask` app. Below the import statements write: 

```py
blueprint = Blueprint('cookies', __name__)
```

As opposed to the `Flask` class, with `Blueprint` we added an extra parameter to specify the name of the blueprint. We need that if we want to load the specific blueprint later on. This should be **unique** and you shouldn't have multiple blueprints with the same name. 

Finally, we need to adjust the decorator methods to use `@blueprint` instead of `@app`. And later down in the file, we access `app.config`. That's also not possible as we don't have access to `app` here. Instead, we can make use of the `current_app` variable. That one can be used **within** route functions and gives us access to all the `app` properties such as `config`. So deplace `app.config` with `current_app.config`.

The final **/app/cookies/route.py** file looks like this now: 

```py
from .models import Cookie
from flask import Blueprint, render_template, request, current_app

blueprint = Blueprint('cookies', __name__)

@blueprint.route('/cookies/<slug>')
def cookie(slug):
  cookie = Cookie.query.filter_by(slug=slug).first_or_404()
  return render_template('cookie.html', cookie=cookie)


@blueprint.route('/cookies')
def cookies():
  page_number = request.args.get('page', 1, type=int)
  cookies_pagination = Cookie.query.paginate(page_number, current_app.config['COOKIES_PER_PAGE'])
  return render_template('cookies.html', cookies_pagination=cookies_pagination)
```

As the last step, we want to be able to import the blueprint in our main **app.py** file. 

We could do that like this: `from .cookies.routes import blueprint`. But that would cause issues later on if we add more blueprints. Because the `blueprint` variable is already imported from the `cookies` folder, we can't import it from other folders. We could solve that by just naming it more explicitely - for example: `cookies_blueprint`. That's a valid approach. But there is another more popular way. 

Create a new file called **__init__.py** in the **app/cookies** folder. (Note there are **two** underscore before and after `init` - that's important).

In that file, add just this one line: 

```py
from . import routes, models
```

This is standard Python code. If you're not familiar with it I recommend learning about Python **modules** and **imports**. But in short, Python treats folders like modules. Whenever you import a folder such as the **cookies** folder, if that folder contains an **__init__.py** file, that file is executed as the folder is imported. 

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

### Troubleshooting: Could not build url for endpoint 'cookies'

If you've used `url_for` anywhere to access the `cookies()` or `cookie()` route functions anywhere (for example in your views) you need to change them as they are now **inside the cookies blueprint**. 

So if your link was this: 

```py
url_for('cookies')
```

it now needs to be this: 

```py
url_for('cookies.cookies')
```

The first `cookies` refers to the blueprint `cookies`. The second one refers to the route function `cookies()`. 

To make this more obvious take the singular `cookie()` route: 

```py
url_for('cookie')
```

This turns into:

```py
url_for('cookies.cookie')
```

## Blueprints and Templates

One last thing about creating blueprints. It may make sense to also organize your views (aka _templates_) by blueprints to keep things organized. 

In your **/app/templates** folder, create a new folder called **cookies**. Now, move the two HTML files **cookies.html** and **cookie.html** in there. Finally rename them to **index.html** and **show.html**. The last step is optional. But it's a common pattern for naming templates as it makes immediately obvious which template is for displaying the full list of the collection and which one is for showing just an individual item. Here is what you should end up with: 

* **app/templates/cookies.html** ➡️ **app/templates/cookies/index.html**
* **app/templates/cookie.html** ➡️ **app/templates/cookies/show.html**

You now need to also adjust the `render_template` functions in your blueprint's **route.py** file accordingly to: 

* `return render_template('cookies/show.html', cookie=cookie)`
* `return render_template('cookies/index.html', cookies_pagination=cookies_pagination)`

You successfully created blueprints and refactored major parts of your application. Your **app.py** feels already much lighter. 

As a next step, you should do the same thing with the `index()`, `about()`, and `legal()` routes. Those could have their own Blueprint called **simple_pages** for example. That blueprint could contain all the landing and legal pages for your website. Note, that you **don't** need a **models.py** for those. But keep in mind, that you will need to `import` different functions. 

In the end, the **app.py** should only import and initialize the different parts of your application. The models, views, controllers and other business logic should be in different files and folders. 

Here is what the final **app.py** looks like when it was made much smaller: 

```py
from flask import Flask
from .extensions.database import db, migrate
from . import cookies, simple_pages

app = Flask(__name__)
app.config.from_object('app.config')

# Extensions
db.init_app(app)
migrate.init_app(app, db)

# Blueprints
app.register_blueprint(cookies.routes.blueprint)
app.register_blueprint(simple_pages.routes.blueprint)
```

This is the **/app/simple_pages/routes.py** file: 

```py
from flask import Blueprint, render_template, send_file, redirect, url_for

blueprint = Blueprint('simple_pages', __name__)

@blueprint.route('/')
def index():
  return render_template('simple_pages/index.html')

@blueprint.route('/about')
def about():
  return 'I like cookies!'

@blueprint.route('/about-me')
def about_me():
  return redirect(url_for('simple_pages.about'))

@blueprint.route('/legal')
def legal():
  return send_file('static/downloads/legal.txt', as_attachment=True)
```

(Note the changes of `url_for` and the different `import`s)

## Factory Pattern

As the final step we're going to apply something called the **Factory Pattern**. You can read [more about it here](https://flask.palletsprojects.com/en/2.0.x/patterns/appfactories/).

The idea is to wrap the different parts of our **app.py** file in functions that can be called and tested (more on that later) individually. 

Start with the extensions and the blueprints. Let's wrap those inside their own functions. 

```py
def register_extensions(app: Flask):
  db.init_app(app)
  migrate.init_app(app, db)

def register_blueprints(app: Flask):
  app.register_blueprint(cookies.routes.blueprint)
  app.register_blueprint(simple_pages.routes.blueprint)
```

Since they are now within functions, we need to explicietely call them to be executed. Additionally, we'll also wrap the `app` initialization inside a new `create_app()` function. Within that function we can also call the other two functions we just created. here is the full **app.py** file: 

```py
from flask import Flask
from .extensions.database import db, migrate
from . import cookies, simple_pages

def create_app():
  app = Flask(__name__)
  app.config.from_object('app.config')

  register_extensions(app)
  register_blueprints(app)

  return app

def register_extensions(app: Flask):
  db.init_app(app)
  migrate.init_app(app, db)

def register_blueprints(app: Flask):
  app.register_blueprint(cookies.routes.blueprint)
  app.register_blueprint(simple_pages.routes.blueprint)
```

Note the `return app` statement. That's important so that we can access the `app` variable when we call `create_app()`. So we can see the two `register_*` functions being called. But where do we run the `create_app()`?

We'll do that in the **run.py** file. Change it to look like this: 

```py
from app.app import create_app

app = create_app()

if __name__ == '__main__':
  app.run()
```

## Conclusion

In this exercise, we didn't add any logic. In fact, your app should function the exact same way it did before you did all the refactoring in this exercise.

Your code is now much cleaner, much better organized and ready to be extended with new features in the future. We did this step so late in the tutorial because whenever you abstract code into different files it becomes much harder to comprehend how it all is connected. So I hope by adding everything in a single file at first and only later refactoring it you were able to get a solid understanding of how all the different parts of your app work. 

Now you have a good foundation and we will add a few more feature to our application. 

## 🛠  Practice 

But first, it's time to practice refactoring with your second project!

1. Move your app logic inside its own **app** folder within your project but keep the logic for the server within the root. Create a new **run.py** file to handle the server logic.
2. Extract your database initialization into a separate **app/extensions** folder.
3. Create blueprints for the different features of your app. Try to do it one by one and not everything at once and always test in between. This way you catch whenever you make a mistake. 
4. Apply the factory pattern to your **app.py** and adjust the **run.py** file accordingly. 