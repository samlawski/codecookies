---
title: Deployment to Heroku
slug: deployment-to-heroku
lastUpdate: September 5th, 2022
sectionIndex: 0
groupIndex: 4
unlisted: true
---

>🚨 **Attention: Outdated Content!**
>This lesson has been delisted from the official tutorial. It's still available as a reference for those who bookmarked the page. **However, this page will not receive any more updates!**
>On August 25th, Heroku has announced to discontinue their free plan. Therefore, many statements made in this lesson aren't true anymore.
>The main tutorial has been changed not to focus on a single hosting provider anymore.

Most web applications are built to be hosted and available **on the web**. This might be obvious. But you could also use web backends in local company networks, at home, or on hardware (or IoT) devices. 

## Choosing a host

When thinking about the best way to make your web backend public to the web, you have many options to choose from. You could run a **Raspberry Pi** or any other computer (even the one you're using right now) and turn it into a web server. Web servers are just computers made available to the internet. But it requires some setup and will maybe be the material for another tutorial sometime. 

The more common alternative is to host your website on someone else's server. Many people or companies choose to rent out server capacity, install their own operating system (OS), and all the software needed on the web server. They will run the entire administration of the server on their own. With this option, you have maximum freedom and control over the supported programming languages and databases. But you're also responsible for setting up everything from scratch by yourself. 

Another option is to use a hosting provider that already comes with some pre-configured setup. Maybe they have PHP or Node.js already pre-installed, and all you need to do is upload your code, and it "just works." 

For the sake of simplicity, in this tutorial, we'll go with a service called **Heroku**. Heroku lets you deploy your code without having to manually install all the required software associated with your app. As you upload your code, they recognize it's using Node.js and will configure the servers accordingly. And most importantly: They offer a free tier, which makes it very practical for learning and trying things out.

>💡 I am **not** associated with Heroku (or its parent company Salesforce) in any way. And (unfortuantely?) I'm also not getting money for recommending them here. I simply chose them because they are easy-to-use and offer a free tier. 

## The web server

Regardless of the programming language or framework you're using, you need a software called a **web server** to run your web backend. The web server is the software that handles incoming requests and outcoming responses. It's the program that connects your backend to the network or the entire internet. 

**Node.js** comes with a solid web server built-in. So by having Node installed, you already have everything you need to run a server. And in fact, you've already been doing that every time you started up the Express server. 

In order to start the server, you just run the corresponding command-line command. 

>💡 If you're coming from other programming languages, you may have heard about web server software like **Apache**, **nginx**, **unicorn**, etc.. Some programming languages rely on separate server software much more than others. 
>It's good to know about them, though. Because even with Node, many companies choose to additionally use a server software such as **nginx** to handle larger loads of requests. It also helps with larger server setups.

## Environments

When reading through web development-related articles or other material, you've probably already come across the term **environment**. Nonetheless, in the context of deployment, it's good to make sure you have understood the concept and know the terms. 

Generally speaking, your application can (and probably will) run on multiple devices. You have it running on your computer that you use for the development process. In this lesson, you'll learn to deploy it to a web server somewhere in the cloud. So that's another computer, another **environment** than your personal computer. 

And maybe, you'll upload it to some other servers as well - maybe a testing server or a beta server. 

All these different computers your application runs on are called **environments**, and they generally have pre-defined names:

* **Development Environment** refers to your local computer or the computer of any developer who is working on the application
* **Production Environment**. This is the live web server used by real users. Anything going on "in production" means it's going on on the server actively used by real people worldwide.
* **Staging Environment** is often the name for a server you use internally for testing the application or a new feature before it goes to production.
* **Testing Environment** becomes relevant when running automated tests or having a **CI/CD** pipeline. This is usually the name of the environment used to run those automated tests.

So, in this lesson, you'll learn to **deploy to production**.

## Getting started with Heroku

As mentioned above, we'll be using Heroku as the hosting provider. So to get started with Heroku, follow these steps: 


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

First of all, it's good practice to include a script to start the Node server in the **package.json** file. You may have it already. But just to make sure, the `"scripts"` of the **package.json** should include a `"start"` script that executes your main JavaScript file (probably **app.js**) using the `node` command. 

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

It is important that you use `node` and not `nodemon`. `nodemon` is the development server we use. It's optimized for the development process as it includes features like auto-restarting the server. When you run your server in production, it's totally fine to use the built-in `node` server for that.

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

If your application uses a locally installed MongoDB database, this database will only be available to you as the developers. Heroku does not have any databases pre-installed. Instead, you need to set one up yourself. 

Technically, Heroku has addons for various databases, and some of them are free. However, Heroku does not have a free addon for using MongoDB. So in order to use a free version of MongoDB with Heroku, you'll have to use **MongoDB Atlas**, a cloud service offered by the company behind MongoDB. They do have a free tier. 

>💡 If you already set up MongoDB Atlas in a previous step, shis chapter will go a lot faster for you. You still should follow the instructions on using the MongoDB Atlas in an **environment variable**.

1. Create an account on Atlas, confirm your email, and log in: [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. When you first login you can choose between a "Serverless", "Dedicated", or **free** "Shared" database. I suggest clicking **"Create**"** with the **free Shared** database. 
3. Next, it'll give you some options for selecting a region, cloud provider, and some other settings. You **don't need to change anything** here and can just go with the default configuration. (By default, the free sandbox tier "M0" should be selected.) Click "**Create Cluster**" at the bottom right to continue. 
4. After that, you should end up on a page called **Quickstart**. You're asked to create a **username** and **password**. Any MongoDB database needs **users** to read and write data. This has _nothing to do_ with potential users of your application. You may only ever need a single user for the database. The user represents you as the developer or the application interacting with the database. As a **username** you can pick something like `admin`. For the password, I suggest using the "Autogenerate Secure Password" button. **🚨 Picking a secure password is extremely important** because anyone with the username, password, and URL to the database can read and write all data in the database! Finally, click "Copy" next to the password (because we'll need it in a second). Then, click on "Create User."
5. So you don't lose the password, paste it somewhere save, for now. We will need it in just a minute. 
6. Finally, we need to tell your MongoDB that Heroku.com is allowed to access the database. By default, your database is protected from outside access. This means no one can access it. If you scroll down on the **Quickstart** page, you see a section at the bottom that lets you add an **IP Address** and **Description**. Add the IP address `0.0.0.0` and then click on "Add My Current IP Address." `0.0.0.0` will give the entire web access to the database. That's _not ideal_, but as long as you picked a secure password for the admin user above, it's still _okay_. In web security, there is no such thing as "complete security." Instead, you add several layers of protection, and their sum makes your application more and more secure. Your database is secure now. But to make it even more secure, you could use a [Heroku addon](https://elements.heroku.com/addons/categories/network) that gives your application a **static IP**. You could then go back to Atlas and allow only access from that IP address. If you use an application with real users, you should probably do that. 

>💳 **Attention:** You should not be asked to enter any credit card information. If you are, you may have selected the wrong (or paid) thing. Be very careful, whenever putting payment information into cloud service providers. If you don't know what you're doing, you may end up with unexpected bills. 

Once you've gone through all the steps above, you have a database up and running. Now, go back to "Database" under "Deployment" (in the left navigation). This time don't click on the cluster name. Instead, click on the button "Connect" and then on "Connect your application." This should lead to a screen where you see something like this: 

```
mongodb+srv://admin:<password>@cluster0.d3bdoc8.mongodb.net/?retryWrites=true&w=majority
```

This is the URL to your database and what we need to provide your application code with to connect it. We just need to make a couple of adjustments. 

First, replace the `<password>` part with the admin user password we set aside before (in step 4). 

Then, we need to add a **database path** (e.g., "`cookieshop`") at the end of the domain and **before** the query parameter (`?retryWrites=true&w=majority`) - just like we did when adding a path to our local database. 

The final URL should look similar to this: 

```
mongodb+srv://admin:dSJE83hDgkwsh38hy@cluster0.d3bdoc8.mongodb.net/cookieshop?retryWrites=true&w=majority
```

You could pass this URL as the parameter of the `mongoose.connect()` function in your application. 

But that would replace the database we're currently using. And as we discussed in the lesson on databases, you should always use a different database for **development** than in **production**. There is a common concept to help you achieve that. 

### Environment Variables

Sometimes we want to define a value to be different depending on the **environment** our application is running in. A prime example is the URL to our database. Whenever we run the application on our local computer, we want to connect to the URL of the database that's running locally on our computer. Whenever we run the application in **production** (so on Heroku), we want it to connect to the database containing all the live data. 

That's what **environment variables** are used for. They are variables defined for and within the environment. You can set the same variable to be a different one on your local computer than on the server, for example. 

There are multiple ways to set environment variables. But one very common and convenient way is to use a **.env** file in your project folder.

To use a **.env** file, install the npm package **dotenv**:

```sh
npm install dotenv
```

Then, in your main application's JavaScript file, import and load dotenv at the top of the file: 

```js
import 'dotenv/config'
```

Now, create a file called **.env** in the root directory of your project (where you also keep the **package.json**). 

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
      <li>📄 .env</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
      <li>📄 Procfile</li>
    </ul>
  </main>
</div>

In the file, add the following line: 

```
MONGODB_URI=mongodb://127.0.0.1:27017/cookieshop
```

**Environment variables** are defined as one variable per line. It's common practice to write environment variables in all caps. Here, we define the environment variable `MONGODB_URI` as equal to the value `mongodb://127.0.0.1:27017/cookieshop`. That's the database URL we used in the lesson on setting up a local database.

>💡 If you already used Atlas and never used a local database, the URL is going to be the Atlas URL and not the one shown above. 

Now, back in the application's JavaScript file, where we have `mongoose.connect()` we should replace the string with the **environment variable. 

Change the line where you connect Mongoose to the database to this: 

```js
mongoose.connect(process.env.MONGODB_URI)
```

In Node.js, you get access to the environment variables through the `process.env` object. Each property of `process.env` represents an environment variable. In this case, it's `MONGODB_URI`. 

Lastly, the **.env** file should **not** be part of the git repository. It often contains sensitive information. Therefore, it should be listed in the **.gitignore** file. In a new line of the **.gitignore** file, add: 

```
.env
```

### Setting Environment Variables on Heroku

We now set the environment variable for our development environment. But we added the **.env** file to **.gitignore**. So how would the variable be set in our **production environment** on Heroku? 

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

The last thing you need to change in your code is the `PORT`. In the Express application, we previously set a variable called `PORT` to `3000`. On Heroku, however, the port is set by Heroku itself. Heroku will put it in an environment variable called `PORT`. So let's also use that one locally. 

Add the following line to the **.env** file: 

```
PORT=3000
```

Remove the following line from your code: 

```js
const PORT = 3000
```

And at the end of the **app.js** file, where you start the server, replace the parts where you used `PORT` to use the environment variable instead: 

```js
app.listen(process.env.PORT, () => {
  console.log(`👋 Started server on port ${process.env.PORT}`)
})
```

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

This was a longer exercise. But hopefully, you were able to deploy your entire application and database and have an application up and running on Heroku and MongoDB Atlas now. If you run into any issues, make sure to use `heroku logs --tail` to see if you find any error messages. Also, make sure to have gone through every single step listed above and don't have any typos in the file names or variable names. Any little change of character can make a huge difference. 

## 🛠 How to practice

To practice what we did today, try setting up another application with Heroku and MongoDB Atlas.