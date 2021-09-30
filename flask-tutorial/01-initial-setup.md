---
title: Initial Setup
videoId: oGvLYpkZj1E
---

## Install Python 3

Before you can create a Flask project, you first need to have Python installed. 

On Windows, you can install it through the microsoft app store. 

On Mac, it should be pre-installed already.

On Linux, you can run the following commands to install it: 

```
sudo apt-get update

sudo apt-get install python3
```

## Create a virtual environment

It's very recommended to work with a virtual environment whenever you create a new Python project. A virtual environment lets you install packages specifically for a project instead of the entire computer. 

Python 3 comes with it's own virtual environment called _venv_. So we'll use that one. Run: 

```
python3 -m venv venv
```

Yes, it says "venv" twice. The first "venv" is the command to use "venv". The second one is just a folder name. It could be called anything else. But it's common practice to name it `venv` so that it's immediately clear what the folder is about. 

## Activate the virtual environment

Once you have a venv folder, you need to run a script located inside that folder to activate the virtual environment for your project. You need to do that whenever you start a new Terminal session. 

On macOS and Linux run: `source venv/bin/activate`

On Windows run: `venv\Scripts\activate.bat`

## Install a Python package: Flask

To install flask, while you have the environment active run: 

```
pip install flask
```

After installing Flask, you should save a list of all the packages you have installed in a separate file. A common practice is to name this file "requirements.txt". Run: 

```
pip freeze > requirements.txt
```

Do this every time you install a new package. This file will allow other develoeprs on your team to install the exact same versions of the same packages you have installed for your project using the following command: 

```
python -m pip install -r requirements.txt
```

This is also going to useful for you if you want to copy over your project to another computer or deploy your application to a server. 

## .gitignore

While not strictly necessary, it's good practice to add a file called `.gitignore` to your repository and add the `venv` folder to it. This file contains a list of all the files and folders you don't want to add to a git repository (if you work with git - you should!).

Each line contains the name of either a file or folder that shouldn't be part of your repository. That's best practice to keep your repository clean and only include code files that are really necessary. 

## Create an app.py file

Finally, create a Python file called `app.py` in your project folder. That one will be the starting point of your application. 

Inside, add `from flask import Flask` to include the flask package we just installed. What exactly that means, you'll find out in the next section.