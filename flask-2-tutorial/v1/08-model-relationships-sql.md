---
title: "Model Relationships in SQL Databases"
videoId:
slug: "model-relationships-sql"
templateEngineOverride: md
---

In this exercise, you'll build upon what you have learned previously about databases and models. One key element of relational databases is **relationships** between data sets - as the name suggests 🤯.

There are many situations where you may want to connect data. Here are some examples:

* An author **has many** blog articles
* While an article **belongs to** only one author
* A playlist **has many** songs 
* But each song can also **belong to many** playlists

Depending on whether your database is a SQL or NoSQL database, those relationships' data structures could look very different (but don't necessarily have to). This exercise will focus on relational (SQL) databases.

## Foreign Keys

To connect data sets in relational databases, you'd commonly use a concept called **foreign keys**. Let's say you have a blog `Article` model:

```py
class Article(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(128))
  text = db.Column(db.Text())
```

And you have a `Author` model:

```py
class Author(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(128))
```

When we display the blog article to our users, we also want to display the author's name on the article page. One way to do that is to just add another field for the author name to the `Article`. But imagine the author changes the name. Now, you'd have to go into your database and change the author name string on all articles. That's quite tedious. A better solution would be to store the author's name only once and set up a relationship between the two models. 

Remember, each table row (i.e., each record) has a **unique id**. You can use that `id` to get a specific record (as you have learned in the previous exercise).

So if you want to remember which author **belongs to** a specific article, we just need to remember the `id` of that specific author. With the `id`, we'll be able to get the name from the `Author` record.

To remember the `id` of the author, we add a new column to the `Article` model that will store just the author's `id`. That's what's called the **foreign key**. The `id` of the author stored on the `Article` model is the **foreign key**. 

You add a new column like this: 

```py
class Article(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(128))
  text = db.Column(db.Text())
  author_id = db.Column(db.Integer, db.ForeignKey('author.id'))
```

Pay attention to the `author_id`. It's defined to be of the type of `db.Integer`. This must be the same type as the `id` column on the `Author` model. 

The second parameter defines that this will be a **foreign key**. Note that the parameter of `db.ForeignKey()` is a string with the `Author` model name in **lower case** plus `.id` as the column's name that represents the foreign key is `id`. It can be confusing and cause mistakes easily. So make sure you pay attention to when you need to use upper case or lower case.

_**Side note**: If you want to make sure a relationship always exists, you can add as a third parameter `nullable=False`. See more [details here](https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/#one-to-many-relationships). What this will do is it'll make sure an `author_id` is always set, and it will never be possible to create an `Article` record without a corresponding `author_id`._

There are different types of relationships between models. It's common to use phrases like **"has many"**, **"belongs to"**, or **"has one"** to describe these relationships. The phrasing helps reason about your data structure and is a great help in coming up with a strategy on **where to put the foreign key**.

## One-to-One Relationship

The most direct relationship is the **one-to-one** relationship.

In our cookie shop, we want users to be able to make orders, and each order should have a delivery address attached to it. This could be a use case for a **one-to-one** relationship. The order records could contain information about when the order was made. A separate address record could contain the street name, city, zip code, and everything relevant for delivering the order.

Now, you could combine both those data sets into the same model. And that could be a valid choice. But maybe, later on, you want to allow orders without address because they are purchased in-store or for pick-up. In those cases, it might make sense not to have a bunch of empty address fields on the `Order` model. 

Create a new **orders** folder with a **models.py** and **\_\_init\_\_.py** file:

* **/app/orders/\_\_init\_\_.py**
* **/app/orders/models.py**

The **\_\_init\_\_.py** should include:

```py
from . import models
```

The **models.py** should import `db` like this: 

```py
from app.extensions.database import db
```

Let's create an order model. We will only start using it in a much later exercise. But we can already create it here as it helps to demonstrate the **one-to-one** relationship. Add it to **/app/orders/models.py**:

```py
from datetime import datetime

class Order(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
```

There are a few things to point out. For the `date` column, we use a data type we haven't used before: `db.DateTime`. This data type represents both date and a time. We set `nullable` to `False` as we want the date to always exist. 

`default` lets us set a default value that's automatically set if we don't specify something else. We assign it to `datetime.utcnow`. `datetime` is a package included by default with Python. It gives us access to a number of time-related utility functions. In this case, we use it to set the current time and date in UTC format as the default value whenever an order is created. 

Below, add another model: 

```py
class Address(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(80))
  street = db.Column(db.String(80))
  city = db.Column(db.String(80))
  state = db.Column(db.String(80))
  zip = db.Column(db.String(80))
  country = db.Column(db.String(80))
  order_id = db.Column(db.Integer, db.ForeignKey('order.id'))
```

You can see, next to a bunch of fields to store the address. We added the field `order_id`. That's the column referring back to our order using a foreign key. In a one-to-one relationship, it actually doesn't really matter which of the two records keeps the foreign key. One way to choose the model with the foreign key could be to think about which one could exist without the other. In our example, we might have an order without an address. But we really won't have an address without an order. Therefore, we added the `order_id` as a foreign key to the `Address` model. 

Technically this is already all we need to set up the relationship. But we can add one more line to our `Order` model: 

```py
address = db.relationship('Address', backref='order', uselist=False, lazy=True)
```

The `db.relationship` will **not** add anything to the database. But it'll allow easier access later on. It'll allow you to access the address of an order instance with dot-notation. E.g., `my_order.address` would return the related address object. 

The first argument is the model's name you're setting the relationship up with. The second parameter, `backref` allows you to do the same the other way around. So it will allow you to do something like `my_address.order` in order to access the order related to a given address. `uselist=False` defines that we have a **one-to-one** relationship here. Without it, this would return a list (see below). Finally, `lazy=True` is technically the default value. So it's not quite necessary. But it's good practice to be explicit. This parameter defines how the data will be loaded. Find out more details [in the official documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/#one-to-many-relationships). `lazy=True` will load the data immediately, while other settings could delay the loading a little bit in case you'd want to add queries dynamically. 

This is a complete **one-to-one** relationship. To add it to a migration, we first need to import it into our app. If you added the model to the **\_\_init\_\_.py** file, you can just add `orders` to the import statement in your **/app/app.py** file: 

```py
from . import cookies, simple_pages, orders
```

Then, run in the command line:

```
flask db migrate -m 'create order and address'
```

(or use your own migration message.)

This will create the migration and to execute it run:

```
flask db upgrade
```

## One-to-Many Relationships

**One-to-many** relationships are actually set up very similarly as **one-to-one** relationships. In fact, the only difference is in the `db.relationship` function.

If you wanted a single `Cookie` to have multiple `Address` records related to it, you could keep the `Address` model exactly as it already is but change the reference to it in the `Order` model slightly to look like this: 

```py
addresses = db.relationship('Address', backref='order', lazy=True)
```

As you can see, not much has changed - at all, actually. We adjusted the name of the property to be plural (`addresses` instead of `address`) and removed the `uselist=False` from the parameters. 

That's it. You can turn a one-to-one relationship into a one-to-many relationship simply by changing some code without even having to change anything about the database! _(Given the foreign key is already on the correct object.)_

Don't actually do that in our project. Instead, we're going to move on to the last type of relationship:

## Many-to-Many Relationships

You may have already noticed that our `Order` model doesn't actually contain any information on what cookies have been ordered. That's because it's not simply a **one-to-many** relationship. 

Both these statements are true: 

* A cookie record can be part of (aka **have many**) orders
* An order can **have many** different cookies

And there is one more problem. What if I want to add an extra piece of information that stores per order how many cookies have been ordered? 

For this kind of setup, we need a **many-to-many** relationship. In SQL databases, those kinds of relationships are done using a third database table in the middle. This table's purpose is only to connect the two records. 

One method to solve this would be to use a so-called **helper table**. That's also the approach you find in the [official documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/models/#many-to-many-relationships).

In our situation, we want to have a little more control over the table and be able to add more columns than just the `cookie_id` and the `order_id`. That's why instead, we'll be following the **association model pattern** as [described in the SQLAlchemy documentation](https://docs.sqlalchemy.org/en/13/orm/basic_relationships.html#association-object).

In **/app/orders/models.py** add (above the other models):

```py
class CookieOrder(db.Model):
  cookie_id = db.Column(db.Integer, db.ForeignKey('cookie.id'), primary_key=True)
  order_id = db.Column(db.Integer, db.ForeignKey('order.id'), primary_key=True)
  number_of_cookies = db.Column(db.Integer)
```

The two most important columns are `cookie_id` and `order_id`. If you create a many-to-many relationship, those are the only two columns you need. But because we want to also store how many cookies someone ordered, we added a third column that stores that exact number. 

_(Note that this model does not have an `id` field on its own. We don't need it because the whole purpose of this model is to be found based on the `cookie_id` and `order_id`.)_

For many-to-many relationships, it's best practice to name the third table after the two tables it's connecting. That's why we named it `CookieOrder`.

To also reference the `CookieOrder` model from the `Order` model, we can just add the following line at the bottom of the `Order` model and below its other properties: 

```py
cookie_orders = db.relationship('CookieOrder', backref='order', lazy=True)
```

We can add a similar line to the `Cookie` model in **/app/cookies/models.py**:

```py
cookie_orders = db.relationship('CookieOrder', backref='cookie', lazy=True)
```

The relationship is defined with the name of the model **as a string**. The `backref` will allow us to also reference the `Order` back from a `CookieOrder`. The `lazy=True` is again not completely necessary but helpful to be explicit about your code. 

## Conclusion

In this exercise, we added a few models without actually letting users interact with them yet. The purpose was to learn about relationships. In a later exercise, we'll actually use those models and work with them more.

## 🛠  Practice

1. Think about a model relationship that might make sense in your project. 
2. Describe the relationship from both sides using the terms **belongs to** and **has many**. Try to determine if it's a **one-to-many**, **one-to-one**, or **many-to-many** relationship.
3. Create the extra models, and don't forget to use migrations. 