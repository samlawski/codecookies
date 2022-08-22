---
title: Complex Data Structures & Relationships in MongoDB
slug: complex-data-structures-and-relationships-in-mongodb
lastUpdate: August 22nd, 2022
sectionIndex: 0
groupIndex: 3
---


## Complex data structures and nested schemas

One thing that MongoDB does really well (compared to relational databases) is represent complex data structures. It's very easy to add arrays or nested object-like structures as properties to documents. 

Let's say our cookies need a list of ingredients. In that case you can use the `Array` data type either like this:

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
const cookieSchema = new mongoose.Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  priceInCents: { type: Number, required: true }, 
  isInStock: { type: Boolean, default: true, required: true },
  ingredients: { type: [String] }
})
```

What you write between the square brackets is the type of any array member. 

You can also define object-like structures with keys and values. If the structure should be open to any type of object and you as the developer don't know what the exact keys and values will be in the end, the [`Map` type](https://mongoosejs.com/docs/schematypes.html#maps) is probably most suitable. 

If you want to specify the specific keys and types of values of the nested structure, you can define [yet another schema](https://mongoosejs.com/docs/schematypes.html#schemas) just for that property value. This means, you can nest multiple schemas inside schemas if you want to define very complex structures. 

## Related Data



Let's say you have some tasks in a todo list that should only be visible to a specific user. 

Or in our cookie-shop we want to associate specific orders with specific users



...