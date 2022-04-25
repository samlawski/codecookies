---
title: Session-Based Authentication
videoId:
slug: "session-authentication"
templateEngineOverride: md
---

One common requirement of many web applications is an authentication system. The most standard way to authenticate a user is to ask them to enter an email address and password. In a blog, you could use authentication to allow only authors to log in and edit articles. In a shop, you can let users log in to view their previous orders.

## Creating Blueprints and Models

Following our blueprint structure, let's create a new blueprint folder with **models** and **routes** files. The models will include a new `User` model (storing each user's email address and password). The routes file will contain the routes `/register`, `/login`, and `/logout`.

Create the following file paths: 

* **/app/users/\_\_init\_\_.py**
* **/app/users/models.py**
* **/app/users/routes.py**
* **/app/templates/users/register.html**
* **/app/templates/users/login.html**

The **\_\_init\_\_.py** file includes:

```py
from . import routes, models
```

Next, we need to define our **model**. 

```py
from app.extensions.database import db, CRUDMixin

class User(db.Model, CRUDMixin):
  id = db.Column(db.Integer, primary_key = True)
  email = db.Column(db.String(120), index = True, unique = True)
  password = db.Column(db.String(120))
```

For now, let's only add `email` and `password`. Important to note: The email should be marked as `unique`. Otherwise, we'd have problems if users try to register two accounts with the same email address.

Remember, whenever we add a new model, we also need to create a migration. In the command line run the following two commands: 

```sh
flask db migrate -m 'create user model'
flask db upgrade
```

Let's create a barebone **routes.py** file with just the basic structure but without any functionality yet: 

```py
from flask import Blueprint, render_template

blueprint = Blueprint('users', __name__)

@blueprint.get('/register')
def get_register():
  return render_template('users/register.html')

@blueprint.post('/register')
def post_register():
  return 'User created'

@blueprint.get('/login')
def get_login():
  return render_template('users/login.html')

@blueprint.post('/login')
def post_login():
  return 'User logged in'

@blueprint.get('/logout')
def logout():
  return 'User logged out'
```

The routes for `POST /register`, `POST /login`, and `GET /logout` are just **placeholders** for now until we add the real logic. The first two will react to form submissions. The logout route does not need its own page. Or have you ever seen a designated logout page? 

Now, we need to `import` `users` in our **/app/app.py** file (in the same line as the other blueprint imports) and register the blueprint with all the other blueprints.

```py
app.register_blueprint(users.routes.blueprint)
```

Lastly, let's create the HTML templates. They will be just basic HTML forms, and for the sake of this tutorial, we'll keep them as simple as possible. 

**/app/templates/users/register.html**

```html
{% extends 'base.html' %}

{% block title %}Cookieshop | Register{% endblock %}

{% block body %}
  <h1>Register</h1>

  <form method="POST">
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" required>
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" name="password" id="password" required>
    </div>

    <div>
      <label for="password_confirmation">Password Confirmation</label>
      <input type="password" name="password_confirmation" id="password_confirmation" required>
    </div>
    
    <input type="submit" value="Sign Up">
  </form>  
{% endblock %}
```

**/app/templates/users/login.html**

```html
{% extends 'base.html' %}

{% block title %}Cookieshop | Login{% endblock %}

{% block body %}
  <h1>Login</h1>

  <form method="POST">
    <div>
      <label for="email">Email</label>
      <input type="email" name="email" id="email" required>
    </div>

    <div>
      <label for="password">Password</label>
      <input type="password" name="password" id="password" required>
    </div>
    
    <input type="submit" value="Login">
  </form>  
{% endblock %}
```

All the above should look quite familiar to you. So let's move on to the actual authentication functionality.

## User Registration Route & Validations

First, let's allow users to create a new user through the registration form. The form has three parameters: `email`, `password`, and `password_confirmation`.

The `post_register()` function will receive the requests from the form. First, we should make sure that the request data is valid.

```py
@blueprint.post('/register')
def post_register():
  if request.form.get('password') != request.form.get('password_confirmation'):
    return render_template('users/register.html', error='The password confirmation must match the password.')
  elif User.query.filter_by(email=request.form.get('email')).first():
    return render_template('users/register.html', error='The email address is already registered.')

  return 'User created'
```

There is a lot more we could validate. But these two validation conditions check for two of the most common issues: not matching passwords and the email address is already taken. Take a moment to understand the logic. If any of the two conditions is true, the `return` statement will stop the function and rerender the registration page, passing an error message. Consider for a second how you'd add validations to check that the length of the password is at least five characters.

You probably noticed that if the validation goes wrong, we rerender the **users/register.html** template but pass it a variable called `error` with some text about what went wrong. So far, however, we don't actually do anything with that error message. To display it in the frontend, let's add some jinja code that'll display an error only if it's passed as a parameter of `render_template()`:

```py
{% if error %}
  <p style="color: tomato;">{{ error }}</p>
{% endif %}
```

You can insert this snippet wherever you'd like the error to appear on the page. In fact, we'll also need that later on the **/templates/users/login.html** page. So go ahead and add it in that template file as well.

Once the validations pass, we want to create a user. We can do that just like creating any other database record:

```py
user = User(
  email = request.form.get('email),
  password = request.form.get('password')
)
user.save()
```

**Don't use the code above.** The code above would work, but it wouldn't be very safe. In the example above, you'd just store the email address and password in the database in plain text. 

### Password Encryption

**☢️ Never store passwords in plain text!**

Passwords are very sensitive information, and no developer should ever have clear read-access to the passwords of their app's users. 

Instead, you should **encrypt** passwords before storing them in the database. Encryption is a huge topic on its own. Luckily, there are libraries that make the topic very simple for us. One of them is called `werkzeug` and comes with Flask by default. `werkzeug` comes with a few `security`-related functions. You can import them now in your **/app/users/routes.py** file: 

```py
from werkzeug.security import generate_password_hash, check_password_hash
```

A `hash` is just an encrypted version of data. `gerate_password_hash` does precisely what you'd think it does. It creates an encrypted string from another string. You can try it out.

```py
password = 'super secret'
hashed_password = generate_password_hash(password)

print(hashed_password)
```

In the code above, `hashed_password` will result in something that looks like this: 

```
pbkdf2:sha256:260000$qDhowSZPOtKIyHEg$f39726e0d6a1f149de76355bf3f583c760dbce1e82927ac1ccb6a5c8a65123c0
```

Obviously, it's not at all anymore clear what the original password was. 

You may have guessed the purpose of the second function already. You can use `check_password_hash`, to validate a password. This second function becomes important when someone wants to **login**. In that case, users type in a password, and in the backend, you'll have to compare the password the user typed in with what you have stored in the database. Since the password is stored in an encrypted way, you cannot just compare the password the user typed in with the hashed password from the database. Instead, you need to hash again the password that the user typed in when trying to login and then compare that hashed string with whatever is stored in the database. The function `check_password_hash` is a shorthand for that.

The `check_password_hash` function takes two parameters:

```py
check_password_hash(hashed_password, password_to_check)
```

You can try it out using the hashed password from above: 

```py
hashed_password = 'pbkdf2:sha256:260000$qDhowSZPOtKIyHEg$f39726e0d6a1f149de76355bf3f583c760dbce1e82927ac1ccb6a5c8a65123c0'
password_to_check = 'super secret'

is_password_valid = check_password_hash(hashed_password, 'super secret')

print(is_password_valid)
# True / False
```

The `hashed_password` could be stored in the database, while the `password_to_check` could come from the form. We'll do that properly below. But the code above is meant to demonstrate how you could use the function to check if a typed-in password is valid. The function will return either `True` or `False`.

Back in our **/app/users/routes.py** file, adjust the `post_register` function to encrypt the password before using the `User` model to store it in the database. 

```py
@blueprint.post('/register')
def post_register():
  if request.form.get('password') != request.form.get('password_confirmation'):
    return render_template('users/register.html', error='The password confirmation must match the password.')
  elif User.query.filter_by(email=request.form.get('email')).first():
    return render_template('users/register.html', error='The email address is already registered.')

  user = User(
    email=request.form.get('email'),
    password=generate_password_hash(request.form.get('password'))
  )
  user.save()

  return 'User created'
```

Whenever you store data in the database, things could go wrong. So let's use what you've learned about **exception handling** in a previous exercise to make our code more robust and return meaningful error messages to users. At the same time, we can also simplify the **validation** to not both use `render_template`. 

```py
@blueprint.post('/register')
def post_register():
  try:
    if request.form.get('password') != request.form.get('password_confirmation'):
      raise Exception('The password confirmation must match the password.')
    elif User.query.filter_by(email=request.form.get('email')).first():
      raise Exception('The email address is already registered.')

    user = User(
      email=request.form.get('email'),
      password=generate_password_hash(request.form.get('password'))
    )
    user.save()

    return 'User created'
  except Exception as error_message:
    error = error_message or 'An error occurred while creating a user. Please make sure to enter valid data.'
    return render_template('users/register.html', error=error)
```

### Route Redirects

Right now, the `post_register()` function only returns a string `'User created'` when a user was created. Let's redirect the user after a successful login. We can maybe have the user go to `/cookies` so they can proceed with buying cookies. 

To redirect a user you'll need to `import` two more functions `from flask`: 

* `request`
* `url_for`

Strictly speaking, you could just redirect users to any URL like that: 

```py
return redirect('/cookies')
```

That's an ok approach. But it's considered good practice not to hard-code specific routes in the backend. Instead, you can use `url_for` to generate the URL to a specific **route function**.

Change `return User created` to this: 

```py
return redirect(url_for('cookies.cookies'))
```

After successful registration, a user will be redirected to the URL of the **route name** `cookies` in the **blueprint** `cookies`.

## User Login

Now that a new user is created, we can create a new route to let that user log in. Earlier, we had already prepared the HTML template. It includes a simple HTML form with an input field for `email` and one for `password`. 

We also already created a placeholder route function for that form called `post_login()`. The purpose of this function is to confirm that for the email address the user typed in, a user exists in the database **and** the password stored in the database matches the one provided in the form. 

We can use what we have learned about **validations**, **exceptions**, and **password decryption** to put together some logic for the `post_login()` route: 

```py
@blueprint.post('/login')
def post_login():
  try:
    user = User.query.filter_by(email=request.form.get('email')).first()

    if not user:
      raise Exception('No user with the given email address was found.')
    elif not check_password_hash(user.password, request.form.get('password')):
      raise Exception('The password does not appear to be correct.')
    
    return redirect(url_for('cookies.cookies'))
    
  except Exception as error_message:
    error = error_message or 'An error occurred while logging in. Please verify your email and password.'
    return render_template('users/login.html', error=error)
```

Don't just copy and paste the code. Write it by hand and try to understand every single part of it. First, we try to query a user based on the email address provided by the form. If no user was found, we throw an error with a proper error message. 

Then, we use the `check_password_hash()` function we learned about earlier to check if the typed-in password matches the hashed password in the database. If it doesn't, we throw an error. 

_(**Important side note**: The order of parameters in the `check_password_hash()` function matters! The first parameter should be the existing hashed password. The second parameter should be the one that you want to check.)_

Finally, if no error occurs, we `redirect` the user to the `/cookies` page.

## Sessions and Flask-Login

We now know that a user is who they say they are when they type in their email address and password. But if they now click around our website and go to different pages, the password and email address aren't sent with every request. So how do we know the user is who they say they are if they, for example, access the route `/checkout`? Maybe we only want to let users access the checkout page if they are actually logged in.

One common way to _remember_ a user while they're navigating your website is to use **sessions**. Sessions are stored in **cookies**. They are a special type of cookie that is cleared as soon as the user closes the browser.

_(Side Note: Cookies are simple pieces of data stored in the web browser. As a developer, you can create cookies to store data in the browser of the user. Cookies are simple **key-value** stores. That means similar to variables you can define a name of a cookie and then write anything inside the value of it. This can be basic text or complex data. One thing that's special about cookies is that they are included in every **request** and **response**. So you can read and write cookies both on the client and on the server-side.)_

To write this kind of logic from scratch that creates the **session cookie** with the proper data and checks if the cookie is still valid on different requests is quite a complex task. Fortunately, people have done this before, and we don't need to reinvent the wheel. Instead, we'll use a Python package called **flask-login**. This package comes with a few convenient functions to handle the complexities of authentication and sessions for us. 

While having the virtual environment active, install it and add it to the **requirements.txt**:

```sh
pip install flask-login
pip freeze > requirements.txt
```

As it's a new **extension** we're adding to our project, we need to add some configuration code. Add a new extension file with this path: 

* **/app/extensions/authentication.py**

In it, add code to initialize `flask_login`: 

```py
from flask_login import LoginManager

login_manager = LoginManager()
```

Additionally, we need to tell `flask_login` which model represents the users that can log in. So add a few more lines to the same file: 

```py
from flask_login import LoginManager
from app.users.models import User

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
  return User.query.get(user_id)
```

So `flask-login` can properly load the `User`, we also need to add something to our `User` model Open **/app/users/models.py**. Add this import: 

```py
from flask_login import UserMixin
```

Then, add the `UserMixin` to the list of inherited classes:

```py
class User(db.Model, CRUDMixin, UserMixin):
```

Now, we also need to add the extension in **/app/app.py**. Import it with: 

```py
from app.extensions.authentication import login_manager
```

Then, add the following line to the `registr_extensions()` function: 

```py
login_manager.init_app(app)
```

Since the **session cookies** are **encrypted**, we'll also need to add a `SECRET_KEY`. This secret key will be used to encrypt the cookie. So it's extremely important that this stays secret and no one can ever access it. 

You can use [randomkeygen.com](https://randomkeygen.com/) to generate a key and then add it to the **.env** file:

```
SECRET_KEY=npjMblrkyRBpiQrjbrc5fax6IVLvnfA024rhu924h
```

Then, add it to **/app/config.py**:

```py
SECRET_KEY = environ.get('SECRET_KEY')
```

`flask-login` will automatically find the `SECRET_KEY` in your app's configuration and use it for encrypting/decrypting the session cookie. 

## Protecting Routes with Flask-Login

Now, `flask-login` is set up, and we can use the various helper functions it comes with. Let's say we want the `/checkout` route to be only visible to logged-in users. We can use the `@login_required` decorator method for that. 

In **/app/orders/routes.py** import: 

```py
from flask_login import login_required
```

We can use this function now as a decorator and just add it to any existing route: 

```py
@blueprint.get('/checkout')
@login_required
def get_checkout():
```

After adding this decorator, try to access your app's [checkout page](http://127.0.0.1:5000/checkout). You should get an error message that says **"Unauthorized"**. 

But you'll also get that error after you go through the [registration](http://127.0.0.1:5000/register) or [login](http://127.0.0.1:5000/login) process. That's because neither of those functions tells `flask-login` yet that we want to **log in** the users - meaning: **setting the session cookie**. 

`flask-login` has some handy convenience functions for that, too. Back in **/app/users/routes.py** add the following import: 

```py
from flask_login import login_user
```

You can now call that function **both** in the `post_register()` and the `post_login()` functions right **before** the `return redirect()`.

```py
login_user(user)
return redirect(url_for('cookies.cookies'))
```

If you now try to [register,](http://127.0.0.1:5000/register) or [login](http://127.0.0.1:5000/login) and afterward navigate to the [checkout page](http://127.0.0.1:5000/checkout), it should actually load properly.

## User Logout

As a final piece of the puzzle, we should allow users also to log out. This is one of the simplest parts of the authentication flow. `flask-login` provides us with the relevant method as well.

In **/app/users/routes.py** import a couple more functions:

```py
from flask_login import login_user, logout_user
```

Then, adjust the `logout()` route function: 

```py
@blueprint.get('/logout')
def logout():
  logout_user()

  return redirect(url_for('users.get_login'))
```

This will remove the session cookie, log out the user, and redirect them to the login page. 

To make this link easily available, let's add it to our **views**. Open **/app/templates/base.html**.

For example, you could add it in a footer below the `{% block body %}{% endblock %}`:

```html
<footer>
  <hr>
  {% if current_user.is_authenticated %}
    <small>
      Logged in as {{ current_user.email }}.
      <a href="{{ url_for('users.logout') }}">Logout</a>
    </small>
  {% endif %}
</footer>
```

We use `url_for` to link to the logout page. But you could also write just `<a href="/logout">`. Either is fine. 

You can see that we use a variable called `current_user` in the HTML. That's yet another nice feature of `flask-login`. Because we connected the `User` model with `flask-login`, we have access to the `current_user` object. That object is available in all our views. It comes with a few built-in methods and gives us access to all the **properties** on the `User` model. So you can see it gives us access to the `email` address of the currently logged-in user. It also has a method called `is_authenticated` which we can use to check if a user is logged in. 

If you now check out any page using the **base.html** layout of your website, you'll see that footer as long as you're logged in. The footer will not be visible if you're not logged in - for example, if you click the "Logout" link.

## Customize Authentication Flows

Congratulations! This was a longer exercise. But you managed to build a full authentication system in Flask. 

As a next step, you may want to customize some more aspects of the login process or the error message shown if a user isn't logged in. Check out the [documentation](https://flask-login.readthedocs.io/en/latest/#customizing-the-login-process) for details on how to do those things. You now know enough to build upon the authentication system and make it yours.

There are also very important authentication features still missing. Think about how you could, for example, implement a settings page allowing users to change their passwords. 

## 🛠  Practice 

1. Install `flask-login` to gain access to helpful convenience functions. 
2. Create a `User` model. 
3. Create routes for login, logout, and registration. 
4. Allow new users to be created and make sure the passwords are always encrypted.
5. Allow users to log in and log out. 
6. Protect at least one route so that unauthenticated people can't access it. 