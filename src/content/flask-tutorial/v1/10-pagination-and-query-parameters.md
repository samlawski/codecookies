---
title: "Pagination and Query Parameters"
slug: "pagination-and-query-parameters"
description: Learn to use query strings in URLs in Flask and how to use them to create a pagination system.
lastUpdate: March 10th, 2023
---

In the previous exercise, we created some models and started interacting with the database using **CRUD** operations. 

Pagination is a topic that's often not covered in beginner tutorials. But it's extremely important. Think of our cookie shop. Assume I'd be adding different types of cookies every day. In our seed file, we had six different types. But what if I have a large-scale shop with 100 different products. Or think of a blog with thousands of articles. 

Sooner or later, it's going to get very expensive and slow to load _all_ records on our `/cookies` page. Similar to a blog or newspaper. It would be a very expensive call to load all articles at once. But right now, our `/cookies` route does exactly that. 

That's what most pages need **pagination** for. As the name suggests, it automatically splits up sets of data into pages. This way, you can scroll through the different pages of products on a shop website and maybe only get ten items at a time. 

## Pagination and Routes

To implement pagination, there are a few options. But let's start from the user's perspective. If you think about pagination, you first have to determine what the URL looks like when you paginate data. 

We have been working with **server-rendered** pages so far. That means that all HTML that is rendered by the user's browser is generated on the backend. This means whenever data in the database changes, users have to reload the page before they see those changes. That also means that any dynamic updates to data (such as loading more store items) have to go through the backend. The backend has to generate a new HTML to return to the user. 

This is different from (for example) single-page applications (short SPAs) built with JavaScript frameworks like React. The point of those frameworks is that you rerender HTML on the **client** whenever data changes, and you don't need to generate the HTML on the backend. You'll learn more about this in a later exercise. But it's important to make this distinction here. 

You may have seen a type of pagination on modern social media sites where you just scroll down and new content loads. Usually, this happens, and the URL in the browser might not even change. This is called **implicit pagination**. If you scroll down the page and load more items but then click in the browser to reload the page, you jump back to the top, and all items at the bottom are gone again. 

**Explicit pagination** means each page is defined by the URL. Users can enter a specific URL in the browser, and this URL will always result in a specific set of items. 

We're going to focus on the explicit way of paginating because so far we have a **server-rendered** page. 

## Paths vs. Query Parameters

There are different ways to define your URL, but a few examples could be: 

1. https://mycookieshop.com/cookies/page-2
2. https://mycookieshop.com/cookies?page=2
3. https://mycookieshop.com/cookies?offset=20

The first option uses a variable in the **path** of the URL (just like we did with dynamic routes). The other two examples use so-called **query parameters**.

The first URL could be defined in Flask, for example like this: 

```py
@blueprint.route('/cookies/page-<int:page_number>')
def cookies(page_number)
```

Don't change your code to this. It's a valid approach, and some blogs do it this way. However, we're going to use a different approach. The second and third URLs use **query parameters**, an approach that is maybe slightly more common and I would also recommend. 

**Query parameters** are optional parameters that can be added to URLs. You can recognize them because they always come after a question mark `?` in the URL. You can even use multiple parameters separated with a `&`, e.g., like this: `/cookies?page=2&filter_by=size`. In this example, you have the two parameters `page`, and `filter_by`, where the value of `page` is `2` and the value of `filter_by` is `size`. 

You'll learn more about query parameters in a later exercise on forms. But I brought them up because traditionally, they are used to specify any limits, ordering, filtering, and pagination of content on a page. They are also often used to show search parameters if you use a search function on a website. _(Try it out! Go to google.com or a big store page and search for something. Then, check out the URL in the browser to see if you find your search term.)_

We're going to use those query parameters to handle the pagination of our cookies. 

_Side note on offsets: Some people recommend not defining pages in the URL but an offset. So, for example, instead of saying, "show me the cookies on page 3 (where each page has ten items)", you'd say, "Show me the cookies after the first 20". This approach is more common when defining APIs. Therefore, I'm not going to talk more about this right now. But it may become more relevant in a later exercise on building an API with Flask._

## Getting Query Parameters in Flask

To read the query parameters in Flask, you can use the `request` object built into Flask. `request` contains all sorts of interesting information about the request a user is making. To use it, you first have to add it to the list of imported items. In **/app/cookies/routes.py** add `request` to the imported functions:

```py
from flask import Blueprint, render_template, request
```

Now, you can use the `request` object within the route functions. The `request` contains all sorts of information such as the current path but also information about the client, their IP address, or browser version. The request also contains information about the query parameters. That's what we are interested in right now. You can access the `page` parameter by writing:

```py
page_number = request.args.get('page', 1, type=int)
```

The method we use is `request.args.get()`. The first argument is the name of the parameter. For example `'page'`. But it could also be another parameter such as `'filter_by'`. The second argument is a default value in case the parameter isn't found. The third parameter defines a type. Much like `/cookies/<int:id>` in the path definition would automatically define `id` as an integer, you can use the type definition here to make sure that the `page` parameter is an integer, as well. 

Add this line to your `/cookies` route. You can use a `print()` statement to see if it worked.

```py
@blueprint.route('/cookies')
def cookies():
  page_number = request.args.get('page', 1, type=int)
  print('=> Page number:', page_number)
  all_cookies = Cookie.query.all()
  return render_template('cookies/index.html', cookies=all_cookies)
```

Try going to [http://127.0.0.1:5000/cookies](http://127.0.0.1:5000/cookies), then go to [http://127.0.0.1:5000/cookies?page=2](http://127.0.0.1:5000/cookies?page=2), and finally, maybe try something like [http://127.0.0.1:5000/cookies?page=test](http://127.0.0.1:5000/cookies?page=test). Keep an eye on the output in your server's console. With the `print` statement in there, you should see what the `page_number` is every time. 

You'll notice that if you type in a value that isn't an integer, Flask will pick the default value (1) as a value. 

Alright! Don't forget to remove the `print` statement again when you're done. You don't want to clutter your code with test or debug code so much.

## How Pagination Works

Pagination basically means to display only a subset of items from your data collection. Let's say we have 100 cookies in our database. To display only the first five cookies on the **first page** of our website, we could write this:

```py
Cookie.query.limit(5).all()
```

To display the second set of cookies, we'd want to skip the first five and return the next 5. You can actually do that using the `offset` method like this: 

```py
Cookie.query.offset(5).limit(5).all()
```

This will skip the first five items in your collection and return the next 5. You can grow the offset as much as you want. For pagination to work, you basically need to know two things: 

1. How many items do you want to display per page? (`limit`)
2. What page is a user viewing? Or how large is the `offset`?

If you were to build basic pagination yourself using what you've seen above, you could write something like this: 

```py
page_number = request.args.get('page', 1, type=int)
items_per_page = 5
cookies = Cookie.query.offset(page_number * items_per_page).limit(items_per_page).all()
```

This would work perfectly fine. But `flask_sqlalchemy` has actually some functionality for pagination already built-in: the `.paginate()` method.

## Configure Pagination

First, let's define the number of cookies per page in our **config.py** file. That's a good place for any type of global constant. 

Add this line: 

```py
COOKIES_PER_PAGE = 4
```

It's good practice to keep configuration values separate from your logic and import it later.

In your **app.py** file you could access the config variables with `app.config['POSTS_PER_PAGE']`. But that's not possible in a blueprint. So instead, we can make use of the `current_app` object provided by Flask. Add it to your imports in **/app/cookies/routes.py**:

```py
from flask import Blueprint, render_template, request, current_app
```

With that we can access the config variables with `current_app.config['POSTS_PER_PAGE']`.

Next, we'll make use of the `paginate` method built into `flask_sqlalchemy`. Add the `paginate` method to the line where you define `Cookie.query.all()` like this: 

```py
all_cookies = Cookie.query.paginate(page_number, current_app.config['COOKIES_PER_PAGE'])
```

The first argument defines the current page number. We have defined that above using the query parameters. 

The second argument defines the maximum number of items per page. We've defined that above in the config file. 

Find a full definition of the method and its arguments [in the documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/api/#flask_sqlalchemy.BaseQuery.paginate).

If you were to save and reload the page now, you'll see this error on the `/cookies` page: 

```
TypeError: 'Pagination' object is not iterable
```

That's because the `.paginate()` method doesn't return a list of objects (like `.all()` would do). Instead, it returns an object in itself with more helper methods. We'll fix the error in just a second. But to make it more explicit to other developers on the team or my future self what the variable `all_cookies` represents, I'm going to rename it to `cookies_pagination` both in the route and in the views. This is what my `cookies()` function now looks like: 

```py
@blueprint.route('/cookies')
def cookies():
  page_number = request.args.get('page', 1, type=int)
  cookies_pagination = Cookie.query.paginate(page_number, current_app.config['COOKIES_PER_PAGE'])
  return render_template('cookies/index.html', cookies_pagination=cookies_pagination)
```

The views are still broken. But we'll fix that now. 

## Paginated Views

The `.paginate()` method returns an object with lots of helpful properties and methods. Check out [the documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/api/#flask_sqlalchemy.Pagination) to see the full list. 

What we need to fix the error is the `.items` property. But we also need to rename the `cookies` variable because we renamed it in the route function. Change `{% for cookie in cookies %}` to:

```py
{% for cookie in cookies_pagination.items %}
```

`cookies_pagination` is the variable name we defined in the `cookies()` route function. `.items` will return a list of only the cookies of the page we're currently looking at. It'll determine which cookies to show based on the `page_number` and `COOKIES_PER_PAGE` we passed to the `.paginate()` method. 

Now, you should be able to try accessing [http://127.0.0.1:5000/cookies](http://127.0.0.1:5000/cookies) or [http://127.0.0.1:5000/cookies?page=2](http://127.0.0.1:5000/cookies?page=2) and see different cookies show up. 

Notice also, how it automatically throws a 404 error if you access a page that doesn't have any cookies. That's also very convenient. 

Next, we want to add links to our page that allow users to switch between pages. Let's think about the logic real fast. 

* If the user is on page 1, there should only be a single link that links to the path `/cookies?page=2`
* If the user is on page 2, there should be two links. One to `/cookies?page=1` ("previous") and one to `/cookies?page=3` ("next")
* The same rule as above applies to any other page
* If the user is on the last page, only the "previous" link should show up and not the "next" link

In other terms, the link to the next page is always the `current_page_number + 1`. The link of the previous page is always the `current_page_number - 1`. Let's start with that before we add conditions. 

Below, the list of cookies, somewhere in the HTML of your **cookies.html** (but still within the `<body></body>`), add the following code: 

```html
<nav>
  <a href="/cookies?page={{ cookies_pagination.prev_num }}">Previous Page</a>
  <span> - </span>
  <a href="/cookies?page={{ cookies_pagination.next_num }}">Next Page</a>
</nav>
```

`.next_num` will return the page number of the next page, `.prev_num` the number of the previous page (as you may have guessed). But they also do something else! They automatically know whether or not there is a previous or next page! That's some logic built right in. So we don't have to write that logic ourselves. If there is no previous or next page, those methods will return `None`. Try it out! Reload the page and click `Next Page` or `Previous Page` a few times. At some point, you should notice in the URL of the browser that it shows `?page=None`. Since that's not a valid page, your site will automatically show the **first page**contents. 

We can use this nifty feature to conditionally only show the "Next Page" and "Previous Page" links if `next_num` or `prev_num` isn't `None`. Remember how to do that from the exercise on jinja?

You can add a condition like this: 

```html
<nav>
  {% if cookies_pagination.prev_num %}
    <a href="/cookies?page={{ cookies_pagination.prev_num }}">Previous Page</a>
  {% else %}
    <span>Previous Page</span>
  {% endif %}

  <span> - </span>

  {% if cookies_pagination.next_num %}
    <a href="/cookies?page={{ cookies_pagination.next_num }}">Next Page</a>
  {% else %}
    <span>Next Page</span>
  {% endif %}
</nav>
```

Don't just copy and paste. Take a moment to understand what's going on. Then type it in your code by hand. 

In this example, we hard-coded the `/cookies` path. This may or may not be fine for your application. But another (some would argue cleaner) way to do this is to use the `url_for` method instead. To change your code using the `url_for` method instead, it would look like this: 

```html
<nav>
  {% if cookies_pagination.prev_num %}
    <a href="{{ url_for('cookies.cookies', page=cookies_pagination.prev_num) }}">Previous Page</a>
  {% else %}
    <span>Previous Page</span>
  {% endif %}
  <span> - </span>
  {% if cookies_pagination.next_num %}
    <a href="{{ url_for('cookies.cookies', page=cookies_pagination.next_num) }}">Next Page</a>
  {% else %}
    <span>Next Page</span>
  {% endif %}
</nav>
```

You see, you can pass query parameters to the `url_for` method by simply defining them as extra variables. Also, note that we have to write `cookies.cookies` because we're using blueprints. The first `cookies` refers to `cookies` blueprint. The second `cookies` refers to the `cookies()` route function. (The index page of the blueprint of the simple page would be, e.g. `simple_pages.index`.)

There are a lot more things you can do with the methods and properties shown in [the documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/api/#flask_sqlalchemy.Pagination). Feel free to use it for diving deeper.

## Testing Routes Including Models

Just like in the previous exercises, let's add some tests to make sure our code is stable and working as expected. 

Create a new file: **/app/tests/cookies/test_routes.py**

We'll need our `Cookie` model again. So add: 

```py
from app.cookies.models import Cookie
```

First, let's test our `cookies()` function. Create a test function with a failing test:

```py
def test_cookies_renders_cookies(client):
  # Page loads and renders cookies
  response = client.get('/cookies')

  assert b'Chocolate Chip' in response.data
```

This test shouldn't include anything that you don't know yet already. The test will load the `/cookies` route and check if the page includes the word `Chocolate Chip`. But since every test starts with a blank database, this test should fail. Try it! Run `pytest -v`.

To get the test to actually pass, we need to add the **Arrange** step before we **act** and **assess**. In your test, you should first create the cookie: 

```py
def test_cookies_renders_cookies(client):
  # Page loads and renders cookies
  new_cookie = Cookie(slug='chocolate-chip', name='Chocolate Chip', price=1.50)
  new_cookie.save()

  response = client.get('/cookies')
  
  assert b'Chocolate Chip' in response.data
```

If you run the test with `pytest -v` and set up your views correctly before, the tests should pass now. 

With this knowledge, you should be able to add another test for the `cookie()` method now that renders a single cookie. Just keep in mind to keep your test function name and comment descriptive and remember to change the route to include whatever `slug` you defined for the cookie. 

## Side note on code organization

This goes way beyond the scope of this exercise. But you may have been asking yourself during the exercise why we passed the `cookies_pagination` object to the view and have all that logic in the view instead of the route function. We briefly already talked about MVC (Model View Controller) and the route function is sort of like our **controller**. It's best practice to keep logic out of the controller and really only use it for putting things together. It's **not** a good practice to have too much logic in your views, either. But in smaller applications, that's ok. In larger applications, people tend to extend the MVC pattern with additional concepts such as _ViewModels_ or _Helpers_ to move logic related to the views into separate places, too. You don't have to worry too much about that at this point. But I wanted to point it out already, so you get a feeling for what's good and clean code. 

## 🛠  Practice 

1. Apply pagination to a collection in your application.
2. Add some logic to the view so that pagination links only work if they are supposed to. 
3. Don't forget to test your new code!