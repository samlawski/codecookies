---
title: Templating
videoId:
slug: "templating-with-jinja"
templateEngineOverride: md
---

As you try to add some HTML to your routes or start adding dynamic data from variables to the text returned to users you quickly notice how complicated it gets.

Just look at this example:

```py
def cookie(slug):
  return '<h1>' + cookies[slug]['name'] + '</h1>' + '<p>' + cookies[slug]['price'] + '</p>'
```

Now imagine, you'd have to build entire pages that way, adding strings and variables together and trying to do all that while using HTML. This would ge quite exhausting after a while 😩. Fortunately, Flask comes with a solution. But first, let's look at some alternative ways to write what you see above. 

## Template strings

Without Flask, Python already offers some ways to simplify the example from a a bove a little. If you're familiar with Python's template strings already you can skip over this chapter and move on straight to "Rendering Templates" below. 

I thought it might be worth to briefly discuss Python's own ways of handling template strings as it may help you understand the rest of this exercise. 

Let's create an example:

```py
name = 'Sam'
'Welcome to shop number ' + str(1) + ' ' + name + '!'
```

You can see that in Python, we can just add strings together as we've done before. One special thing to remember is that you can only add strings to strings. So if you have a different data type (such as integer or list) you cannot just add it to a string without converting it (as shown with `str()` above).

Python offers a few different ways to make it more convenient.

One way of doing it is to use the `.format()` method. on a string. The example above would for example look like this: 

```py
name = 'Sam'
'Welcome to shop number {}, {}!'.format(2, name)
```

The `{}` in your string signals a placeholder. The parameters of the `format()` method will be inserted into the string in the order in which the `{}` are placed within the string.

In Python 3 an even more convenient way was introduced:

```py
name = 'Sam'
f'Welcome to shop number {4}, {name}!'
```

Now, you can just write an `f` right before a string. This allows you to add `{}` to a string and between those curly braces you can add any Python data type or variable you like. Note how in both those last examples, the type conveniently doesn't meatter anymore. So you can even insert numbers into strings.

You can even add the `f` in front of a string you defined with tripple quotes like this: 

```py
name = 'Sam'
f'''<h1>Welcome, {name}</h1>
<p>This is shop number {5}</p>
'''
```

With all this information we can now simplify the code in our app significantly. Here is the example from above simplified:

```py
def cookie(slug):
  return f'''<h1>{cookies[slug]['name']}</h1>
  <p>{cookies[slug]['price']}</p>'''
```

This already looks much more readable. But there is more you can do!

## Rendering Templates

But first, let's take a step back and not talk about adding variables to strings anymore. Instead, let's talk abou the length of some of those strings.

In the previous examples, we've only added some basic lines of HTML. But technically that's no complete HTML. We were missing quite a lot of tags such as the entire `<head>` area. Here is what a complete version of our index route could look like: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>
```

That's still a very minimal HTML document. If you've worked with HTML before you'll know that the files usually contain a lot more information.

You can add complete HTMl documents as strings to your routes like this:

```py
from flask import Flask

app = Flask(__name__)

@app.route('/')
def index():
  return '''
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>
  '''

if __name__ == '__main__':
  app.run()
```

Try it out. This is a complete and functioning way of returning a full HTML document. But you will probably agree that this is going to have our Python code get out of hand pretty soon. And it's not very convenient. 

This is where Flask can help! Flask comes with a function called `render_template`. You can start using if you add it to the import statement at the top of your file. It should now look like this: 

```py
from flask import Flask, redirect, url_for, render_template
```

Now, you can use the function. To demonstrate what it does, create a new folder in your project called `templates`. In it, add a brand new **index.html** file. Add some valid HTML to it. For example the code from above. 

Your folder structure should look something like this now: 

![Screenshot showing templates folder within project root including an index.html file](/assets/content/flask-2-tutorial/03-templating/folder-screenshot-1.png)

Back in your Python code, change one of your routes to return the `render_template` function with a string as parameter: `'index.html'`. It could look like this: 

```py
@app.route('/')
def index():
  return render_template('index.html')
```

Now save everything and open that page in the web browser. You should see how the HTML from your **index.html** is being rendered. That's another one of the very conventient things Flask does for you. When executing the `render_template` function Flask will automatically search for a folder valled `"templates"` in your project. (You can configure it to use a different folder.)

The first parameter is a string with the path to the template file you'd like to render. In our case it's just the file name **index.html**. But you can also have sub-folders within your **templates** folder. 

Now with this, try practicing this and add another template for our about-page. 

## Jinja

Now this solves the problem of having really long HTML documents in our Python code. But what about adding variables? Can I still do that? 

The answer is yes! Flask has you covered again. The `render_template` can do something very similar to what we did in the chapter above on **template strings**. It will take the HTML file you have and can dynamically insert content into the HTML string. The way it does that is using a package called [jinja](https://github.com/pallets/jinja). **jinja** is a templating language. That means it works very similar to template strings. But it adds a lot more features allowing you to do more complex things such as filtering and loops. We'll come to that in a second. Let's first try something as simple as in the example above. 

Let's say we want to display two variables again as in the example above. You can pass those two variables with the `render_template` function by just adding them as parameters like so: 

```py
@app.route('/')
def index():
  return render_template('index.html', name='Sam', visitor_number=342)
```

With the `render_template` function we _have to_ always first define a variable name and then assign it a value. In this example we have a variable name `name` and `visitor_number`. Both those can also be other variables in your code. So it could look like this: 

```py
@app.route('/')
def index():
  name = 'Sam'
  fake_number = 342
  return render_template('index.html', name=name, visitor_number=fake_number)
```

Notice that the variable that you assign in the `render_template` function does not have to be the same as the ones you use in your code. 

The variables you assign in the `render_template` functions are now available to be used in your HTML code. You can insert them similar to the template strings. But instead of `{name}` single curly braces you have to use double curly braces: `{{name}}`. Hereis an example what this could look like with both variables in your HTML (note: I'll leave out the `<head>` and `<html>` to simplify the example. You should still keep it in your HTML files though!):

```html
<body>
  <h1>Hello {{name}}!</h1>
  <p>You are visitor number {{visitor_number}}!</p>
</body>
```

Give it a try! Try out different parameters and values and see what happens. Don't be afraid to break your app!

## Jinja: Loops and hidden code

In jinja, there are **two ways to insert code** in your template. We just looked at the first method. It's the double curly braces `{{ }}`. Those will automatically try to insert anything into your template that's written inside of them. 

Alternatively, you can also use a single curly brace combined with a percentage sign like this: `{% %}`

Any code written within those kinds of braces will be executed but **not inserted** into the template. One usecase of that is adding more programming logic to your code such as loops. 

Remember our cookie shop? In the last exercise we created individual pages for each of our cookies. Let's now create an index page for our cookies that will display links to every single cookie in our shop. 

To kick things off, we first need to add a template for our cookies. Add a **cookies.html** file to the **templates** folder and add some standard HTML to it (such as `<head>`, `<body>` etc.)

Back in your Python code, add a `cookies` route to use `render_template` to render the HTML file you just created. (Scroll up if you don't remember how to do that.)

Add a variable named `cookies` as parameter to the `render_template` function and assign it to our list of cookies from before. Don't forget that the parameters are variables that need to be assigned _even if they have the same name_ (like in the code example in the previous chapter).

For the sake of reference, this is the list of cookies I'll be using: 

```py
cookies_data = {
  'chocolate-chip' : {'name': 'Chocolate Chip', 'price': '$1.50'},
  'oatmeal-raisin' : {'name': 'Oatmeal Raisin', 'price': '$1.00'},
  'sugar' : {'name': 'Sugar', 'price': '$0.75'},
  'peanut-butter' : {'name': 'Peanut Butter', 'price': '$0.50'},
  'oatmeal' : {'name': 'Oatmeal', 'price': '$0.25'},
  'salted-caramel' : {'name': 'Salted Caramel', 'price': '$1.00'},
}
```

Now we have access to the `cookies` variable in our template. But how do we loop over it? It actually looks very similar to a regular Python `for` loop. Change the `<body>` of your **cookies.html** to look like the following code: (remember: You learn more if you don't copy and paste but type by hand. Really!)

```html
<body>
  <h1>Cookies</h1>
  <ul>
    {% for slug, cookie in cookies.items() %}
      <li>{{ cookie['name'] }}</li>
    {% endfor %}
  </ul>
</body>
```

The part that should look new to you is this one: 

```html
{% for slug, cookie in cookies.items() %}
  
{% endfor %}
```

This is a for-loop that works just like a Python for-loop. The main difference to Python is that you have to add the `endfor` in the end to signal the end of the loop. That's because in HTML documents you can't work with indentation the way you do in Python.

If you want to loop over a dictionary in Python you have multiple options. But by using the `items()` method you have access to both the **key** (in our example that's the `slug`) and the **value** (which is the `cookie` dictionary). You can also just loop over the `keys()` or the `values()`. 

Or if instead your cookies were a list instead of a dictionary it could look like this: 

```py
cookies_data = [
  {'name': 'Chocolate Chip', 'price': '$1.50'},
  {'name': 'Oatmeal Raisin', 'price': '$1.00'},
  {'name': 'Sugar', 'price': '$0.75'}
]
```

and the jinja part would look like this: 

```html
{% for cookie in cookies %}
  <li>{{ cookie['name'] }}</li>
{% endfor %}
```

Either way, the loop will insert whatever is within the loop (in our case it's `<li>{{ cookie['name'] }}</li>`) as many times in the HTML template as the list `cookies` or `cookies.items()` is long.

Try it out! Add it to your code and see what happens. Try adding or removing cookies and see the results. 

Maybe you can already think of how we could turn this into a list of links. We just use the different elements we already know about. 

Here is what it could look like: 

```html
<body>
  <h1>Cookies</h1>
  <ul>
    {% for slug, cookie in cookies.items() %}
      <li>
        <a href="/cookies/{{ slug }}">{{ cookie['name'] }}</a>
      </li>
    {% endfor %}
  </ul>
</body>
```

In this case, we made use of the fact that we have the `slug` already as part of looping over the dictionary items. The rest is just plain HTML.

## Jinja: Conditions

Next to loops another basic control flow feature is conditions. You can also add `if` or `if-else` statements to your templates. 

Let's say for example, I am not making much of a profit off of the cookie that's just 25 cents and I'd prefer to display it crossed out and not as a link. I could use a condition to accomplish that. 

Adjust the code to what you see below (and don't forget to type by hand):

```html
{% for slug, cookie in cookies.items() %}
  <li>
    {% if cookie['price'] == '$0.25' %}
      <s>{{ cookie['name'] }}</s>
    {% else %}
      <a href="/cookies/{{ slug }}">{{ cookie['name'] }}</a>
    {% endif %}
  </li>
{% endfor %}
```

The new part here is this:

```html
{% if cookie['price'] == '$0.25' %}
  
{% else %}
  
{% endif %}
```

Again, this works just like any condition. It just looks a little different in terms of syntax and requires the `endif` in the end to signal the end of your conditional statement. Logically, it works the way you'd expect it to work, though. It only inserts the content into the HTML template if the condition is true. In our case, if the price property of the `cookie` dictionary is equal to `'$0.25'` we don't render it as a link. Instead we render it as strikethough HTML element.

## Jinja: Template inheritance

You may have already thought about it when you created the additionaly **cookies.html** file. It feels quite redundant to add the same `<head>` values in every single HTML file. Jinja has a way to help you avoid all this duplicate code. It's called **template inheritance** and uses the `block` statement for that. 

Let's again explain it by writing some code first. 

In your **templates** folder, add a new file called **base.html**. This could be called anything you like. But again, "base" is sort of the standard that many applications use. This will be the _base_ of our other templates. (It's important to note that you can have multiple differente bases should you need it.)

Add the HTML to the base that you'd want to have on every single page of your website. Here is an example: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title></title>
</head>
<body>
  
</body>
</html>
```

Now, let's define some `block` sections. Those will be sections that can be **overwritten** by other templates. So those should be things that may or may not be dynamic on some pages. Here is what this could look like: 

```html
<!DOCTYPE html>
<html lang="en">
<head>
  {% block head %}
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}{% endblock %}</title>
  {% endblock %}
</head>
<body>
  {% block body %}{% endblock %}
</body>
</html>
```

The way you define a block is like this: 

```html
{% block body %}{% endblock %}
```

You can see the keyword `block` that's just like the keywords `for` or `if` and tell jinja what you want to do. It's followed by a name that you choose. This can be anything that would also work as a variable name. In our example we chose the three names `head`, `body`, and `title`, as it makes sense to choose names that are explicit about what they are. 

You can see in the example of the `head` block that you can actually add pre-written HTML code inside a block. And you can see that you can even have a block inside of a block (see the `title` block).

Let's make use of those blocks. Back in our **index.html** file let's remove everything we got there and replace it with this: 

```html
{% extends 'base.html' %}

{% block title %}Cookieshop{% endblock %}

{% block body %}
  <h1>Hello World!</h1>

  <p>Welcome to my cookie shop!</p>
{% endblock %}
```

With the line `{% extends 'base.html' %}` we tell jinja that we want to use the file **base.html** as a base for this page. If we were to add nothing else to the file other than `{% extends 'base.html' %}` and look at the page we'd see that it includes all the HTML code from the **base.html** file but nothing else. 

With the block elements we can now define what should be inserted within each block of the **base.html** file. You can see that we overwrite the contents of the `title` block and the `body` block but don't touch the `head`. You don't have to overwrite all blocks. You only need to overwrite the ones you want. 

But let's say I do want to add something to the `<head>` without overwriting anything else in there. Maybe there is a CSS file that you want to load only on a specific page but not any other page. In that case you can use the `super()` function to load all the other content. Look at this example: 

```html
{% block head %}
  {{ super() }}
  <link rel="stylesheet" href="/assets/style.css">
{% endblock %}
```

The code above won't work right now because we don't have any CSS files in our project just yet. But it serves to demonstrate that the `{{ super() }}` in there will actually load all the contents of the `head` block as they were defined in the **base.html** file. This way you can easily add think in case some page have some optional head code.

## Jinja can do a lot more

This was a lot. And there is a lot more to discover. We just scratched the surface and covered some of the most important features of Jinja. But there are a lot more you could learn about. One important feature we haven't looked at is for example **filters**. I suggest you take some time scrolling through [this page](https://jinja.palletsprojects.com/en/3.0.x/templates/#template-designer-documentation) to get a general overview of what all is possible. You now know enough to get started and learn more as you need to. 

## 🛠  Practice

For further practice, apply what you have learned again in an entirely separate project:

1. Use templates for all your routes. 
2. Use one or more base templates in combination with blocks for all pages of your application. 
3. Add a page that lists the data from your data collection using a jinja for-loop. Each entry should link to a new page. 
4. Add a jinja condition to any of your pages to conditionally display some content. 
