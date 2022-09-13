---
title: Deployment to Google App Engine
slug: deployment-to-app-engine
lastUpdate: September 13th, 2022
sectionIndex: 2
groupIndex: 0
---


Hosting providers (no matter how simple or complex they are) usually have some custom configuration and requirements for hosting applications on their servers. 

In this lesson, we're going to look at hosting an Express application on [Google App Engine](https://cloud.google.com/appengine). Google is one of the largest cloud providers after Amazon's AWS. It comes with some free credits to get started building a project for free. You will, however, have to provide a credit card (unless you're a student and got free credit from your school).

This tutorial assumes you have completed the [deployment lesson](/express-tutorial/v1/deployment/). It's crucial that you follow the steps in that lesson before continuing here. 

## Getting started with Google App Engine

Before you get started, you need to create a project. 

Follow the steps on [cloud.google.com](https://cloud.google.com/appengine) to access the **"Console"**. If you haven't already, create a new account. This may take a while. 

Once you've done that, follow the steps listed [here (link)](https://cloud.google.com/appengine/docs/standard/nodejs/building-app/creating-project) to first create a new project and finally create an App Engine app. 

## Install and setup the CLI

One of the steps in setting up a cloud project is to install the CLI if you haven't already. 

Before you can deploy anything, you need to install the **Google Cloud CLI**. For that, follow the installation instructions for your operating system on [this page (link)](https://cloud.google.com/sdk/docs/install). Choose your operating system, download the file that is relevant for your system, and download and install it. 

>💡 On macOS, make sure to select the correct file (M1 for the newer M1 laptops or the other one for older computers).
>Also, you will not have to "install" anything. Instead, you just copy the folder to a place where you want to keep it. Then, navigate to that folder using the **Terminal**. Then, execute the following command `./install.sh`. You'll be guided through a basic installation process. After you've completed that close and open the Terminal again. 
>
>You now have access to the command `gcloud init` to initialize the CLI. 

After setting up the Google Cloud CLI, make sure to run `gcloud init` in a new command line window. Following the setup process, you'll be asked to log in. That's important if you want to be able to deploy your application from the command line. 

## Preparing the application for deployment

While App Engine is meant to keep the amount of server administration to a minimum it still has a few requirements before you can deploy your application. 

### Node Server

If you followed the deployment lesson, you should now have a `"start"` script in your **package.json** file that executes `node app.js` (or whatever is the line to start your Express server).

### app.yaml

Google App Engine requires your application code to contain a file called **app.yaml**. 

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
      <li>📄 app.yaml</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

The file contains some configuration details for the deployment. 

Add the following content to the **app.yaml** file: 

```yaml
runtime: nodejs14

instance_class: F1
```

You can change the runtime to the Node version you'd like to use. We set the instance to `F1` because that's the smallest possible server instance. Google lets you create one `F1` instance for free. You can specify a different setup here for larger-scale applications.

### Database

App Engine comes with its own solution for non-relational databases. If you want to use MongoDB, it's easier and cheaper, however, to go with an external cloud service like MongoDB Atlas. If you're using that, there is nothing you need to set up in App Engine for your database. You do, however, have to set environment variables.

### Environment Variables on App Engine

Most web backends use **environment variables**. If you're using a **.env** file, that will not be deployed. That's by design, as the server is a different environment from your local development environment. 

In Google App Engine, you define environment variables in the **app.yaml** file like this: 

```yml
env_variables:
  MY_VAR: "my value"
```

If you are using a MongoDB Atlas database, you'll need to set a `MONGODB_URI` variable. 


So in our case, we want to set `MONGODB_URI` and want to set it to the URL we got from MongoDB Atlas earlier. 

This is what it could look like, for example: 

```yaml
env_variables:
  MONGODB_URI: "mongodb+srv://admin:dSJE83hDgkwsh38hy@cluster0.d3bdoc8.mongodb.net/cookieshop?retryWrites=true&w=majority"
```

Make sure the Atlas URL has the correct password and sub-path for the database set!

**Important:** If you're adding environment variables to the **app.yaml** file, you should also add a line to the **.gitignore** file that lists the `app.yaml` file. It's very important to always keep those variables secret and not add them to the repository!

>💡 You should **not** set the `PORT` environment variable. This variable is set by Google App Engine automatically.

## Deploy to Google App Engine

Once you have prepared your application as described above and in the [deployment lesson](/express-tutorial/v1/deployment/), you can run the following command to deploy your application to Google:

```
gcloud app deploy
```

You'll have to confirm (by pressing the Enter key) to start the deployment.

Once the deployment is done, you can run `gcloud app browse` to automatically open the website in the web browser and see the URL in the command line. 

## Recap

The complicated part about Google App Engine is to set up and register the account and project. Once all that is sorted and the command line is installed and installed, the actual deployment of the application is quite straightforward. 