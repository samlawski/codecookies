---
title: Deployment to Heroku
slug: deployment-to-heroku
description: Learn to deploy an Express application to Heroku.
lastUpdate: September 20th, 2022
sectionIndex: 2
groupIndex: 0
---

Hosting providers (no matter how simple or complex they are) usually have some custom configuration and requirements for hosting applications on their servers. 

In this lesson, we're going to look at hosting an Express application on [Heroku](https://heroku.com). Has become very popular because it's very simple to use, and more importantly, it used to offer a free pricing tier. On August 25th, however, it announced discontinuing that pricing plan. It still remains popular, though. Therefore, this lesson is meant to help point out a few special setup steps you need for Heroku in particular. 

This tutorial assumes you have completed the [deployment lesson](/express-tutorial/v1/deployment/). It's crucial that you follow the steps in that lesson before continuing here. 

## Getting started with Heroku

To get started with Heroku, follow these steps: 

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

This will commit everything as it currently is using `git`. If you're not familiar with git, it's quite important that you learn about it now as it's relevant for deployment from now on. 

## Create a new application on Heroku

To create a new application on Heroku, make sure you are within your project's folder in the command line. Then, run:

```
heroku create
```

Once the app is created, you'll see an output like this:

```
Creating app... done, ⬢ your-app-name-123
https://your-app-name-123.herokuapp.com/ | https://git.heroku.com/your-app-name-123.git
```

The first line shows the application name. Keep note of that. You may need it later!

On the second line, the first item is the URL of your application on Heroku. The second one is the git remote link used to deploy your application. 

To access your application on the server, you can now use the first URL. But for now, it'll not show anything. There are still a few more things we have to do. 

## Preparing the application for deployment

Even though Heroku already takes care of a lot of things, there are still a few steps to take to prepare your application for deployment. 

### The Node server

If you followed the deployment lesson, you should now have a `"start"` script in your **package.json** file that executes `node app.js` (or whatever is the line to start your Express server).

### Procfile

Next, we need to tell Heroku how to start the server. For that, Heroku requires you to add a new file to the project folder. The file should be called **Procfile** without any extension (!) and be placed in the root of your project. 

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop</div>
  </header>
  <main>
    <ul>
      <li>📁 helpers</li>
      <li>📁 middlewares</li>
      <li>📁 node_modules</li>
      <li>📁 public</li>
      <li>📁 views</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
      <li>📄 Procfile</li>
    </ul>
  </main>
</div>

The **Profile** needs to contain just a single line: 

```
web: npm start
```

This is telling Heroku to run using the command `npm start` to start the web server. 

### Database

Heroku comes with paid add-ons that let you host a MongoDB database right on Heroku. It's easier and cheaper, however, to go with an external cloud service like MongoDB Atlas. If you're using that, there is nothing you need to set up in Heroku for your database. You do, however, have to set environment variables.

### Setting Environment Variables on Heroku

In a correctly set up project, the **.env** file (containing all environment variables) should be listed in the **.gitignore** file. So how would the variable be set in our **production environment** on Heroku? 

Heroku has a CLI (command line interface) we installed and used earlier. Through that, you can also set **environment variables** on Heroku.

To view environment variables set on Heroku, you can run: 

```sh
heroku config
```

Defining a new variable follows this format:

```sh
heroku config:set MY_NEW_VARIABLE="12345"
```

Notice the quotes around the value. They are not always necessary - but sometimes. So it's best to just use them every time.

So in our case, we want to set `MONGODB_URI` and want to set it to the URL we got from MongoDB Atlas earlier. 

```sh
heroku config:set MONGODB_URI="mongodb+srv://admin:dSJE83hDgkwsh38hy@cluster0.d3bdoc8.mongodb.net/cookieshop?retryWrites=true&w=majority"
```

Make sure the Atlas URL has the correct password and sub-path for the database set!

### Setting the port from the environment variable

Heroku sets its own server port. So make sure to use a `PORT` environment variable for your application. But it's important that you **don't set the environment variable on Heroku**. Heroku will do that automatically for you.

## Deploy to Heroku

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

>**Debugging on Heroku**
>If you run into any issues, you'll want to be able to see the error messages in the console. 
>To see the console output form the server, you can run `heroku logs` to view the logs on Heroku.
>Run `heroku logs --tail` to view the logs and keep listening to new logs. 
>You can stop listening with `Ctrl` + `C`.

## Recap

Heroku is relatively easy to set up. Especially if you keep the database running on another cloud service, there is not much to set up. One huge benefit of Heroku is its Git workflow. This way you can very easily connect the deployment process to any other git workflows you have set up.