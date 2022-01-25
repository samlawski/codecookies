---
title: SQL Database and CRUD Basics
videoId:
slug: "sql-database-and-crud-basics"
templateEngineOverride: md
---

When we start talking about databases we have to talk about data structures. As you build an application, one of the first things to think about is what kind of data your application needs and how it should be set up.

For examples, most applications will need a collection of users where each user has at least the properties `email` and `password`. Maybe they also have properties like `name` or `profile_picture_url`. It may be tempting to try and setup more properties because you _may need them in the future_. But in fact it's considered best practice to work with as little data as possible for as long as you can. And later in this exercise you'll learn a method to easily add properties later on. 

Some other examples for data collections your application may need are: articles, todo list items, shop item, expenses. 

## Models (MVC)

One of the most popular ways to structure code of your web application is called **MVC** (Model-View-Controller). It describes a way you organize the logic of your code. Models are in charge or representing a data collection. You can for example have a `User` model or an `Article` model. They are usually directly connected to a database table and represent the data in that table. 
Views refer to the part of your application that's visual to users. In our flask app that would be the HTML templates. Lastly, the controllers connect everything. They are for example the route functions we we created. They are in charge of bringing everything together, models, views, and any business logic from other files. Controllers aren't supposed to have business logic in them. They are only there to connect the different parts of your application. 

For this section we will focus on models as models represent the data layer of your application. If we think of our cookieshop one obvious data set would be for the cookies. So in my application, I'll need a `Cookie` model. This model will replace the `cookies_data` collection we used in the previous exercises.

Models are usually represented as Python **classes** and their name is defined in singular. That's just a common pattern and we'll stick to it, too. 

To kick things off, open your **app.py** file and delete your old `cookies_data` collection or cut it out of your project and keep it somewhere separate for now. 

In it's place (so above the routes but below the instantiation of the `Flask` app) create a new class called `Cookie`. Give it a few properties like `id`, `slug`, `name`, and `price` but assign them to empty strings for now. They are just placeholders that will be filled later.

```py
class Cookie():
  id = ''
  slug = ''
  name = ''
  price = ''
```

Those are the same values we had before. But this time, I specifically defined a `slug` field. Additionally, I added an `id` field. The ID is important for later. Every data item should have a unique ID. This way you'll have an easier time finding a specific item. 

Creating placeholder models like this can be a helpful way for you to think about the different data collections and their properties as you plan your application. 

## When or why use a database?

Now, that we deleted the `cookies_data` set we need an alternative way to store the cookie data. We already m entioned above that we want to use a database for that. A database is usually a separate piece of software installed on your machine and on the server. You may have heard of MySQL, Postgres, or MongoDB. These are not just file formats. They are actual pieces of software that need to be installed and executed. And in order for an application to interact with a MySQL database, the MySQL software has to be running in parallel to your application at all times.

Databases are best suited for dynamic data and content. Those can be blog posts, users, bank accounts, just to name a few examples. In some cases, it may make sense to use static data however. If you have a set of data that most likley will never (or very rarely) change, it's also totally fine **not** to use a database. 
Some example for static data that doesn't need a database coule be: a list of countries you offer your products in, a list of services you offer that are never changing, the type of bank accounts a user could open, etc.

We may want to add or remove types of cookies as we go. So we'd like to store them dynamically in a database.

## Choosing a database

Once we understand why to use a database we need to choose which one to use. We're not going to go into the different kinds of databases here. But just know that with Flask you're free to use any kind of database you like. 

We'll go with a relational database because it's a very common choice in the Flask community. If you're new to the field it's always good to choose a technology stack that's widely used. This way it'll be easier for you to get help whenever you get stuck. Each tech community has their own preferred stack. PHP developers like MySQL, Node.JS developer like MongoDB, and Flask developers often use Postgres. You can use any kind of database in all these cases. But Postgres is just a common choice among Flask developers. 

Postgres is a relational database. So to simplify things, we're going to get started with **sqlite** in this section. **sqlite** is a very small kind of relational database. It uses SQL. So you can interact with it in a very similar way as MySQL or Postgres. One big advantace of **sqlite** is that you don't need to have an additional piece of software running. Postgres you first would have to install and always running. And that's what you should do in a larger application. But when you're just starting out it's fine to start with **sqlite**. It stores the entire database in a single file in your project folder. 

_(Side note on hosting: You won't be able to use sqlite as main database on PaaS providers such as Heroku or Google App Engine. As mentioned in earlier exercises, they don't allow files to be written on the server except for the deployment itself. Since sqlite is data store in a simple file of your project folder, the data won't be stored long term. So as soon as you want to deploy youre application, you'll have to use something like Postgres instead. But we'll talk abou that more in a later section.)_

## Using an ORM: SQLAlchemy

When working with any database in your program, it's best if you don't have to write raw SQL code. Instead, you should use an **ORM** (Object-relational mapping) tool. One very popular tool for SQL databases in Python is **SQLAlchemy**. ORMs are essentially prewritten Python functions that allow you to interact (read, write, delete, update) with data in any SQL database by writing basic Python code. This way you can switch databases without changing much of your code. Think of it as an **interface to interact with the database by writing basic Python code**.

**SQLAlchemy** is a library and you can install it by running 

```
pip install flask_sqlalchemy
```

Don't forget you need to have your virtual environment active before you install the package. Also, don't forget to freeze your requirements.txt file after every package you install. 

Now, you can import it at the top of your **app.py** file by writing `from flask_sqlalchemy import SQLAlchemy`.

Similarly to `Flask`, `SQLAlchemy` is a class that needs to be initialized. As a parameter you should pass the `app` variable. That's how you connect SQLAlchemy with your Flask application: 

```py
db = SQLAlchemy(app)
```

Add the lien you see above right below the config function ands till above the model you created. 

Lastly, we should tell SQLAlchemy where to find out database. By default it'll use `sqlite` in the memory. But we want it to create an **sqlite** database file in our project directory. To do that you can add this line right below your other `app.config` line: 

```py
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
```

`SQLALCHEMY_DATABASE_URI` is a predefined configuration variable used by SQLAlchemy to know the URL to your database. Here we tell SQLAlchemy to use **sqlite** and store it in a file called **database.db**. 

That's it. That's all you need to setup a very basic **sqlite** database. Here is what the top half of your code should roughly look like now (I did not include all routes and neither the `app.run()` in the code example below): 

```py
from flask import Flask, redirect, url_for, render_template, send_file
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config.from_object('config')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'

db = SQLAlchemy(app)

# Models

class Cookie():
  id = ''
  slug = ''
  name = ''
  price = ''

# Routes

@app.route('/')
def index():
  return render_template('index.html')

# ...
```

To keep our project code clean, you should add the name of the **database.db** file on a new line to the **.gitignore** file.

## Defining a model with SQLAlchemy

Now, that SQLAlchemy is all set up I can use it to define my model. The reason for that is that I want my model to represent a table in my database. The database will have several tables later on. Maybe one for users, one for orders, but also one for cookies. And that's the one we want to create now. 

Again, the ORM makes it easy for me to define my data structure by just writing Python code. SQLAlchemy will handle translating this to the actual database - no matter whether it's sqlite or Postgres. 

To define the data structure I need to _inherit_ my `Cookie` class from a class defined in SQLAlchemy called `db.Model` - like this: `class Cookie(db.Model)`.

Now, let's define the properties we created placeholders for earlier. The way you do that is with the `db.Column()` method provided by SQLAlchemy. That method tells SQLAlchemy to create a column for the given property. As parameter of the function, you need to tell SQLAlchemy what **type** of column to create. Some types are `db.Integer`, `db.String`, `db.Date`. Check out [this complete list](https://docs.sqlalchemy.org/en/14/core/type_basics.html) of data types available.

Here is what it would look like doing it for all our properties: 

```py
class Cookie(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  slug = db.Column(db.String(80), unique=True)
  name = db.Column(db.String(80))
  price = db.Column(db.Numeric(10, 2))
```

There are a few important things to point out. 

Each model you define should always have an `id` property. And unless you have a good reason to do it differently, it should just be defined as `db.Integer` and have the `primary_key` parameter set to `True`. SQLAlchemy will automatically fill that value for you when new records are created. And each new record will have an incremented number as ID. That means the first record you'll ever create will automatically get the ID `1`, the second one `2`, the third one `3`, and so on. The `primary_key` attribute tells SQLAlchemy that this field will be used to primarily identify the record. Therefore, it **must be unique**. There can never be two records with the same ID in a single table. 

The `80` that's the argument of the `db.String()` function limits the string's length to 80 characters. Users will not be able to create or update records to have longer strings. It's considered good practice to limit the length for security reasons (for example, so nobody can go nuts and fill your database with insane amounts of data). Keep in mind, though, not to be too restrictive. Especially when you deal with the names of real people there are plenty of bad examples out there of applciations that required a minimum length higher than the length of some people's actual names or limited the street name field so much that the full street name couldn't fit. Just be cautious. 

Then, there is a parameter `unique=True`. As you might guess, this parameter tells SQLAlchemy that this field value should also always be unique. Since we use the `slug` for the URL to our cookies, we don't want any cookies to accidentally have the same `slug`. If we try to create a record with the same slug as another one, this will throw an error and the creation won't happen. 

Finally, we chose the `db.Numeric` type for the price. We could have also used `db.Integer` or `db.Float`. But in the case of prices both those data types have downsides. Integers have a maximum value and floats do wonky things once you start doing math with them. And you certainly don't want your app to do funny things when it comes to financial information. The numeric data type uses multiple integers to store a numeric value that may include decimals. The first parameter `10` defines how many integers to use. In this case we chose `10` - although it's unlikely that we'll ever have a cookie that expensive. The second value `2` defines how many decimal points we want to allow. Since this is a price we want there only to ever be a maximum of 2 decimal points. 

## Migrations

Alright! We got our model set up. Now we need to actually let SQLAlchemy create a database table for us that matches what we defined in the `Cookie` model. 

This is the part where a lot of other tutorials will tell you to open the Python console with `python3` in the Terminal now. Then run `from app import db` and `db.create_all()`. And it's true. `db.create_all()` is a function provided by SQLAlchemy to actually create all the database tables based on the models you have defined in your application. **But** it's not really sustainable to always have to do that in a growing application. And it's not considered best practice either. 

Most larger applications use a concept called **migrations**. A migration is like a script that migrates your Python models to the database as tables. Each time you make a change, a new migration file is created. This way you can keep track of all the changes that ever happened in your application. It also makes it easier to roll changes back if something goes wrong. That's why I'd suggest to use migrations from the beginning.

Fortunately, there is a useful package for that again. Run `pip install flask_migrate`. (Don't for get to freeze the requirements.txt file)

Then, add it to your **app.py** file: 

```py
from flask_migrate import Migrate
```

Right below where you initialized `db = SQLAlchemy`, insert: 

```py
migrate = Migrate(app, db)
```

Note, that you need to pass two parameters: `app` and `db`. That's because you want to connect the migration package also to SQLAlchemy and the database. 

Once you've done that you can use the command line to create migrations. 

### Initial database creation

First, you need to initialize the database. Do that by running: 

```
flask db init
```

To make sure it has worked, you should see a new folder called **migrations** created in your project folder. That should include a whole bunch of stuff. Among them a **versions** folder. 

If that's not the case, try to identify the error messages you got in the terminal. There may be some warnings. That's fine, we'll deal with those later. Try to see if there are **errors** and not warnings. They may give you an idea of what went wrong. Sometimes it can be as simple as a typo in your code or a missing colon.

You only need to run this `init` script once in the beginning and then never again.

### Making database updates with migrations

Once you got the **migrations** folder, you can move on to the next step. Now we can create the actual migration for the `Cookie` model. 

You create a new migration with this command in the command line: 

```
flask db migrate -m 'create cookie model'
```

Execute this command and then have a look in the **migrations/versions** folder. You should now see a new file was created. This file includes the script that interacts with SQLAlchemy to create a new database table for our `Cookie` model. 

The text of the string in the end `'create cookie model'` could have been anything you like. Think of those like git commits. They should describe what changes you made. This will help you later on more easily keep track of the changes you made over time. 

Now, that the migration was created you can actually run the migration script with: 

```
flask db upgrade
```

If everything went well, you should see something like this in your command line: 

```
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 339d18852676, create cookie model
```

Alright great! We have created a database table!

## CRUD

Now we have a database, but how do we interact with the data? You may have heard of **CRUD**. It stands for Create, Read, Update, Delete. Those are the four ways you can interact with your data. Reading data means getting it from the database. Creating data writes a new record to your database table.

### Create

Right now we have an empty database. In order to read anything we first need to create something. Let's create a bunch of our cookies as records in the database. 

When developers want to add a bunch of data to a database at once they usually do that with a **seed** script file. So let's do exactly that. In the root of your project, create a new file called **seed.py**. 

In that file import `from app import db, Cookie` at the top. That's because we will use both the database and the `Cookie` model in our seed file. 

Then, you can add the `cookies_data` data set from before. 

```py
from app import db, Cookie

cookies_data = {
  'chocolate-chip' : {'name': 'Chocolate Chip', 'price': 1.50},
  'oatmeal-raisin' : {'name': 'Oatmeal Raisin', 'price': 1.00},
  'sugar' : {'name': 'Sugar', 'price': 0.75},
  'peanut Butter' : {'name': 'Peanut Butter', 'price': 0.50},
  'oatmeal' : {'name': 'Oatmeal', 'price': 0.25},
  'salted-caramel' : {'name': 'Salted Caramel', 'price': 1.00},
}
```

👀  _Attention: The price was a string in our old data set. I adjusted it here to be a number. If it would be a string, our script would break as we defined `price` to be a `db.Numeric` value._

Now, add a for-loop that loops over each data point. This might look different depending on whether you loop over a dictionary or a list. In our example we want to loop over a diciotnary. So this is what it would look like: 

```py
for slug, cookie in cookies_data.items():
```

Now, within that loop we want to create a new record for each item and assign the slug, name, and price. Remember, the `id` is set automatically by SQLAlchemy. 

There are different ways to accomplish this. But first we need to create an instance of each cookie using the `Cookie` class:

```py
for slug, cookie in cookies_data.items():
  new_cookie = Cookie(slug=slug, name=cookie['name'], price=cookie['price'])
```

We assign all three variables coming from the data collection above. 

To save this to the database, we need to add the newly created `Cookie` instance to the **database session**:

```py
for slug, cookie in cookies_data.items():
  new_cookie = Cookie(slug=slug, name=cookie['name'], price=cookie['price'])
  db.session.add(new_cookie)

db.session.commit()
```

The `db.session` represents a temporary version of your database. With `db.session.add()` you say: "Remember this record for a moment in your temporary storage. I'll do something with it later."
After you have looped through all the records, you then run `db.session.commit()` and with that save all the records at once instead of individually. 

Whenever you want to **create**, **update**, or **delete** records in the database, you need to **commit database sessions**. Think of a **database session** as of a temporary version of your database. It's a working draft of your database and it's only saved once you use the `commit` command. 

Run this script executing `python seed.py` in the command line. 

If everything went well, you should not see much happening in the command line. If there was an error, you'll see that one. 

### Read

Let's see if our seed worked and fix our broken `cookies` route at the same time. For that, we need to learn how to `get` the data. **SQLAlchemy** gives us some handy methods for querying data. You can access all sorts of methods through the `Cookie.query` namespace. Remember, our `Cookie` model inherits the methods from `db.Model`. And that model comes with methods such as `query` predefined. Therefore, they are also available for our `Cookie` class. 

**Query all:**

To query all the cookies run: `Coookie.query.all()`

You can add that to the cookies route so that it looks like this: 

```py
@app.route('/cookies')
def cookies():
  all_cookies = Cookie.query.all()
  return render_template('cookies.html', cookies=all_cookies)
```

But that's only the first part. Previously our cookies were all dictionaries. But now they are all class instances. That means, their properties are accessed using **dot-notation** and not **square brackets** anymore (like with dictionaries). Thus, we need to open our **cookies.html** file and make some changes. 

First of all, `cookies.items()` will fail because `cookies` is just a list now. 
So the for-loop should be changed to `{% for cookie in cookies %}`.

Secondly, all the square bracket notation neets to be replaced with **dot-notation**. `cookie['price']` becomes `cookie.price`, `cookie['name']` becomes `cookie.name` and `slug` is now `cookie.slug`. Also, the condition to check for the price now needs to be adjusted to compare to a numerical value. Here is what all the changes look like: 

```html
<h1>Cookies</h1>
<ul>
  {% for cookie in cookies %}
    <li>
      {% if cookie.price == 0.25 %}
        <s>{{ cookie.name }}</s>
      {% else %}
        <a href="/cookies/{{ cookie.slug }}">{{ cookie.name }}</a>
      {% endif %}
    </li>
  {% endfor %}
</ul>
```

If you save all the files and everything went well, your website should look the exact same way it looked before. 

**Query one:**

Let's also fix the individual cookie page and with that learn how to get a specific cookie. To grab an individual record based on it's `id`, you would use this method: 

```py
cookie = Cookie.query.get(id)
```

This would be helpful, if the routes wouldn't use a `slug` but instead the `id`. You could change the link on the `cookies` page to this: 

```html
<a href="/cookies/{{ cookie.id }}">{{ cookie.name }}</a>
```

That would allow you to use the `id` to get an individual cookie in the `cookie` route. But we'd like to go a step further. Let's grab a record based on another value:

```py
cookie = Cookie.query.filter_by(slug=slug).first()
```

The `filter_by` method let's me filter by a specific parameter of my records. It will return a list (even if there is only one item that matches the filter). So To make sure we only get a single cookie record here, we use the `first()` method. 

Here is what all this together looks like: 

```py
@app.route('/cookies/<slug>')
def cookie(slug):
  cookie = Cookie.query.filter_by(slug=slug).first()
  return render_template('cookie.html', cookie=cookie)
```

And the corresponding HTML in the **cookie.html** could look like this: 

```html
{% extends 'base.html' %}

{% block title %}Cookieshop{% endblock %}

{% block body %}
  <h1>{{cookie.name}}</h1>

  <p>Price: ${{cookie.price}}</p>

  <footer>
    <a href="/cookies">Back to all cookies</a>
  </footer>
{% endblock %}
```

(Assuming you created a base.html file in the exercise before.)

Try this out and you should see all the values show up correctly. 

Now, there is one thing we had before in the `cookie` reoute that we just removed. That's a validation that makes sure a cookie actually exists. We could add another condition like `if cookie:` that checks whether or not a cookie was found and conditionally render a different template. 

An easier solution is to use a function provided by SQLAlchemy itself. That's `.first_or_404()`. We can use that instead of `first()` to throw a 404 error in case a record wasn't found. Here is what it'll look like: 

```py
@app.route('/cookies/<slug>')
def cookie(slug):
  cookie = Cookie.query.filter_by(slug=slug).first_or_404()
  return render_template('cookie.html', cookie=cookie)
```

Now, try accessing the page of a cookie that doesn't exist, for example: [127.0.0.1:5000/cookies/banana-bread](127.0.0.1:5000/cookies/banana-bread). You should receive a 404 error. That's good. Because that's the standard way of how your webserver should handle routes you don't want to exist. 

Let's briefly cover the last two of the **CRUD** methods. While we won't be implementing them in our example application just yet, you'll learn how to use them. This way you can use this page as a reference in case you need to use the methods later on. 

### Update

We have created our list of cookies and our application can access them. Let's assume we like to change the price of one of our cookies. How would we do that? 

As mentioned above, to make any changes to the database, you need to call the `db.session` and `commit` it. Since this is a very common task and we may have to do that more often in the future, it makes sense to add an **instance method** to our `Cookie` class for `commit`ting or "saving" our cookie. 

Open your **app.py** file, scroll to the `Cookie` model and add the following method to it: 

```py
def save(self):
  db.session.add(self)
  db.session.commit()
```

If you're familiar with Python classes (which you really should be by now!), you'll know that `self` just refers to the cookie instance and represents a cookie object. This could be for example an object with the slug `chocolate-chip` and the price `1.50`. 

`db.session.add(self)` just adds that cookie object to the session, including it's ID (if it has one). If it doesn't have an ID, SQLAlchemy automatically knows to create a new cookie record from the instance. 

With `db.session.commit()` we **save** the whole thing to the actual database. Until it's `commit`ted, nothing is saved in the database. 

This is what your model should look like now: 

```py
class Cookie(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  slug = db.Column(db.String(80), unique=True)
  name = db.Column(db.String(80))
  price = db.Column(db.Numeric(10, 2))

  def save(self):
    db.session.add(self)
    db.session.commit()
```

Now we can use the method. While having the virtual environment active, type `python` in your command line and just hit enter. This will open an interactive Python console where you can type in single lines of Python code to be executed. 

Think of it as a **.py** file that you can edit and execute on the fly and line by line. This means, you even have access to commands like `import`. 

Try it out! Write `from app import db, Cookie` and hit Enter. If you now type `Cookie.query.all()` and hit Enter you should see something like this: 

```py
[<Cookie 1>, <Cookie 2>, <Cookie 3>, <Cookie 4>, <Cookie 5>, <Cookie 6>]
```

This is a list of all the `Cookie` records in our database. Just like in your Python files, you can interact with them here because you imported the `db` variable as well as the `Cookie` class from your **app.py** file. This is very practical if you want to run quick lines of code. But it can also help whenever you want to try out some code. 

We now want to change a specific cookie. Query any cookie and store it in a variable. For example like this: 

```py
cookie = Cookie.query.get(1)
```

To see the properties of `cookie` you can just access them using dot-notation. Just try typing `cookie.slug` or `cookie.price`.

This is what you'll see:

```py
>>> cookie.price
Decimal('1.50')
>>> cookie.slug
'chocolate-chip'
```

Let's say the cookie sold very well and we want to raise the price. Changing the price is very simple thanks to the `.save()` method we added earlier. Just change the price to whatever you like as you'd assign a new variable value and then call `cookie.save()`.

For example: 

```py
from app import db, Cookie
cookie = Cookie.query.get(1)
cookie.price = 3.0
cookie.save()
```

If you now access the page of the cookie in the browser, you should see the adjusted price. In my example, this was the chocolate chip cookie. So the URL was [http://127.0.0.1:5000/cookies/chocolate-chip](http://127.0.0.1:5000/cookies/chocolate-chip). Yours could have been a different one. Just double check by printing out the slug with `cookie.slug`.

To close the Python console again, just run `exit()`.

### Delete

Raising the price of our chocolate chip cookie hasn't reduced the demand. To the contrary. It's sold out and we want to delete it from our database. 

Let's add a another instance method called **delete** to our `Cookie` class:

```py
def delete(self):
  db.session.delete(self)
  db.session.commit()
```

You can just add it below the `save` method (but not inside of it). You may have already guessed. Just like `db.session.add(self)` **added** the current cookie object to the datbase session, `db.session.delete(self)` removes it from the session. If you `commit` the session with the cookie object removed, it will also be deleted from the actual database. 

To delete a record from the database, run `python` again to start up the Python console. Import again both `db` and `Cookie` as we did above. Query the cookie you'd like to delete from the database and assign it to the `cookie` variable. Finally, run `cookie.delete()` and you should notice if you exit the console, start the server and reload the page that the cookie should be gone now. 

```py
from app import db, Cookie
cookie = Cookie.query.get(1)
cookie.delete()
```

## Using another database

Everything you learned about in this exercise works exactly the same for another SQL database such as Postgres or MySQL. WIth those, your configuration `app.config['SQLALCHEMY_DATABASE_URI']` will not point to `sqlite`. Instead, you'd install the software, e.g. Postgres. Then, you'd set up a database and in the end get a URL to that database. That URL you could insert in the configuration instead of `'sqlite:///database.db'`. You'll learn to do this in more detail later on, when we deploy our application to a server. 

## 🛠  Practice 

1. In your separate practice project, install `flask_sqlalchemy` and `flask_migrate` and set up both database and migrations with SQLite.
2. Come up with at least one model you need. Create a class for it, make sure it inherits from `db.Model` and define its columns. 
3. Add a `save` and `delete` method to the model.
4. Create a seed file to fill your database with some initial data and create a bunch of records. 
5. Adjust the routes of your application. One page should query all database records. Your dynamic pages should get an individual records based on the URL. (If a user tries to access a page that doesn't exist they should get a 404 error.)