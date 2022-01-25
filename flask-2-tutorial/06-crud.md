---
title: CRUD
videoId:
slug: "crud"
templateEngineOverride: md
---

In the previous exercise you learned to set up a database. But we haven't really done anything with the data yet. How do we do that?

You may have heard of **CRUD**. It stands for Create, Read, Update, Delete. Those are the four ways you can interact with your data. Reading data means getting it from the database. Creating data writes a new record to your database table.

Let's go through each one of them at a time.

## Create

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

## Read

Let's see if our seed worked and fix our broken `cookies` route at the same time. For that, we need to learn how to `get` the data. **SQLAlchemy** gives us some handy methods for querying data. You can access all sorts of methods through the `Cookie.query` namespace. Remember, our `Cookie` model inherits the methods from `db.Model`. And that model comes with methods such as `query` predefined. Therefore, they are also available for our `Cookie` class. 

### Query all:

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

### Query one:

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

## Update

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

## Delete

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

That's it. That is how you do CRUD operations on your models. In future exercises we're going to implement more of them directly in your application code. 

## 🛠  Practice 

1. Add a `save` and `delete` method to the model.
2. Create a seed file to fill your database with some initial data and create a bunch of records. 
3. Adjust the routes of your application. One page should query all database records. Your dynamic pages should get an individual records based on the URL. (If a user tries to access a page that doesn't exist they should get a 404 error.)