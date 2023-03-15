---
title: SQL Database Setup
slug: "sql-database-setup"
description: Learn to set up a relational database and migrations with SQLAlchemy in Flask. 
lastUpdate: March 10th, 2023
---

As we begin to explore databases, we also have to talk about data structures. When you build an application, one of the first things to think about is the kind of data your application needs and works with.

For example, most applications will need a collection of users where each user has at least the properties `email` and `password`. Maybe they also have properties like `name` or `profile_picture_url`. It may be tempting to try and set up more properties because you _may need them in the future_. But in fact, it's considered best practice to work with as little data as possible for as long as you can. And later in this exercise, you'll learn a method to add properties later on easily. 

Some other examples for data collections your application may need are articles, to-do list items, shop items, expenses. 

## Models (MVC)

One of the most popular ways to structure the code of your web application is called **MVC** (Model-View-Controller). It describes the way you organize the logic of your code. Models are in charge or representing a data collection. You can, for example, have a `User` model or an `Article` model. They are usually directly connected to a database table and represent the data in that table. 
Views refer to the part of your application that's visual to users. In our Flask app, that would be the HTML templates. 
Lastly, the controllers connect everything. We already added them to our application in the **routes.py** file. They are in charge of bringing everything together, models, views, and any business logic from other files. Controllers aren't supposed to have business logic in them. They are only there to connect the different parts of your application.

For this section, we will focus on models as models represent the data layer of your application. If we think of our cookie shop one obvious data set would be for the cookies. So in my application, I'll need a `Cookie` model. This model will replace the `cookies_data` collection we used in the previous exercises.

Models are usually represented as Python **classes**, and their name is defined in singular. That's just a common pattern, and we'll stick to it, too. 

To kick things off, create a new file: **/app/cookies/models.py**

You should also add it to the **/app/cookies/\_\_init\_\_.py** file:

```py
from . import routes, models
```

You can remove the `cookies_data` variable in **/app/cookies/routes.py** now or comment it out and delete it at the end of the exercise. Keep in mind that deleting the `cookie_data` will break the routes defined in that file. So you can also keep it in there and delete it in a later exercise when we fix the logic in the views.

In our new **models.py** file, create a new class called `Cookie`. Give it a few properties like `id`, `slug`, `name`, and `price` but assign them to empty strings for now. They are just placeholders that will be filled in later on.

```py
class Cookie():
  id = ''
  slug = ''
  name = ''
  price = ''
```

Those are the same values we had before. But this time, I specifically defined a `slug` field. Additionally, I added an `id` field. The ID is important for later. Every data item should have a unique ID. This way, you'll have an easier time finding a specific item. 

Creating placeholder models like this can be a helpful way for you to think about the different data collections and their properties as you plan your application. 

## When or why use a database?

Now that we deleted the `cookies_data` set, we need an alternative way to store the cookie data. We already mentioned above that we want to use a database for that. A database is usually a separate piece of software installed on your machine and on the server. You may have heard of MySQL, Postgres, or MongoDB. These are not just file formats. They are actual pieces of software that need to be installed and executed. And in order for an application to interact with a MySQL database, the MySQL software has to be running in parallel to your application at all times.

Databases are best suited for dynamic data and content. Those can be blog posts, users, bank accounts, just to name a few examples. However, it may make sense to use static data in some cases. If you have a set of data that most likely will never (or very rarely) change, it's also totally fine **not** to use a database. 
Some examples for static data that doesn't need a database could be a list of countries you offer your products in, a list of services you offer that are never changing, the type of bank accounts a user could open, etc.

We may want to add or remove types of cookies as we go. So we'd like to store them dynamically in a database.

## Choosing a database

Once we understand why to use a database, we must choose which one to use. We're not going to go into the different kinds of databases here. But just know that with Flask, you're free to use any type of database you like. 

We'll go with a relational database because it's a very common choice in the Flask community. If you're new to the field, it's always good to choose a technology stack that's widely used. This way, it'll be easier for you to get help whenever you get stuck. Each tech community has its preferred stack. PHP developers like MySQL, Node.JS developers like MongoDB, and Flask developers often use Postgres. You can use any kind of database in all these cases. But Postgres is just a common choice among Flask developers. 

Postgres is a relational database. So to simplify things, we're going to get started with **SQLite** in this section. **SQLite** is a very small kind of relational database. It uses SQL. So you can interact with it in a very similar way as MySQL or Postgres. One big advantage of **SQLite** is that you don't need to have an additional piece of software running. Postgres you first would have to install and always running. And that's what you should do in a larger application. But when you're just starting out, it's fine to start with **SQLite**. It stores the entire database in a single file in your project folder. 

_(Side note on hosting: You won't be able to use SQLite as the main database on PaaS providers such as Heroku or Google App Engine. As mentioned in earlier exercises, they don't allow files to be written on the server except for the deployment itself. Since SQLite is data stored in a simple file of your project folder, the data won't be stored long term. So as soon as you want to deploy your application, you'll have to use something like Postgres instead. But we'll talk about that more in a later section.)_

## Adding SQLAlchemy as Extension to Flask

When working with any database in your program, it's best if you don't have to write raw SQL code. Instead, you should use an **ORM** (Object-relational mapping) tool. One very popular tool for SQL databases in Python is **SQLAlchemy**. ORMs are essentially prewritten Python functions that allow you to interact (read, write, delete, update) with data in any SQL database by writing basic Python code. This way, you can switch databases without changing much of your code. Think of it as an **interface to interact with the database by writing basic Python code**.

**SQLAlchemy** is a library, and you can install it by running 

```
pip install flask_sqlalchemy
```

Don't forget you need to have your virtual environment active before you install the package. Also, don't forget to freeze your requirements.txt file after every package you install. 

Now, we can import it. But where? Since we refactored our project to use blueprints and extract code from the **app.py** file, it wouldn't be a good idea to add it directly in there. Instead, create a new folder called **extensions** in the **app** folder and in it add a new file called **database.py**. 

The **extensions** folder will hold all additions to our applications that, e.g., come from third-party packages. Later, we may, for example, add the authentication extension. 

In **/app/extensions/database.py**, add: 

```py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
```

Similar to `Flask`, `SQLAlchemy` is a class that needs to be initialized. That's what we're doing here. 

Next, we need to connect the `db` variable (representing an instance of the `SQLAlchemy` class) with our application. 

Back in our **/app/app.py** file, import the `db` variable at the top: 

```py
from app.extensions.database import db
```

At the bottom of the file, create a new function that will behave very similarly to our `register_blueprints` function - except it'll register our extensions: 

```py
def register_extensions(app: Flask):
  db.init_app(app)
```

`db.init_app(app)` initializes the database connection of `SQLAlchemy` and passes the `app` (which is our Flask application object) as an argument. 

Finally, add `register_extensions` to the `create_app` function but **before** the `register_blueprints`.

```py
def create_app():
  app = Flask(__name__)
  app.config.from_object('app.config')

  register_extensions(app)
  register_blueprints(app)

  return app
```

## Configure SQLAlchemy

Right now, SQLAlchemy is connected to our application, but there is no database it's using. 

SQLAlchemy will automatically use an _in-memory_ SQLite database if you don't define anything. That means all data is only temporarily stored in memory and removed as soon as the server stops. 

We want to create an **SQLite** database file in our project directory. To do that, you can add another configuration to Flask. Normally, you would do that by writing:

```py
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
```

But don't do that! Remember, we actually have this line in our project `app.config.from_object('app.config')` to load our config file? We can use this file whenever a tutorial tells us to define a configuration with `app.config[]`. 

But there is another thing. It's good practice to store the URL to your database in an **environment variable**. That's because, most likely, you'll have a different URL depending on the environment your app is in. So, for example, your local development version of the app will use a different database than when it's deployed to a server.

In your **.env** file, add the following line: 

```
DATABASE_URL=sqlite:///database.db
```

Next, back in **/app/config.py**, add the following import at the top: 

```py
from os import environ
```

`os` is a built-in package in Python, and `environ` allows us to read environment variables. 

Further down in the file, add: 

```py
SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL')
```

`SQLALCHEMY_DATABASE_URI` is a predefined configuration variable used by SQLAlchemy to know the URL to your database. With the value from the environment variable, we tell SQLAlchemy to use **SQLite** and store it in a file called **database.db**. 

To keep our project code clean, you should add the name of the **database.db** file on a new line to the **.gitignore** file!

That's it. That's all you need to set up a very basic **SQLite** database. 

## Setup SQLAlchemy for testing

When it comes to tests, it's good practice to keep the database used for testing completely separate from the database I use for development or on the server. 

So the use of an **environment variable** comes in very handy here as we can just overwrite it for our tests. 

Open the **/app/tests/conftest.py** file and import `environ` at the top: 

```py
from os import environ
```

Inside the fixture and right above `app = create_all()` add this line: 

```py
environ['DATABASE_URL'] = 'sqlite://'
```

With this line, we overwrite the environment variable and define it as `'sqlite://'`. This will cause SQLAlchemy to use the default in-memory SQLite database for our tests. That's fine because we don't want our testing data to exist permanently. It's fine to be cleared after every test. 

## Defining a model with SQLAlchemy

Now that SQLAlchemy is all set up, I can use it to define my model. The reason for that is that I want my model to represent a table in my database. The database will have several tables later on. Maybe one for users, one for orders, but also one for cookies. And that's the one we want to create now. 

Again, the ORM makes it easy to define my data structure by just writing Python code. SQLAlchemy will handle translating this to the actual database - no matter whether it's SQLite or Postgres. 

To define the data structure, I need to _inherit_ my `Cookie` class from a class defined in SQLAlchemy called `db.Model` - like this: `class Cookie(db.Model)`.

In **/app/cookies/models.py**, first, we need to import the `db` variable. Then, we can adjust our `Cookie` class to inherit from `db.Model`: 

```py
from app.extensions.database import db

class Cookie(db.Model):
```

Now, let's define the properties we created placeholders for earlier. The way you do that is with the `db.Column()` method provided by SQLAlchemy. That method tells SQLAlchemy to create a column for the given property. As a function parameter, you need to tell SQLAlchemy what **type** of column to create. Some types are `db.Integer`, `db.String`, `db.Date`. Check out [this complete list](https://docs.sqlalchemy.org/en/14/core/type_basics.html) of data types available.

Here is what it would look like doing it for all our properties: 

```py
class Cookie(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  slug = db.Column(db.String(80), unique=True)
  name = db.Column(db.String(80))
  price = db.Column(db.Numeric(10, 2))
```

Make those changes to your **/app/cookies/models.py** file. 

There are a few important things to point out. 

Each model you define should always have an `id` property. And unless you have a good reason to do it differently, it should just be defined as `db.Integer` and have the `primary_key` parameter set to `True`. SQLAlchemy will automatically fill that value for you when new records are created. And each new record will have an incremented number as ID. That means the first record you'll ever create will automatically get the ID `1`, the second one `2`, the third one `3`, and so on. The `primary_key` attribute tells SQLAlchemy that this field will be used to identify the record primarily. Therefore, it **must be unique**. There can never be two records with the same ID in a single table. 

The `80` that's the argument of the `db.String()` function limits the string's length to 80 characters. Users will not be able to create or update records to have longer strings. It's considered good practice to limit the length for security reasons (for example, so nobody can go nuts and fill your database with insane amounts of data). Keep in mind, though, not to be too restrictive. Especially when you deal with the names of real people, there are plenty of bad examples out there of applications that required a minimum length higher than the length of some people's actual names or limit the street name field so much that the full street name couldn't fit. Just be cautious. 

Then, there is a parameter `unique=True`. As you might guess, this parameter tells SQLAlchemy that this field value should also always be unique. Since we use the `slug` for the URL to our cookies, we don't want any cookies to have the same `slug` accidentally. If we try to create a record with the same slug as another one, this will throw an error, and the creation won't happen. 

Finally, we chose the `db.Numeric` type for the price. We could have also used `db.Integer` or `db.Float`. But in the case of prices, both those data types have downsides. Integers have a maximum value, and floats do wonky things once you start doing math with them. And you certainly don't want your app to do funny things when it comes to financial information. The numeric data type uses multiple integers to store a numeric value that may include decimals. The first parameter, `10`, defines how many integers to use. In this case, we chose `10` - although it's unlikely that we'll ever have a cookie that expensive. The second value, `2`, defines how many decimal points we want to allow since this is a price, we want there only ever to be a maximum of 2 decimal points. 

## Migrations

Alright! We got our model set up. Now we need to actually let SQLAlchemy create a database table that matches what we defined in the `Cookie` model. 

This is the part where a lot of other tutorials will tell to create a new database with `db.create_all()` in the `python3` console. `db.create_all()` is a function provided by SQLAlchemy to create all the database tables based on the models you have defined in your application. **But** it's not sustainable to always have to do that in a growing application. And it's not considered best practice either. 

Most larger applications use a concept called **migrations**. A migration is like a script that migrates your Python models to the database as tables. Each time you make a change, a new migration file is created. This way, you can keep track of all the changes that ever happened in your application. It also makes it easier to roll changes back if something goes wrong. That's why I'd suggest using migrations from the beginning.

Fortunately, there is a useful package for that again. Run `pip install flask_migrate`. (Don't forget to freeze the requirements.txt file)

Then, add it to your **/app/extensions/database.py** file: 

```py
from flask_migrate import Migrate
```

Right below where you initialized `db = SQLAlchemy()`, insert: 

```py
migrate = Migrate()
```

Back in **/app/app.py** add `migrate` to the import at the top: 

```py
from app.extensions.database import db, migrate
```

Then, initialize it in the `register_extensions` function you created before right below the existing `db.init_app(app)`:

```py
migrate.init_app(app, db, compare_type=True)
```

The first parameter `app` tells the migration package where to look for the **models**. The migration package is configured to automatically scan your Flask application for any models. It will automatically generate a script for you based on the models that are **imported** in your app. That also means that if you create a model in a .py-file in your project but never import it anywhere, the package will also not find it!

The second parameter, `db`, as you might have guessed, tells the script where to find the database that should be dated with the new database tables. 

And finally, the parameter `compare_type=True` is a [configuration option](https://flask-migrate.readthedocs.io/en/latest/#alembic-configuration-options). That means it's optional and you could leave it out. But I do recommend adding it here. This option will enable any changes you make to column types in your models and allow you to create migrations for it. Let's say you have a `User` model with a `name` that's configured to be a string of 50 characters. But later you realize that's too short and you want to increase the number to 200. Without this option, the migration script wouldn't notice when you make that change. But with this option, you can make the change, then generate a migration file and update the database. 

As the final step, because we refactored our app to be started with the **run.py** file, we need to tell FlaskMigrate where it can find our app. We do that by adding `FLASK_APP=run.py` to a new line in our **.env** file.

Once you've done that, you can use the command line to create migrations. 

### Initial database creation

First, you need to initialize the database. Do that by running: 

```
flask db init
```

To make sure it has worked, you should see a new folder called **migrations** created in your project folder. That should include a whole bunch of stuff. Among them is a **versions** folder. 

If that's not the case, try to identify the error messages you got in the terminal. There may be some warnings. That's fine, and we'll deal with those later. Try to see if there are **errors** and not warnings. They may give you an idea of what went wrong. Sometimes it can be as simple as a typo in your code or a missing colon.

You only need to run this `init` script once in the beginning and then never again.

### Making database updates with migrations

Once you get the **migrations** folder, you can move on to the next step. Now we can create the actual migration for the `Cookie` model. 

Before we can do that you need to keep in mind one important thing: FlaskMigrate will automatically search your project for models and add changes to those to the **migrations**. But, for FlaskMigrate to actually find a model, it must be imported as part of your project. Right now, our **models.py** file exists, but it's not imported anywhere in our code. So it would simply be ignored by FlaskMigrate. To fix that, open **/app/cookies/routes.py** and at the top add: 

```py
from .models import Cookie
```

This will import the model. We won't use it until a later exercise. But this is the file where we'll need it. So we can already import it here. 

Now, you can create a new migration with this command in the command line: 

```
flask db migrate -m 'create cookie model'
```

Execute this command and then have a look in the **migrations/versions** folder. You should now see a new file was created. This file includes the script that interacts with SQLAlchemy to create a new database table for our `Cookie` model. 

The text of the string in the end `'create cookie model'` could have been anything you like. Think of those like git commits. They should describe what changes you made. This will help you, later on, more easily keep track of the changes you made over time. 

Now that the migration was created, you can actually run the migration script with: 

```
flask db upgrade
```

If everything went well, you should see something like this in your command line: 

```
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 339d18852676, create cookie model
```

Alright great! We have created a database table! Our app now doesn't do much with the data we have set up. But you now know how to define models and add new tables to a database. 

## Adding Migrations to Tests

If you remember from before, we create a blank in-memory database for our tests. So any migrations we run are not applied to the database we want to use for testing. 

The way to solve this is to run a migration before our test. Luckily that's not too difficult to set up. In **/app/tests/conftest.py** import `upgrade` from `flask_migrate`:

```py
from flask_migrate import upgrade
```

Inside the `with app.app_context()` block of our **fixture**, right before our `yield app.test_client()` add the `upgrade` function: 

```py
with app.app_context():
  upgrade()
  yield app.test_client()
```

`upgrade` works just like the command line action we used earlier to run our migrations. `with app.app_context()` is a requirement of the `flask_migrate` library. It makes sure that `upgrade()` only runs within the context of our application. Learn more about `with` [here](https://stackoverflow.com/questions/1369526/what-is-the-python-keyword-with-used-for).


## Making changes to models

If you want to add another model or add properties to existing models, all you have to do is add the code and create another migration. So, for example, if you want to add a field `picture_url` to the `Cookie`, just change it accordingly: 

```py
class Cookie(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  slug = db.Column(db.String(80), unique=True)
  name = db.Column(db.String(80))
  price = db.Column(db.Numeric(10, 2))
  picture_url = db.Column(db.String(260))
```

Now you just add a new migration and then run it in the command line: 

```
flask db migrate -m 'add picture_url to Cookie'
flask db upgrade
```

If you want to delete a column, you can just remove the property from the code, then create another migration, and finally `upgrade` it again. 

**Important: Don't change the name of a property or remove and add properties within the same migration.** Changing existing column names or removing one column and adding another within the same migration **can cause issues** with SQLite. This is different from other databases. But SQLite doesn't support just changing existing columns. So what you'd have to do is to use separate migrations: one for removing a column and another for adding a new column. (☝️ Note that this will mean the data within a deleted column will be lost!)

### Troubleshooting Migration Errors

Sometimes things go wrong, and you'll see an error in your command line when running migrations. **Pay good attention to the output in your command line** to make sure you catch those errors early. 

One common error e.g., looks like this: `sqlite3.OperationalError: duplicate column name`. 

One big benefit of migrations is that they allow you to roll back changes you made more easily. Let's say you see an error when trying to run `flask db upgrade`. What you can do then is to run `flask db downgrade` instead. 

If you take a look at the different files in the **migrations/versions** folder, you'll see that each script contains a `upgrade` and `downgrade` functions. The migrations have a script built-in to allow you to reverse changes easily. By running `flask db downgrade`, you'll roll your latest migration to the previously working version. The command line output will show you the specific version with something like this: 

```
INFO  [alembic.runtime.migration] Running downgrade ba34b67747d0 -> 339d18852676, add picture_url to Cookie
```

You can then find the migration file in the **migrations/versions** folder (in the example, it's `339d18852676`) to see which version of the database that refers to. The name of the **downgraded migration file** you'll see **before** the arrow in the command line (in our example, that's `ba34b67747d0`). You could find the downgraded file and either remove it if it caused the error. Or you can attempt to fix the specific errors you found. 

If you choose just to remove the migration file, you can just delete it, make whatever changes you need to make to your models, and create a new migration file with `flask db migrate` and run `flask db upgrade`. Hopefully, this time it's fixed and works without problems. 

## Using another database

Everything you learned about in this exercise works exactly the same for another SQL database such as Postgres or MySQL. With those, your configuration `SQLALCHEMY_DATABASE_URI` will not point to `sqlite`. Instead, you'd install the software, e.g., Postgres. Then, you'd set up a database and, in the end, get a URL to that database. That URL you could insert in the configuration instead of `'sqlite:///database.db'`. We will do exactly that in a later exercise and when you have to deploy the application to a server.

## 🛠  Practice 

1. In your separate practice project, install `flask_sqlalchemy` and `flask_migrate` and set up both database and migrations with SQLite. Add them as **extensions** to your app.
2. Come up with at least one model you need. Create a class for it, make sure it inherits from `db.Model`, and define its columns. 
3. Make sure both SQLAlchemy and FlaskMigrate are set up for testing. This will be important later on.
4. Optional: Try adding separate migrations and running them with `flask upgrade` where each migration adds a property to your model or removes one. Make sure you have separate migrations each time. Try running several of these to start getting a feeling for how it works. And don't worry about breaking things. This is a practice application. This is the best situation to break things.
