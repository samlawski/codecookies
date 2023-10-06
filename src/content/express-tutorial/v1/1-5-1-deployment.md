---
title: Deployment
slug: deployment
description: Learn how to prepare any Express application for easy deployment to the cloud.
lastUpdate: October 6th, 2023
sectionIndex: 0
groupIndex: 4
---

Most web applications are built to be hosted and available **on the web**. This might be obvious. But you could also use web backends in local company networks, at home, or on hardware (or IoT) devices. 

## Choosing a host

When thinking about the best way to make your web backend public to the web, you have many options to choose from. You could run a **Raspberry Pi** or any other computer (even the one you're using right now) and turn it into a web server. Web servers are just computers made available to the internet. But it requires some setup and will maybe be the material for another tutorial sometime. 

The more common alternative is to host your website on someone else's server. Many people or companies choose to rent out server capacity, install their own operating system (OS), and all the software needed on the web server. They will run the entire administration of the server on their own. With this option, you have maximum freedom and control over the supported programming languages and databases. But you're also responsible for setting up everything from scratch by yourself. 

Another option is to use a hosting provider that already comes with some pre-configured setup. Maybe they have PHP or Node.js already pre-installed, and all you need to do is upload your code, and it "just works."

Most large-scale cloud providers offer a service that requires low configuration and makes deployment as simple as pushing to a **git remote repository**.

To list a few options:

- [render.com (external documentation)](https://render.com/docs/deploy-node-express-app)
- [Google App Engine (tutorial available)](/express-tutorial/v1/deployment-to-app-engine/)
- [Heroku (tutorial available)](/express-tutorial/v1/deployment-to-heroku/)
- AWS Elastic Beanstalk
- Azure App Service
- IBM Cloud Foundry

This tutorial will **not** go into detail about how to deploy your application to a specific one of the providers above. But for some of them, there are follow-up tutorials you can complete after completing this lesson. Also, all of them have their own tutorials on deploying your application. I suggest searching the web for "[name of provider] Express."

Instead, the rest of this lesson will focus on getting your application ready for deployment.

## The web server

Regardless of the programming language or framework you're using, you need a software called a **web server** to run your web backend. The web server is the software that handles incoming requests and outcoming responses. It's the program that connects your backend to the network or the entire internet. 

**Node.js** comes with a solid web server built-in. So by having Node installed, you already have everything you need to run a server.

In order to start the server, you just run the corresponding command-line command. For Node, that's `node app.js`. 

It's considered good practice to include a script to start the Node server in the **package.json** file. You may have it already. But just to make sure, the `"scripts"` of the **package.json** should include a `"start"` script that executes your main JavaScript file (probably **app.js**) using the `node` command. 

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

It is important that you use `node` and not `nodemon`. `nodemon` is the development server we use. It's optimized for the development process as it includes features like auto-restarting the server. When you run your server online, it's totally fine to use the built-in `node` server for that.

>💡 If you're coming from other programming languages, you may have heard about web server software like **Apache**, **nginx**, **unicorn**, etc.. Some programming languages rely on separate server software much more than others. 
>It's good to know about them, though. Because even with Node, many companies choose to additionally use a server software such as **nginx** to handle larger loads of requests. It also helps with larger server setups.

## Databases and stateless servers

If your application uses a locally installed MongoDB database, this database will only be available to you as the developers.

When you deploy your application to a web server, it's considered good practice to keep the database and application code separate from each other. Many hosting services (like App Engine or Heroku) enforce this practice by keeping the server **stateless**. In other words, the server does **not remember the state** of your application. This means you **cannot store dynamic data**. You cannot store log files and file-based databases (like SQLite) nor allow file uploads from users. This is very important to remember!

Instead, it's common practice to run separate services for each of these features. For example, in addition to your web application, you have a separate service that's only in charge of hosting a database. You have yet another service that's in charge of logging and, finally, another service for storing files uploaded by your users. 

As an **example**, this might mean that you use Google App Engine to host your application. You use MongoDB Atlas (a separate cloud service) to host your database. You use Google's native cloud logging service. And you may use Google Cloud Storage or Amazon's AWS S3 to store file uploads. For each of these examples, there are hundreds of alternatives. You could also use Google's own Firestore database instead of MongoDB. If you use a relational database, you may use [Elephant SQL](https://www.elephantsql.com/) or Supabase. 

When working with the cloud, it's important to understand which part is stateless and part of your code and which part is **stateful** and should exist within its own service.

### Setting up MongoDB Atlas

Regardless of which hosting provider you choose, a simple way to get started with MongoDB on a web server is to use **MongoDB Atlas**. **MongoDB Atlas** is a cloud service built and provided by the people who made MongoDB. For now, they have a free tier. That's why it's part of this tutorial. But be aware that it's a private company, and companies can decide to [remove free pricing plans anytime](https://blog.heroku.com/next-chapter).

>💡 If you already set up MongoDB Atlas in a previous step, shis chapter will go a lot faster for you. You still should follow the instructions on using the MongoDB Atlas in an **environment variable**.

1. Create an account on Atlas, confirm your email, and log in: [mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. When you first login you can choose between a "Serverless", "Dedicated", or **free** "Shared" database. I suggest clicking **"Create**"** with the **free Shared** database. 
3. Next, it'll give you some options for selecting a region, cloud provider, and some other settings. You **don't need to change anything** here and can just go with the default configuration. (By default, the free sandbox tier "M0" should be selected.) Click "**Create Cluster**" at the bottom right to continue. 
4. After that, you should end up on a page called **Quickstart**. You're asked to create a **username** and **password**. Any MongoDB database needs **users** to read and write data. This has _nothing to do_ with potential users of your application. You may only ever need a single user for the database. The user represents you as the developer or the application interacting with the database. As a **username** you can pick something like `admin`. For the password, I suggest using the "Autogenerate Secure Password" button. **🚨 Picking a secure password is extremely important** because anyone with the username, password, and URL to the database can read and write all data in the database! Finally, click "Copy" next to the password (because we'll need it in a second). Then, click on "Create User."
5. So you don't lose the password, paste it somewhere save, for now. We will need it in just a minute. 
6. Finally, we need to tell your MongoDB that our web server is allowed to access the database. By default, your database is protected from outside access. This means no one can access it. If you scroll down on the **Quickstart** page, you see a section at the bottom that lets you add an **IP Address** and **Description**. Add the IP address `0.0.0.0` and then click on "Add My Current IP Address." `0.0.0.0` will give the entire web access to the database. That's _not ideal_, but as long as you picked a secure password for the admin user above, it's still _okay_. In web security, there is no such thing as "complete security." Instead, you add several layers of protection, and their sum makes your application more and more secure. Your database is secure now. But to make it even more secure, you can look up the IP address of your web server. You can then go back to Atlas and allow only access from that IP address. If you use an application with real users, you should probably do that. 

>💳 **Attention:** You should **not** be asked to enter any credit card information. If you are, you may have selected the wrong (or paid) thing. Be very careful, whenever putting payment information into cloud service providers. If you don't know what you're doing, you may end up with unexpected bills. 

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

But that would replace the database we're currently using. And as we discussed in the lesson on databases, you should always use a different database for **development** than on the server with real users. There is a common concept to help you achieve that called **environment variables**.

## Environments

When reading through web development-related articles or other material, you've probably already come across the term **environment**. Nonetheless, in the context of deployment, it's good to make sure you have understood the concept and know the terms. 

Generally speaking, your application can (and probably will) run on multiple devices. You have it running on your computer that you use for the development process. In this lesson, you'll learn to deploy it to a web server somewhere in the cloud. So that's another computer, another **environment** than your personal computer. 

And maybe, you'll upload it to some other servers as well - maybe a testing server or a beta server. 

All these different computers your application runs on are called **environments**, and they generally have pre-defined names:

* **Development Environment** refers to your local computer or the computer of any developer who is working on the application
* **Production Environment**. This is the live web server used by real users. Anything going on "in production" means it's going on on the server actively used by real people worldwide.
* **Staging Environment** is often the name for a server you use internally for testing the application or a new feature before it goes to production.
* **Testing Environment** becomes relevant when running automated tests or having a **CI/CD** pipeline. This is usually the name of the environment used to run those automated tests.

So, when we talk about deployment, we usually refer to **deploying to production**.

### Environment Variables

Sometimes we want to define a value to be different depending on the **environment** our application is running in. A prime example is the URL to our database. Whenever we run the application on our local computer, we want to connect to the URL of the database that's running locally on our computer. Whenever we run the application in **production** (so on the server), we want it to connect to the database containing all the live data. 

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

>💡 **Make sure** to look up **how to set environment variables** with the hosting provider you chose! Remember, variables you set in the `.env` file are only available in the **development environment** (which is your personal computer). You will need to declare those environment variables separately again on the web server!

### Setting the port from the environment variable

Remember how your Express application has a `PORT` variable set to `3000`? The port is kind of like a door to the network. If you host a web server on your local computer at home, you could open up that door (aka **port**) in the settings of the **router** that you connect to via WiFi. The specific port number often doesn't really matter. You can also set it to `1234`. Then, your server is available at `localhost:1234`. And if you wanted to make that server available to the internet, you'd have to configure your router to **open the port** `1234` - which means to open that particular door to the internet. 

Different hosting providers have different configurations when it comes to ports. So it's a good idea to put the port in an **environment variable**.

In the Express application, we previously set a variable called `PORT` to `3000`. So let's move that value to an **environment variable**.

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

## Setting up Git

Finally, if you haven't already, you should make use of **Git** as your project's **version control system**. Many hosting providers allow you to integrate the deployment process with **git** - making it very convenient. But even if your deployment process doesn't rely on git, you should always use it to keep track of your project changes. 

To get started, run: 

```
git init
git add .
git commit -am 'initial commit'
```

MDN has some [resources](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/GitHub) on learning how to use git. 

## Recap

In this lesson, we did not look into deploying your application to a specific provider. Instead, we looked at all the different concepts you should know about in preparation for deploying your app.

There are two separate tutorials that you can follow **after** completing this lesson if you want to deploy to either [Google App Engine (link)](/express-tutorial/v1/deployment-to-app-engine/) or [Heroku (link)](/express-tutorial/v1/deployment-to-heroku/). As of October 6th, 2023, [render.com (link)](https://render.com/docs/deploy-node-express-app) also offers a free hosting plan and has a quite easy deployment set-up. So if you're looking for a simple and free hosting solution just to try out deployment that's a very good option.

There are many different hosting providers, and a quick web search will result in great instructions on how to deploy your application with those providers. The nice thing about Express is that it's one of the less complicated frameworks to run.

Finally, the most important thing to remember is that many web servers run your application in a **stateless environment**. That means you cannot alter or upload files and need to use separate services for file storage and databases. This may seem overly complicated in the beginning. But with time and experience, you'll see the benefits of keeping these different elements separate from each other. 

## 🛠 How to practice

To practice what we did today, try setting up another application with Heroku and MongoDB Atlas.