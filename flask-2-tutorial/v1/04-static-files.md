---
title: Static Files
videoId:
slug: "static-files"
lastUpdate: April 8th, 2022
templateEngineOverride: md
---

Now that our application is growing and we have more and more HTML pages, you may be wondering how you can add static files such as CSS or JS files to your project. 

## The static folder

Similar to the **templates** folder, Flask has another folder it automatically looks for in your file system. In the root of your project (so where you have your **app.py** file), create a new empty folder called **static**. In there, create another folder called **css**, and finally, a new file called **main.css**. 

It may look like this: 

![screenshot of folder structure with a static folder, a css folder inside and a main.css file inside of that](/assets/content/flask-2-tutorial/04-static-files/folder-screenshot-2.png)

Add some CSS rules to that folder to give your page some basic styling. 

Here is an example of what you could add: 

```css
body {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 20px;

  font-family: Helvetica, sans-serif;
}
```

Now, save the file. 

Next, we'll use the `url_for` function again. Remember, we've added that before to get the URL of specific routes. 

```py
from flask import Flask, redirect, url_for, render_template
```

You can also use it to get the URL of static files! Just as a reminder: `url_for` will return a URL as a string. In our case, we want it to return the URL to a static file in our **static** folder. To do that, we would write this: 

```py
url_for('static', filename='css/main.css')
```

The `'static'` signals to Flask that we are looking for a static file in the **static** folder. The `filename` defines the path to the file. And As you can see, it can even include sub-folders within the **static** folder. 

You may have already guessed, but we will need that URL in the HTML part of our application. So go to the **base.html** template and inside the `head` block insert an HTML `<link>` tag and define the `href` to use `{{ url_for('static', filename='css/main.css') }}`. Conveniently, `render_template` and jinja allow us to access the `url_for` function right from within the HTML template without having to pass it through as a parameter. 

Here is what the `head` could look like now: 

```html
<head>
  {% block head %}
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}{% endblock %}</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/main.css') }}">
  {% endblock %}
</head>
```

Save everything. If it went well and you create the main.css file in the right place, the pages of your application should now look a little different.

## Adding downloads to your site

Sometimes you may want to return the contents of a static file to the user and not just the URL. In that case, you could use the `send_file` function. Add it to the list of imported functions at the top: 

```py
from flask import Flask, redirect, url_for, render_template, send_file
```

Let's imagine you have some legal documents you want to allow users to download. For simplicity, create this file path: **static/downloads/legal.txt** (so a folder called **downloads** in your **static** folder, along with a file called **legal.txt**).

To let users download that file, you can create a new route called `legal` and then use the `send_file()` function to return the file to the user like this: 

```py
@app.route('/legal')
def legal():
  return send_file('static/downloads/legal.txt')
```

In your frontend, all you have to do is now add a link to the route you just created: 

```html
<a href="/legal">Download legal details</a>
```

You can also use this method if you want to provide users with a custom or simplified link to download a static file on your server instead of giving them a really long URL. 

Try out the code above. You'll notice that your browser will most likely try to open the `.txt` file right in the browser. It might not do that with every file type. But to make sure the browser triggers a download instead of just opening a file, you can use the `as_attechment` parameter like this: 

```py
@app.route('/legal')
def legal():
  return send_file('static/downloads/legal.txt', as_attachment=True)
```

Now, the file will be downloaded when the route is accessed. 

## File storage and dynamic files

If you want your application to handle lots of files - maybe even large files like videos or high-quality audio - storing them as part of your code repository is not a good idea. You can maybe imagine that adding lots of large files to your code will make it increasingly hard to work with having to upload and download large files all the time when developing or testing. 

Especially if the large files are tied to dynamic and changing content in your application, it would be quite tedious to have all those files as part of your codebase. 

Another thing you may be thinking about in this context is to let users upload files. Maybe they have a profile picture or other files. It's usually best practice to keep dynamic content separate from your codebase. So the codebase only represents the application's code but **not** any dynamic content itself. 

On top of all that, many modern PaaS (platform as a service) hosting providers such as Heroku or Google App Engine are designed not even to let you upload or alter files of your application project. All you can do is deploy your project's code repository. But once it's deployed (which means uploaded), it cannot be altered, and no files can be added by you or the users of your application. To update your application, you have to deploy your entire application code once again. This is a very common workflow and one that doesn't allow for file uploads or file changes in the same place where you host your application. 

The solution that many developers use for this is a separate storage space for files. There is AWS S3, Google Cloud Storage, and many more providers of specific hosting of static files. There are also open-source self-hosted solutions such as [minio](https://min.io/). What you're looking for is object storage. Those servers are optimized for hosting static files as opposed to dynamic code written in Python or PHP. Think of them as a database just for files. 

You'll learn a similar principle in the section on databases. Modern web applications usually consist of multiple connected services. One is the application code itself. But on top of that, the app may connect to a database stored separately and another separate file storage.

Implementing that goes beyond the scope of this section on static files. But we'll circle back to the topic later. 

## 🛠  Practice 

To practice what you've learned in this exercise: 

1. Create a CSS and maybe a JavaScript file for your project and add them to the static folder.
2. Load the CSS and JavaScript files correctly in your HTML templates
3. Add a downloadable file to your application. 

This can be a good opportunity to spend some time with the layout of your application. Make it look nice, and spend some time writing out your CSS code. 