---
title: Relationships in MongoDB
slug: relationships-in-mongodb
description: Learn to create relationships between data objects in a MongoDB database with mongoose.
lastUpdate: October 17th, 2022
sectionIndex: 1
groupIndex: 2
templateEngineOverride: md
---

>This lesson assumes you have [set up a MongoDB database with mongoose](/express-tutorial/v1/mongodb-database-and-odm-setup/) and know the basics of **CRUD** to interact with the database. 

Even though MongoDB is not a relational database, it still offers a variety of ways to represent related data sets. If you already have some experience with relational databases, you may just need to think about it differently.

## Why do we need related data? And what is it?

When we talk about related data, we mean two different collections of object types that are somehow connected. This can be an admin user of a blog who is the author of the blog articles. Maybe there is a page for the author displaying only the articles that the author has written. Vice-versa, the blog article shows the name of the author user. 

On the author's page (e.g., `/author/jane-doe`), you  may need the following data: 

```json
{
  "id": 3,
  "name": "Jane Doe",
  "slug": "jane-doe",
  "portrait_url": "https://filestorage.com/portraits/jane-doe.jpg",
  "bio": "Jane was an author for [...]",
  "articles": [
    {
      "article_id": 13,
      "title": "How to make a good cofee",
      "url": "/articles/how-to-make-good-coffee"
    },
    {
      "article_id": 87,
      "title": "Top 10 coffee beans of 2022",
      "url": "/articles/top-10-coffee-beans-of-2022"
    }
  ]
}
```

And on the article page for each article, you may need a data structure like this: 

```json
{
  "id": 13,
  "title": "How to make a good cofee",
  "slug": "how-to-make-good-coffee",
  "text": "Lorem Ipsum [...]",
  "author": {
    "author_id": 3,
    "name": "Jane Doe",
    "url": "/author/jane-doe"
  }
}
```

Of course you could just create a specific structure per page. But that's very inefficient and a lot of duplicate data which you need to make sure to keep up-to-date whenever anything changes. 

In a **relational database**, you'd probably represent the data with two separate tables: 

<div class="demowindow demowindow--files demowindow--noheaderbtn" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__title">Author: 3</div>
  </header>
  <main>
    <ul>
      <li><strong>id</strong>: 3</li>
      <li><strong>slug</strong>: jane-doe</li>
      <li><strong>name</strong>: Jane Doe</li>
      <li><strong>portrait_url</strong>: https://filestorage.com/portraits/jane-doe.jpg</li>
      <li><strong>bio</strong>: Jane was an author for [...]</li>
    </ul>
  </main>
</div>

<div class="demowindow demowindow--files demowindow--noheaderbtn" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__title">Article: 13</div>
  </header>
  <main>
    <ul>
      <li><strong>id</strong>: 13</li>
      <li><strong>slug</strong>: how-to-make-good-coffee</li>
      <li><strong>text</strong>: Lorem Ipsum [...]</li>
      <li><strong>author_id</strong>: 3</li>
    </ul>
  </main>
</div>

The relationship between the two records is determined by the `author_id` on the `article` record. That's how the app knows a particular article **belongs to** a particular author. 

In a **document-based database**, this sort of relationship is displayed a bit differently. There are a couple of different ways you'd represent related data in a NoSQL database like MongoDB. 

### Unique nested data structures

One approach we have looked at in the [lesson on complex data structures in MongoDB](/express-tutorial/v1/complex-data-structures-in-mongodb). There, we described that you could have an object or array as a particular property of a data object. This approach is useful if you work with data that doesn't need to be shared across multiple different records. 

For example, maybe a recipe has unique ingredients and cooking instructions. They are usually not sure by multiple recipes. This might be a case where those instructions and ingredients could be represented as a nested data set. 

As described in the other lesson, you can represent bested data using **maps** or **arrays**.

### Nested Structures with shared properties

Also, in the [previous lesson](/express-tutorial/v1/complex-data-structures-in-mongodb), we touched on **subschemas**. They are also a way to represent nested data **inside another** data set. However, subschemas provide a way to pre-define the exact data structure and reuse the same structure across multiple records. 

While in a recipe, the number and type of ingredients and cooking instructions can vary drastically, other data sets might have more predictable sub-data. 

For example, a user might have several tasks that are only connected to a single user. An individual task might always have the same properties of `text`, `dueDate`, and `isCompleted`. Here is what this kind of data structure could look like: 

<div class="demowindow demowindow--files demowindow--noheaderbtn" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__title">Users Collection</div>
  </header>
  <main>
    <ul>
      <li>
        📁 <strong>users</strong>:
        <ul>
          <li>
            📄 <strong>id</strong>: user1<br />
            <ul>
              <li><strong>name</strong>: Peter Sampleton</li>
              <li>
                📁 <strong>tasks</strong>:
                <ul>
                  <li>
                    📄 <strong>id</strong>: task1
                    <ul>
                      <li><strong>text</strong>: Clean the kitchen</li>
                      <li><strong>dueDate</strong>: Oct 20th, 2022</li>
                      <li><strong>isCompleted</strong>: false</li>
                    </ul>
                  </li>
                  <li>
                    📄 <strong>id</strong>: task2
                    <ul>
                      <li><strong>text</strong>: Exercise</li>
                      <li><strong>dueDate</strong>: Oct 11th, 2022</li>
                      <li><strong>isCompleted</strong>: true</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
          <li>
            📄 <strong>id</strong>: user2<br />
            <ul>
              <li><strong>name</strong>: Thea Testor</li>
              <li>
                📁 <strong>tasks</strong>:
                <ul>
                  <li>
                    📄 <strong>id</strong>: task1
                    <ul>
                      <li><strong>text</strong>: Go shopping</li>
                      <li><strong>dueDate</strong>: Apr 10th, 2021</li>
                      <li><strong>isCompleted</strong>: false</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </main>
</div>

In the example above, multiple **users** can have multiple **tasks**. Yet, all users and tasks have the same properties. In this situation, a **subschema** is a suitable approach.

## References with Mongoose

The approaches described above are common ways to represent data in different NoSQL databases. MongoDB (and mongoose in particular) offers an additional feature that lets you connect data sets similar to how you'd do it in a relational database.

Mongoose comes with a feature called [populate](https://mongoosejs.com/docs/populate.html). It allows you to reference a particular data object by its id - just like you would in a relational database. 

But before we get into that, let's clarify a bit of terminology. It has become the de-facto standard to describe data relationships with the following terms: 

- One-to-Many Relationships
- One-to-One Relationships
- Many-to-Many Relationships

In this lesson, I'll follow the same pattern. 

## One-to-Many Relationships

The one-to-many relationship is probably one of the most popular relationships you'll come across. A bank account **has many** transactions. A user **has many** tasks. A newspaper **has many** articles.

Describing it the other way around, we could say: A transaction **belongs to** a single bank account. A task **belongs to** a single user. An article **belongs to** a single newspaper. 

Let's imagine an e-commerce website with a `User` model where a user can **have many** `orders`. 

>**Side Note** If you haven't worked on the **authentication** of your application yet, you can still follow along by creating a user model and adding the logic for login and registration later. 

Here is an example for what their schemas could look like: 

**/models/user.js**

```js
import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  street: { type: String, required: false },
  zip: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  country: { type: String, required: false },
})

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: false },
  address: addressSchema
})

export const User = mongoose.model('User', userSchema)
```

**/models/order.js**

```js
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  message: { type: String, required: true }
})

export const Order = mongoose.model('Order', orderSchema)
```

For simplicity, the order is just a free-form text where users can type in whatever they'd like to order. 

We can now reference a `User` by its `_id` from the `Order` model like this: 

```js
import mongoose from 'mongoose'

const { Schema } = mongoose

const orderSchema = new mongoose.Schema({
  message: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

export const Order = mongoose.model('Order', orderSchema)
```

>💡 `const { Schema } = mongoose` is a more modern JavaScript syntax and is called [destructering](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). It's a shorter version and the same as if you were to write this: 
>`const Schema = mongoose.Schema`

You can see the key new element we added is the `type: Schema.Types.ObjectId`. That's how we tell mongoose, that we want the type of the `user` property to be a reference to another document. With `ref` we tell mongoose the name of the other document collection that is being referenced.

By doing this, mongoose will give you a bunch of features to easily work with relationships (we'll talk about that below). But in reality, the only thing that's actually stored in the database is the `ID` of the `User` model - which is usually an integer that looks something like this: `121233453423`

As we've discussed before, NoSQL databases have an additional benefit over relational databases. They are generally better at representing structured data. While in a related database, you'd usually store **foreign keys** (which refers to the **ID** of an element in another database) on the element that **belongs to** another one, in document-based databases, you can also do it the other way around. Since MongoDB is able to handle arrays well, you can also store an array of **ID**s on the object that **has many** others. So in our example, we could have the `User` store a reference to all their orders like this: 

```js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: false },
  address: addressSchema,
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
})
```

You see: Like any other array, we just wrap the same reference object inside square brackets. Be careful with this, though! If you relate two models with each other like this and you put **foreign keys** on both models, you'll also have to make sure to always keep both updated and accurate. Because of that, it's good practice to really only use an array of IDs if you have a very specific reason for it. This reason could be performance-related or depend on the way the data is accessed from the frontend. In most applications, however, it'll be totally fine to only put the reference on one of the two models. So I'd also recommend here **not** to put the order IDs on the `userSchema`.

## One-to-One Relationships

You actually already know everything there is to know about a one-to-one relationship. As the name suggests, it's a relationship between two single objects. We actually already have a classic one-to-one relationship above: The user **has one** address, and the address **belongs to** only one user. 

You can represent this kind of relationship perfectly in MongoDB with **subschemas**. However, nothing is stopping you to also just use a **foreign key** as described above to represent a one-to-one relationship.

## Many-to-Many Relationship

Many-to-many relationships are a lot easier to represent in NoSQL databases than they are in relational databases. 

Let's say instead of just storing an "order message" on the `Order` record, we want users to be able to select a specific set of cookies. In that case, an order can have many cookies. But a cookie can also belong to many different orders. How would you represent that? 

Because we can store an array of IDs on a single record, we can just store a list of IDs on both models like this: 

```js
const orderSchema = new mongoose.Schema({
  message: { type: String, required: true },
  cookies: [{ type: Schema.Types.ObjectId, ref: 'Cookie' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})
```

```js
const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true },
  ingredients: [String],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
})
```

## Create/Update related data

So far, we have only looked at setting up schemas and models. But how do we actually work with these? 

To demonstrate that, let's create a new **/controllers/orders.js** file. This will contain order-related routes. The first one we create is a `/checkout` route: 

```js
import { Router } from 'express'

const router = Router()

router.get('/checkout', async (request, response) => {
  response.render('orders/checkout')
})

export default router
```

>💡 In this code example, we use server-side rendering and EJS as a templating language as explained in the [lesson on templating](/express-tutorial/v1/html-response-and-templating). This would of course also work if the backend was just an API. In that case, you could leave out all the code related to rendering templates and only focus on the `POST` endpoint (see below).

That route is set to render the following view with the following form: 

**/views/orders/checkout.ejs**

```js
[...]

<main>
  <h2>Create a new order</h2>

  <form action="/orders/checkout" method="POST">
    <input type="text" name="name" placeholder="your name" /><br />
    <input type="email" name="email" placeholder="your email" /><br />

    <strong>Delivery Address</strong><br />
    <input type="text" name="street" placeholder="street & number" /><br />
    <input type="text" name="city" placeholder="city" /><br />
    <input type="text" name="zip" placeholder="zip" /><br />
    <input type="text" name="state" placeholder="state" /><br />
    <input type="text" name="country" placeholder="country" /><br />

    <strong>Your Order:</strong><br /> 
    <textarea name="message"></textarea><br />

    <button>Submit</button>
  </form>
</main>

[...]
```

>💡 Replace the `[...]` with the relevant HTML tags or potential `include`s that come before and after. 

As you can see, this form includes input fields with data scattered across multiple **schemas**. There is a `name` and `email` from the `User`. There is a `message` that goes with the `Order`. And there are several `Address` related fields. 

Don't forget to reference the new controller in the main **app.js** file: 

```js
import orderRoutes from './controllers/orders.js'
```

```js
app.use('/orders', orderRoutes)
```

The form makes a `POST` request to `/orders/checkout`. So let's create that route in the backend. In that route, we can create a new `User` and `Order`. So first, at the top of the **controllers/orders.js** file, import the relevant models: 

```js
import { Order } from '../models/order.js'
import { User } from '../models/user.js'
```

Then, create a new controller action:

```js
router.post('/checkout', async (request, response) => {
  const user = new User({
    name: request.body.name,
    email: request.body.name,
    address: {
      street: request.body.street,
      zip: request.body.zip,
      city: request.body.city,
      state: request.body.state,
      country: request.body.country
    }
  })
  await user.save()

  const order = new Order({
    message: request.body.message,
    user: user._id
  })
  await order.save()

  console.log('User:', user)
  console.log('Order:', order)

  response.redirect('/orders')
})
```

Take a moment to understand what's happening. You can see that in order to set the values of a **subschema** we just add the properties as a nested object. 

We save the `User` first because when we save it, MongoDB will automatically assign it a **unique `_id`** value. This ID we can use to reference the user on the `Order` object.

And that's how you **create** or **update** records with a relationship to another object. If the relationship was defined as an **array** instead of `user._id` we could set it to an array of IDs. 

I added a couple of `console.log()` statements in there so that you can see what's actually being saved. But make sure to remove them again later. 

>💡 For simplicity's sake, this function is rather simple. It does not contain any **error handling** or **validation**. Make sure to add those in a real backend!

## Read related data

When trying to read related data, that's where the aforementioned `populate` feature of mongoose comes into play. 

To demonstrate that, let's create a page that will show all orders already made in **controllers/orders.js**: 

```js
router.get('/', async (request, response) => {
  const orders = await Order.find({}).exec()

  response.render('orders/index', { orders })
})
```

So far, so familiar. Let's add the view in **views/orders/index.ejs**:

```html
[...]

<main>
  <p>Orders:</p>
  <ul>
    <% orders.forEach(order => { %>
      <li>
        <%= order.user.name %> (<%= order.user.email %>):<br />
        <%= order.message %>
      </li>
    <% }) %>
  </ul>
</main>

[...]
```

>🔐 In a real-world application, you'd of course never want to make this kind of page available. We've done this now for easy visualization of what's going on. In a real application, you probably want to make an overview page like the one above only available to logged-in admins of the platform. Learn about authentication with Express to password-protect this page. 

Now, try out creating a new object at [localhost:3000/orders/checkout](http://localhost:3000/orders/checkout) and then look at the orders page at [localhost:3000/orders](http://localhost:3000/orders). The page should break.

In the HTML, we try to access the `user` object **through** the `order` object. If `user` were a **subschema** on `order` it would just work like that. But in the database, it's just a reference. To make that reference work, we have to tell mongoose to not only get the `Order`s but also to fill in the data from the related `User`. You can do that with the [populate](https://mongoosejs.com/docs/populate.html#populate) function. 

All you need to do is to add it to the query like this: 

```js
const orders = await Order.find({}).populate('user').exec()
```

If you now try to access [localhost:3000/orders](http://localhost:3000/orders) you should see the user data that's related to the order show up. 

If you want to show all the orders of a user on the user's page, instead of using `populate()` you can just query elements using the user's id: 

```js
await Order.find({
  user: user.id
}).exec()
```

The `user.id` would have to come maybe from a `user` object that you loaded before, or maybe it's part of the URL. It usually looks something like this: `'634d1372afe49dfce9bd0d0e'`

## Recap

In this lesson, you learned about the various types of relationships data objects can have to each other. We looked at representing those relationships using **subschemas** (if they are strictly top-down and don't contain any shared information). We also learned about references using the mongoose `populate()` feature and allowing to create more complex data relationships. 

## 🛠 How to practice

There are many ways you can practice what we learned in this lesson. And I recommend that you spend some time with it because it's one of the more complex aspects of building a solid application. It's also very likely that you'll have to undo or redo a lot of what you have done. That's normal in the learning process. Knowing how to structure your data is a complex task that can only be accomplished with practice. 

Another data relationship you may want to create is between a `News` model and the `User` model as the author of a news article.

Additionally, think about how you'd represent the data structure if you'd allow users to add billing information to their accounts. 

>**Advanced Task**
>We've briefly touched on it during this exercise. But we haven't put it in practice, yet. Update the **checkout** page and add form fields to allow users to select which cookies they want to buy and how many. You can maybe take some inspiration from the [lesson on complex data structures](/express-tutorial/v1/complex-data-structures-in-mongodb).
>
>In the backend, store them as many-to-many relationship. An order can have multiple cookies. A cookie can have multiple orders.
>
>But there is more. A user could order multiple cookies of a particular kind. So you need to store on the order another set of data about how many of each cookie a user may order. This is certainly an advanced task. But possible with what we have discussed in this and the previous lesson. 