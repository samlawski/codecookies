---
title: Server and Deployment
videoId:
slug: "server-and-deployment"
lastUpdate: Mar 1st, 2023
---

You now have learned about all the fundamental concepts of building a web application with Flask. You can create routes, views, and models, connect a database, perform CRUD operations, and paginate your content. In future exercises, we'll learn to put all of that together and refine some more aspects of it. But in this exercise, we're going to learn about the final step of building a basic application: uploading it to the internet. 

## Choosing a Host

Flask is a Python framework. So when you think about where to host your application, you should make sure that platform lets you run Python 3 applications. This means shared hosting providers that only let you run PHP on the server are unsuitable. Also, static hosts and object storage (like Netlify or AWS S3) cannot run your application. 

Providers like Google App Engine or Digital Ocean require a little more setup. By all means, try it out, and there are lots of great tutorials out there to help you deploy your Flask application to almost any of those providers. 

In this tutorial, my focus is to help you learn Flask and not server administration. So I chose to go with [render.com](https://render.com) as it offers a free tier and is one of the easiest **PaaS** (platform-as-a-service) providers out there. This may change in the future, though. Especially when it comes to free products, make sure not to build your business on one specific provider. They could always change their business model, and you should be prepared for that.

>💡 A prominent example of a a company changing their business model is Heroku. A previous version of this tutorial (and many other tutorials) used to use Heroku.com for free hosting. They used to offer a free plan and a very simple deployment process. That's how they became very popular and eventually got bought. So in 2022, they [announced](https://blog.heroku.com/next-chapter) to stop their free plan. 
>This is just one example and a good lesson on being aware of whom your application (and maybe business) is dependent on. 

## The Web Server

In order to run a backend application, you need to have a **web server** software installed and running on the server. This can be something like _Apache_ or _ngnix_. If you remember from before, Flask actually has a very simple web server software built right into the framework. But that's not suitable to run on an actual production server. 

_Apache_ and _nginx_ are very popular general-purpose web servers. You cannot use them directly with Python, though. They are just not designed to do that. Instead, you need a so-called **WSGI server**. That's a web server software designed to support Python applications (among other programming languages as well). Some popular ones are called _uWSGI_ and _Gunicorn_ (inspired by Ruby's unicorn server).

Many people will still use both something like _nginx_ and a **WSGI** server in combination to still benefit from the features that come with _nginx_. It is totally fine, though, to **only** use a **WSGI server** for smaller-scale applications. So that's what we're going to do.

If you want to learn more about the topic [check out this article](https://www.fullstackpython.com/wsgi-servers.html).

We're going to go with [Gunicorn](https://gunicorn.org/).

To install it, run `pip install gunicorn` while your virtual environment is active. 

_(Don't forget to run `pip freeze > requirements.txt`! This is particularly important now because once you deploy your application to a server, you'll need the **requirements.txt** file to install all the package dependencies on the server.)_

To use _Gunicorn_ to run your web server, instead of running `python run.py` in the terminal, you just run: 

```sh
gunicorn run:app
```

>💡 **Important note for Windows users**
>
>_Gunicorn_ is designed to run on _Unix_ systems. This refers to distributions of _Linux_ and _macOS_. It does not run on _Windows_. 
>That's not much of a problem right now, though, because the purpose of using _Gunicorn_ is to run it on the web server. On your personal computer you can continue to use the default Flask server with `python run.py`.
>
>Alternatively to _Gunicorn_ you could also use another web server that does run on Windows such as [uWSGI](https://flask.palletsprojects.com/en/2.2.x/deploying/uwsgi/) or [Waitress](https://flask.palletsprojects.com/en/2.2.x/deploying/waitress/). Either of those are fine. The reason we use [Gunicorn](https://flask.palletsprojects.com/en/2.2.x/deploying/gunicorn/) in the tutorial is because of its popularity.

The `run` is the name of your **run.py** file. `app` is the `app` variable within that file. This tells the _Gunicorn_ server where to find your application. 

That's it. Now you have your application running with the _Gunicorn_ web server instead of the built-in Flask server. (Note that the port of the IP might be different. Instead of 127.0.0.1:5000 it might be 127.0.0.1:8000. Check the output in the Terminal to see the link to your application.)

While you develop your application, that doesn't really matter much. You can continue to use the built-in Flask server. But you can also use it locally. It can be a good idea in larger applications to use the same software on your computer as you do on the server. This way, you catch issues specific to, e.g., the web server early. 

After making those updates don't forget to commit those changes with **git** and upload them to a remote git host (like GitHub, Gitlab, etc.). This will become very important in a minute because render.com uses git for deployment. 

If you haven't used **git** until now run the following commands in your project folder:

```
git init
git add .
git commit -am 'initial commit'
```

Then, find a host like GitHub or GitLab and upload your repository there. 

## Deployment to render.com

Render.com is a hosting provider like many others. One reason I picked it for this tutorial is that it offers a free plan and is easy to use. 

First, go to [render.com](https://render.com/) and create a free account. If you're using GitHub or GitLab to host your project it might be a good idea to already connect your account since that's what you need to do later on anyway. 

Once you end up on the dashboard you can click the "New +" button at the top and select "Web Service". If you have already paired your GitHub/Gitlab account you'll now see your repositories show up in the middle. If they don't show up you may have to click "Configure account" on the right and manually allow access to specific repositories. 

Once your account is connected properly you should be able to find your code repository in the middle of the screen and click the "**Connect**" button. 

Next, you'll have to pick a name for your project (that will also be the URL to your app) and a few more things. Most fields should already contain the right information. 

- Region: Pick one that makes sense based on where you expect your users to be from
- Branch: Probably already picked by default the one that your main version is on
- Root Directory: Should stay empty if you've been following the tutorial and don't have a custom subfolder for your app
- **Build Command**: This needs to be updated! It probably already shows the right command to install packages from the _requirements.txt_ file. But what we also want to do is add the migration script here. This makes sure the migrations also run every time automatically when the app is deployed. So update the line to this: 

`pip install -r requirements.txt; flask db upgrade`

- **Start Command**: This also likely needs to be adjusted. If you have a **run.py** file that starts your server you'll need to change this line to the following: `gunicorn run:app`

Further down you can keep the "Free" instance type selected and finally click "Create Web Service" at the bottom. 

Now your application code will automatically be pulled from GitHub/Gitlab. Render.com takes care of installing the right version of Python 3, installing all the packages, and running the migrations. Usually, you'd have to do all these things by hand. 

>⚠️ Your code will now start deploying and installing the application on render.com. But since we're still missing a few steps, the application will probably **fail**! That's ok. Don't worry. In fact it really should fail at this point. Look through the **logs** and try to understand the error. You may have to scroll up a bit and read carefully to find some helpful information. Can you guess what we're missing?

## The Database

As mentioned in previous exercises, you can't use _sqlite_ on providers like render.com because all records are stored in a file, and render.com doesn't let you write data to the file system. 

Instead, we're going to use the SQL database called **Postgres** on render.com. Postgres is a separate piece of software running on your server. You can think of it as another mini web app with its own web server and URL. 

For Flask to work with Postgres you need to install the package `psycopg2`. That's quite straight-forward, though:

```
pip install psycopg2
pip freeze > requirements.txt
```

_(Don't forget to commit those changes with **git** and upload them to GitHub/Gitlab!)_

That's it. no additional configuration required. Now, _SQLAlchemy_ just needs to be told the URL to the database and it'll be able to work with Postgres.

Remember, in our **.env** file we defined the `DATABASE_URL` to be `'sqlite:///database.db'`. That's the URL of our _sqlite_ database. So that's the URL we want to be different on render.com.

But first, we actually need a database on render.com. To create a new database go to the [render.com dashboard](https://dashboard.render.com/) and click on "New +" at the top. Select "PostgreSQL". You can give it any name you like. As a region, you should select the same one as the region of the application. The rest you can leave as is.

Finally, click "Create Database". Once created, you should end up on an "Info" page about the database and when you scroll down you should see a section with information about "Connections". One of the points is "Internal Database URL". There is a little button to reveal the URL and another button to copy it. Copy that entire URL (make sure not to miss a part)!

## Environment Variables

Now go back to the render.com dashboard. Click on your application. Then, in the sidebar, click on "Environment". That's where you can define the environment variables on the server. Remember the **.env** file in our project? This should be part of the **.gitignore** file. So it was (hopefully!) never deployed to GitHub/Gitlab or render.com. But we still need those variables. So this is the place where you can set those variables on render.com. 

As a "key" add `DATABASE_URL` and as a value paste the URL you just copied from the database earlier. (Don't be surprised. It will be hidden shortly afterward.)

Then, make sure to add the other environment variables and their values (you find the keys and values in the **.env** file of your project.) Those should probably be `FLASK_APP` (with the value `run.py`) and `SECRET_KEY`. Do **not** set a `FLASK_DEBUG` variable! That's very important. 

>💡 You may have other environment variables (such as an `API_KEY` from the API-building exercise). Make sure to add all the environment variables that are required to run your code.
>
>You'll probably also add new environment variables in the future - for example, when you implement authentication. Don't forget that you'll need to then also add the environment variables **before** you deploy the application. 

Finally, click "Save Changes" and click "Manual Deploy" at the top right. This should redeploy the application. 

Watch the logs to see how things go and if any other errors come up. But technically now everything should be ready to go. 

You can click on the URL to your website on the top left once the deployment is done and click around to see if everything works. 

>💡 **Debugging on render.com**
>
>On render.com you can click on the "Logs" tab on the left to see the logs of the server. This is extremely helpful whenever something doesn't work. Scroll through the list and read carefully so you don't miss anything. Usually, you'll find any error messages here that'll tell you what went wrong. 

## Running a script on the server

If you click around your website and have been following the tutorial, you'll probably notice quickly that the cookie records are not there. That makes sense. We created a brand new database on the server. All the cookie records we worked with before were in our local database on our computer. 

Remember, at one point we created a **seed file**, a script to populate our database with a few cookie records. Locally, we executed that script by running `python -m app.scripts.seed`. And if you had a paid plan with render.com you could do the same thing through the "Shell" on the render.com dashboard. But we're on a free plan. So we have to get a bit creative. 

To make this fully clear: The following approach is a **hacky workaround**. In a real-world application, you should go with a paid plan and use either the "Shell" in the browser, a "Job", or an **SSH** connection to execute scripts on the server. 

So what you can do as a **hack** is just add a _secret_ route in your application **temporarily**. When that route is called in a web browser, the seed script is executed. This is obviously not a secure solution! So you should make sure this can only be called once and ideally you just remove the route immediately afterward again.

To make sure the route can only be called once let's add it to the **cookies** blueprint. So in **/cookies/routes.py**, at the bottom add this route:

```py
@blueprint.route('/run-seed')
def run_seed():
  if not Cookie.query.filter_by(slug='chocolate-chip').first():
    import app.scripts.seed
    return 'Database seed completed!'
  else:
    return 'Nothing to run.'
```

This adds a route `/run-seed` to your application. The file should already import the `Cookie` model at the top. Using the model we can check if a record with the slug `chocolate-chip` already exists. If your seed contains different files, you should adjust this line to check if a record from the seed file already exists. Any record should be fine. 

The condition makes sure to only run the line `import app.scripts.seed` (and therefore execute the seed script) if a record with the given slug does **not** yet exist. If it _does_ find a record with that slug, it will not do anything and just return "Nothing to run". This makes sure the seed can only be executed once. 

>💡 Make sure the seed file, the seed file uses the condition `if __name__ == '__main__':` to only run `create_app()` if the file is executed directly. This is now very important because we'll execute the script within the context of a running application. 

After adding this route, you can commit the changes using **git** and upload them to GitHub/Gitlab. This should automatically trigger a deployment to render.com. Once the deployment is done, you should now be able to access the `/run-seed` route on the server (using the URL you got from the render.com dashboard).

If everything went well you should now see either `Database seed completed!` the first time you access that route on the server. The second time you should see `Nothing to run.`. And on the `/cookies` route, you should now see the cookies created. 

If something went wrong check the logs on render.com. They should help you identify what the issue is. 

>🐛 To debug this locally, rename or delete the **database.db** file in your project folder. Then run `flask db upgrade` to generate a new blank database locally. Now, start the server locally and try to access [http://127.0.0.1:8000/run-seed](http://127.0.0.1:8000/run-seed). Try to use the logs and error messages to debug the issue. 

## Side Note on localhost and 127.0.0.1

If it wasn't clear, I just wanted to point out again: `localhost` and `127.0.0.1` refer to the IP of your own local computer. Don't ever hard-code them anywhere in your code. The URL to your application, once it's deployed to Heroku, is a different one. That's why it's best to always work with either relative paths like `/cookies` or the `url_for()` function.

## 🛠  Practice 

You now know everything to build and deploy a full Flask application! 

1. To practice what you have learned in this exercise, set up Heroku with Postgres for another application and deploy it. 
2. Make sure to connect Postgres properly and run the migrations (and seed files if applicable).
3. Watch the logs come in as you navigate around your website. 