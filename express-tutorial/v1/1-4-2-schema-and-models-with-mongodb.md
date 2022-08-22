---
title: Schema & Models with MongoDB
slug: schema-and-models-with-mongodb
lastUpdate: August 22nd, 2022
sectionIndex: 0
groupIndex: 3
---

MongoDB is a document-based **NoSQL** database. If you are already familiar with relational databases, there are a few important differences to be aware of. 

As a document-based database, you are technically completely flexible to change the properties of any record. For example, if you have a collection of cars, one record could have the properties of color, size, and speed, while another record has the properties of color, name, and description. So you can share properties, or you can use entirely different ones. 

On the one hand, this gives you a large amount of flexibility in setting up your data structures. On the other hand, this flexibility makes your data easily unpredictable and hard to manage reliably.

Most developers would say that it's better to give your code some boundaries in order to avoid errors and make working with your data reliable.

The **ODM** Mongoose has some functions to help provide these boundaries and make working with MongoDB easier. 

## Data structures in MongoDB

If you run MongoDB on your local computer, the URL to MongoDB will be `mongodb://127.0.0.1:27017/`. 

Within MongoDB, you can have **multiple databases**. Most commonly, you'll probably have **one database per app**. You can target each specific database with a unique URL. For example, a database called `"cookieshop"` would have the following URL: 

`mongodb://127.0.0.1:27017/cookieshop`

Inside each database, you have multiple **collections**. If you're familiar with relational databases, you can think of **collections** as the document-based equivalent to database tables.

An easier way to think of collections is like _folders on your computer_. A collection is a folder and can contain **many documents**. A document represents a single record - like a file in a folder.

A document, again, can have multiple properties (just like a table row can have many columns). 

<div class="demowindow demowindow--files demowindow--noheaderbtn" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__title">Cookieshop Database</div>
  </header>
  <main>
    <ul>
      <li>
        📁 cookies
        <ul>
          <li>📄 chocolate-chip</li>
          <li>📄 banana</li>
          <li>📄 peanut-butter</li>
        </ul>
      </li>
    </ul>
  </main>
</div>

Each individual record is represented in an object structure much like JSON or JavaScript objects: 

```js
{
  slug: 'chocolate-chip',
  name: 'Chocolate Chip',
  priceInCents: 350, 
  isInStock: true
}
```

The name of the document is also called the **key**. In this example, it's just equal to the **slug**. But in many cases, this is also a **unique random string**, for example, a **UUID**, and looks like this:

```
81c60db5-b760-4d0c-8e46-3519d5f8ddea
```

## Setting up Schemas

**Schemas** are your data structures. A schema represents the data structure of any **document** within a **collection**. Let's say we want to have a collection of cookies where each cookie is represented by a single document. Each cookie should have the properties `slug`, `name`, `priceInCents`, and `isInStock`. 

To define the schema in MongoDB, first make sure the `mongoose` package is imported in your JavaScript file. Then, you can create a new schema with the `mongoose.Schema` function like this: 

```js
const cookieSchema = new mongoose.Schema()
```

To define the properties of each document, you can pass an object as an argument to the function: 

```js
const cookieSchema = new mongoose.Schema({
  slug: String,
  name: String,
  priceInCents: Number, 
  isInStock: Boolean
})
```

As you can see, the object keys are all the properties we want the document to have. The values are the data type. Defining data types gives you some extra restrictions and safety in defining document structures. This way, you can be sure that, for example, the price is always a number and not sometimes a string. And you can write code that relies on the data being a number without having to first run checks or conversions. 

The data types you see above are standard [JavaScript data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures). There are a few data types that aren't standard data types. You can find a full list in [the official documentation of mongoose](https://mongoosejs.com/docs/schematypes.html#what-is-a-schematype).

>💡 These schemas are only enforced by Mongoose and within your application. Nothing is stopping you to open MongoDB compass or the MongoDB console, and manually change records and add documents with different properties or different data types. 
>The purpose of Mongoose schemas is to help restrict this kind of freedom within the context of your application. This way you can write code that relies on your data to always look a certain way and have a certain data type. It'll allows you to write less and more robust code.
>But it's important to keep in mind that things could break if you ever change things around or allow the database to be altered by different sources other than your app.

## Extended Schemas

Instead of just setting the type of each property, you can also add more restrictions. This can be very helpful in getting some automatic data validation. If you or the user try to create a record in the databases that don't match the criteria, an error will be thrown, and the record will not be created. 

To set more boundaries, you can define an object as the value of a property. To, for example, make sure that a `slug` is always present, you can set the `required` attribute. 

```js
const cookieSchema = new mongoose.Schema({
  slug: { type: String, required: true },
  name: String,
  priceInCents: Number, 
  isInStock: Boolean
})
```

Note that if you use an object as the value of a property, the type has to be defined using the `type` property of the object. You can then add any other pre-defined properties. So, in this case, we added `required: true`. This means that if you or the user try to create a cookie record in the database without specifying the `slug` field, Mongoose will throw an error and not create the record. 

Since slugs always have to be unique, it might also make sense to set the property `unique` to `true`. This way, Mongoose would throw an error if you tried to create a database record with a slug that already exists in the database. 

Another useful property is `default`, which automatically sets a default value even if you or the user don't set that value when creating a new record.

You find a list of the various options in the [documentation](https://mongoosejs.com/docs/api/schematypeoptions.html). 

Depending on each data type you defined, you have even more options. For example, you can define strings to `match` a certain pattern or have a `minLength` or `maxLength`. You can scroll through all the different options [in the documentation](https://mongoosejs.com/docs/api.html#SchemaStringOptions).

Here is what a more detailed schema could look like: 

```js
const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true }
})
```

## Creating a model

Now we know how to define a data structure for the database. But there is one more very important concept: **models**.

A **model** is one of the three components of the **MVC** (Model View Controller) pattern. Controllers are the route functions of your application. They handle the request and the response and execute any code that has to run between request and response. The views are your HTML files and EJS templates (if you use those). Some applications may not have views strictly speaking. Instead, they may have serializers, structuring the JSON response. 

Following the MVC pattern, **models** represent the data in your database. Usually, a single **model** refers to a single data collection. So in our application, we'd refer to a `Cookie` model. Models are usually represented in **singular** and written with a capital first letter. This is just a convention that has become common practice across the development world regardless of programming language. 

_(Other models we may add later could be `User`, `Order`, or `BlogArticle`.)_

So you may now wonder how a model is different from the schema. The main difference is that the schema is really only in charge of the data structure. The model is usually represented as a **class** or **object** containing not only properties but also functions to perform actions on the specific record. You use the model, for example, to query multiple records (or just one). Or you use it to create/update/delete records. Also, any functions that relate to filtering a list of records would be on the model.

Defining a model with Mongoose is quite straightforward. Below the schema definition, add the following line: 

```js
const Cookie = mongoose.model('Cookie', cookieSchema)
```

We use the `mongoose.model()` function to define a model. The first parameter is the name of the model as a string. This could be anything. But we follow the standard convention of using the **singular** form of the collection item and spelling it with a capital first letter. _(If you were to use multiple words in a model, it's best practice to continue with [CamelCase](https://en.wikipedia.org/wiki/Camel_case).)_

The second parameter is the schema we defined earlier. 

## Changing data structures

If you are familiar with relational databases, you might also be familiar with the concept of **migrations**. Migrations are the process of taking a schema and model structure and running a script that creates actual database tables from that structure. 

Because MongoDB is a document-based database, migrations are not necessary. So whenever you want to change the data structure, you can just go into your code and change the schema. 

Whenever you change schemas, you have to keep in mind that old database records may not match the new schema anymore. So if you have written code that relies on an old schema, you either have to now adjust your code to consider both schema versions. Or you update all existing records to match the new schema. 

Either way, changing schemas in a database that already has existing data can be quite a tedious process and is something that has to be done with **extreme caution**.

At the same time, software changes, and not every situation can be planned in advance. So it's extremely likely that you will run into this situation. If you ever have to change schemas of existing data, remember that you either have to delete/update old data (you can write a script to automate that process), or you have to make sure the code that uses the data can support both the old and the new schema.

## Recap

From a user's perspective, we still did not change much in our application. We only created the data structure without any data. But this is a very important step in any application development. Whenever you plan a new application, one of the first things you should think about is the data structure. Think about the various models you may need and what kind of data they should have. 

With what you have learned in this lesson, you'll be able to create different data structures for the most simple use cases.

## 🛠 How to practice

To practice the concept of schemas and models, try creating another model for news about our shop. Let's say we want to create a separate page that displays news around the shop. 

* Create a schema and model for `NewsItem`. 
* It should at least have the properties of `title`, `content`, and `date`.
* Set the proper data types for each property.
* Think about which additional options might be useful as restrictions on the data. Add those.

>💡 We have not yet addressed complex data structures such as arrays or maps. We also haven't talked about data relationships. Sometimes, for example, you'd want to have a list of various ingredients related to a cookie record. Or you'd like users to have many orders of cookies. All those things will be addressed in a separate lesson. For now, as you practice, focus only on simple data structures.

To further practice, in a second project, think about the data structure you may need. Add schemas and models according to that structure. It's fine if they are just placeholders for now - in case there are some more complex data structures that you haven't learned about yet. It still helps you practice thinking about data structures and models. 