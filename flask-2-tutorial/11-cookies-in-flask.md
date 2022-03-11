---
title: Intro to Cookies in Flask
videoId:
slug: "cookies-in-flask"
templateEngineOverride: md
---

Sometimes you'd like to store some data for or about users, but the database is not quite the right place for it. Maybe it's data you only need temporarily, and it's not something you need to store indefinitely. Or maybe it's data that should be stored on the client-side of your application because it's tied to the specific device a user is on, but it doesn't need to be synced across devices.

In this exercise, we're going to build a shopping cart feature for our cookie shop using **cookies**. If we wanted to store the shopping cart data in the database, we'd first have to know which user a given shopping cart belongs to. But since we don't have a user login on our site yet, we're going to use cookies instead. With cookies, we can store the shopping cart data on a given device (an approach many online stores use for their shopping cart feature.)

_(Side Note: This exercise is going to cover a lot of JavaScript code and not just Python. That's because I'd like to demonstrate the whole purpose and use of cookies both on the frontend and the backend. If you're only interested in how Flask handles cookies, you can skip down to the bottom part.)_

## What are Cookies

Cookies are a way to store data on the client-side of a website. They are stored in a very simple format, as strings in key-value pairs. This means if you want to store numbers or even complex data structures, you'll always have to convert them to strings.

If you're familiar with some JavaScript, you may also know about a feature called `localStorage` which also is able to store data on the clien-side. One main difference between the two is that **cookies are always attached to your requests to the backend**. So both the backend and the frontend have access to your website's cookies. `localStorage`, on the other hand, only stays on the frontend by default.

You can see which cookies a website has set by opening the developer tools (with Chrome and Firefox, it's `CMD` + `option` + `I` on macOS and `Ctrl` + `Alt` + `I` on Windows.) In Chrome, navigate to the "Application" tab and find the "Cookies" section in the left sidebar. On Firefox, you find the "Cookies" section under the "Storage" tab. Try it out on different websites. This particular website doesn't really use cookies - unless you click on the little 🍪  emoji on the [home page](/).

## Adding JavaScript to Flask

To use cookies in our application, we'll build a shopping cart feature. Users will be able to add or remove items from the individual cookie page. For that, we need to use JavaScript. This tutorial assumes you have some basic knowledge of JavaScript. Particularly, it'll be helpful to know how to **select HTML elements** using `querySelector` and using **event listeners** to react to events such as button clicks. 

To add JavaScript to our application, add a new folder and file with the following path: 

* **/app/static/js/main.js**

For now, add a `console.log('hello world')` to the file so we can confirm it's working. Now, add that file to the **/app/templates/base.html** file. You can add it in your `block head` right below the `link` to your CSS file: 

```html
<script src="{{ url_for('static', filename='js/main.js') }}" defer></script>
```

The `defer` attribute is very important. It makes sure your JavaScript is only loaded once the rest of the page has been loaded. Alternatively, what many developers do is to add the `script` element all the way at the bottom and as the last element inside the `body` element. 

Save everything and reload your website in the browser. When you open the JavaScript **console** in your browser's developer tools, you should now see the words from the `console.log()` appear. That means it's working, and you can remove the `console.log()` again. 

Next, we need buttons to allow users to edit the number of cookies in the shopping cart. We'll start with the basic JavaScript functionality and without cookies for now.

In the **/app/templates/cookies/show.html** file, add the following code somewhere in the `block body`:

```html
<p class="shoppingCart">
  <strong>In shopping cart: </strong>
  <span class="shoppingCart__number--js">0</span>
  
  <button class="shoppingCart__add--js">
    +
  </button>
  <button class="shoppingCart__remove--js">
    -
  </button>
</p>
```

The exact naming of the classes doesn't matter. You can pick whatever names you'd prefer. I followed the [BEM pattern of naming classes](http://getbem.com/introduction/) and used the `--js` suffix to indicate that this class isn't for styling but only to add some JavaScript interactivity.

The span element `.shoppingCart__number--js` will change dynamically based on the number of items in a shopping cart. The two buttons will be used to increase or decrease the number. 

We can now target for example the `span` element and assign it to a variable:

```js
var $numberOfItems = document.querySelector('.shoppingCart__number--js')
```

Add this line to your JavaScript file. _(Side note: The `$` in the beginning of the variable name is a pattern I use to recognize later that this variable represents a selector object easily. It's not necessary, though.)_

We want to increase the number of items in my shopping cart whenever the "+" button is clicked. The other button should always decrease the number of items in the shopping cart every time the button is clicked. But the number shouldn't be able to go below 0.

For that we need an event listener for each button that listens to the click events: 

```js
var $numberOfItems = document.querySelector('.shoppingCart__number--js')

document.querySelector('.shoppingCart__add--js').addEventListener('click', function(e) {

})

document.querySelector('.shoppingCart__remove--js').addEventListener('click', function(e) {

})
```

Again, if any of this seems foreign to you, make sure to catch up on some JavaScript basics. These are just two event listeners (one for each button), and the contents of the `function` will be executed whenever a button is clicked. 

Now, we make use of the `$numberOfItems` selector variable we defined earlier. For the first function, we want to just increase the number every time the button is clicked:

```js
var $numberOfItems = document.querySelector('.shoppingCart__number--js')

document.querySelector('.shoppingCart__add--js').addEventListener('click', function(e) {
  $numberOfItems.innerText = parseInt($numberOfItems.innerText) + 1
})

document.querySelector('.shoppingCart__remove--js').addEventListener('click', function(e) {

})
```

You can see we use the `innerText` property on the `span` element we defined earlier. Remember, we set the content of that element to `0`. Therefore, this property will always start with the value `"0"`. By default, `innerText` will always return a **string** - regardless of the content. So we need to use the function `parseInt()` to convert the string to a number. Finally, we add `1` to the number. 

If you try it out now, you'll see that we can increase the number but not decrease it yet. To do that, we add similar code to the second event listener function - except this time, we make sure that the value can't go below 0 with the [built-in function `Math.max()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max):

```js
var $numberOfItems = document.querySelector('.shoppingCart__number--js')

document.querySelector('.shoppingCart__add--js').addEventListener('click', function(e) {
  $numberOfItems.innerText = parseInt($numberOfItems.innerText) + 1
})

document.querySelector('.shoppingCart__remove--js').addEventListener('click', function(e) {
  $numberOfItems.innerText = Math.max(0, parseInt($numberOfItems.innerText) - 1)
})
```

Now, the number for the shopping card changes dynamically. But we don't actually store the number in a cookie. If you refresh the page, we'll see `0` again. 

## Setting Cookies on the Frontend

Setting a cookie with JavaScript is extremely simple. You just write something like this: 

```js
document.cookie = 'myCookieName=cookieValue'
```

`myCookieName` will be the **key** while `cookieValue` will be the **string value**. You can repeat that line as often as you want to add more cookies. 

Cookies can also have additional data on them. For example, it's a good idea to add `;path=/` to the cookie declaration. This will make sure the cookie is set for the entire domain and not just one sub-path of the page. It would look like this: 

```js
document.cookie = 'myCookieName=cookieValue;path=/'
```

A little lost what that means? Try it out! Open a sub-page in your web browser, e.g. [http://localhost:5000/cookies/oatmeal-raisin](http://localhost:5000/cookies/oatmeal-raisin). Then go to the JavaScript developer tools and copy and paste one of the two lines above in there and hit enter. Then, reload the page and find the cookies in the "Application" or "Storage" tab. Then, try the whole process again with the other of the two lines. Also, try changing the key or value of the cookie. Spend some time with this. The best way to understand is to try it out!

This is a very simple data structure. Often we need to store more complex data structures (such as objects or lists). In that case, we need to convert those to strings before we can store them as cookie values. 

In our case, we'd like to have a simple structure where the cookie name is the key in an object (aka dictionary in Python), and the value is the number of cookies in the shopping cart. 

For example: 

```js
{
  "Chocolate Chip": 4,
  "Oatmeal Raisin": 2
}
```

So how do we get this structure into a cookie? First, we need the cookie name. There is a very neat JavaScript feature called the `dataset`. Back in your HTML, add some `data` attributes to `button`s:

```html
<p class="shoppingCart">
  <strong>In shopping cart: </strong>
  <span class="shoppingCart__number--js">0</span>
  
  <button class="shoppingCart__add--js" data-name="{{cookie.name}}">
    +
  </button>
  <button class="shoppingCart__remove--js" data-name="{{cookie.name}}">
    -
  </button>
</p>
```

The `data-` attribute could be named anything. It could also be `data-tree` or `data-banana`. But we'll call it `data-name` for now. The value is set to be filled with **jinja**. It'll be the name of the cookie. 

Load the page in the browser and inspect those buttons with the developer tools. You should see the cookie name show up as values. 

The nice things about `data-` attributes is that we can very easily access them from our selector object in JavaScript. Back in your JavaScript file, adjust the first event listener function to this: 

```js
document.querySelector('.shoppingCart__add--js').addEventListener('click', function(e) {
  // Update View
  $numberOfItems.innerText = parseInt($numberOfItems.innerText) + 1
  // Update Cookie
  var itemName = e.target.dataset.name

  console.log(itemName)
})
```

The `e` is an event variable defined at the end of the first line (as function argument). It's the event object made available by any JavaScript event listener. The object has some default properties. One of them is `target`. That `target` refers to the HTML element that was clicked. In fact, in this situation `e.target` is the same thing as `document.querySelector('.shoppingCart__add--js')`. They both represent the exact same HTML element object. 

That HTML object has a property called `dataset` which in itself is another object that gives you access to all the `data-` attributes of a given HTML element. And since we defined the `data-name` attribute, we can access it here with `dataset.name`. If we had defined `data-banana` we could access `dataset.banana` now. 

If you save the file and reload the page, the `console.log()` should return the cookie name. 

Now, let's actually set a cookie in JavaScript. First, create an empty object. Then we set the key of that object to the cookie name and the value to the number of cookies. (The `console.log()` can be removed again now btw.)

```js
var itemName = e.target.dataset.name
var cookieObj = {}

cookieObj[itemName] = $numberOfItems.innerText
```

Finally, we're going to use the built-in function `JSON.stringify()` to convert the JavaScript object `cookieObj` to a string and then assign it to the cookie name `shoppingCart`:

```js
document.querySelector('.shoppingCart__add--js').addEventListener('click', function(e) {
  // Update View
  $numberOfItems.innerText = parseInt($numberOfItems.innerText) + 1
  // Update Cookie
  var itemName = e.target.dataset.name
  var cookieObj = {}
  cookieObj[itemName] = $numberOfItems.innerText
  document.cookie = 'shoppingCart=' + JSON.stringify(cookieObj) + ';path=/'
})
```

We also should add the same logic to the button that removes cookies from the shopping cart: 

```js
document.querySelector('.shoppingCart__remove--js').addEventListener('click', function(e) {
  // Update View
  $numberOfItems.innerText = Math.max(0, parseInt($numberOfItems.innerText) - 1)
  // Update Cookie
  var itemName = e.target.dataset.name
  var cookieObj = {}
  cookieObj[itemName] = $numberOfItems.innerText
  document.cookie = 'shoppingCart=' + JSON.stringify(cookieObj) + ';path=/'
})
```

If you save everything now and reload the page, you can click the `+` and `-` buttons to increase or decrease the number of cookies in the shopping cart, and you can use the developer tools to confirm that they are actually written in the cookie.

Before we move on, let's optimize our code a little. Right now, we wrote four of the same lines of code twice. This is always a good sign that we should abstract something into a separate function. 

Create a new function above the two event listeners: 

```js
function updateCookie(itemName, numOfItems){
  var cookieObj = {}
  cookieObj[itemName] = numOfItems
  document.cookie = 'shoppingCart=' + JSON.stringify(cookieObj) + ';path=/'
}
```

Adjust the two event listeners to look like this: 

```js
document.querySelector('.shoppingCart__add--js').addEventListener('click', function(e) {
  // Update View
  $numberOfItems.innerText = parseInt($numberOfItems.innerText) + 1
  // Update Cookie
  updateCookie(e.target.dataset.name, $numberOfItems.innerText)
})

document.querySelector('.shoppingCart__remove--js').addEventListener('click', function(e) {
  // Update View
  $numberOfItems.innerText = Math.max(0, parseInt($numberOfItems.innerText) - 1)
  // Update Cookie
  updateCookie(e.target.dataset.name, $numberOfItems.innerText)
})
```

You can see that we are calling the `updateCookie()` function, with the first argument being the name from the `dataset` object and the second argument being the number of items seen in the HTML.

## Reading Cookies on the Frontend

You may notice a few issues that our code has right now. One problem is that when you reload the page, the number of cookies in the shopping cart is still `0` even if a cookie is set to a higher number. 
The other issue is that if we were to add other cookies to the shopping cart, it would overwrite the entire cookie. So right now, we can only have a single type of cookie in the shopping cart. 

We can address this issue if we know how to **read cookies on the frontend.**

Reading and working with cookies on the frontend is a little tricky. Well, technically, it's super simple. But that's what makes it tricky. With `document.cookie` you can read **all cookies as a single string**. (Try it out! Just type `document.cookie` in the JavaScript console of your website and see what it returns.) 

So instead of being able to target specific cookies by their name (like you could, e.g. with `localStorage`) you can only get all cookies at once as a string. That's why it's super simple and, at the same time, tricky to work with. Because before you can do anything with an individual cookie value, you have first to get the specific cookie you're looking for from within the string. 

It would go way beyond the scope of this tutorial to explain the depths of how to do this. But there are [numerous approaches and algorithms (and libraries) to read out the values of a specific cookie in JavaScript](https://stackoverflow.com/questions/10730362/get-cookie-by-name). To not grow this tutorial too much, I decided to go with a very simple function that you can copy and paste into your JavaScript file. You can use this function to find and retrieve a specific cookie value by its name. Add the following code somewhere at the top of your JavaScript file: 

```js
function getCookieByName(name){
  var value = "; " + document.cookie
  var parts = value.split("; " + name + "=")
  if (parts.length == 2) return parts.pop().split(";").shift()
}
``` 

You can call the function and pass the cookie name as an argument. Try it out! After adding the function to your JavaScript and saving the file, reload the page. Then, click the `+` button a few times. Afterward, open the JavaScript console of the developer tools, type `getCookieByName('shoppingCart')`, and hit the Enter key. You should now see a string that includes the JavaScript object we defined earlier. For example: 

```js
'{"Oatmeal Raisin":"5"}'
```

If you type in a cookie name that isn't stored as a cookie, the function will just return `undefined`.

We can now replace the line `var cookieObj = {}` in the `updateCookie()` function and load it from the existing cookie: 

```js
function updateCookie(itemName, numOfItems){
  var cookieString = getCookieByName('shoppingCart')
  var cookieObj = cookieString ? JSON.parse(cookieString) : {}
  cookieObj[itemName] = numOfItems
  document.cookie = 'shoppingCart=' + JSON.stringify(cookieObj) + ';path=/'
}
```

We created a new variable `cookieString` to represent whatever our `getCookieByName` function returns.

`JSON.parse()` is the reverse function of `JSON.stringify()`. We used `JSON.stringify()` above to turn a JavaScript object into a stirng. We can now use `JSON.parse()` to turn a string into a JavaScript object.

Since `getCookieByName()` could return `undefined` (if no cookie is set yet), `JSON.parse(cookieString)` would break. That's why we use the **ternary operator** to first check if `cookieString` exists. The **ternary operator** might be new to you. It's essentially a short way of writing `if() ... else() ...` in a single line. It's standard JavaScript. Here is a simple example:

```js
(1 + 1 == 2) ? 'the calculation is correct' : 'the calcultaion is false'
```

Everything before the `?` is what you'd usually write inside the parentheses of your `if()` statement. The `:` acts as `else`. This is very useful when assigning variables conditionally.

You can try it out. Navigate to different cookie pages and add them to the shopping cart (e.g., [http://127.0.0.1:5000/cookies/sugar](http://127.0.0.1:5000/cookies/sugar)). Then, check the cookie values in the developer tools. The value should now include multiple different types of cookies like this: 

```js
'{"Sugar":"3","Oatmeal Raisin":"2"}'
```

But this doesn't solve the problem yet that the HTML still shows `0` whenever we change pages. Let's solve that next.

## Asscessing Cookies on the Backend

Remember, cookies are available both in the frontend and the backend. So we can also access them in our Flask backend. 

To do that, we can use the `request` object we've used before. In **/app/cookies/routes.py**, make sure `request` is part of the imported objects. Then, in the `cookie(slug)` route function add the following line **above** the `return` statement. 

```py
print('SHOPPING CART COOKIE', request.cookies.get('shoppingCart'))
```

If you now open an individual cookie page in the web browser and pay close attention to the terminal that's running your webserver, you should see the line printing out the contents of the `shoppingCart` cookie that was previously set on the frontend. (Note that this line will cause your app to break if no cookies have been set yet. So after trying it out, you should immediately remove it from your code again.)

Now, however, we're in the same situation as previously on the frontend. The contents of the cookie are **look like** a dictionary, but in reality, they are just a **string**. So we need first to convert the string as we did on the frontend with `JSON.parse()`. Luckily Python has a very similar function!

## Introducing Helpers in Flask

Since our **controller** (aka **routes**) functions are only supposed to connect data to our view but not contain any real business logic, this is a good time to add a new Python file to handle some of the additional logic. Create a new file with this path: 

**/app/cookies/helpers.py**

In it, add the following import statement at the top: 

```py
from flask import request
import json
```
 
We need `request` to have access to the `cookie` object. `json` contains the function that allows us to convert JSON in strings to Python dictionaries. 

Then, create a new function. Let's call it:

```py
def get_number_of_items_in_shopping_cart_cookie(item_name):
```

This function should first get the cookie string as we did earlier in the `print()` statement: 

```py
def get_number_of_items_in_shopping_cart_cookie(item_name):
  shopping_cart_string = request.cookies.get('shoppingCart')
```

`shopping_cart_string` will represent a string that looks like this: `'{"Oatmeal Raisin":"1"}'`

`request.cookies` is dictionary. The `get()` function is just a regular Python function that allows you to get the value of a key in a dictionary. The code above will have the exact same result as if you were to write this: 

```py
shopping_cart_string = request.cookies['shoppingCart']
```

The main difference is that the second option (with square brackets `[]`) will break the entire application and show an error if the key `'shoppingCart'` isn't found. The `get()` method will simply return `None` as the value if the key doesn't exist. 

Next, we need to convert it to a Python dictionary which we can do with `json.loads()`:

```py
def get_number_of_items_in_shopping_cart_cookie(item_name):
  shopping_cart_string = request.cookies.get('shoppingCart')
  shopping_cart = json.loads(shopping_cart_string)
```

`shopping_cart` will be a Python dictionary looking like this: `{"Oatmeal Raisin":"1"}`.

And finally, we only want to return the number of items per cookie. So only the value of that dictionary given the specific item name. So we add one more line: 

```py
def get_number_of_items_in_shopping_cart_cookie(item_name):
  shopping_cart_string = request.cookies.get('shoppingCart')
  shopping_cart = json.loads(shopping_cart_string)
  return shopping_cart.get(item_name, 0)
```

Above, I explained the `get()` function. In this new line, you can see one more nifty feature. You can pass a second argument to it (here, it's the `0`) that will act as the default value. If `get()` doesn't find a key based on the `item_name`, instead of returning `None`, it'll return the default value. Here, that's `0`. 

Nonetheless, as it's now, this function is still very unstable! It would break our entire application if no cookie was set at all. 

We could do similar logic as we did in the frontend with the ternary operator. Or we could just wrap everything inside a `try ... except ...` block. That's standard Python code. So make sure to look it up if you're not familiar with it. The `try ... except ...` block will allow us to say, "If anything goes wrong trying to get the cookie data, just return something else and don't throw an error."

Here is what it'll look like: 

```py
def get_number_of_items_in_shopping_cart_cookie(item_name):
  try:
    shopping_cart_string = request.cookies.get('shoppingCart')
    shopping_cart = json.loads(shopping_cart_string)
    return shopping_cart.get(item_name, 0)
  except:
    return 0
```

In this case, we'll just return a string with the number `0` if anything goes wrong. This way, the default value of our shopping cart will always be `0`.

Back in **/app/cookies/routes.py**, we can import our function at the top of the file like this: 

```py
from .helpers import get_number_of_items_in_shopping_cart_cookie
```

We need whatever the function returns in the jinja code of the HTML template. So we need to pass it with the `render_template()` function. Adjust the `cookie(slug)` route function to look like this: 

```py
@blueprint.route('/cookies/<slug>')
def cookie(slug):
  cookie = Cookie.query.filter_by(slug=slug).first_or_404()
  return render_template('cookies/show.html', 
    cookie=cookie, 
    num_in_cart=get_number_of_items_in_shopping_cart_cookie(cookie.name)
  )
```

You can see I added some line breaks to the arguments of the `render_template()` function to increase the readability. I also simplified the variable name to be used in the template to `num_in_cart`.

In **/app/templates/cookies.show.html** you have this line: 

```html
<span class="shoppingCart__number--js">0</span>
```

Change it to this now: 

```html
<span class="shoppingCart__number--js">{{num_in_cart}}</span>
```

`num_in_cart` we just made available through the `render_template()` function. If you save everything now and reload the page, the shopping cart shouldn't anymore show just `0` but instead, show the number of items stored in the shopping cart cookie. 

That's it! You know how to read and write cookies on the frontend and the backend of your application. And at the same time, you even learned about adding **helpers** and working with JavaScript in Flask. 

If you want to find out more, check out the [documentation](https://flask.palletsprojects.com/en/2.0.x/quickstart/#cookies).

## Setting Cookies in the Backend

You can also set cookies in the Flask backend that will then be available and usable on the frontend. We won't go into much depth here and won't apply it in the code. But it should be mentioned here in case you need it in your app. 

## Flask Sessions vs. Cookies

There is one more Flask-specific feature I want to have mentioned here: `session`. Right now, anyone who knows how to use the developer tools of a web browser can also look at the cookies set on your website in plain text. That's totally fine for simple features like shopping carts. But sometimes, you want to store on the user's device without the client-side having access to the specific data. This could be, for example, whenever you want to remember the client's device to stay maybe logged in for several days. 

We will talk about this a little more later when we talk about **authentication**. But for the sake of completeness, I wanted to have mentioned it here. 

The way you can do this in Flask is `import` the `session` object `from flask`. 

That object will set a cookie in the frontend but with a key difference to `request.cookies`: It's **encrypted**. That means the frontend will only see a cookie that looks like this: `w3904uhte9u4tu0h`. On the backend, however, you can decrypt it and read the specific values. 

To be able to use the `session` object, you need to set an environment variable called `SECRET_KEY` in your **.env** file. As a value, you can use any complex set of characters. You can use [randomkeygen.com/](https://randomkeygen.com/) if you want just quickly to generate a key. 

Then, in your **/app/config.py** file, you can set it as a global config variable by adding this line: 

```py
SECRET_KEY = environ.get('SECRET_KEY')
```

That key is necessary because it's going to be used for the **encryption** of the cookie. Having done that, you can start using `session` in your Flask code. 

You can read more about sessions [in the official documentation](https://flask.palletsprojects.com/en/2.0.x/quickstart/?highlight=session#sessions).

## 🛠  Practice 

Think about a use case of cookies for your project. Maybe it can be as simple as remembering that a user has looked at a website before and showing some custom content to welcome them back. 

1. Set a cookie on your website either on the client-side with JavaScript (see above) or on the backend in Flask (see [documentation](https://flask.palletsprojects.com/en/2.0.x/quickstart/#cookies))