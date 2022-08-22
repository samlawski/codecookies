---
title: Setup & Overview
slug: setup-and-overview
lastUpdate: August 22nd, 2022
sectionIndex: 0
groupIndex: 0
---

Welcome to a series on learning how to build web applications with Node and Express! 👋

**Express** is a micro-framework built to run on a **Node.js** server. Originally, JavaScript was made to run in web browsers. As the language matured, people explored opportunities to use JavaScript to also write web backends. The result was **Node.js**. Essentially, it runs the same JavaScript engine that is used in the Chrome Browser (called **v8**) but does that without the graphical interface of the web browser. Using **Node.js** you can execute JavaScript files on your computer like any other scripting language by typing `node filname.js` in the command line. 

## Prerequisites

I'll assume you have some previous knowledge to keep this course focused. If any of the following topics seem foreign to you, make sure to catch up on them before continuing with this tutorial. 

* Using the [command line](https://web.mit.edu/mprat/Public/web/Terminus/Web/main.html) (on your operating system)
* [Using git](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/GitHub)
* [How the internet works](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/How_does_the_Internet_work) ([client-server relationship](https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-Server_overview))
* [HTML](https://developer.mozilla.org/en-US/docs/Learn/HTML) ([CSS](https://developer.mozilla.org/en-US/docs/Learn/CSS) is optional but helpful)
* [JavaScript](https://javascript.info/) (particularly functions, for-loops, object-oriented programming with classes)

## How this tutorial works

This series has several lessons, each covering a larger topic. It's best to go through the tutorial in the given order. Some concepts only make sense after understanding some pre-required topics. 

The approach of this tutorial is very project-focused. Throughout this tutorial, we'll be working on an example project: an e-commerce website to sell cookies. Follow along the instructions and try to immediately put into practice what you see.

> 💡 By following along with the tutorial you will end up with a complete application in the end. In addition, you should come up with a separate project (e.g. a blog or a todo list application are great starter projects).
> Try to apply what you have learned in each lesson to that **second project** of yours. Only if you practice transferring your knowledge to separate projects over and over again, you'll actually learn and memorize these concepts. 

## Install Node.js

To get started, go to [nodejs.org](https://nodejs.org/) and follow the link to install the **"LTS"** version of Node. That's not the newest version but the one that's currently most widely used.

After you've installed Node, open the command line and confirm that you have installed it by running `node -v`. This should output the version number of Node that you have installed. 

## npm

Part of Node is also a software called **npm**. When installing Node, you automatically installed npm as well. Npm stands for "Node Package Manager". It gives you access to an online library of numerous **packages**. Packages are pre-written pieces of JavaScript uploaded by other developers all over the world. **Express** is one of those packages, and we'll install that later. 

First, however, we have to initialize a project. Create a new project folder and give it any name you like - for example, `cookieshop`. In your command line, navigate into that folder. From within the folder, run the following command: 

```sh
npm init
```

You will be asked to fill out some information about your project. Don't worry too much about those details. You can always change them later. If you don't know what to write simply hit the "Enter" key on your keyboard to autocomplete. The final step asks you if you're OK with the configuration defined. Just hit "Enter" again. Now, you should see a new file in that folder generated for you: **package.json**. This file is the heart of any JavaScript application. It lists some general information about your app, but it'll also include a list of all the packages installed and used in your application.

## Install Express

Now that our project is prepared, we can install Express. Express is a micro-framework. That means it behaves much like a library and not like a full-featured framework. If you're familiar with other frameworks such as Angular, Next.js, Ruby on Rails, or Django, you may be used to frameworks that generate a whole folder structure for you. That's one of the key differences to micro-frameworks. Micro-frameworks have no opinion about the folder structure. You can set up your project in any way you like. You'll generally start with nothing and create every single file in your application by yourself. 

The word "library" means that Express is a library of JavaScript functions pre-written by the developers of Express. They are functions to make building web applications easier and more convenient for you. This way, you don't have to reinvent the wheel over and over again but simply use the functions predefined by the Express team. 

To install Express, run the following command: 

```sh
npm install express
```

This may take a moment. When the installation is done, you'll see a couple of new things pop up in your project folder. You see a new file called **package-lock.json** and a folder called **node_modules**. The folder contains all the packages installed for your project. It contains the actual code. Have a look around. You'll see that Express comes with a whole load of packages, and you can see the code of each of them. 

The **package-lock.json** file is an auto-generated file. You should never touch it manually. It specifies which exact versions of which modules you have currently installed. This is very useful when working together with other developers and wanting to make sure everyone uses the exact same versions.

Finally, if you take a look at the **package.json** file, you'll also notice that `express` was added as one of the `dependencies`. The version number is automatically set to the newest one if you don't specify it when installing a package.

> 💡 If you ever want to uninstall a package, all you need to do is run
> `npm uninstall package-name`. 

## .gitignore

If you inspect the **node_modules** folder you'll notice that it's quite the huge folder. Since the **package-lock.json** file includes already all the relevant information about which versions to install, you don't need to make the entire **node_modules** folder part of your code repository.

You'll most likely work with **git** to manage the versions of your application. If you haven't already, create a file called **.gitignore** and write the following line in it: 

```
node_modules
```

If you are using macOS, you should also add `.DS_Store` on a new line. That's just a mac-specific file that sometimes gets auto-generated and shouldn't be part of your repository either. 

## Creating an Express application

First, we'll need a code file that serves as the starting point of our application. Executing that file will start our application server so that users can interact with it. 

In your project folder, create a new file called **app.js**.

<div class="demowindow demowindow--files" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">📁 cookieshop</div>
  </header>
  <main>
    <ul>
      <li>📁 node_modules</li>
      <li>📄 .gitignore</li>
      <li>📄 app.js</li>
      <li>📄 package.json</li>
      <li>📄 package-lock.json</li>
    </ul>
  </main>
</div>

> In the **package.json** file, I suggest to also change the `"main"` value from `"index.js"` to `"app.js"`. While it's strictly speaking not necessary right now, it'll keep your code consistent and may avoid silly issues in the future.

## Importing vs Requiring modules

Inside the newly created **app.js** file, we need to import the `express` package we just installed in order to use it. **Importing** and **exporting** (also known as `require` and `module.export`) are extremely important concepts when working with larger JavaScript projects. As your project grows, you don't want to keep all your code inside a single file. Instead, you'll have multiple files. But since, in the end, you'll just start a single file (in our case, the **app.js**), you need to specify inside that file which other files (or packages) you want to open. 

For the longest time, Node used a module called [CommonJS](https://nodejs.org/docs/latest/api/modules.html) for importing different files into each other. Using that syntax, you'd use the function `require()` to import either a package or another file from your project folder. Most Node projects use this way of importing _modules_ ("modules" are any type of packages or JavaScript files you'd like to import). 

In newer versions of Node, it's also possible to use the recent JavaScript standard called **ECMAScript modules** to import modules. Instead of writing `require()`, you'd be writing `import`. 

In this tutorial, we'll be using the newer `import` syntax throughout the project. Just be aware that many references on the internet (such as the [official Express documentation](http://expressjs.com/)) may still use CommonJS instead. Often, when you see this:

```js
const express = require('express')
```

You can write the same thing with the new syntax like this: 

```js
import express from 'express'
```

However, sometimes this won't work because the particular package you're using may not support the new syntax exactly how you'd like to use it. In that case, you can just use `require()` instead.

To be able to use the new syntax, you have to add the following property to your **package.json** file: 

```json
"type": "module",
```

It doesn't matter where you add it as long as it's part of the main project. I added it right below the line defining the `"main"` file of my project. 

The Node developer decided to keep `require()` as the standard for now in order to be backwards compatible. That's why you have to explicitly enable the new syntax with the line we just added. 

Let's finally import `express` and initialize express in our **app.js** file:

```js
import express from 'express'

const app = express()
```

All of the Express functionality is built into the single `express()` function. Once you run it, you start Express and gain access to all its features and functions. 

## Starting an Express server

Under the hood, Express comes with a built-in web server software. That's very convenient because it means you don't have to run any additional server software. You can just start the Express server, and your website is live. 

To start the server, you use the `listen()` function available through `express()`. 

```js
import express from 'express'

const app = express()
const PORT = 3000

app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})
```

That's it. If you now run `node app.js` and execute the **app.js** file, it'll start the server, and the server will be running in the Terminal window. 

The first parameter of the `listen()` function represents the **port** your server is running on. Explaining ports would go beyond the scope of this tutorial. If you're not familiar with them, all you need to know is that ports are a way to open up your computer (or a server) to the network (like the internet). You could technically have multiple web servers run on a single device. By using different ports for each one of them, you can allow other devices to access all those different web servers on the same computer. 

There is much more to it, and if you're interested in learning more, I suggest reading up on **networking**. For now, however, just know that all web servers need to run on a port that could be any number specified by you. Some ports like `3000`, `4000`, or `8080` have become standard ports among web developers. 

The second argument of the `listen()` function is another function. That function will be executed the moment the server is started. In our example, this function just contains a single `console.log()`. But in a real-world application, we could run any code here that needs to be run once whenever the server starts. 

Alright, our server is running. You can access it by going to [localhost:3000](http://localhost:3000) in your web browser. But since we didn't add any page or response, opening that link will just throw an error. 

## Adding your first route

Let's render some text when someone accesses the URL above. In **app.js**, above the `app.listen()` function, add the following function: 

```js
app.get('/', (request, response) => {
  response.send('Welcome to my 🍪 Cookieshop!')
})
```

You can **stop the express server** in the terminal by hitting the keys `ctrl` + `c` on your keyboard. Then, start the server again by running again `node app.js`. 

If you now go to [localhost:3000](http://localhost:3000) in the web browser, you should see our welcome message.

`get()` is another function provided by Express that allows us to add routes to our web backend that can be accessed by web browsers or other clients. You'll learn in more detail about routes in the next lesson.

## npm run and nodemon

Before we wrap up this lesson, let's do one more thing in our **package.json**. In there you find a section called `"scripts"`. This section let's you define shorthand command line commands relevant to your application. Right now, it only contains a `"test"` command that responds with an error that no tests are defined. We may change that in a later lesson.

Scripts from the **package.json** file can be executed with the command `npm run` followed by the name of the script. Try running `npm run test`. Do you see the error message defined in the **package.json**?

It's common practice to define a script called `start` with the command to start up the server. Right now, the start command is very short. It's `node app.js`. But in the future, it might get a little longer. So it's best to just set it up already. 

Inside the `"scripts"` object and above the line with the `"test"` command, add a new line: 

```json
"start": "node app.js",
```

Now, you can start your application by running `npm run start`. 

However, whenever you make any changes in the code, you still need to stop the server with `Ctrl` + `C` and restart it again with `npm run start`. Wouldn't it be nice if changes are automatically detected and the server reloads on its own? That's what a package called `nodemon` does for you. Install it by running:

```sh
npm install nodemon --save-dev
```

Notice the additional `--save-dev` in the command. That's a so-called **"flag"**. You can add predefined "flags" to some command line commands to slightly alter or specify what should happen. After running the command, take a look at the **package.json** of your project. You can see that `"nodemon"` was added under a new category called `devDependencies` instead of `dependencies`. `--save-dev` automatically moved `nodemon` into that second category. As the name suggests, this category is meant for any packages that you install that are only relevant for the development process but not relevant for running the server. When you run the application on a server later, you don't need it to automatically restart when you make changes to the code because whenever you make changes, you make them on your local computer and then redeploy and restart the entire application.

Now, let's add one more `script` to the **package.json**.

Underneath the line `"start": "node app.js",` add the following new line: 

```json
"dev": "nodemon app.js",
```

This is what the **package.json** could look like now (your version will most certainly have different version numbers.)

```json
{
  "name": "cookieshop-express",
  "version": "1.0.0",
  "description": "",
  "main": "app.js",
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.18.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.19"
  }
}
```

From now on, whenever you start working on your application, you just run `npm run dev` to start up the server. And as soon as you make updates to the code, the server is automatically restarted.

## A word on JavaScript Syntax

JavaScript is highly opinionated and has changed over time. Many developers have strong opinions about the **right way** to write JavaScript. 

In this tutorial, I will follow the newest standards whenever possible or reasonable. Sometimes, you may read things that could be more efficient, or other developers may even strongly disagree with my approach. Generally, I will favor readability and understandability over everything else. 

Here are a few important highlights you should know: 

* I will use [arrow functions](https://www.w3schools.com/js/js_arrow_function.asp) whenever possible for better readability. 
* I will avoid using `var` and instead use `const` whenever possible. Whenever a variable value were to change, in most cases, I'll try to assign a new variable with `const` instead of **mutating** an existing variable. I believe that makes code much easier to read and debug. I'm not 100% strict on this, though. In some contained situations, I may use `let` for variables that are meant to change their value. 
* The most controversial one is my use of **semicolons** - or the lack thereof. JavaScript has a feature called [Automatic Semicolon Insertion (ASI)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_semicolon_insertion). It's a built-in part of JavaScript and won't be removed because of JavaScript's backward compatibility. Because of that, it's almost never necessary to use semicolons at the end of a line. There are very few instances in which semicolons are really necessary. That's when you start a line with parentheses or brackets `(`, `[`, `{`. A semicolon is only necessary if one of those shows up at the beginning of a line. In those cases, I place a semicolon right in front of them like so: `;(`, `;[`, `;{`. I do this because I favor readable code over convention and rules. And in most cases, the semicolon is simply not necessary. Removing it removes noise from the code and makes it more readable.

## 🛠 How to practice

The last part of each lesson will always include a short section on how you can practice what you have learned. You will only learn the contents of each lesson if you practice it. 

As you go through the tutorial, you should have at least one more separate project to work on. So at any given time, there should be at least two projects you're working on: the cookie shop and your own project. 

In order to practice, create a separate, brand new project. Install `express` and set up a main starter file for the project. Try to get it to run in the browser.