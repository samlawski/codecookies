---
title: Validation and Exception Handling
videoId:
slug: "validation-and-exception-handling"
templateEngineOverride: md
---

Whenever you allow users to submit forms to a backend, things can potentially go wrong for multiple reasons. Maybe a database record can't be created because the data doesn't meet the database requirements - for example, a string could be too long. There is a lot that could potentially go wrong.

On top of that, bots or people could purposely try to insert harmful data in your backend. 

For those reasons, it's essential to validate incoming data. Validating data means confirming formatted correctly and save to add to your database.

And coupled with that: Whenever anything goes wrong, you want to inform the client of what happened and why. You also want to make sure a simple issue doesn't break your entire application. That process is called **exception handling**.

## Validate Incoming Data

Validating incoming data can be as simple as writing a condition: 

```py
@blueprint.post('/checkout')
def post_checkout():
  cookies = Cookie.query.all()

  if not request.form.get('name'):
    return render_template('orders/new.html', 
      cookies=cookies,
      error='You must select a name.'
    )

  create_order(request.form, cookies)
  return render_template('orders/new.html', cookies=cookies)
```

In the example above, we add a condition to our controller action (aka route function). The purpose of this condition is to check if the form value `name` is set. If it's not, we don't run `create_order`. Instead, we immediately `return render_template` and pass an additional parameter with an error message.

To let the user know about the error, we can use the `error` string we passed to the `render_template` function and add it to the template.

In **/app/templates/orders/new.html**, add the following snippet in the place where you want to show the error. 

```html
{% if error %}
  <p style="color: tomato;">{{ error }}</p>
{% endif %}
```

You can write a much more elaborate error notification, of course. This is just a simple demonstration of how to render the `error` message in case it exists.

Right now, the validation only checks for the presence of one form field. You can adjust the validation accordingly to cover all the form fields: 

```py
@blueprint.post('/checkout')
def post_checkout():
  cookies = Cookie.query.all()

  if not all([
    request.form.get('name'),
    request.form.get('street'),
    request.form.get('city'),
    request.form.get('state'),
    request.form.get('zip'),
    request.form.get('country')
  ]):
    return render_template('orders/new.html', 
      cookies=cookies,
      error='Please fill out all address fields.'
    )

  create_order(request.form, cookies)
  return render_template('orders/new.html', cookies=cookies)
```

If you try out the [checkout form](http://127.0.0.1:5000/checkout) now, you should see an error message if only a single form stays empty.

## Exceptions

The validation condition as above will make sure that all the data is present. But an error could still occur when the record is actually added to the database. 

Let's see what I mean. If you take a look at the `Address` **model**, you'll notice that we defined a maximum string length for all the address fields of `80`. That means there will be an error if we try to add a longer string. Note, however, that **SQLite does not enforce the string length**. So you won't see an error locally. But once you deploy your application and use another database such as **Postgres** or **MySQL**, those databases will throw an error if you try to add a string longer than 80 characters.

So how do you communicate that error to users? One way to do that is using `try-except` blocks. `try-except` is just regular Python code and particularly useful in web backends. Change your controller action code to this: 

```py
@blueprint.post('/checkout')
def post_checkout():
  try:
    cookies = Cookie.query.all()

    if not all([
      request.form.get('name'),
      request.form.get('street'),
      request.form.get('city'),
      request.form.get('state'),
      request.form.get('zip'),
      request.form.get('country')
    ]):
      return render_template('orders/new.html', 
        cookies=cookies,
        error='Please fill out all address fields.'
      )

    create_order(request.form, cookies)
    return render_template('orders/new.html', cookies=cookies)
  except:
    return render_template('orders/new.html', 
      cookies=cookies,
      error='An error occurred while processing your order. Please make sure to enter valid data.'
    )
```

The code from before is now all within the `try:` block. If any error were to occur for any reason, the code would jump to and execute the code inside the `except:` block. In our case, we'd inform the user that an error had happened. Not the best error message, but better than nothing. 

Right now, we have `render_template()` in there three times. That's not particularly clean. We can optimize our code a little more and make use of the `raise` feature, which manually triggers an error and jumps the code to the `except:` block.

```py
@blueprint.post('/checkout')
def post_checkout():
  try:
    cookies = Cookie.query.all()

    if not all([
      request.form.get('name'),
      request.form.get('street'),
      request.form.get('city'),
      request.form.get('state'),
      request.form.get('zip'),
      request.form.get('country')
    ]):
      raise Exception('Please fill out all address fields.')

    create_order(request.form, cookies)
    return render_template('orders/new.html', cookies=cookies)
  except Exception as error_message:
    error = error_message or 'An error occurred while processing your order. Please make sure to enter valid data.'

    return render_template('orders/new.html', 
      cookies=cookies,
      error=error
    )
```

With `raise Exception()`, we trigger a manual error. This will make the code jump to the `except` block. We added `Exception as error_message` to the `except` definition. This will tell our code to look for a custom error message that we defined above with `raise Exception()`. If that error message, we'll display that. If it doesn't exist, we display a generic error message. 

## Logging Errors

One important thing to keep in mind when using `try-except` is that it will _escape_ any errors. That means, as a backend developer, you'll never notice that an error happened. It'll just hide it from you and go straight into the `except:` block. This can be very dangerous things might be going wrong in your app without you noticing it. 

A common way to handle errors in a way that users don't notice them but you as a developer will is to use logging.

Flask has a built-in logger available through `app.logger` or `current_app.logger`.

Add `current_app` to the functions imported `from flask`. Then, you can add it to the `except` block to log any errors.

```py
except Exception as error_message:
  error = error_message or 'An error occurred while processing your order. Please make sure to enter valid data.'

  current_app.logger.info(f'Error creating an order: {error}')

  return render_template('orders/new.html', 
    cookies=cookies,
    error=error
  )
```

If now an error happens, it'll also be printed out in the server logs (in your command line.)

## 🛠  Practice 

It makes sense to have some validations and exception handling happening in many parts of your application.

1. Validate any incoming data in your route functions. 
2. Use exception handling to display meaningful errors to your users.
3. Make sure to keep track of errors with logging. 