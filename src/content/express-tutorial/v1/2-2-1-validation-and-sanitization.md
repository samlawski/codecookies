---
title: Validation & Sanitization
slug: validation-and-sanitization
description: Learn how to keep an Express backend more secure by only allowing requests and data formatted a certain way.
lastUpdate: September 20th, 2022
sectionIndex: 1
groupIndex: 1
---

Allowing clients to send data to your backend is always a security risk. If you run a web backend publicly on the internet, you can be almost certain that sooner or later, a person or a bot will try to use it maliciously. 

For example, if you have a contact form, most likely, sooner or later, bots will try to submit spam messages. If you have a registration form, random registration requests will be made. If you have a search bar or other types of forms, attackers may try to **[inject queries](https://www.w3schools.com/sql/sql_injection.asp)** or attempt **[cross-site scripting](https://owasp.org/www-community/attacks/xss/)**. Or, more harmlessly but still annoying, people may just try to break things by entering silly or extremely long values into your forms. And sometimes, people may just accidentally use your forms incorrectly and put in the wrong information by accident. 

You see, there are many situations in which data sent to the backend isn't formatted exactly the way the backend needs the data to be. 

To avoid any problems and make sure your backend works as intended, you should use a concept called **validation** on incoming requests. The idea is to **validate** that incoming data contains all the information you need on the backend and that all the data is formatted correctly. 

## When it's useful (an example)

Let's say we have an e-commerce website selling cookies. We have a controller action that lets an admin of the website create a `Cookie` record in the database. 

```js
router.post('/', async (request, response) => {
  try {
    const cookie = new Cookie({
      slug: request.body.slug,
      name: request.body.name,
      priceInCents: request.body.priceInCents
    })
    await cookie.save()

    response.redirect(`/cookies/${request.body.slug}`)
  }catch (error) {
    console.error(error)
    response.send('Error: The cookie could not be created.')
  }
})
```

_(This code example assumes you have an Express application set up and have it configured to parse the `body` of incoming requests for data - as described [here](/express-tutorial/v1/query-strings-and-form-data/). It also assumes you know how to [organize routes in separate files](/express-tutorial/v1/folder-structure/))_

In this example, we can see that the client provides three values: `slug`, `name`, and `priceInCents`. Those three values are used to create a new record in the database using the `Cookie` model. One way to validate the data would be to set restrictions with the model schema. 

```js
const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true },
})

export const Cookie = mongoose.model('Cookie', cookieSchema)
```

In the example above, you can see that we restrict the data type of each field to be either a `String` or a `Number`. All three are also `required: true`. So if the client now sent an empty value for one of the three `mongoose` would throw an error because the record couldn't be created. Also, if the `priveInCents` would be a string, `mongoose` would also throw an error. 

It's definitely important to set these kinds of restrictions on the model, and this will add a certain layer of security. But it would be better if we **additionally** validated incoming data before it even hits the database. 

What we should add is **validation at the controller level**. 

There are a couple of reasons for that: 

1. It's more secure. There is no such thing as 100% security when it comes to web applications. Instead, developers add various different measures to increase security. So adding an extra layer of validation is an extra layer of security. 
2. It's faster. If you validate incoming data as you process the request **before** handing it over to the model, the response can be sent back much sooner, and you can save yourself the resources for interacting with the model. 
3. It's cleaner. Requests could include much more information than just the data that you need for a single specific model. Validating the request gives you the flexibility to react to it specifically. Maybe the model could be edited through various different controller actions. And maybe each needs to be validated slightly differently or needs custom error messages. 

## A naive implementation

The simplest way to validate incoming requests is with a simple **condition**. Let's say we want to make sure `priceInCents` is a number. Here is what it could look like: 

```js
router.post('/', async (request, response) => {
  try {
    if(
      isNaN(
        parseInt(request.body.priceInCents)
      )
    ) throw new Error('priceInCents should be a number')

    const cookie = new Cookie({
[...]
```

Depending on your backend setup, incoming request values can be strings. So first, we try to convert the string `priceInCents` to a number. Then, we use `isNaN()` to check if the return value is a **Not a Number**. If it's not a number, we throw an error and interrupt the function. 

You could do this for each type of validation that you want to run. That's an ok approach. But you may then want to write a separate function to validate the various elements. 

## A custom middleware implementation

To avoid having really long controller functions, we can make use of Express' [middleware feature](/express-tutorial/v1/middlewares/). The whole purpose of middleware is to process data before it hits the main controller action - therefore, a perfect use case for data validation. 

Instead of writing the condition in the controller action, let's create a middleware function to contain all validation conditions we may need: 

```js
const validateCreateCookie = (request, response, next) => {
  if(
    isNaN(
      parseInt(request.body.priceInCents)
    )
  ) return response.status(400).send('priceInCents should be a number.')

  next()
}
```

You can add the middleware just like any other middleware as an argument of the **route function**: 

```js
router.post('/', validateCreateCookie, async (request, response) => {
  try {
    const cookie = new Cookie({
[...]
```

That's it. Now, you have a validation middleware that will not even attempt to execute the controller action if `priceInCents` is not a number. 

The use case is obviously still very limited. But you can now add conditions and extend the `validateCreateCookie()` middleware to validate any data you like. 

You can also customize the error response. Right now, it's just text. But you can also respond with **JSON** or a `response.render()` function to build a custom error page. 

## Introducing Express Validator

Since this is a very common situation for many developers, there is a library to make validations a lot easier for you.

One popular library is called [express-validator](https://express-validator.github.io/docs/). 

>💡 Whenever choosing to use libraries with your project make sure they are well maintained and have recent git commits. Particularly when it comes to web backends, using out-dated or discontinued libraries can cause huge security risks. A good rule of thumb is to use only large libraries used by many people. 

To install **express-validator**, run the following command in the Terminal while being in your project folder: 

```
npm i express-validator
```

**express-validator** is a library that comes with built-in validation functions for the most common use cases. Make sure to spend some time studying the [documentation](https://express-validator.github.io/docs/) to get a good overview of all its possibilities. 

## Data validation with express-validator

To validate data that are part of the request's body, we import the `body` and the `validationResult` functions from `express-validator`:

```js
import { body, validationResult } from 'express-validator'
```

`body()` can act as a middleware when combined with a corresponding validator function. There are a whole lot of validators to choose from: 

* [github.com/validatorjs/validator.js#validators](https://github.com/validatorjs/validator.js#validators)

And you can even [write your own](https://express-validator.github.io/docs/custom-validators-sanitizers.html). 

Let's say we want to validate that `priceInCents` is not only a number but a **whole number**. Since the value should be in cents, the number should be an integer - meaning it should not contain any decimals. You can validate that using the `isInt()` validator function. You add it as a middleware to the route function like this: 

```js
router.post('/', body('priceInCents').isInt(), async (request, response) => {
  try {
    const cookie = new Cookie({
[...]
```

This code would run the middleware. But we haven't told it yet what to do if the data isn't valid. For that, we use the `validationResult()` function.

The function expects the `request` object as a parameter and would return an object with `"errors"` as an array if any of the validations failed. It also provides a convenience function called `.isEmpty()`. 

So `validationResult(request).isEmpty()` would evaluate to `true` if any errors occurred. We could use that to add a simple condition to our code and return an error `if` the `validationResult` is **not** (`!`) empty. However, if you're using the `try...catch` syntax, there is an even easier approach: `.throw()`


```js
router.post('/', body('priceInCents').isInt(), async (request, response) => {
  try {
    validationResult(request).throw()

    const cookie = new Cookie({
      slug: request.body.slug,
      name: request.body.name,
      priceInCents: request.body.priceInCents
    })
    await cookie.save()

    response.redirect(`/cookies/${request.body.slug}`)
  }catch (error) {
    console.error(error)
    response.send('Error: The cookie could not be created.')
  }
})
```

The `.throw()` function will **throw** an error only if any of the validations fail. The code above would then immediately jump to the `catch(error)` block and execute that one. 

Following the same principle, we can validate that the other two parameters are strings and have a certain maximum length. We can also confirm that the field `slug` is following the standard conditions for **slugs**.

>💡 Remember: A **slug** is usually all lower-case without spaces or any special characters other than dashes (`-`). It is a format that can easily be used in a URL. For exampple, `this-is-a-slug`.

```js
router.post(
  '/', 
  body('name').isString().isLength({ max: 256 }),
  body('slug').isString().isLength({ max: 256 }).isSlug(), 
  body('priceInCents').isInt(), 
  async (request, response) => {
    try {
      validationResult(request).throw()

      const cookie = new Cookie({
[...]
```

>💡 For better reaadability, we separated the different validators to separate lines. That'll make it much easier to see them all than having them all in one line. It does not change the functionality, though. We are simply adding multiple middlewares before getting to the controller action in the end. 

## Data sanitization

Sometimes you can anticipate that the client could possibly make mistakes when sending data. Maybe you don't want to outright throw an error. If you anticipated a potential issue, you could maybe also just fix it on the backend and proceed without any issues.

Let's say you want to make sure that the `name` and `slug` don't contain any HTML code. You can automatically clean any strings of HTML code without having to throw an error to the user. 

The process of editing data before, e.g., storing it in the database, is called **sanitization**. 

If you want to strip a string of all potential HTML for security (which you probably should in most situations when you allow users to submit data to your backend), that process is called **escaping**. 

**Express-validator** comes with functions for both. To sanitize a parameter from the request, you can just add the **sanitization function** to the middleware just like you added the **validator functions**. 

You can find a full list of [sanitization functions here](https://github.com/validatorjs/validator.js#sanitizers).

So to **escape** the `name` and `slug`, just add those functions like this: 

```js
router.post(
  '/', 
  body('name').isString().isLength({ max: 256 }).escape(),
  body('slug').isString().isLength({ max: 256 }).isSlug().escape(), 
  body('priceInCents').isInt(), 
  async (request, response) => {
    try {
      validationResult(request).throw()

      const cookie = new Cookie({
[...]
```

There are a few interesting functions. So make sure to scroll through them. Another useful one is `trim()` which will remove any empty spaces before and after the string. Sometimes users enter spaces by accident. And they don't notice them because they are generally not visible. So a good idea is to always `trim()` strings unless you explicitly want users to be able to have empty spaces at the beginning or end of a string. 

## Recap

Validation and sanitization are two extremely important concepts for most web applications. Whenever your backend is able to receive free-form data from a client, you need some type of validation and sanitization. It's important for the user experience (because mistakes happen). But it's also important for security. 

## 🛠 How to practice

If you haven't already, go through your entire application and make sure to validate and sanitize any incoming data. 

However, as you add restrictions, make sure not to restrict things too much! For example, if you ask users for their names, be aware that it's not uncommon in some nations to have single-letter names. On the other side, you also don't want to limit the length of names, email addresses, or passwords too much! Those can often be much longer than you think.

Also, keep in mind that names and passwords may contain various kinds of special characters. So you may not want to be too restrictive on them either. 