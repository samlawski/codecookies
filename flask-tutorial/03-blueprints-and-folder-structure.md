---
title: Blueprints and Folder Structure
videoId: 92wED7lS6bY
---

Being a micro framework, Flask does not give you many rules for how you should structure your application. That can be helpful but also make things more complicated. 

Blueprints are a newer feature of Flask that you can use to structure your application into separate sub-applications or separate features. 

You use them by creating a new folder called "**simple_pages**". Following the MVC pattern, I decided to call my main entry file **controller.py** in that folder. Then, I moved all the routes from the **app.py** file in there and defined an instance of the `Blueprint` class at the top: 

```py
from flask import Blueprint

blueprint = Blueprint(
  'simple_pages',
  __name__
)

@blueprint.get('/')
def index():
  return 'Hello World'

@blueprint.get('/about-me')
@blueprint.route('/about')
def about():
  return 'I am Sam!!'

@blueprint.post('/contact')
def contact():
  return ''
```

In the same **simple_pages** folder I also add a new file called **__init__.py**. This file allows me to import the folder without specifying the file I want to import. 

To do that I add the following to the **__init__.py** file: 

```py
from . import controller
```

Now, back in the **app.py** file I can simply import the new folder by writing: 

```py
import simple_pages
```

And below I can register the blueprints with my application and make sure all the routes are removed from this file. 

In total, my **app.py** file looks like this: 

```py
from flask import Flask
import simple_pages

def register_blueprints(app: Flask):
  app.register_blueprint(simple_pages.controller.blueprint)


app = Flask(__name__)
app.config.from_object('config')

register_blueprints(app)
```