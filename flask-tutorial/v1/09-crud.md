---
title: CRUD
videoId:
slug: "crud"
description: Learn how to create, read, update, and delete database records in Flask using SQLAlchemy.
lastUpdate: March 10th, 2023
templateEngineOverride: md
---

In the previous exercises, you learned to set up a database and models. But we haven't really done anything with the data yet. How do we do that?

You may have heard of **CRUD**. It stands for Create, Read, Update, Delete. Those are the four ways you can interact with your data. Reading data means getting it from the database. Creating data writes a new record to your database table.

Let's go through each one of them at a time.

## Create

Right now, we have an empty database. To read anything, we first need to create something. Let's create a bunch of our cookies as records in the database. 

When developers want to add a bunch of data to a database, they usually do that with a **seed** script file. So let's do exactly that. Create a file and folder at the following path: 

* **/app/scripts/seed.py**

In that file, we'll need to import a few things:

```py
from app.app import create_app
from app.cookies.models import Cookie
from app.extensions.database import db
``` 

We need `create_app` because we want to perform actions that take place within our application context. We need `Cookie` as that's the model we'll use to create records for. Finally, we need `db` to perform actual operations on the database.

Below the imports add: 

```py
if __name__ == '__main__':
  app = create_app()
  app.app_context().push()
```

The two last lines create an app instance and initialize an **application context**. This is a bit confusing and you don't have to understand the details. But in essence, this allows you to run the script as a single file without starting the Flask application server. It kind of simulates running the application just for the duration the Python script is being executed. 

The line `__name__ == '__main__'` should look familiar. It checks if the seed.py file is the one that's executed directly from the command line. If it is this will evaluate as `True`. If it isn't the code in the condition will be ignored. This is important because sometimes you want to run script files like this one while your Flask application is running. So this makes sure you only simulate an app context if you execute this file directly and not if you run the script while the app is running anyway. 

Again, this can be very confusing and is relatively advanced. So don't worry if you still don't fully understand the application context. The important part is that you need to "fake" an application context if you run this script outside of your regular Flask application. 

Next up, add the `cookies_data` from the previous exercises. We'll use it to populate our database. The file should look like this now: 

```py
from app.app import create_app
from app.cookies.models import Cookie
from app.extensions.database import db

if __name__ == '__main__':
  app = create_app()
  app.app_context().push()

cookies_data = {
  'chocolate-chip' : {'name': 'Chocolate Chip', 'price': 1.50},
  'oatmeal-raisin' : {'name': 'Oatmeal Raisin', 'price': 1.00},
  'sugar' : {'name': 'Sugar', 'price': 0.75},
  'peanut-butter' : {'name': 'Peanut Butter', 'price': 0.50},
  'oatmeal' : {'name': 'Oatmeal', 'price': 0.25},
  'salted-caramel' : {'name': 'Salted Caramel', 'price': 1.00},
}
```

👀  _Attention: The price was a string in our old data set. I adjusted it here to be a number. If it were a string, our script would break as we defined `price` to be a `db.Numeric` value._

Now, add a for-loop that loops over each data point. This might look different depending on whether you loop over a dictionary or a list. In our example, we want to loop over a dictionary. So this is what it would look like: 

```py
for slug, cookie in cookies_data.items():
```

Now, within that loop, we want to create a new record for each item and assign the slug, name, and price. Remember, the `id` is set automatically by SQLAlchemy. 

There are different ways to accomplish this. But first, we need to create an instance of each cookie using the `Cookie` class:

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
After you have looped through all the records, you then run `db.session.commit()` and with that, save all the records at once instead of individually. 

Whenever you want to **create**, **update**, or **delete** records in the database, you need to **commit database sessions**. Think of a **database session** as a temporary version of your database. It's a working draft of your database, and it's only saved once you use the `commit` command. 

Run this script executing `python -m app.scripts.seed` in the command line. The `-m` makes sure that all the paths and `import` statements are understood correctly. `app.scripts.seed` is the same way of writing it as we would with import statements.

If everything went well, you should not see much happening in the command line. If there was an error, you'll see that one. 

_**Side note**: You may see a "Warning". Warnings are different from errors. They are usually only **informative**. They just want to point out something to you. But they **don't** mean that anything broke. Make sure to differentiate between the two. Errors show something broke. Warnings try to inform you about something but the code itself still worked._

## Read

Let's see if our seed worked and fix our broken `cookies` route at the same time. For that, we need to learn how to `get` the data. **SQLAlchemy** gives us some handy methods for querying data. You can access all sorts of methods through the `Cookie.query` namespace. Remember, our `Cookie` model inherits the methods from `db.Model`. And that model comes with methods such as `query` predefined. Therefore, they are also available for our `Cookie` class. 

### Query all:

To query all the cookies use: `Coookie.query.all()`

Let's use this opportunity to fix our `cookies()` route that has been broken all this time. Back in **/app/cookies/routes.py** change the `cookies` route to this: 

```py
@blueprint.route('/cookies')
def cookies():
  all_cookies = Cookie.query.all()
  return render_template('cookies/index.html', cookies=all_cookies)
```

_(We're calling the `Cookie` model here. You should have already imported it in an earlier exercise. But if not, do it now.)_

That's only the first step, though. Previously our cookies were all dictionaries. But now, they are all class instances. That means their properties are accessed using **dot-notation** and not **square brackets** anymore (like with dictionaries). Thus, we need to open our **/app/templates/cookies/index.html** file and make some changes. 

First of all, `cookies.items()` will fail because `cookies` is just a list now. 
So the for-loop should be changed to `{% for cookie in cookies %}`.

Secondly, all the square bracket notation needs to be replaced with **dot-notation**. `cookie['price']` becomes `cookie.price`, `cookie['name']` becomes `cookie.name` and `slug` is now `cookie.slug`. Also, the condition to check for the price now needs to be adjusted to compare to a numerical value. Here is what all the changes look like: 

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

### Query one:

Let's also fix the individual cookie page and, with that, learn how to get a specific cookie. To grab an individual record based on it's `id`, you would use this method: 

```py
cookie = Cookie.query.get(id)
```

This would be helpful if the routes wouldn't use a `slug` but instead the `id`. You could change the link on the `cookies` page to this: 

```html
<a href="/cookies/{{ cookie.id }}">{{ cookie.name }}</a>
```

That would allow you to use the `id` to get an individual cookie in the `cookie` route. But we'd like to go a step further. Let's grab a record based on another value:

```py
cookie = Cookie.query.filter_by(slug=slug).first()
```

The `filter_by` method let's me filter by a specific parameter of my records. It will return a list (even if only one item matches the filter). So To make sure we only get a single cookie record here, we use the `first()` method. 

Here is what all this together looks like: 

```py
@blueprint.route('/cookies/<slug>')
def cookie(slug):
  cookie = Cookie.query.filter_by(slug=slug).first()
  return render_template('cookies/show.html', cookie=cookie)
```

You may not have the template for this route yet. So this might be a good opportunity to add one. Note that I called the file **show.html**. Just like the name `index` is often used as the file name for a page that shows the whole collection, `show` is often used as the file name for the page that shows an individual collection item. 

Here is what the **/app/templates/cookies/show.html** file could look like: 

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

Try this out, and you should see all the values show up correctly. 

Now, there is one thing we had before in the `cookie` route that we just removed. That's a validation that makes sure a cookie actually exists. We could add another condition like `if cookie:` that checks whether or not a cookie was found and conditionally render a different template. 

An easier solution is to use a function provided by SQLAlchemy itself. That's `.first_or_404()`. We can use that instead of `first()` to throw a 404 error in case a record wasn't found. Here is what it'll look like: 

```py
@blueprint.route('/cookies/<slug>')
def cookie(slug):
  cookie = Cookie.query.filter_by(slug=slug).first_or_404()
  return render_template('cookies/show.html', cookie=cookie)
```

Now, try accessing the page of a cookie that doesn't exist, for example: [127.0.0.1:5000/cookies/banana-bread](127.0.0.1:5000/cookies/banana-bread). You should receive a 404 error. That's good because that's the standard way of how your webserver should handle routes you don't want to exist. 

Let's briefly cover the last two of the **CRUD** methods. While we won't be implementing them in our example application just yet, you'll learn how to use them. This way, you can use this page as a reference in case you need to use the methods later on. 

## Update

We have created our list of cookies, and our application can access them. Let's assume we like to change the price of one of our cookies. How would we do that? 

As mentioned above, to make any changes to the database, you need to call the `db.session` and `commit` it. Since this is a very common task and we may have to do that more often in the future, it makes sense to add an **instance method** to our `Cookie` class for `commit`ting or "saving" our cookie. In fact, it's so common that we may even need it for our other models. So instead of adding it as a method to our `Cookie` model, we're going to create a **mixin class** that all our models can **inherit** from in order to have access to those methods.

A good place to put it is the **/app/extensions/database.py** file. Since we want a mixin class for all our **CRUD** operations, let's add a class at the bottom of the file and call it `CRUDMixin`. Then, we'll add an **instance method** and call it `save`. This method will **save** the model's current state with all its properties. 

Here is what it'll look like: 

```py
class CRUDMixin():

  def save(self):
    db.session.add(self)
    db.session.commit()
    return self
```

If you're familiar with Python classes (which you really should be by now!), you'll know that `self` just refers to the model instance and represents e.g., an individual cookie object. This could be, for example, an object with the slug `chocolate-chip` and the price `1.50`. 

`db.session.add(self)` just adds that model (e.g., cookie) object to the session, including it's ID (if it has one). If it doesn't have an ID, SQLAlchemy automatically knows to create a new record from the instance. 

With `db.session.commit()` we **save** the whole thing to the actual database. Until it's `commit`ted, nothing is saved in the database. 

The `return self` is just added for convenience in case we want to do something with the object after it has been saved.

For `Cookie` to inherit from the `CRUDMixin` class, we just add it to the `import` statement in **/app/cookies/models.py** and then as a second parameter of the `Cookie` model: 

```py
from app.extensions.database import db, CRUDMixin

class Cookie(db.Model, CRUDMixin):
  id = db.Column(db.Integer, primary_key=True)
  slug = db.Column(db.String(80), unique=True)
  name = db.Column(db.String(80))
  price = db.Column(db.Numeric(10, 2))
```

Now we can use the method with our `Cookie` class instance. Let's write a test to see if it worked. Create a new folder: **/app/tests/cookies** and in it a **\_\_init\_\_.py** file. Also, add a file called **test_models.py** in there.

In that file, we need to `import` our model and `db`. So add:

```py
from app.extensions.database import db
from app.cookies.models import Cookie
```

Next, let's write a test function: 

```py
def test_cookie_update(client):
  # updates cookie's properties
```

Remember the pattern: **Arrange-Act-Assess**. If we want to check if we can **update** a record, a record first has to exist. So in the **Arrange** step, we need to create a new record:

```py
def test_cookie_update(client):
  # updates cookie's properties
  cookie = Cookie(slug='chocolate-chip', name='Chocolate Chip', price=1.50)
  db.session.add(cookie)
  db.session.commit()
```

This will just create a cookie. Next, we want to **Act**, which means we want to execute the function that we're actually testing: 

```py
def test_cookie_update(client):
  # updates cookie's properties
  cookie = Cookie(slug='chocolate-chip', name='Chocolate Chip', price=1.50)
  db.session.add(cookie)
  db.session.commit()

  cookie.name = 'Peanut Butter'
  cookie.save()
```

Finally, we'll **Assess** whether the value is what we expect: 

```py
def test_cookie_update(client):
  # updates cookie's properties
  cookie = Cookie(slug='chocolate-chip', name='Chocolate Chip', price=1.50)
  db.session.add(cookie)
  db.session.commit()

  cookie.name = 'Peanut Butter'
  cookie.save()

  updated_cookie = Cookie.query.filter_by(slug='chocolate-chip').first()
  assert updated_cookie.name == 'Peanut Butter'
```

Note that we query the cookie record here again instead of just using the `cookie` variable set before. That's because we assigned `cookie.name` to be `Peanut Butter` before, and the test result would be positive even if `save()` didn't work. That's why we query the variable from the database again. 

Run `pytest -v`. If everything went well, you'll see all tests passing.

## Delete

Raising the price of our chocolate chip cookie hasn't reduced the demand. To the contrary. It's sold out, and we want to delete it from our database. 

Let's add another instance method called **delete** to our `CRUDMixin` class:

```py
def delete(self):
  db.session.delete(self)
  db.session.commit()
  return
```

You can just add it below the `save` method (but not inside of it). You may have already guessed. Just like `db.session.add(self)` **added** the current cookie object to the database session, `db.session.delete(self)` removes it from the session. If you `commit` the session with the cookie object removed, it will also be deleted from the actual database. 

To test whether this function works, let's add another test. Back in **/app/tests/cookies/models.py** add: 

```py
def test_cookie_delete(client):
  # deletes cookie
  cookie = Cookie(slug='chocolate-chip', name='Chocolate Chip', price=1.50)
  db.session.add(cookie)
  db.session.commit()
```

This is the test with the **Arrange** step. Next, add `cookie.delete()` for the **Act** step. And finally, you can **assert**:

```py
def test_cookie_delete(client):
  # deletes cookie
  cookie = Cookie(slug='butter', name='Butter', price=1.50)
  db.session.add(cookie)
  db.session.commit()

  cookie.delete()

  deleted_cookie = Cookie.query.filter_by(slug='butter').first()
  assert deleted_cookie is None
```

We expect the query to find no cookie. Therefore we `assert` `deleted_cookie` to be `None`.

That's it. That is how you do CRUD operations on your models. In future exercises, we will implement more of them directly in your application code.


## 🛠  Practice 

1. Create a `CRUDMixin` class and make sure your models inherit from it.
2. Add a `save` and `delete` method to the class.
3. Create a seed file to fill your database with some initial data and create a bunch of records. 
4. Adjust the routes of your application. One page should query all database records. Your dynamic pages should get an individual record based on the URL. (If a user tries to access a page that doesn't exist, they should get a 404 error.)
