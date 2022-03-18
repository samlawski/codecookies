---
title: Server and Deployment
videoId:
slug: "server-and-deployment"
---

You now have learned about all the fundamental concepts of building a web application with Flask. You can create routes, views, models, connect a database, perform CRUD operations, and paginate your content. In future exercises, we'll learn to put all of that together and refine some more aspects of it. But in this exercise, we're going to learn about the final step of building a basic application: uploading it to the internet. 

## Choosing a Host

Flask is a Python framework. So when you think about where to host your application, you should make sure that platform lets you run Python 3 applications. This means shared hosting providers that only let you run PHP on the server are unsuitable. Also, static hosts and object storage (like Netlify or AWS S3) cannot run your application. 

Providers like Google App Engine or Digital ocean require a little more setup. By all means, try it out, and there are lots of great tutorials out there to help you deploy your Flask application to almost any of those providers. 

In this tutorial, my focus is to help you learn Flask and not server administration. So I chose to go with [heroku.com](https://heroku.com) as it offers a free tier and is one of the easiest **PaaS** (platform-as-a-service) providers out there. This may change in the future, though. Especially when it comes to free products, make sure not to build your business on one specific provider. They could always change their business model, and you should be prepared for that. 

## The Web Server

In order to run a backend application, you need to have a **web server** software installed and running on the server. This can be something like _Apache_ or _ngnix_. If you remember from before, Flask actually has a very simple web server software built right into the framework. But that's not suitable to run on an actual production server. 

_Apache_ and _nginx_ are very popular general-purpose web servers. You cannot use them directly with Python, though. They are just not designed to do that. Instead, you need a so-called **WSGI server**. That's a web server software designed to support Python applications (among other programming languages as well). Some popular ones are called _uWSGI_ and _Gunicorn_ (inspired by Ruby's unicorn server).

Many people will still use both something like _nginx_ and a **WSGI** server in combination to still benefit from the features that come with _nginx_. It is totally fine, though, to **only** use a **WSGI server** for smaller-scale applications. So that's what we're going to do.

If you want to learn more about the topic [check out this article](https://www.fullstackpython.com/wsgi-servers.html).

We're going to go with [Gunicorn](https://gunicorn.org/).

To install it, run `pip install gunicorn` while your virtual environment is active. (Don't forget to freeze the requirements.txt file.)

To use _Gunicorn_ to run your web server, instead of running `python run.py` in the terminal, you just run: 

```sh
gunicorn run:app
```

That's it. Now you have your application running with the _Gunicorn_ web server instead of the built-in Flask server. (Note that the port of the IP might be different. Instead of 127.0.0.1:5000 it might be 127.0.0.1:8000. Check the output in the Terminal to see the link to your application.)

While you develop your application, that doesn't really matter much. You can continue to use the built-in Flask server. But you can also use it locally. It can be a good idea in larger applications to use the same software on your computer as you do on the server. This way, you catch issues specific to, e.g., the webserver early. 

## The Database

As mentioned in previous exercises, you can't use _sqlite_ on providers like Heroku because all records are stored in a file, and Heroku doesn't let you write data to the file system. 

Instead, we're going to use Postgres on Heroku. Postgres is a separate piece of software running on your server. You can think of it as another mini web app with its own web server and URL. For Flask to interact with it, you don't need much except to tell _SQLAlchemy_ what the URL is to the database. 

Remember, in our **.env** file we defined the `DATABASE_URL` to be `'sqlite:///database.db'`. That's the URL of our _sqlite_ database. So that's the URL we want to be different on Heroku.

Because we're already using an **environment variable** here, there isn't actually much we need to do here. Heroku will automatically set the **environment variable** `DATABASE_URL` to be the URL of our database on Heroku. 

There is, however, one thing we need to do, and it's a little bit silly. Postgres made an update to the default prefix for its databases. In the past, it was `postgres://` (remember: just like `sqlite://`). They changed it in newer versions to `postgresql://`. _SQLAlchemy_ has adjusted their code accordingly. But _Heroku_ has not. That will lead to your database not being recognized by default. You can write a little "hack" to fix that issue. In your **/a[[/config.py** change the line of `SQLALCHEMY_DATABASE_URI` to look like this: 

```py
SQLALCHEMY_DATABASE_URI = environ.get('DATABASE_URL').replace('postgres://', 'postgresql://', 1)
```

We use Python's native `.replace()` method to check the environment variable if it includes the string `'postgres://'`. The nice thing about this method is that it just doesn't do anything with our `sqlite` URL because it doesn't include that string. On Heroku, however, it'll replace the string with `'postgresql://'` and fix the issue. Hopefully, this issue will be fixed by Heroku at some point. But as of _Feb 16th, 2022_ it's not. 

Also, note that if you ever want to use Postgres locally on your computer, you should adjust that logic and make sure to call the `replace` method only on Heroku. A simple condition should do the trick. 

_Side Note: Because the database and the web application are both on the same server, it's totally fine to just use a URL to connect the application with the database. It's, however, also possible to host the database on a separate server from the actual application. In that case, you cannot just use the URL to connect. That would be extremely insecure! Instead, you need some secret keys or other credentials to verify the connection._

## Preparing Deployment to Heroku

Our application is ready to go in terms of the webserver and the database. But we need a few more steps specific for Heroku. 

1. First, create an account on [heroku.com](https://heroku.com)
2. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli). With that, you can deploy your application from the command line. 
3. Afterwards, run `heroku login` in the command line and follow the steps to log in to the CLI. 

The Heroku CLI uses **git** for deployment. So if you haven't already, make sure to create a `git commit` of your current project version. 

Navigate to your project in the command line. Then run:

```
git init
git add .
git commit -am 'initial commit'
```

_(If you have `git` already set up for your project, you can skip these steps. Instead, make sure that the current version of your code is committed.)_

This will commit everything as it currently is using `git`. If you're not familiar with git, it's quite important that you learn about it now as it's relevant for the deployment from now on. 

### Create your application on Heroku

To create a new application on Heroku, make sure you are within your project's folder in the command line. Then, run:

```
heroku create
```

Once the app is created, you'll see an output like this:

```
Creating app... done, ⬢ your-app-name-123
https://your-app-name-123.herokuapp.com/ | https://git.heroku.com/your-app-name-123.git
```

The first line shows the application name. That's important for later!
On the second line, the first item is the URL of your application on Heroku. The second one is the git remote link used to deploy your application. 

To access your application on the server, you can now use the first URL. But for now, it'll not show anything. There are still a few more things we have to do. 

### Activate Postgres on Heroku

As mentioned above, Postgres is a separate piece of software running on our server. To install it on Heroku, we also just need a simple command: 

```
heroku addons:create heroku-postgresql:hobby-dev --app your-app-name-123
```

Replace `your-app-name-123` with the name of your app that you got in the previous step. 

Great! Now you have an app and Postgres setup in Heroku (you can actually see the current configuration if you log in on heroku.com).

### Setting Environment Variables on Heroku

Remember, we said Heroku would set the `DATABASE_URL` environment variable for us? You can check and see all environment variables by running the following: 

```sh
heroku config
```

You'll see that only one variable is set so far. That's the variable of the database we just created in the previous step. But if you look at your **.env** file, you'll see that we have a couple more variables defined. So we need to make sure to set those also on Heroku. 

Setting them is just as easy as getting them. Write:

```sh
heroku config:set FLASK_APP=run.py
```

and

```sh
heroku config:set FLASK_ENV=production
```

If you run `heroku config` now, you'll see the updated environment variables. 

### Prepare the application for deployment

There are still a couple of adjustments we have to make to our code before we can deploy our application. 

Heroku requires a file with the name **Procfile** in our project's root. This file includes instructions on how to run the webserver. So create a file with that exact name (and no file extension!) and add to it just a single line: 

```
web: gunicorn run:app
```

Next, we need to install the **psycopg2** package because Heroku uses it to interact with the Postgres database. It's extremely important that this package is listed in the **requirements.txt** file so that Heroku knows to install it. Just run these two commands:

```
pip install psycopg2
pip freeze > requirements.txt
```

### Deployment to Heroku

Now, your code is ready to be deployed. Remember, deployment works with git. So, after all the changes you just made, you need to make sure to have all the code committed to git. 

For example:

```sh
git add .
git commit -am 'add Heroku configuration'
```

To deploy, all you have to do is run: 

```sh
git push heroku main
```

(Or if your main branch is `master`, you should run `git push heroku master`. You aren't sure? Just run `git branch` to find out what your main branch is called. You can also use this to deploy specific branches. That's why deployment with git is so powerful!)

Once the deployment is done, you can run `heroku open` to open the application in your web browser. Or you use the URL from above. 

### Side Note: Debugging on Heroku

So your application is deployed, but an important step is still missing. If you go to the /cookies route of the application, you'll notice an error. 

To see an error message, you can take a look at the logs on Heroku by running this in the command line:

```
heroku logs
```

That's extremely useful whenever you have errors on Heroku. It'll show you what error messages were thrown on the server. 

You can also watch the logs live as they come in by running:

```
heroku logs --tail
```

That will keep the connection open, and as you navigate your side, you'll see new logs pop up (just like when you run the server locally).

To stop logging, just use the keys Ctrl + C.

### Running code on the server

So we know we have an issue. And if you read the error, you might have guessed already. We have connected the database, but we haven't actually created the tables yet for our application. Remember, the database on the server is separate from our local database. We just created a complete blank and new database. So we need to again to through the steps of the previous exercise to actually create the database tables in Postgres on the server.

Fortunately, we have migration files that already include what tables need to be created. We even have a seed file with data ready to go. So how do I execute both the migrations and the seed file on Heroku? 

Heroku lets you run command-line commands on the server! All you have to do is prefix them with `heroku run`. 

Let's start by running the migrations: 

```sh
heroku run flask db upgrade
```

_(It's important that your environment variables are set correctly for this step.)_

Once that's done running, you can also execute the seed file: 

```sh
heroku run python -m app.scripts.seed
```

If you go to the /cookies route on Heroku now, you should see our cookies! 

You can use the same command to even run the python console on Heroku by running:

```sh
heroku run python
```

If you quickly `import` your models and just run simple queries or CRUD operations, you can also use the `flask shell` for the by running:

```sh
heroku run flask shell
```

## Side Note on localhost and 127.0.0.1

If it wasn't clear, I just wanted to point out again: `localhost` and `127.0.0.1` refer to the IP of your own local computer. Don't ever hard-code them anywhere in your code. The URL to your application, once it's deployed to Heroku, is a different one. That's why it's best to always work with either relative paths like `/cookies` or the `url_for()` function.

## 🛠  Practice 

You now know everything to build and deploy a full Flask application! 

1. To practice what you have learned in this exercise, set up Heroku with Postgres for another application and deploy it. 
2. Make sure to connect Postgres properly and run the migrations (and seed files if applicable).
3. Watch the logs come in as you navigate around your website. 