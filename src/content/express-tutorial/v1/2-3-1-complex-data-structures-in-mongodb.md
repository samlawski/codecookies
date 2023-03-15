---
title: Complex Data Structures in MongoDB
slug: complex-data-structures-in-mongodb
description: Learn to define objects and arrays as data properties of documents in a MongoDB database.
lastUpdate: October 17th, 2022
sectionIndex: 1
groupIndex: 2
---

>This lesson assumes you have [set up a MongoDB database with mongoose](/express-tutorial/v1/mongodb-database-and-odm-setup/) and know the basics of **CRUD** to interact with the database. 

MongoDB is quite a powerful document-based database. Being document-based doesn't mean that you cannot represent data relationships or otherwise complex data structures. 

In fact, representing complex data structures is one of MongoDB's strengths. However, if you're familiar with relational databases, it'll require some rethinking as things work quite differently in NoSQL databases.

One thing that MongoDB does really well (compared to relational databases) is representing **complex data structures**. It's very easy to add arrays or nested object-like structures as properties to documents and work with them.

## Defining Array Data Types

Let's say we have a `Cookie` model for an e-commerce website that sells cookies. And let's say we'd like each cookie to have a list of ingredients. In that case, you can use the `Array` data type either like this:

```js
const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true },
  ingredients: [String]
})
```

or like this: 

```js
ingredients: { type: [String] }
```

If you're familiar with **JSDoc** or **TypeScript** you may be familiar with this style of defining an `Array` type. To tell mongoose, that you want a particular property to be an array of a particular type of elements, you wrap square brackets `[]` around that type - in our case `String`. 

If you want to allow an array of **mixed types** you just set the square brackets `[]` without anything in it: 

```js
ingredients: []
```

## Updating Arrays

You can [create](/express-tutorial/v1/create-records/) database entries with arrays or [update](/express-tutorial/v1/update-and-delete-records) them just like any other data type. You just have to make sure they are formatted as an actual array containing the correct data type. 

Let's say we have an HTML page with a form to edit a cookie record based on the model above. This is what it could look like: 

**/views/cookies/edit.ejs**

```html
<!DOCTYPE html>
<html lang="en">
<%- include('head', {title: "Edit Cookie | Cookieshop"}) %>
<body>
  <%- include('header') %>

  <main>
    <h2>Edit a cookie</h2>

    <form action="/cookies/<%= cookie.slug %>" method="POST">
      <input type="text" value="<%= cookie.name %>" name="name" placeholder="name" /><br />
      <input type="text" value="<%= cookie.slug %>" name="slug" placeholder="slug" /><br />
      <input type="number" value="<%= cookie.priceInCents %>" name="priceInCents" placeholder="price in cents" /><br />
      
      <label for="ingredients">Select ingredients</label><br />
      <select id="ingredients" name="ingredients" size="6" multiple>
        <option value="sugar">sugar</option>
        <option value="flour">flour</option>
        <option value="chocolate">chocolate</option>
        <option value="berries">berries</option>
        <option value="butter">butter</option>
        <option value="water">water</option>
      </select>
      <br />

      <button>Save</button>
    </form>
  </main>

  <%- include('footer') %>
</body>
</html>
```

There are many different **UI patterns** for defining lists (aka arrays). Here we have a multiple-choice `select` element. We made it multiple-choice by setting the `multiple` attribute. This allows the user to select multiple elements by holding down the _Shift_ key on the keyboard. (You can try it out below)

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/chocolate-chip/edit" target="blank">
        localhost:3000/cookies/chocolate-chip/edit
      </a>
    </div>
  </header>
  <main>
    <div>
      <h1>Cookieshop</h1>
      <div>
        <a>Home</a>&nbsp;|&nbsp;
        <a>About</a>&nbsp;|&nbsp;
        <a>Shop</a>&nbsp;|&nbsp;
        <a>Contact</a>
      </div>
    </div>
    <div>
      <h2>Edit a Cookie</h2>
      <input type="text" value="Chocolate Chip" name="name" placeholder="name" /><br />
      <input type="text" value="chocolate-chip" name="slug" placeholder="slug" /><br />
      <input type="number" value="350" name="priceInCents" placeholder="price in cents" /><br /><br />
      <label for="ingredients">Select ingredients: </label><br />
      <select id="ingredients" name="ingredients" size="6" multiple>
        <option value="sugar">sugar</option>
        <option value="flour">flour</option>
        <option value="chocolate">chocolate</option>
        <option value="berries">berries</option>
        <option value="butter">butter</option>
        <option value="water">water</option>
      </select><br /><br />
      <button>Save</button>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>

By using the `select` HTML tag, the `"ingredients"` data submitted with the form will automatically be formatted as an **array**.

You can confirm that by adding a `console.log()` in the backend:

```js
router.post('/:slug', async (request, response) => {
  try {
    console.log(request.body.ingredients)

    const cookie = await Cookie.findOneAndUpdate(
      { slug: request.params.slug }, 
      request.body,
      { new: true }
    )
    
    response.redirect(`/cookies/${cookie.slug}`)
  }catch (error) {
    console.error(error)
    response.send('Error: The cookie could not be created.')
  }
})
```

In this example, we have a basic function that finds and updates a `Cookie` record using the `request.body` - which includes all form data (including the `request.body.ingredients` from the `select` element). But there is also a `console.log()` so that you can confirm in the command line that the submitted form data is, in fact, an array of strings.

Using this information, you can also implement a form to create new database records (e.g., at the route **/cookies/new**).

When **reading** the database record, the `ingredients` property is just an **array**. So to render it in the views, you can loop over each element just like any other array. When using templating with **EJS** it could look like this: 

```html
<strong>Ingredients:</strong>
<ul>
  <% cookie.ingredients.forEach(ingredient => { %>
    <li><%= ingredient %></li>
  <% }) %>
</ul>
```

(You could, for example, insert the code above on a page that shows the details of an individual cookie - such as **/views/cookies/show.ejs**)

>💡 Getting data from UI elements as **arrays** is a rather complex task. That's why complex. You may want to allow the users to input list items as free text. Unfortunately, HTML doesn't have a native input type for that (yet). So people often use additional libraries like [tagify](https://github.com/yairEO/tagify).
>A very trivial, or naive implementation could also be to manually convert a string into an array.
>Let's say you let users input a list in this format: 
>`const list = 'sugar, flour, water, chocolate'` 
>You could then use JavaScript code to convert that string into an array by splitting the elements using the comma: 
>`list.split(',')`
>This will result in `['sugar', ' flour', ' water', ' chocolate']`.
>Notice the spaces before the last three words? To remove those, we can add them to the `split(', ')` function or we can add some code at the end to `trim()` each element in the array of its leadning and trailing spaces: 
>`list.split(',').map(element => element.trim())`

## Defining Map Data Types

Sometimes, instead of arrays, you want to add some object-like (aka key-value) data to database records. That's possible in MongoDB in two major ways. If the data is open and you (as the developer) don't know the exact structure of the data, you can use the [`Map` type](https://mongoosejs.com/docs/schematypes.html#maps).

Let's say we want the ingredients of our `Cookie` to be more specific and include values for how much of each ingredient is included in a cookie. In that situation, a map might be more suitable than an array. 

You can define a map like this: 

```js
const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true },
  ingredients: { type: Map }
})
```

Like in **JSON** objects, keys must be **strings**. In the example above, the values could be anything. If you want to be more restrictive and say that values should be of a particular type, you can use the `of` property: 

```js
ingredients: { type: Map, of: String }
```

Just like the other data types, you treat maps just like JavaScript objects when it comes to **reading** or **updating** them. 

For example, create a new `Cookie` like this: 

```js
const cookie = new Cookie({
  slug: 'chocolate-chip',
  name: 'Chocolate Chip',
  priceInCents: 350,
  ingredients: {
    'water': '100ml',
    'sugar': '300g',
    'flour': '100g'
  }
})
await cookie.save()
```

To read, e.g., the `water` property of the record above, your code could look like this:

```js
const cookie = await Cookie.findOne({ slug: 'chocolate-chip' }).exec()

cookie.ingredients.water
```

Creating a **UI** for updating this sort of data structure would be quite complex. Essentially, you'd need to create an interface with multiple text input fields and allow the user to add additional fields. 

<div class="demowindow demowindow--web" aria-hidden="true" tabindex="-1">
  <header>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__btn"></div>
    <div class="demowindow__title">
      <a href="http://localhost:3000/cookies/chocolate-chip/edit" target="blank">
        localhost:3000/cookies/chocolate-chip/edit
      </a>
    </div>
  </header>
  <main>
    <div>
      <h1>Cookieshop</h1>
      <div>
        <a>Home</a>&nbsp;|&nbsp;
        <a>About</a>&nbsp;|&nbsp;
        <a>Shop</a>&nbsp;|&nbsp;
        <a>Contact</a>
      </div>
    </div>
    <div>
      <h2>Edit a Cookie</h2>
      <input type="text" value="Chocolate Chip" name="name" placeholder="name" /><br />
      <input type="text" value="chocolate-chip" name="slug" placeholder="slug" /><br />
      <input type="number" value="350" name="priceInCents" placeholder="price in cents" /><br /><br />
      <label for="ingredients">Add ingredients: </label><br />
      <input type="text" value="water" placeholder="ingredient type" /><input type="text" value="100ml" placeholder="ingredient amount" /><br />
      <input type="text" value="sugar" placeholder="ingredient type" /><input type="text" value="300g" placeholder="ingredient amount" /><br />
      <input type="text" value="flour" placeholder="ingredient type" /><input type="text" value="100g" placeholder="ingredient amount" /><br />
      <input type="text" placeholder="ingredient type" /><input type="text" placeholder="ingredient amount" /><br />
      <div id="demoIngredients"></div>
      <script>
        function handleAddIngredient(){
          document.getElementById('demoIngredients').insertAdjacentHTML('beforebegin', '<input type="text" placeholder="ingredient type" /><input type="text" placeholder="ingredient amount" /><br />')
        }
      </script>
      <butto onclick="handleAddIngredient()">+ Add ingredient</button><br /><br />
      <button>Save</button>
    </div>
    <div>
      <br>
      Made with 🍪 by Codecookies
    </div>
  </main>
</div>

HTML doesn't come with a native way to do this. So most likely, you'll have to use **client-side JavaScript**, to create this kind of form.

## Defining Subschemas

In addition to **maps**, MongoDB also lets you define [**subschemas**](https://mongoosejs.com/docs/schematypes.html#schemas) as an additional object-like data structure. The difference to maps is that **subschemas** let you (as the developer) define the key-value data structure beforehand.

For example, if we want to add nutritional facts about our `Cookie` we could do it like this: 

```js
const nutritionFactsSchema = new mongoose.Schema({
  fat: String,
  sugar: String,
  salt: String
})

const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true },
  ingredients: { type: Map, of: String },
  nutrition: nutritionFactsSchema
})
```

And again, you'd update these properties the same way as you'd update the properties of maps. The difference is that this time, the keys of the data structure are clearly set in stone, and only the values are variable. Therefore, it's going to be easier to build a UI for that. You could, for example, add input fields like this: 

```html
<input type="text" name="nutrition_fat" placeholder="fat" /><br />
<input type="text" name="nutrition_sugar" placeholder="sugar" /><br />
<input type="text" name="nutrition_salt" placeholder="salt" /><br />
```

In the backend, then, you can't anymore just pass the `request.body` as it is to the function that updates the database record. You'll then probably have to do some manual assignments like this: 

```js
const cookie = await Cookie.findOneAndUpdate(
  { slug: request.params.slug }, 
  {
    name: request.body.name,
    slug: request.body.slug,
    priceInCents: request.body.priceInCents,
    ingredients: request.body.ingredients,
    nutrition: {
      fat: request.body.nutrition_fat,
      sugar: request.body.nutrition_sugar,
      salt: request.body.nutrition_salt
    }
  }
  { new: true }
)
```

You have to do this because HTML forms cannot pass nested data structures by default. 

## Recap

MongoDB makes it very comfortable to work with nested, structure data. Where you may need to have multiple tables in a relational database, in MongoDB, you can use the `Array`, `Map`, and `Subschema` data types to define complex data that are only relevant to a single data object.

## 🛠 How to practice

In this lesson, we have gone through a lot of examples. Apply them in your application and find use cases for arrays, maps, and/or subschemas. 

Go beyond just defining the schemas, though, but make sure to practice the implementation of all the required elements: the schema, the controller action (creating, reading, and updating records with complex data), the views (building user interfaces to insert complex data and using loops and other elements to render complex data).

>**Advanced Task**
>Using client-side JavaScript, try to use what you have learned in this lesson to build a UI for adding and editing **maps** on database records.
>Use the demo in the lesson above to get an idea for what this could look like. Users should be able to add and remove key value pairs, while using two input fields to update both the key and the value.
>Assign dynamic `name` properties to make sure, you'll be able to identify the different input fields in the backend. How can you use code to give each input field a unique `name` attribute?
>Also, consider what this means for data validation. How would you make sure the data is formatted in just the way you need it to be formatted? And how do you communicate to the user if there is an error in the validation?